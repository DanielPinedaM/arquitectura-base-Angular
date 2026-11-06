# Referencia de refinamientos y transformaciones

Documentación: zod.dev/api · Zod 4.6.7

## .refine(fn, opts)

Validación personalizada que devuelve un booleano. La función solo recibe el valor.

```typescript
const EvenNumber = z.number().refine((n) => n % 2 === 0, {
  error: "Must be even",
})

// Refinamiento asíncrono — hay que usar parseAsync/safeParseAsync
const UniqueEmail = z.email().refine(
  async (email) => !(await db.exists(email)),
  { error: "Email taken" }
)
```

Opciones: `error`, `path` (dónde va el issue), `abort` (detenerse después de que falle este check), `when` (ejecutarlo solo cuando se cumple una condición; consulta `refine-cross-field`).

## .superRefine((val, ctx) => void)

Validación que agrega varios issues, cada uno con su propio path. La página del paquete `zod` lo lista como deprecado en favor de `.check()`; la página de la API lo documenta y los tipos de 4.6.7 no lo marcan como deprecado.

```typescript
const Password = z.string().superRefine((val, ctx) => {
  if (val.length < 8) {
    ctx.addIssue({ code: "custom", message: "Must be at least 8 characters", input: val })
  }
  if (!/[A-Z]/.test(val)) {
    ctx.addIssue({ code: "custom", message: "Must contain uppercase letter", input: val })
  }
  if (!/[0-9]/.test(val)) {
    ctx.addIssue({ code: "custom", message: "Must contain a number", input: val })
  }
})
```

### Validación entre campos

```typescript
const Form = z
  .object({
    password: z.string().min(8),
    confirm: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirm) {
      ctx.addIssue({
        code: "custom",
        path: ["confirm"], // apunta al campo confirm
        message: "Passwords don't match",
        input: data.confirm,
      })
    }
  })
```

## .check(...checks)

Acepta funciones de check como `z.minLength()`, o una función que recibe `ctx` y hace push de issues en `ctx.issues`. Funciona en Zod y es la única forma de agregar checks en Zod Mini.

```typescript
z.string().check(
  z.minLength(8, "Too short"),
  z.maxLength(100, "Too long"),
)

z.string().check((ctx) => {
  if (!ctx.value.includes("@")) {
    ctx.issues.push({ code: "custom", message: "Missing @", input: ctx.value })
  }
})
```

En Zod Mini (`import * as z from "zod/mini"`), las mismas llamadas funcionan: `z.string().check(z.minLength(8), z.maxLength(100))`.

## .transform(fn)

Convierte el valor a un tipo nuevo (unidireccional).

```typescript
const StringToNumber = z.string().regex(z.regexes.integer).transform(Number)
// Entrada: string, Salida: number

const Trimmed = z.string().transform((s) => s.trim())
// Entrada: string, Salida: string (recortado)
```

Nunca lances excepciones dentro de una transformación: Zod no captura el error. Para fallar, haz push en `ctx.issues` y devuelve `z.NEVER` (consulta `refine-never-throw`). Una transformación es unidireccional: `.encode()` en un schema que contiene una lanza `$ZodEncodeError`. Para conversiones bidireccionales, usa `z.codec()`.

## .pipe(schema)

Parseo por etapas — la salida del schema actual se convierte en la entrada del siguiente.

```typescript
const PortNumber = z
  .string()
  .pipe(z.coerce.number())
  .pipe(z.int().min(1).max(65535))

// Etapa 1: validar el string
// Etapa 2: aplicar coerción a number
// Etapa 3: validar un entero dentro del rango
```

## z.preprocess(fn, schema)

Ejecuta una función sobre la entrada cruda y luego parsea el resultado con `schema`. Una función de nivel superior, no un método. Su tipo de entrada es `unknown` a menos que anotes el parámetro de la función.

```typescript
const TrimmedString = z.preprocess(
  (val) => (typeof val === "string" ? val.trim() : val),
  z.string().min(1)
)

// anotar el parámetro para establecer el tipo de entrada, p. ej. para react-hook-form
const Trimmed = z.preprocess((val: string | null | undefined) => val?.trim() ?? "", z.string())
type TrimmedInput = z.input<typeof Trimmed> // string | null | undefined
```

