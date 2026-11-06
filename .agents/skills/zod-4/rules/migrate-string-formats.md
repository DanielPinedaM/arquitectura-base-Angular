---
title: "v4: formatos de string de nivel superior"
impact: MEDIO
description: Usa z.email(), z.uuid(), z.url() de nivel superior en lugar de los métodos deprecados z.string().email().
tags: migración, v4, string, email, uuid, url, formatos
---

# v4: formatos de string de nivel superior

## Problema

Zod 4 movió los formatos de string a funciones de nivel superior. Las formas de método, como `z.string().email()`, todavía funcionan, y sus definiciones de tipos las marcan como deprecadas (zod.dev/v4/changelog).

## Incorrecto

```typescript
// MAL: formas de método de Zod 3
const Email = z.string().email() // deprecado: usar z.email()
const Url = z.string().url() // deprecado: usar z.url()
const Uuid = z.string().uuid() // deprecado: usar z.uuid()
const Cuid = z.cuid() // deprecado: CUID v1 filtra información; usar z.cuid2()
```

## Correcto

```typescript
const Email = z.email()
const Url = z.url()
const HttpUrl = z.httpUrl() // http o https, con un dominio válido
const Uuid = z.uuid() // bits de variante de RFC 9562; z.guid() para cualquier string hex 8-4-4-4-12
const Cuid2 = z.cuid2()
const Ulid = z.ulid()
const Ipv4 = z.ipv4()
const Cidrv6 = z.cidrv6()
const Jwt = z.jwt()
const Base64url = z.base64url() // sin padding
const IsoDate = z.iso.date()
const IsoDateTime = z.iso.datetime() // segundos obligatorios desde Zod 4.5
```

## Por qué

Cada formato es su propio tipo de schema, y la forma de nivel superior es más corta y funciona mejor con el tree-shaking. `z.uuid()` verifica los bits de variante de RFC 9562; acepta todas las versiones a menos que pases `{ version }` o uses `z.uuidv4()`, `z.uuidv7()`. `z.string().ip()` y `z.string().cidr()` se eliminaron; usa `z.ipv4()`/`z.ipv6()` y `z.cidrv4()`/`z.cidrv6()`, o una unión. La lista completa está en `references/tipos-de-schema.md`.
