---
title: Zod Mini solo con límites estrictos de bundle
impact: MEDIO
description: Usa Zod Mini solo para bundles del cliente con límites de tamaño estrictos; impórtalo desde zod/mini y carga un locale.
tags: tamaño-del-bundle, mini, cliente, tree-shaking, locale
---

# Zod Mini solo con límites estrictos de bundle

## Problema

Zod Mini tiene las mismas funcionalidades que Zod detrás de una API funcional a la que los bundlers pueden aplicar tree-shaking. El ahorro es de unos pocos kilobytes, y la API es más difícil de descubrir. La página Zod Mini de zod.dev recomienda el Zod normal a menos que el tamaño del bundle sea una restricción inusualmente estricta, y dice que el ahorro no importa en un servidor. Además, Zod Mini no carga ningún locale, así que todos los mensajes dicen "Invalid input" hasta que cargues uno.

## Incorrecto

```typescript
// MAL: Zod Mini en un servidor, donde unos pocos kilobytes no importan
import * as z from "zod/mini"

const Order = z.object({
  sku: z.string().check(z.minLength(1)),
  quantity: z.int().check(z.positive()),
})
// y sin ningún locale cargado, el mensaje de cada issue es "Invalid input"
```

## Correcto

```typescript
// BIEN: un bundle del cliente con restricciones de tamaño que muestra mensajes a los usuarios
import * as z from "zod/mini"
import { en } from "zod/locales"

z.config(en())

const LoginForm = z.object({
  email: z.email(),
  password: z.string().check(z.minLength(8)),
})
```

## Por qué

Medido por la página Zod Mini de zod.dev (gzip): `z.boolean().parse(true)` genera un bundle de 2.12 kB con Zod Mini y de 5.91 kB con Zod; un schema de objeto de tres claves genera un bundle de 4.0 kB y de 13.1 kB.

| | Zod | Zod Mini |
|---|---|---|
| Importación | `import * as z from "zod"` | `import * as z from "zod/mini"`, o el paquete `@zod/mini`, que sigue las versiones de `zod` |
| Checks | Métodos: `.min(8)`, `.trim()`, `.refine()` | `.check(z.minLength(8), z.trim(), z.refine(...))` |
| Wrappers | `.optional()`, `.nullable()` | `z.optional(s)`, `z.nullable(s)` |
| Mensajes de error | Locale en inglés cargado | Ninguno cargado: "Invalid input" hasta `z.config(en())` |
| JSON Schema, metadata | `z.toJSONSchema()`, `.meta()`, `.describe()` | `z.toJSONSchema()`; `z.meta()` y `z.describe()` son checks |
| Entrada cíclica en schemas recursivos | Funciona | Necesita un memoizer registrado |
| Úsalo cuando | Servidores, scripts, la mayoría de los frontends | Bundles del cliente con un presupuesto de tamaño estricto |

Una librería que debe aceptar schemas tanto de Zod como de Zod Mini compila contra `zod/v4/core` (zod.dev/library-authors).
