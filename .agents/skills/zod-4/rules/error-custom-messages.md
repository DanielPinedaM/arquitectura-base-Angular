---
title: Mensajes de error personalizados (API de v4)
impact: ALTO
description: Personaliza los mensajes con el parámetro error. required_error e invalid_type_error ya no existen; message está deprecado.
tags: errores, mensajes, v4, migración
---

# Mensajes de error personalizados (API de v4)

## Problema

Zod 4 eliminó `required_error` e `invalid_type_error`. TypeScript los rechaza; JavaScript puro los deja pasar y Zod los ignora, así que aparece el mensaje por defecto en lugar del tuyo. El parámetro `message` todavía funciona, pero está deprecado.

## Incorrecto

```typescript
// BUG: Zod 4 eliminó estos parámetros, así que los mensajes personalizados nunca aparecen
const Name = z.string({
  // @ts-expect-error required_error e invalid_type_error no son parámetros de Zod 4
  required_error: "Name is required",
  invalid_type_error: "Name must be a string",
})

// `message` todavía funciona, pero Zod 4 lo documenta como deprecado
const Age = z.number().min(18, { message: "Must be 18+" })
```

## Correcto

```typescript
// BIEN: el parámetro error acepta un string
const Age = z.number().min(18, { error: "Must be 18+" })

// BIEN: o solo el string
const AgeShort = z.number().min(18, "Must be 18+")

// BIEN: una función distingue un valor ausente de un tipo incorrecto
const Name = z.string({
  error: (issue) => (issue.input === undefined ? "Name is required" : "Name must be a string"),
})
```

## Por qué

Zod 4 agrupa toda la personalización de errores bajo un único parámetro `error` (zod.dev/error-customization). Acepta un string, o una función que recibe el issue (`code`, `input`, `path` y campos como `minimum`) y devuelve un string, o `undefined` para pasar al siguiente error map. Un error a nivel de schema cubre los issues que generan sus propios checks, así que `z.string("Invalid name").min(5)` reporta "Invalid name" para un string corto.
