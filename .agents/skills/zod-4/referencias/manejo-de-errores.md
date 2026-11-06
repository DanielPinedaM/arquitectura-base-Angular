# Referencia del manejo de errores

Documentación: zod.dev/error-customization, zod.dev/error-formatting · Zod 4.6.7

## ZodError

```typescript
const Signup = z.object({
  email: z.email(),
  age: z.int().positive(),
  address: z.object({ zip: z.string().length(5) }),
})

const result = Signup.safeParse(data)
if (!result.success) {
  result.error            // instancia de ZodError
  result.error.issues     // array de issues
  result.error.message    // los issues como JSON formateado
  result.error.toString() // igual que .message
}
```

`ZodError.errors` de Zod 3 ya no existe; lee `.issues`. Un `ZodError` del paquete `zod` es un `Error`. La clase `$ZodError` de `zod/v4/core` no extiende de `Error`.

## Estructura de un issue

```typescript
// Todo issue tiene estos campos; cada código agrega los suyos (ver la tabla)
type IssueBase = {
  code: string        // código del tipo de issue
  message: string     // mensaje legible para humanos
  path: PropertyKey[] // path hasta el campo
  input?: unknown     // entrada cruda, solo con reportInput: true
}
```

## Códigos de issue

| Código | Cuándo | Campos extra |
|------|------|-------------|
| `invalid_type` | Tipo incorrecto, clave obligatoria ausente, `Date` inválido | `expected` |
| `too_small` | Por debajo del mínimo | `origin`, `minimum`, `inclusive`, `exact` |
| `too_big` | Por encima del máximo | `origin`, `maximum`, `inclusive`, `exact` |
| `invalid_format` | Falla un formato de string o un regex | `format`, `pattern` |
| `not_multiple_of` | Falla `.multipleOf()` | `divisor` |
| `unrecognized_keys` | Claves desconocidas (strict) | `keys` |
| `invalid_union` | Ninguna rama coincidió | `errors` (un array de issues por rama) |
| `invalid_key` / `invalid_element` | Clave de un record o de un map, elemento de un map o de un set | `origin`, `issues` |
| `invalid_value` | No es un valor literal o de enum permitido | `values` |
| `custom` | Refinamiento personalizado | `params`, cuando se pasan |

El campo `received` de Zod 3 en `invalid_type`, y los códigos `invalid_string`, `invalid_enum_value`, `invalid_literal`, `invalid_date`, `invalid_arguments` e `invalid_return_type`, ya no existen. Una implementación de `z.function()` lanza un `$ZodError` del core con argumentos incorrectos o un valor de retorno incorrecto; en 4.6.7, `instanceof z.ZodError` es false para él.

## Funciones de formateo de errores

### z.flattenError(error)

Estructura plana para formularios de un nivel. Los issues de los campos anidados quedan bajo su clave de nivel superior.

```typescript
if (!result.success) {
  const flat = z.flattenError(result.error)
  // {
  //   formErrors: [],
  //   fieldErrors: {
  //     email: ["Invalid email address"],
  //     address: ["Too small: expected string to have exactly 5 characters"],
  //   }
  // }
}
```

### z.treeifyError(error)

Árbol anidado que coincide con la forma del schema. Para formularios anidados, arrays y schemas recursivos.

```typescript
if (!result.success) {
  const tree = z.treeifyError(result.error)
  // {
  //   errors: [],
  //   properties: {
  //     address: {
  //       errors: [],
  //       properties: { zip: { errors: ["Too small: expected string to have exactly 5 characters"] } }
  //     }
  //   }
  // }

  tree.properties?.address?.properties?.zip?.errors // optional chaining: las claves ausentes son undefined
}
```

### z.prettifyError(error)

Un string de varias líneas para logs y CLIs.

```typescript
if (!result.success) {
  const pretty = z.prettifyError(result.error)
  // ✖ Invalid email address
  //   → at email
  // ✖ Too small: expected string to have exactly 5 characters
  //   → at address.zip
}
```

### z.formatError() — deprecado

La documentación marca `z.formatError()`, `error.format()` y `error.flatten()` como deprecados. Todavía se ejecutan. Usa `z.treeifyError()` o `z.flattenError()`.

## Personalización de errores

### A nivel de schema

```typescript
// Forma abreviada con string
z.string({ error: "Must be a string" })
z.string("Must be a string")
z.number().min(18, { error: "Must be 18+" })
z.number().min(18, "Must be 18+") // forma abreviada

// Forma de función — mensajes dinámicos; devolver undefined para pasar al siguiente
z.string({
  error: (issue) => {
    if (issue.input === undefined) return "Required"
    return "Must be a string"
  },
})
```

### A nivel de parseo

```typescript
Signup.safeParse(data, {
  error: (issue) => `Validation failed: ${issue.code}`,
})
```

### A nivel global

```typescript
z.config({
  customError: (issue) => {
    if (issue.code === "invalid_type") {
      return `Expected ${issue.expected}`
    }
    if (issue.code === "too_small") {
      return `Minimum is ${issue.minimum}`
    }
    return undefined // usar el mensaje del locale
  },
})
```

## Precedencia de errores

De mayor a menor (zod.dev/error-customization, "Error precedence"):

1. **Nivel de check**: el error del check que falló, p. ej. `.min(5, "Too short")`
2. **Nivel de schema**: el error del schema, p. ej. `z.string("Invalid name")`. También cubre los issues de los propios checks del schema que no tienen un error propio
3. **Nivel de parseo**: el `error` que se pasa a `.parse()` o a `.safeParse()`
4. **Global**: `z.config({ customError })`
5. **Locale**: `z.config(en())`; el Zod normal carga `en` automáticamente

## Opción reportInput

Incluye los valores de entrada crudos en los issues de error. Zod omite la entrada por defecto. **Nunca la uses en producción.**

```typescript
// Solo en desarrollo
const debugResult = Signup.safeParse(data, { reportInput: true })
if (!debugResult.success) {
  debugResult.error.issues[0].input // contiene el valor crudo
}
```

Filtra contraseñas, tokens, PII en los logs y en el monitoreo de errores.

## i18n / localización

Zod incluye locales. El Zod normal carga el inglés; Zod Mini no carga ninguno, así que todos los mensajes dicen "Invalid input" hasta que cargues uno.

```typescript
import * as z from "zod"
import { de } from "zod/locales"

z.config(de())
```

Para tus propias traducciones, usa la forma de función de error:

```typescript
type Translate = (key: string, values?: Record<string, unknown>) => string
declare const t: Translate

const NameSchema = z.string({
  error: (issue) => (issue.input === undefined ? t("field.required") : t("field.invalid")),
}).min(1, { error: t("field.too_short") })

z.config({
  customError: (issue) => {
    switch (issue.code) {
      case "invalid_type": return t("validation.invalid_type")
      case "too_small": return t("validation.too_small", { min: issue.minimum })
      default: return undefined
    }
  },
})
```
