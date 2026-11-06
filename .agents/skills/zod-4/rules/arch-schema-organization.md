---
title: Ubicar los schemas junto a su capa de límite
impact: ALTO
description: Coloca los schemas junto al límite que los usa. Los schemas de la API en api/users/schemas.ts, los schemas de formularios en features/profile/form-schema.ts. Los tipos de dominio usan z.infer, nunca reexportes schemas crudos entre capas.
tags: arquitectura, organización, coubicación, estructura-del-proyecto
---

# Ubicar los schemas junto a su capa de límite

## Problema

Volcar todos los schemas en una sola carpeta `schemas/` crea un cajón de sastre de schemas no relacionados, sin ninguna indicación de dónde se usan. Los schemas de las rutas de la API, de la validación de formularios y del parseo del env se mezclan, lo que hace poco claro qué límite es dueño de qué schema.

## Incorrecto

```text
# BUG: todo en una carpeta — sin capas, pertenencia poco clara
src/
  schemas/
    user.ts          # ¿lo usan la API Y el formulario Y el env?
    order.ts
    config.ts
    form-profile.ts
    api-response.ts
    db-result.ts
```

```typescript
// BUG: el módulo de dominio importa y reexporta schemas crudos
// src/domain/user.ts
import { UserSchema } from "../schemas/user"
export { UserSchema } // filtra el parseo hacia el dominio
```

## Correcto

```text
src/
  api/
    users/
      route.ts
      schemas.ts       # schemas de petición/respuesta de la API para /users
    orders/
      route.ts
      schemas.ts       # schemas de la API para /orders
  features/
    profile/
      form-schema.ts   # schema de validación del formulario
      ProfileForm.tsx
  config/
    env.ts             # schema de las variables de entorno, parseado al arrancar
  domain/
    types.ts           # solo tipos z.infer — sin schemas crudos
```

```typescript
// api/users/schemas.ts — ubicado junto a la ruta
import * as z from "zod"

export const CreateUserBody = z.object({
  name: z.string().min(1),
  email: z.email(),
})

export const UserResponse = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
})
```

```typescript
// domain/types.ts — solo tipos inferidos, sin schemas crudos
import type { CreateUserBody, UserResponse } from "../api/users/schemas"
import type * as z from "zod"

export type CreateUser = z.infer<typeof CreateUserBody>
export type User = z.infer<typeof UserResponse>
```

## Por qué

La coubicación deja clara la pertenencia: el handler de la ruta de la API y sus schemas viven en el mismo directorio. Cuando una ruta cambia, el schema cambia con ella. Los tipos de dominio se derivan mediante `z.infer`, así que la capa de dominio nunca depende directamente de Zod — solo de tipos de TypeScript. Esto mantiene el parseo en el límite y la lógica de negocio libre de responsabilidades de validación.
