---
title: Usar safeParse() para la entrada del usuario
impact: CRÍTICO
description: Usa safeParse() en lugar de parse() para evitar lanzar excepciones con una entrada inválida.
tags: parseo, safeParse, manejo-de-errores, validación
---

# Usar safeParse() para la entrada del usuario

## Problema

`parse()` lanza un `ZodError` con una entrada inválida. Envolverlo en un try/catch es verboso y propenso a errores — pierdes el resultado discriminado de éxito/error y te arriesgas a capturar errores no relacionados.

## Incorrecto

```typescript
const UserSchema = z.object({ name: z.string(), email: z.email() })

// BUG: try/catch es verboso y captura errores no relacionados
function validateInput(data: unknown) {
  try {
    const result = UserSchema.parse(data)
    return { success: true, data: result }
  } catch (e) {
    if (e instanceof z.ZodError) {
      return { success: false, errors: e.issues }
    }
    throw e // relanzar los errores que no son de Zod
  }
}
```

## Correcto

```typescript
function validateInput(data: unknown) {
  const result = UserSchema.safeParse(data)
  if (!result.success) {
    return { success: false, errors: result.error.issues }
  }
  return { success: true, data: result.data }
}
```

## Por qué

`safeParse()` devuelve una unión discriminada `{ success: true, data } | { success: false, error }`. Sin excepciones, sin try/catch, sin riesgo de capturar errores no relacionados. Usa `parse()` solo cuando los datos inválidos sean verdaderamente excepcionales (p. ej., una configuración interna que nunca debería estar mal). Cuando solo necesitas un sí o un no, `.validate()` devuelve un booleano sin construir un error (zod.dev/basics). `ZodError.errors` de Zod 3 se eliminó; lee `.issues`.
