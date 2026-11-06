---
title: Nunca lanzar excepciones en los refinamientos
impact: ALTO
description: Las funciones de refinamiento y de transformación nunca deben lanzar excepciones. Devuelve false desde .refine(), agrega issues en .superRefine(), haz push en ctx.issues en .transform().
tags: refine, superRefine, transform, throw, error
---

# Nunca lanzar excepciones en los refinamientos

## Problema

Una excepción lanzada dentro de una función de `.refine()` o de `.transform()` no se convierte en un issue de Zod. Escapa de `.parse()` y de `.safeParse()` como un `Error` plano, así que quien llama y confía en que `safeParse()` nunca lanza excepciones recibe una excepción no manejada.

## Incorrecto

```typescript
// BUG: el throw escapa de safeParse()
const PositiveNumber = z.number().refine((n) => {
  if (n <= 0) throw new Error("Must be positive")
  return true
})
```

## Correcto

```typescript
// BIEN: .refine() devuelve un booleano; su función solo recibe el valor
const PositiveNumber = z.number().refine((n) => n > 0, { error: "Must be positive" })

// BIEN: .superRefine() recibe ctx y puede agregar varios issues
const Password = z.string().superRefine((val, ctx) => {
  if (val.length < 8) {
    ctx.addIssue({ code: "custom", message: "Password must be at least 8 characters", input: val })
  }
  if (!/[A-Z]/.test(val)) {
    ctx.addIssue({ code: "custom", message: "Password must contain an uppercase letter", input: val })
  }
})

// BIEN: una transformación reporta un fallo haciendo push en ctx.issues y devolviendo z.NEVER
const NumericString = z.string().transform((val, ctx) => {
  const n = Number(val)
  if (Number.isNaN(n)) {
    ctx.issues.push({ code: "custom", message: "Not a number", input: val })
    return z.NEVER
  }
  return n
})
```

## Por qué

`.refine()` espera un booleano, o una `Promise<boolean>` para un check asíncrono. Su función solo recibe el valor, sin `ctx`. `.superRefine()` recibe `(value, ctx)` y reporta con `ctx.addIssue()`. Un `.transform()` recibe `(value, ctx)` y reporta con `ctx.issues.push()` (zod.dev/api, "Refinements" y "Transforms"). Cada uno de estos se convierte en un issue de Zod en el resultado; un throw no.
