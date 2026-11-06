---
title: Evolucionar los schemas sin romper a los consumidores
impact: MEDIO
description: Usa cambios aditivos para una evolución sin breaking changes. Los campos nuevos usan .optional(). Nunca elimines campos obligatorios sin un incremento de versión major.
tags: arquitectura, versionado, compatibilidad-hacia-atrás, evolución-de-la-api
---

# Evolucionar los schemas sin romper a los consumidores

## Problema

Eliminar campos de un schema de Zod o hacerlos más restrictivos rompe silenciosamente a los consumidores. Como `z.object()` elimina por defecto las claves desconocidas, los campos eliminados desaparecen de la salida parseada sin ningún error — los consumidores que leen ese campo obtienen `undefined` en runtime, a pesar de que TypeScript no muestra ningún error de compilación si no han actualizado sus tipos.

## Incorrecto

```typescript
// v1 — los consumidores dependen de `role`
const UserV1 = z.object({
  name: z.string(),
  email: z.email(),
  role: z.enum(["admin", "user"]),
  nickname: z.string(),
})

// v2 — BREAKING: se eliminó `role`, los consumidores obtienen undefined silenciosamente
const UserV2 = z.object({
  name: z.string(),
  email: z.email(),
  nickname: z.string(),
  // role ya no existe — los consumidores que llaman a user.role obtienen undefined
})
```

## Correcto

```typescript
// v2 — sin breaking change: mantener role, agregar displayName como opcional, deprecar nickname
const UserV2 = z.object({
  name: z.string(),
  email: z.email(),
  role: z.enum(["admin", "user"]),         // se mantiene — no se elimina
  nickname: z.string(),                     // se mantiene — deprecar en la documentación, eliminar en v3
  displayName: z.string().optional(),       // nuevo — opcional para que los payloads antiguos se sigan parseando
})

type UserV2 = z.infer<typeof UserV2>
```

## Tabla de decisión: cambios en el schema

| Cambio | ¿Breaking? | Enfoque seguro |
|--------|-----------|---------------|
| Agregar un campo opcional | No | `.optional()` — los datos antiguos se siguen parseando |
| Agregar un campo obligatorio | **Sí** | Hacerlo opcional primero, exigirlo en la siguiente major |
| Eliminar un campo | **Sí** | Deprecarlo primero, eliminarlo en la siguiente major |
| Endurecer una restricción (p. ej., min 1 → min 5) | **Sí** | Los datos que antes eran válidos ahora fallan |
| Relajar una restricción (p. ej., min 5 → min 1) | No | Todos los datos existentes siguen siendo válidos |
| Renombrar un campo | **Sí** | Agregar el nombre nuevo como opcional, mantener el antiguo, migrar |
| Cambiar el tipo (p. ej., string → number) | **Sí** | Un campo nuevo con un nombre nuevo, deprecar el antiguo |
| Agregar un miembro a una unión | No | Los datos existentes siguen coincidiendo |
| Eliminar un miembro de una unión | **Sí** | Los datos existentes con ese valor fallan |

## Por qué

Los schemas de Zod son contratos en runtime. Cambiarlos tiene el mismo impacto que cambiar una API — los consumidores que dependen de la forma se romperán. Los cambios aditivos (campos opcionales nuevos, restricciones relajadas, miembros nuevos en las uniones) siempre son seguros. Los cambios sustractivos (eliminar campos, endurecer restricciones) requieren una migración coordinada entre todos los consumidores.
