---
title: Pipe para parseo por etapas
impact: MEDIO
description: Usa .pipe() para encadenar etapas de validación. Parsear string → aplicar coerción a number → validar el rango.
tags: pipe, por-etapas, coerce, encadenamiento
---

# Pipe para parseo por etapas

## Problema

Las cadenas de validación complejas que aplican coerción y validan en varias etapas se vuelven desordenadas cuando se hacen en una sola transformación. Cada etapa debería parsear la salida de la etapa anterior.

## Incorrecto

```typescript
// MAL: todo en una transformación — sin validación intermedia
const PortNumber = z.string().transform((val) => {
  const n = parseInt(val, 10)
  if (isNaN(n)) throw new Error("Not a number") // incorrecto: no debería lanzar excepciones
  if (n < 1 || n > 65535) throw new Error("Invalid port") // incorrecto: no debería lanzar excepciones
  return n
})
```

## Correcto

```typescript
// BIEN: parseo por etapas con pipe
const PortNumber = z
  .string()
  .pipe(z.coerce.number()) // etapa 1: string → number
  .pipe(z.int().min(1).max(65535)) // etapa 2: validar el rango

PortNumber.parse("8080") // 8080
PortNumber.safeParse("abc").success // false: falla la etapa 1
PortNumber.safeParse("99999").success // false: falla la etapa 2
```

## Por qué

`.pipe()` pasa la salida de un schema a otro. Cada etapa produce issues de Zod cuando falla, y el tipo de cada etapa se infiere. `z.coerce.number()` acepta todo lo que acepta `Number()`, así que `"0x50"` se convierte en 80, `"1e3"` en 1000 y `" 80 "` en 80. Cuando solo los dígitos decimales son válidos, verifica primero el string: `z.string().regex(z.regexes.integer).transform(Number).pipe(z.int().min(1).max(65535))`.