## .overwrite(fn)

Cambia el valor sin cambiar su tipo, y devuelve la misma clase de schema, así que los demás métodos siguen disponibles. `.trim()`, `.toLowerCase()` y `.toUpperCase()` están construidos sobre él.

```typescript
const NormalizedEmail = z.email().overwrite((email) => email.toLowerCase())
NormalizedEmail.parse("A@B.CO") // "a@b.co"
```

## .default(value)

Cuando la entrada es `undefined`, devuelve el valor por defecto y omite el parseo. El valor por defecto no se valida, y debe coincidir con el tipo de salida.

```typescript
const Port = z.number().default(3000)
Port.parse(undefined) // 3000
Port.parse(8080)      // 8080

z.string().min(5).default("ab").parse(undefined) // "ab": min(5) no se ejecuta
```

El tipo de entrada pasa a ser opcional:
```typescript
type Input = z.input<typeof Port>   // number | undefined
type Output = z.infer<typeof Port>  // number
```

## .prefault(value)

Cuando la entrada es `undefined`, parsea en su lugar el valor del prefault. Debe coincidir con el tipo de entrada, y pasa por todos los checks y transformaciones.

```typescript
const Name = z.string().min(1).prefault("Anonymous")
Name.parse(undefined) // "Anonymous" (validado contra min(1))

const Length = z.string().transform((s) => s.length).prefault("tuna")
Length.parse(undefined) // 4
```

## .catch(value)

Devuelve un valor de fallback cuando el parseo falla. Pasa una función para calcularlo; la función recibe `ctx.error`.

```typescript
const SafeNumber = z.number().catch(0)
SafeNumber.parse("not a number") // 0
SafeNumber.parse(42)             // 42
```

## .apply(fn, ...args)

Llama a una función con el schema y devuelve su resultado, así que un helper compartido encaja en una cadena de métodos. Los argumentos extra van a la función.

```typescript
function percentage<T extends z.ZodNumber>(schema: T) {
  return schema.min(0).max(100)
}

const Score = z.number().apply(percentage).nullable()
```

## Refinamientos y transformaciones asíncronos

Cuando algún refinamiento o transformación es asíncrono, debes usar `parseAsync()` o `safeParseAsync()`. Los métodos síncronos lanzan `$ZodAsyncError`.

```typescript
const Schema = z.object({
  email: z.email().refine(
    async (email) => !(await db.exists(email)),
    { error: "Taken" }
  ),
  avatar: z.url().transform(async (url) => {
    const res = await fetch(url)
    return res.blob()
  }),
})

// OBLIGATORIO: parseo asíncrono
const result = await Schema.safeParseAsync(data)
```

## Códigos de issue

Los códigos que reporta Zod 4. Usa `"custom"` en `ctx.addIssue()` y en `ctx.issues.push()`.

| Código | Se genera cuando |
|------|-------------|
| `"custom"` | Falla un refinamiento o un check personalizado |
| `"invalid_type"` | Tipo de entrada incorrecto, incluido un `Date` inválido y una clave obligatoria ausente |
| `"too_small"` / `"too_big"` | Por debajo de un mínimo o por encima de un máximo (longitud, valor, tamaño) |
| `"invalid_format"` | Falla un formato o un patrón de string (`format` lo nombra: `"email"`, `"regex"`, ...) |
| `"not_multiple_of"` | Falla `.multipleOf()` |
| `"unrecognized_keys"` | Claves desconocidas en un objeto estricto |
| `"invalid_union"` | Ninguna rama de la unión coincidió; `errors` contiene los issues de cada rama |
| `"invalid_key"` / `"invalid_element"` | Envuelve en `issues` los issues de una clave de record o de map que falla, o de un elemento de map o de set. En 4.6.7, una clave de record que falla su patrón da `invalid_key`; las claves de map y los elementos de set reportan el código interno |
| `"invalid_value"` | No es uno de los valores literales o de enum permitidos |

Los `invalid_string`, `invalid_enum_value`, `invalid_literal`, `invalid_date`, `invalid_arguments` e `invalid_return_type` de Zod 3 ya no existen (zod.dev/v4/changelog).
