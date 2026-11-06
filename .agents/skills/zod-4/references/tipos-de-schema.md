# Referencia de tipos de schema

Documentación: zod.dev/api · Zod 4.6.7

## Primitivos

```typescript
z.string()     // string
z.number()     // número finito: rechaza NaN, Infinity y -Infinity
z.boolean()    // boolean
z.bigint()     // bigint
z.date()       // instancia de Date; rechaza un Date inválido
z.symbol()     // symbol
z.undefined()  // undefined
z.null()       // null
z.void()       // undefined, tipado como void
z.nan()        // solo NaN
z.any()        // any — se salta la verificación de tipos
z.unknown()    // unknown — más seguro que any
z.never()      // never — siempre falla
```

## Strings

### Restricciones

```typescript
z.string().min(5)           // longitud mínima
z.string().max(100)         // longitud máxima
z.string().length(10)       // longitud exacta
z.string().regex(/^[a-z]+$/) // patrón regex
z.string().startsWith("https://")
z.string().endsWith(".com")
z.string().includes("@")
z.string().lowercase()      // check: sin caracteres en mayúscula
z.string().uppercase()      // check: sin caracteres en minúscula

// Sobrescrituras: cambian el valor sin cambiar el tipo
z.string().trim()
z.string().toLowerCase()
z.string().toUpperCase()
z.string().normalize()      // normalización Unicode
```

### Formatos de string de nivel superior

Cada formato es su propio schema. Las formas de método (`z.string().email()`) están deprecadas.

```typescript
z.email()          // más estricto que el RFC, aproximadamente las reglas de Gmail; pasar { pattern } para cambiarlo
z.url()            // cualquier URL WHATWG, incluidas "mailto:" y "http://localhost"
z.httpUrl()        // http o https, con un dominio válido
z.hostname()
z.uuid()           // bits de variante de RFC 9562, cualquier versión; z.uuidv4(), z.uuidv6(), z.uuidv7()
z.guid()           // cualquier string hex 8-4-4-4-12
z.cuid2()
z.ulid()
z.nanoid()
z.emoji()          // un carácter emoji
z.e164()           // número de teléfono E.164
z.ipv4()
z.ipv6()
z.mac()
z.cidrv4()
z.cidrv6()
z.base64()
z.base64url()      // sin padding
z.hex()
z.jwt()
z.creditCard()     // checksum de Luhn
z.currencyCode()   // ISO 4217
z.iban()           // checksum ISO 7064 mod-97
z.hash("sha256")   // digest hex de la longitud correcta; o "sha1", "sha384", "sha512", "md5"
```

Para un formato que Zod no tiene, `z.stringFormat()` da issues `invalid_format`, que nombran el formato, mientras que `.refine()` da `custom`:

```typescript
const CoolId = z.stringFormat("cool-id", /^cool-[a-z0-9]{8}$/)
CoolId.safeParse("x").error?.issues[0]?.code // "invalid_format"
```

`z.cuid()` todavía existe y está deprecado: CUID v1 filtra información. Usa `z.cuid2()`.

### Strings de fecha/hora ISO

```typescript
z.iso.date()      // "2024-01-15"
z.iso.time()      // "13:45" o "13:45:30" o "13:45:30.123"; sin offsets
z.iso.datetime()  // "2024-01-15T13:45:30Z": segundos obligatorios, sin offset, sin hora local
z.iso.datetime({ offset: true })  // también "2024-01-15T13:45:30+02:00"
z.iso.datetime({ local: true })   // también "2024-01-15T13:45" y "2024-01-15T13:45:30"
z.iso.datetime({ precision: 3 })  // exactamente milisegundos
z.iso.duration()  // "P3Y6M4DT12H30M5S"
```

Desde Zod 4.5, `z.iso.datetime()` exige segundos (zod.dev/blog/zod-4-5). Para aceptar también la precisión de minutos, haz una unión de `z.iso.datetime()` con `z.iso.datetime({ precision: -1 })`. Estos son formatos de string; la salida sigue siendo un string. Para un `Date`, usa un codec (consulta `pattern-codecs`).

### Template literals

```typescript
// Valida strings que coinciden con un patrón de plantilla
const UserID = z.templateLiteral(["user_", z.string()])
// Coincide: "user_abc123", "user_xyz"
// Rechaza: "abc123", "admin_xyz"

const CssLength = z.templateLiteral([z.number(), z.enum(["px", "em", "rem"])])
```

## Números

```typescript
z.number()                // cualquier número finito
z.int()                   // entero seguro: Number.MIN_SAFE_INTEGER..Number.MAX_SAFE_INTEGER
z.int32()                 // rango de entero de 32 bits con signo
z.uint32()                // rango de entero de 32 bits sin signo
z.float32()               // rango de float32
z.float64()               // rango de float64
z.int64()                 // bigint en el rango de int64
z.uint64()                // bigint en el rango de uint64

// Restricciones
z.number().min(0)         // >= 0 (alias .gte)
z.number().max(100)       // <= 100 (alias .lte)
z.number().gt(0)          // > 0
z.number().lt(100)        // < 100
z.number().positive()     // > 0
z.number().negative()     // < 0
z.number().nonnegative()  // >= 0
z.number().nonpositive()  // <= 0
z.number().multipleOf(5)  // divisible entre 5 (alias .step)
```

`.finite()` y `.safe()` están deprecados: `z.number()` ya rechaza los valores infinitos, y `.safe()` es lo mismo que `.int()`. No existe `z.float()`.

## BigInt

