---
title: Usar .validate() cuando solo necesitas un booleano
impact: MEDIO
description: Usa .validate() para un sí o un no, porque no construye ningún error; usa safeParse() cuando necesites el valor parseado.
tags: parseo, validate, rendimiento, type-guard
---

# Usar .validate() cuando solo necesitas un booleano

## Problema

`.safeParse(x).success` construye un `ZodError` completo por cada fallo y luego lo descarta. `.validate()` (Zod 4.6) devuelve un booleano, se detiene en el primer fallo y no construye ningún error. Tiene una trampa: estrecha el valor al tipo de entrada del schema y no devuelve ninguna salida, así que después de una transformación, un valor por defecto o un codec, el valor estrechado es la entrada cruda.

## Incorrecto

```typescript
const Item = z.object({ id: z.string(), price: z.number().nonnegative() })

// Construye y descarta un ZodError por cada elemento inválido
function validItems(items: unknown[]) {
  return items.filter((item) => Item.safeParse(item).success)
}

const Port = z.string().regex(z.regexes.integer).transform(Number)

function nextPort(raw: unknown) {
  if (Port.validate(raw)) {
    return raw + 1 // BUG: raw tiene el tipo de entrada, string, así que "8080" + 1 es "80801"
  }
  return undefined
}
```

## Correcto

```typescript
function validItems(items: unknown[]) {
  return items.filter((item) => Item.validate(item))
}

function nextPort(raw: unknown) {
  const result = Port.safeParse(raw)
  return result.success ? result.data + 1 : undefined
}
```

## Por qué

La página basics de zod.dev mide `.validate()` como hasta 16x más rápido que `.safeParse().success` con una entrada inválida, y el post del lanzamiento de la 4.6 mide hasta 35x en un schema compilado con `z.compile()`. Úsalo para filtros, guards y decisiones de enrutamiento. Usa `.safeParse()` cuando necesites el valor transformado o los issues.

En un schema con un refinamiento asíncrono, `.validate()` lanza una excepción, como lo hace `.safeParse()`; usa `.validateAsync()`.
