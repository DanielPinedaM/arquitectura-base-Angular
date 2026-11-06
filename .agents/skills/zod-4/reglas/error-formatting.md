---
title: Funciones de formateo de errores
impact: ALTO
description: Usa z.flattenError() para formularios planos, z.treeifyError() para datos anidados, z.prettifyError() para logs. z.formatError() está deprecado.
tags: errores, formateo, treeify, flatten, prettify
---

# Funciones de formateo de errores

## Problema

Zod 4 documenta `z.formatError()` y los métodos `.format()` y `.flatten()` de `ZodError` como deprecados. Todavía se ejecutan. Las funciones de nivel superior los reemplazan.

## Incorrecto

```typescript
const Signup = z.object({ email: z.email(), age: z.number().min(18) })

const result = Signup.safeParse(data)
if (!result.success) {
  // la documentación marca z.formatError() como deprecado en favor de z.treeifyError()
  const formatted = z.formatError(result.error)
}
```

## Correcto

```typescript
const Signup = z.object({
  email: z.email(),
  address: z.object({ zip: z.string().length(5) }),
})

const result = Signup.safeParse(data)
if (!result.success) {
  // formularios planos: { formErrors: string[], fieldErrors: { email?: string[], address?: string[] } }
  const flat = z.flattenError(result.error)
  flat.fieldErrors.email // p. ej. ["Invalid email address"]

  // datos anidados: un árbol que refleja el schema; usar optional chaining
  const tree = z.treeifyError(result.error)
  tree.properties?.address?.properties?.zip?.errors

  // logs y CLIs: una línea por issue, con "→ at <path>" debajo de cada uno
  const pretty = z.prettifyError(result.error)
}
```

## Por qué

| Función | Salida | Caso de uso |
|----------|--------|----------|
| `z.flattenError()` | `{ formErrors, fieldErrors }` | Formularios de un nivel; los issues anidados quedan bajo la clave de nivel superior |
| `z.treeifyError()` | `{ errors, properties?, items? }`, anidado como el schema | Formularios anidados, arrays, schemas recursivos |
| `z.prettifyError()` | Un string de varias líneas | Logs, depuración, salida de CLI |

Fuente: zod.dev/error-formatting.
