---
title: Inferir los tipos a partir de los schemas
impact: CRÍTICO
description: Usa z.infer<typeof Schema> para los tipos de salida. Nunca dupliques tipos manualmente.
tags: inferencia, tipos, typescript, DRY
---

# Inferir los tipos a partir de los schemas

## Problema

Definir manualmente interfaces de TypeScript junto a los schemas de Zod crea definiciones de tipos duplicadas que se desincronizan. Cuando el schema cambia, el tipo manual se olvida.

## Incorrecto

```typescript
// BUG: el tipo manual se desviará del schema
interface User {
  name: string
  email: string
  age: number
}

const UserSchema = z.object({
  name: z.string(),
  email: z.email(),
  age: z.number().min(0),
})

// Estos pueden divergir silenciosamente cuando se actualiza el schema
```

## Correcto

```typescript
const UserSchema = z.object({
  name: z.string(),
  email: z.email(),
  age: z.number().min(0),
})

// Tipo de salida (después del parseo/las transformaciones)
type User = z.infer<typeof UserSchema>

// Tipo de entrada (antes de las transformaciones — útil para formularios)
type UserInput = z.input<typeof UserSchema>
```

## Por qué

`z.infer` extrae el tipo de salida (después de las transformaciones). `z.input` extrae el tipo de entrada (antes de las transformaciones). Estos siempre se mantienen sincronizados con el schema. Usa `z.infer` en la mayoría de los casos; usa `z.input` cuando necesites la forma previa a la transformación (p. ej., el estado de un formulario donde un campo de fecha es un string antes de transformarse en Date).

Cuando el tipo viene primero, de un cliente generado o de un tipo que no te pertenece, verifica el schema contra él con `z.toZod<T>()` (Zod 4.5). Falla al compilar ante cualquier diferencia, mientras que `satisfies z.ZodType<T>` deja pasar claves extra y `z.any()`:

```typescript
type Player = { username: string; xp: number }

const Player = z.toZod<Player>()(
  z.object({
    username: z.string(),
    xp: z.number(),
  })
)
```
