---
title: "v4: parámetro de error unificado"
impact: MEDIO
description: Reemplaza message, required_error, invalid_type_error y errorMap por el parámetro error.
tags: migración, v4, errores, message, errorMap
---

# v4: parámetro de error unificado

## Problema

Zod 3 tenía cuatro formas de personalizar los errores: `message`, `required_error`, `invalid_type_error` y `errorMap`. Zod 4 las reemplaza por un único parámetro `error`. `message` todavía funciona y está deprecado. Los otros tres ya no existen: TypeScript los rechaza y, en runtime, Zod los ignora.

## Incorrecto

```typescript
// MAL: parámetros de Zod 3
const name = z.string({
  // @ts-expect-error no es un parámetro de Zod 4; se ignora en runtime
  required_error: "Required",
})
// @ts-expect-error errorMap ahora es `error`; se ignora en runtime
const email = z.email({ errorMap: () => ({ message: "Bad email" }) })
const age = z.number().min(18, { message: "Too young" }) // `message` está deprecado
```

## Correcto

```typescript
// BIEN: un string
const age = z.number().min(18, { error: "Must be 18 or older" })
const ageShort = z.number().min(18, "Must be 18 or older")

// BIEN: una función, que reemplaza a errorMap; devuelve un string, o undefined para usar el siguiente error map
const email = z.email({
  error: (issue) => (issue.input === undefined ? "Email is required" : "Enter a valid email"),
})
```

## Por qué

En Zod 4, un error map devuelve un string plano en lugar de `{ message }`. La precedencia también cambió: un error a nivel de schema ahora gana sobre un error map pasado a `.parse()` (zod.dev/v4/changelog). Para un map global, usa `z.config({ customError })`.