```typescript
z.bigint()
z.bigint().min(0n)
z.bigint().max(100n)
z.bigint().positive()
z.bigint().negative()
z.bigint().nonnegative()
z.bigint().nonpositive()
z.bigint().multipleOf(5n)
```

## Boolean

```typescript
z.boolean()        // true o false
z.literal(true)    // solo true
z.literal(false)   // solo false
```

## Date

```typescript
z.date()                           // instancia de Date
z.date().min(new Date("2020-01-01")) // en esa fecha o después
z.date().max(new Date("2030-01-01")) // en esa fecha o antes
```

## Enums

```typescript
// Array de literales string
z.enum(["active", "inactive", "pending"])

// Enum de TypeScript: z.enum() reemplaza al deprecado z.nativeEnum()
enum Status {
  Active = "active",
  Inactive = "inactive",
}
z.enum(Status)

// Enum numérico: .options es [0, 1, 2] desde Zod 4.6
enum Priority {
  Low = 0,
  Medium = 1,
  High = 2,
}
z.enum(Priority)
```

## Stringbool

Convierte las representaciones booleanas en string en booleanos reales.

```typescript
z.stringbool()
// Acepta, sin distinguir mayúsculas de minúsculas: "true"/"false", "1"/"0", "yes"/"no", "on"/"off", "y"/"n", "enabled"/"disabled"
// Devuelve: boolean

z.stringbool().parse("true")   // true
z.stringbool().parse("false")  // false
z.stringbool().parse("1")      // true
z.stringbool().parse("0")      // false

// Conjuntos personalizados
z.stringbool({ truthy: ["ja"], falsy: ["nein"] })
```

## Literales

```typescript
z.literal("hello")   // exactamente "hello"
z.literal(42)        // exactamente 42
z.literal(true)      // exactamente true
z.literal(null)      // exactamente null
z.literal(undefined) // exactamente undefined
z.literal(100n)      // exactamente 100n (bigint)
z.literal(["red", "green"]) // cualquiera de los dos valores
```

## Archivos

```typescript
z.file()                                 // instancia de File
z.file().min(1024)                       // .size mínimo en bytes
z.file().max(5 * 1024 * 1024)            // .size máximo (5 MB)
z.file().mime("image/png")               // tipo MIME
z.file().mime(["image/png", "image/jpeg"]) // uno de varios tipos MIME
```

La documentación no muestra ningún comodín como `"image/*"`; lista los tipos.

## JSON

`z.json()` valida un valor que se puede codificar como JSON: un string, un número, un booleano, null, un array o un objeto plano de esos. No parsea un string JSON.

```typescript
z.json().parse({ name: "Alice", tags: ["a"] }) // { name: "Alice", tags: ["a"] }
z.json().parse('{"name":"Alice"}')             // el mismo string, sin parsear
z.json().safeParse(new Date()).success         // false
```

Para parsear un string JSON a un valor tipado, usa la receta `jsonCodec` de zod.dev/codecs.

## Tipos personalizados

```typescript
// Tipo personalizado con función de validación
const NonEmptyString = z.custom<string>(
  (val) => typeof val === "string" && val.length > 0,
  { error: "Must be a non-empty string" }
)
// Sin una función, z.custom<T>() acepta cualquier valor y solo establece el tipo
```

`z.instanceof(Class)` verifica `instanceof`:

```typescript
const ErrorSchema = z.instanceof(Error)
ErrorSchema.safeParse(new Error("test")).success // true
ErrorSchema.safeParse("not an error").success    // false
```

## Funciones

`z.function()` no es un schema en Zod 4. Construye un wrapper que valida los argumentos y el valor de retorno de una implementación.

```typescript
const LongerThan = z.function({
  input: [z.string(), z.number()], // parámetros: un array o un z.tuple()
  output: z.boolean(),
})

const longerThan = LongerThan.implement((s, n) => s.length > n)
longerThan("abc", 1) // true; los argumentos incorrectos o un valor de retorno incorrecto lanzan una excepción
```

La forma de Zod 3 `z.function(args, returns)` no pasa la verificación de tipos. Una llamada con argumentos incorrectos lanza `z.core.$ZodError`; en 4.6.7, `instanceof z.ZodError` es `false` para ella. Usa `.implementAsync()` para una implementación asíncrona.

## Branded types

`.brand<"Name">()` agrega un brand solo de tipo, así que dos tipos estructuralmente idénticos no se mezclan. La única forma de obtener un valor con brand es parsearlo.

```typescript
const USD = z.number().brand<"USD">()
const EUR = z.number().brand<"EUR">()
type USD = z.infer<typeof USD> // number & z.$brand<"USD">

function pay(amount: USD) { return amount }
const euros = EUR.parse(100)
// @ts-expect-error EUR no es asignable a USD
pay(euros)

const UserId = z.string().brand<"UserId">()
const Slug = z.string().regex(/^[a-z0-9-]+$/).brand<"Slug">()
```

## Optional, Nullable, Nullish

```typescript
z.string().optional()   // string | undefined
z.string().nullable()   // string | null
z.string().nullish()    // string | null | undefined
```

## Coerción

```typescript
z.coerce.string()   // String(input)
z.coerce.number()   // Number(input): "0x50" → 80, "" → 0
z.coerce.boolean()  // Boolean(input) — cuidado: Boolean("false") === true; usar z.stringbool()
z.coerce.bigint()   // BigInt(input)
z.coerce.date()     // new Date(input)
```

El tipo de entrada de un schema con coerción es `unknown`. Pasa un argumento de tipo para estrecharlo: `z.coerce.number<string>()`.
