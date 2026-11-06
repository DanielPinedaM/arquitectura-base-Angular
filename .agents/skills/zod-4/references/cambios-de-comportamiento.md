# Cambios de comportamiento por versión

Documentación: zod.dev/v4/changelog, zod.dev/blog/zod-4-5, zod.dev/blog/zod-4-6 y las notas de la versión v4.4.0 en GitHub · Zod 4.6.7

Cada fila es un cambio en lo que un parseo acepta, rechaza o devuelve, o en lo que contiene un error o un JSON Schema. Un schema que pasaba sus tests en una versión anterior puede fallar en una posterior. Lee este archivo cuando actualices Zod, o cuando un schema se comporte de forma distinta al código escrito para una versión anterior.

La columna Test nombra el test de `.github/check/claims.test.ts` que muestra el resultado en 4.6.7. "A nivel de tipos" significa que el cambio solo se ve en TypeScript. "No ejecutado" significa que la verificación no prueba la fila.

## De Zod 3 a 4.0

| Cambio | Resultado en 4.6.7 | Test |
|---|---|---|
| `z.number()` rechaza `Infinity` y `-Infinity` | `z.number().safeParse(Infinity).success` es `false` | S5 |
| `z.int()` y `.int()` solo aceptan enteros seguros | `z.int().safeParse(2 ** 53).success` es `false` | S5 |
| `z.uuid()` verifica los bits de variante de RFC 9562; `z.guid()` no | `"00000000-0000-0000-c000-000000000000"` falla con `z.uuid()` y pasa con `z.guid()` | B1 |
| `z.base64url()` rechaza el padding | `"SGVsbG8="` falla, `"SGVsbG8"` pasa | B2 |
| Una clave ausente con un schema `z.coerce.*` falla | `z.object({ foo: z.coerce.boolean() }).safeParse({})` da `invalid_type`, con expected `"nonoptional"` | B3 |
| `.default()` devuelve el valor por defecto sin parsearlo; `.prefault()` lo parsea | `z.string().min(5).default("ab").parse(undefined)` devuelve `"ab"` | S3 |
| Los valores por defecto se aplican dentro de los campos opcionales | `z.object({ a: z.string().default("tuna").optional() }).parse({})` devuelve `{ a: "tuna" }` | B4 |
| `z.record()` con una clave enum exige todas las claves; `z.partialRecord()` no | `z.record(z.enum(["a", "b"]), z.number())` rechaza `{ a: 1 }` | B5 |
| Una intersección cuyos dos resultados no se pueden fusionar lanza un `Error` plano, no un `ZodError` | el mensaje empieza con "Unmergable intersection" | B6 |
| El tipo de entrada de `z.coerce.*` es `unknown` | `z.input<typeof z.coerce.number>` es `unknown` | A nivel de tipos |
| `z.record()` necesita un schema de clave y un schema de valor | `z.record(z.string())` es un error de tipo | A nivel de tipos |

## 4.4

| Cambio | Resultado en 4.6.7 | Test |
|---|---|---|
| Una clave cuyo schema es `z.undefined()`, `z.unknown()` o `z.any()` es obligatoria: la clave debe estar presente, y su valor puede ser `undefined` | `z.object({ a: z.unknown() }).safeParse({})` falla; `{ a: undefined }` pasa | B7 |
| Los valores por defecto de las tuplas aparecen en la salida | `z.tuple([z.string(), z.string().default("fallback")]).parse(["a"])` devuelve `["a", "fallback"]` | B8 |
| `.merge()` lanza una excepción cuando el receptor tiene refinamientos | el mensaje dice "Use .safeExtend() instead" | B9 |
| `z.base64()` rechaza los espacios en blanco | `"Zm 9v"` falla | B10 |
| `z.httpUrl()` rechaza un protocolo con una sola barra | `"https:/example.com"` falla | B11 |
| `z.cuid()` está deprecado, y su patrón es más estricto | los typings marcan `cuid` con `@deprecated` | S6 |
| Un error de unión discriminada nombra los valores esperados | `"Invalid discriminator value. Expected 'circle' \| 'square'"`, con `options` en el issue | B12 |
| `z.treeifyError()` conserva los paths de los issues dentro de una unión | los issues de cada miembro de la unión quedan bajo su campo | B13 |
| `z.toJSONSchema()` quita el `id` redundante de las entradas de `$defs` | `$defs.Inner` no tiene la clave `id` | B14 |

## 4.5

| Cambio | Resultado en 4.6.7 | Test |
|---|---|---|
| `z.iso.datetime()` exige segundos; `local: true` todavía acepta minutos | `"2020-01-01T06:15Z"` falla; haz una unión con `z.iso.datetime({ precision: -1 })` para aceptarlo | B15 |
| La longitud de un string cuenta puntos de código, no unidades de código UTF-16 | `z.string().max(5)` acepta cinco emojis; `z.string().min(5)` rechaza tres | B16 |
| El schema de clave de un record solo se aplica a las claves que coinciden con él | `z.object({ name: z.string() }).and(z.record(z.string().regex(/^S_/), z.string()))` acepta `{ name: "a", S_a: "s" }` | B17 |
| Un issue `unrecognized_keys` no detiene los otros checks | un objeto estricto con un valor incorrecto y una clave extra reporta `invalid_type` y `unrecognized_keys` | B18 |
| `__proto__` se elimina de los objetos parseados; un objeto estricto lo reporta como `unrecognized_keys` | la salida solo tiene las claves declaradas y un prototipo normal | B19 |
| `z.ipv6()` y `z.ulid()` son más estrictos, y `z.httpUrl()` verifica la longitud del host | `"::1\n"` falla con `z.ipv6()`; un ULID que empieza con `8` falla | B20 |
| La entrada cíclica se parsea a través de un schema recursivo | un objeto que se contiene a sí mismo se parsea | S1 |

## 4.6

| Cambio | Resultado en 4.6.7 | Test |
|---|---|---|
| Los error maps se ejecutan cuando se lee `result.error` por primera vez, no en el momento del parseo; `.parse()` no cambia | `safeParse()`, luego `z.config(z.locales.fr())`, luego lee el mensaje: está en francés | B21 |
| `z.emoji()` necesita un pictograma, un indicador regional o un keycap | `"123"` falla | B22 |
| `.options` de un enum numérico de TypeScript lista solo los valores | `[0, 1, 2]`, no los nombres del mapeo inverso | B23 |
| `z.toJSONSchema()` combina los checks encadenados; el orden de la cadena no cambia el resultado | `z.number().min(0).max(23).int()` da `minimum: 0, maximum: 23` | B24 |
| Los getters de límites (`.minLength`, `.maxLength`, `.minValue`, `.maxValue`, `.format`, `.isInt`, `.minDate`, `.maxDate`) leen los checks combinados | `z.string().min(8).length(5).minLength` es `8` | B25 |
| Un email dentro de un template literal ya no verifica el texto que le sigue | `z.templateLiteral([z.email(), "\|", z.string()])` acepta `"a@b.cc\|a..b"` | B26 |
| `z.base64()` y `z.base64url()` verifican la longitud y el padding en código, no en el regex | lo que acepta un `z.base64()` simple no cambia | No ejecutado |
