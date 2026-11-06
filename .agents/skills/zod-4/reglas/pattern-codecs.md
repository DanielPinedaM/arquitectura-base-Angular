---
title: Codecs para transformaciones bidireccionales
impact: MEDIO
description: Usa z.codec() para transformaciones bidireccionales (p. ej., string ISO ↔ Date). .transform() es unidireccional.
tags: codec, encode, decode, serialización
---

# Codecs para transformaciones bidireccionales

## Problema

`.transform()` es unidireccional — convierte la entrada en la salida durante el parseo. Pero cuando necesitas volver a serializar los datos (p. ej., Date → string ISO para una respuesta de la API), una transformación unidireccional pierde la dirección de codificación.

## Incorrecto

```typescript
// MAL: transform es unidireccional — no se puede volver a serializar a un string ISO
const DateField = z.string().transform((s) => new Date(s))

// El parseo funciona: "2024-01-01" → objeto Date
// Pero ¿cómo lo conviertes de vuelta a "2024-01-01" para la API?
```

## Correcto

```typescript
// BIEN: el codec define ambas direcciones
const DateField = z.codec(z.iso.datetime(), z.date(), {
  decode: (s) => new Date(s), // string → Date (parseo)
  encode: (d) => d.toISOString(), // Date → string (serialización)
})

const parsed = DateField.parse("2024-01-01T00:00:00Z") // objeto Date
const serialized = DateField.encode(parsed) // "2024-01-01T00:00:00.000Z"
```

## Por qué

Los codecs definen un par `decode` (dirección de parseo) y `encode` (dirección de serialización), para valores que hacen ida y vuelta entre representaciones: la entrada y la salida de una API, las filas de una base de datos, los valores de un formulario. `.parse()` acepta `unknown`; `.decode()` y `.encode()` aceptan una entrada tipada, así que TypeScript detecta un argumento incorrecto. Llamar a `.encode()` en un schema que contiene un `.transform()` lanza `$ZodEncodeError`, un error plano en lugar de un `ZodError`. Los valores por defecto, los prefaults y `.catch()` solo se aplican al decodificar. La página de codecs de zod.dev tiene recetas para copiar, como `stringToInt`, `epochSecondsToDate` y `jsonCodec`; Zod no las exporta.

| | `.transform()` | `z.codec()` |
|---|---|---|
| Dirección | Unidireccional (entrada → salida) | Bidireccional (decode + encode) |
| Úsalo cuando | Solo parseas (entrada de la API) | Ida y vuelta (entrada de la API ↔ salida) |
| Codificación | Lanza `$ZodEncodeError` | `schema.encode(value)` |
