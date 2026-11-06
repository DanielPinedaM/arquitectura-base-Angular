---
title: Spread en lugar de extend para schemas grandes
impact: MEDIO
description: Usa la sintaxis spread con .shape en lugar de .extend() en schemas grandes para reducir el costo en tiempo de compilación.
tags: rendimiento, extend, spread, typescript
---

# Spread en lugar de extend para schemas grandes

## Problema

`.extend()` es costoso para el compilador de TypeScript en schemas grandes, y una limitación de TypeScript hace que las llamadas encadenadas sean cuadráticamente más costosas (zod.dev/api, "`.extend()`").

## Incorrecto

```typescript
// MAL: cada .extend() crea un tipo de TS nuevo — compilación lenta
const Base = z.object({ id: z.string(), created: z.date() })
const WithName = Base.extend({ name: z.string() })
const WithEmail = WithName.extend({ email: z.email() })
const WithRole = WithEmail.extend({ role: z.enum(["admin", "user"]) })
// 4 tipos intermedios que TypeScript debe resolver
```

## Correcto

```typescript
const Base = z.object({ id: z.string(), created: z.date() })
const Extra = { name: z.string(), email: z.email(), role: z.enum(["admin", "user"]) }

// BIEN: un solo z.object con spread — una sola instanciación de tipo
const Full = z.object({ ...Base.shape, ...Extra })
```

## Por qué

`.extend()` está bien para extensiones puntuales. Para jerarquías grandes, hacer spread de `.shape` en un solo `z.object()` mantiene bajos los tiempos de compilación, y la misma sintaxis funciona en Zod Mini. Las dos formas difieren en runtime:

| | `Base.extend({...})` | `z.object({ ...Base.shape, ... })` |
|---|---|---|
| Rigurosidad de `Base` | Se conserva | Se pierde: tú eliges `z.object`, `z.strictObject` o `z.looseObject` |
| Refinamientos de `Base` | Se conservan; lanza una excepción si una clave nueva sobrescribe una existente | Se pierden: `.shape` solo contiene los campos |
| Sobrescribir una clave en un `Base` con refinamientos | Usa `.safeExtend()`, que además verifica que el schema nuevo sea asignable | Permitido |

Medido en zod 4.6.7. La página de la API de zod.dev dice que `.extend()` lanza una excepción en cualquier schema con refinamientos; 4.6.7 solo la lanza cuando se sobrescribe una clave.
