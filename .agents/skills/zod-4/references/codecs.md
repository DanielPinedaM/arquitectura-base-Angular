# Referencia de codecs

Documentación: zod.dev/codecs, zod.dev/blog/zod-4-5 · Zod 4.6.7

Un codec es un schema con una transformación en cada dirección. Decodificar convierte el tipo de entrada en el tipo de salida: `.decode()` hace en runtime lo que hace `.parse()`. Codificar convierte el tipo de salida de vuelta en el tipo de entrada. Usa un codec donde un valor cruce un límite en ambas direcciones: una petición y una respuesta de API, una fila de base de datos, un valor de formulario, un query string.

## Definir un codec

```typescript
const isoDatetimeToDate = z.codec(z.iso.datetime(), z.date(), {
  decode: (isoString) => new Date(isoString), // string → Date
  encode: (date) => date.toISOString(),       // Date → string
})

const parsed = isoDatetimeToDate.decode("2024-01-15T10:30:00.000Z") // Date
const serialized = isoDatetimeToDate.encode(parsed)                 // "2024-01-15T10:30:00.000Z"
```

Un codec es un schema como cualquier otro. Anídalo en objetos, arrays y pipes.

```typescript
const Payload = z.object({ startDate: isoDatetimeToDate })

Payload.decode({ startDate: "2024-01-15T10:30:00.000Z" }) // { startDate: Date }
Payload.encode({ startDate: new Date() })                  // { startDate: string }
```

## Entrada tipada

`.parse()` acepta `unknown`. `.decode()` acepta el tipo de entrada y `.encode()` acepta el tipo de salida, así que TypeScript encuentra un argumento incorrecto.

```typescript
isoDatetimeToDate.parse(12345) // compila; falla en runtime

// @ts-expect-error un number no es un string
isoDatetimeToDate.decode(12345)

// @ts-expect-error un number no es un Date
isoDatetimeToDate.encode(12345)
```

## Métodos y funciones

| Método | Función de nivel superior | Devuelve |
|---|---|---|
| `.decode(input)` | `z.decode(schema, input)` | la salida, o lanza `ZodError` |
| `.encode(output)` | `z.encode(schema, output)` | la entrada, o lanza `ZodError` |
| `.safeDecode()`, `.safeEncode()` | `z.safeDecode()`, `z.safeEncode()` | `{ success, data }` o `{ success, error }` |
| `.decodeAsync()`, `.encodeAsync()` | `z.decodeAsync()`, `z.encodeAsync()` | una `Promise` |
| `.safeDecodeAsync()`, `.safeEncodeAsync()` | `z.safeDecodeAsync()`, `z.safeEncodeAsync()` | una `Promise` del resultado seguro |

`z.decode()` y `z.encode()` funcionan con cualquier schema, no solo con un codec. Un codec puede tener funciones `decode` y `encode` asíncronas; usa los métodos asíncronos con él.

## Qué se ejecuta en cada dirección

| Parte del schema | Decodificar | Codificar |
|---|---|---|
| `z.codec(A, B, ...)` | parsea con `A`, ejecuta `decode`, parsea con `B` | codifica con `B`, ejecuta `encode`, codifica con `A` |
| `.pipe()` de `A` a `B` | `A`, luego `B` | `B`, luego `A` |
| Checks y `.refine()` | se ejecutan | se ejecutan, después de una primera pasada que solo verifica los tipos |
| Sobrescrituras como `.trim()` | se ejecutan | se ejecutan |
| `.default()` y `.prefault()` | se aplican a `undefined` | no se aplican: `undefined` falla |
| `.catch()` | se aplica | no se aplica |
| `z.stringbool()` | de string a booleano | `true` al primer valor truthy, `false` al primer valor falsy (`"true"` y `"false"` por defecto) |
| `.transform()` | se ejecuta | lanza `$ZodEncodeError`, un error plano, no un `ZodError` |

```typescript
const WithDefault = z.string().default("hello")
WithDefault.decode(undefined)                        // "hello"
WithDefault.safeEncode(undefined as never).success   // false: los valores por defecto son solo para decodificar

z.stringbool({ truthy: ["yes", "y"], falsy: ["no", "n"] }).encode(false) // "no"
```

Un schema que contiene un `.transform()` no puede codificar. Reemplaza la transformación por un codec cuando el valor deba volver a salir.

## Invertir un codec

`z.invertCodec()` intercambia los schemas de entrada y de salida y las dos funciones. Solo invierte el codec que le pasas; los codecs anidados dentro de otro schema mantienen su dirección.

```typescript
const dateToIsoDatetime = z.invertCodec(isoDatetimeToDate)

dateToIsoDatetime.decode(new Date("2024-01-15T10:30:00.000Z")) // "2024-01-15T10:30:00.000Z"
dateToIsoDatetime.encode("2024-01-15T10:30:00.000Z")           // Date
```

## Validar un lado: `z.input()` y `z.output()`

`z.input(schema)` y `z.output(schema)` dan un schema para un lado de los codecs y los pipes que hay dentro de `schema`. Úsalos para verificar por separado la forma de transmisión y la forma enriquecida. En un schema sin codecs ni pipes, no cambian nada.

```typescript
const Event = z.object({ name: z.string(), at: isoDatetimeToDate })

z.input(Event).safeParse({ name: "launch", at: "2024-01-01T00:00:00Z" }).success // true
z.output(Event).safeParse({ name: "launch", at: new Date() }).success           // true
z.input(Event).safeParse({ name: "launch", at: new Date() }).success            // false
```

