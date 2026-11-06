---
title: "v4: z.enum() unificado"
impact: MEDIO
description: Pasa los enums de TypeScript a z.enum(). z.nativeEnum() todavía se ejecuta, pero está deprecado.
tags: migración, v4, enum, nativeEnum
---

# v4: z.enum() unificado

## Problema

Zod 3 tenía `z.enum()` para arrays de strings y `z.nativeEnum()` para los enums de TypeScript. En Zod 4, `z.enum()` acepta ambos. `z.nativeEnum()` todavía se ejecuta, y su definición de tipos lo marca como deprecado.

## Incorrecto

```typescript
enum Role {
  Admin = "admin",
  User = "user",
}

const RoleSchema = z.nativeEnum(Role) // deprecado: usar z.enum(Role)
```

## Correcto

```typescript
enum Role {
  Admin = "admin",
  User = "user",
}

const RoleSchema = z.enum(Role)

// un array de strings, escrito inline o con `as const` para que los valores sigan siendo tipos literales
const StatusSchema = z.enum(["active", "inactive", "pending"])

// .enum da el objeto tipo enum; .exclude() y .extract() derivan schemas nuevos
StatusSchema.enum.active // "active"
const Open = StatusSchema.exclude(["inactive"])
```

## Por qué

`z.enum()` acepta un array de strings, un enum de TypeScript o un objeto tipo enum (zod.dev/api, "Enums"). Desde Zod 4.6, `.options` de un enum numérico lista solo los valores: `z.enum(Country).options` para `enum Country { UK, Germany }` es `[0, 1]`, sin las claves del mapeo inverso. `.Enum` y `.Values` de Zod 3 se eliminaron; usa `.enum`.
