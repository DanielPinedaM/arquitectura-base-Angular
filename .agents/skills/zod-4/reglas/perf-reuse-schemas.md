---
title: Reutilizar schemas con composición
impact: MEDIO
description: Define los schemas una sola vez. Usa .pick(), .omit(), .partial() para derivar variantes.
tags: composición, pick, omit, partial, DRY
---

# Reutilizar schemas con composición

## Problema

Duplicar definiciones de campos entre schemas relacionados (Create, Update, Response) provoca deriva. Cuando un campo cambia, solo algunos schemas se actualizan.

## Incorrecto

```typescript
// MAL: campos duplicados entre schemas
const UserCreate = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(8),
})

const UserUpdate = z.object({
  name: z.string().optional(),
  email: z.email().optional(),
  // se olvidó el campo password — deriva
})

const UserResponse = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  createdAt: z.date(),
})
```

## Correcto

```typescript
// BIEN: una sola fuente, derivar variantes
const User = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  password: z.string().min(8),
  createdAt: z.date(),
})

const UserCreate = User.omit({ id: true, createdAt: true })
const UserUpdate = User.pick({ name: true, email: true }).partial()
const UserResponse = User.omit({ password: true })
```

## Por qué

`pick()`, `omit()`, `partial()` y `required()` derivan schemas nuevos a partir de una base. Los cambios en la base se propagan automáticamente a todos los schemas derivados. Los tipos inferidos también se mantienen sincronizados. `.exactPartial()` (Zod 4.5) hace que las claves se puedan omitir sin aceptar un `undefined` explícito, y `z.deepPartial()` también hace parciales los objetos anidados. `.partial()` y `z.deepPartial()` lanzan una excepción en un objeto que tiene su propio refinamiento.