## Codecs vs transformaciones

| | `.transform()` | `z.codec()` |
|---|---|---|
| Dirección | En un solo sentido: de la entrada a la salida | En ambos sentidos |
| Úsalo cuando | Solo parseas | Parseas y serializas |
| `.encode()` | Lanza `$ZodEncodeError` | Ejecuta la función `encode` |

## Recetas

Zod no exporta estos codecs. La documentación los llama recetas para copiar en tu código y cambiar según sea necesario. La verificación ejecuta cada receta de este bloque contra los ejemplos que hay debajo de él.

```typescript
const stringToNumber = z.codec(z.string().regex(z.regexes.number), z.number(), {
  decode: (str) => Number.parseFloat(str),
  encode: (num) => num.toString(),
})

const stringToInt = z.codec(z.string().regex(z.regexes.integer), z.int(), {
  decode: (str) => Number.parseInt(str, 10),
  encode: (num) => num.toString(),
})

const stringToBigInt = z.codec(z.string(), z.bigint(), {
  decode: (str) => BigInt(str),
  encode: (bigint) => bigint.toString(),
})

const numberToBigInt = z.codec(z.int(), z.bigint(), {
  decode: (num) => BigInt(num),
  encode: (bigint) => Number(bigint),
})

const epochSecondsToDate = z.codec(z.int().min(0), z.date(), {
  decode: (seconds) => new Date(seconds * 1000),
  encode: (date) => Math.floor(date.getTime() / 1000),
})

const epochMillisToDate = z.codec(z.int().min(0), z.date(), {
  decode: (millis) => new Date(millis),
  encode: (date) => date.getTime(),
})

const jsonCodec = <T extends z.core.$ZodType>(schema: T) =>
  z.codec(z.string(), schema, {
    decode: (jsonString, ctx) => {
      try {
        return JSON.parse(jsonString)
      } catch (err) {
        ctx.issues.push({
          code: "invalid_format",
          format: "json",
          input: jsonString,
          message: err instanceof Error ? err.message : "Invalid JSON",
        })
        return z.NEVER
      }
    },
    encode: (value) => JSON.stringify(value),
  })

const utf8ToBytes = z.codec(z.string(), z.instanceof(Uint8Array), {
  decode: (str) => new TextEncoder().encode(str),
  encode: (bytes) => new TextDecoder().decode(bytes),
})

const bytesToUtf8 = z.codec(z.instanceof(Uint8Array), z.string(), {
  decode: (bytes) => new TextDecoder().decode(bytes),
  encode: (str) => new TextEncoder().encode(str),
})

const base64ToBytes = z.codec(z.base64(), z.instanceof(Uint8Array), {
  decode: (base64String) => z.util.base64ToUint8Array(base64String),
  encode: (bytes) => z.util.uint8ArrayToBase64(bytes),
})

const base64urlToBytes = z.codec(z.base64url(), z.instanceof(Uint8Array), {
  decode: (base64urlString) => z.util.base64urlToUint8Array(base64urlString),
  encode: (bytes) => z.util.uint8ArrayToBase64url(bytes),
})

const hexToBytes = z.codec(z.hex(), z.instanceof(Uint8Array), {
  decode: (hexString) => z.util.hexToUint8Array(hexString),
  encode: (bytes) => z.util.uint8ArrayToHex(bytes),
})

const stringToURL = z.codec(z.url(), z.instanceof(URL), {
  decode: (urlString) => new URL(urlString),
  encode: (url) => url.href,
})

const stringToHttpURL = z.codec(z.httpUrl(), z.instanceof(URL), {
  decode: (urlString) => new URL(urlString),
  encode: (url) => url.href,
})

const uriComponent = z.codec(z.string(), z.string(), {
  decode: (encodedString) => decodeURIComponent(encodedString),
  encode: (decodedString) => encodeURIComponent(decodedString),
})
```

`isoDatetimeToDate` es el primer ejemplo de esta página. El `jsonCodec` de la documentación captura `err: any`; esta copia, en cambio, estrecha el error, así que compila bajo `strict` con `useUnknownInCatchVariables`.

```typescript
stringToNumber.decode("42.5")                    // 42.5
stringToInt.decode("42")                         // 42
stringToInt.safeDecode("12abc").success          // false: el regex lo rechaza
stringToBigInt.decode("12345")                   // 12345n
numberToBigInt.encode(42n)                       // 42
epochSecondsToDate.decode(1705314600)            // 2024-01-15T10:30:00.000Z
epochMillisToDate.encode(new Date(1705314600000)) // 1705314600000
jsonCodec(z.object({ name: z.string(), age: z.number() })).decode('{"name":"Alice","age":30}') // { name: "Alice", age: 30 }
jsonCodec(z.object({ name: z.string() })).safeDecode("~~invalid~~").success                 // false: invalid_format, format "json"
base64ToBytes.decode("SGVsbG8=")                 // Uint8Array [72, 101, 108, 108, 111]
base64urlToBytes.decode("SGVsbG8")               // Uint8Array [72, 101, 108, 108, 111]
hexToBytes.decode("48656c6c6f")                  // Uint8Array [72, 101, 108, 108, 111]
bytesToUtf8.decode(utf8ToBytes.decode("Hello, 世界!")) // "Hello, 世界!"
stringToURL.encode(new URL("https://example.com")) // "https://example.com/"
stringToHttpURL.safeDecode("mailto:a@b.co").success // false: solo http o https
uriComponent.decode("Hello%20World%21")          // "Hello World!"
```
