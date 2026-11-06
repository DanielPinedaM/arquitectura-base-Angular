---
title: Usar uniones discriminadas
impact: CRÍTICO
description: Usa z.discriminatedUnion() para uniones de objetos etiquetadas en lugar de z.union().
tags: unión, discriminada, etiquetada, rendimiento
---

# Usar uniones discriminadas

## Problema

`z.union()` prueba cada rama secuencialmente hasta que una coincide. Para uniones de objetos con un campo discriminador compartido (como `type` o `kind`), esto es lento y produce mensajes de error confusos que muestran los issues de todas las ramas.

## Incorrecto

```typescript
// MAL: prueba cada rama secuencialmente, el error muestra los issues de todas las ramas
const Shape = z.union([
  z.object({ type: z.literal("circle"), radius: z.number() }),
  z.object({ type: z.literal("square"), side: z.number() }),
  z.object({ type: z.literal("rect"), width: z.number(), height: z.number() }),
])
// { type: "triangle" } falla con un único issue invalid_union en el path [], con el mensaje "Invalid input",
// y un array `errors` que contiene los issues de cada rama
```

## Correcto

```typescript
// BIEN: elige la rama según el discriminador; los issues nombran el campo que falla
const Shape = z.discriminatedUnion("type", [
  z.object({ type: z.literal("circle"), radius: z.number() }),
  z.object({ type: z.literal("square"), side: z.number() }),
  z.object({ type: z.literal("rect"), width: z.number(), height: z.number() }),
])
// { type: "triangle" } falla en el path ["type"]:
//   "Invalid discriminator value. Expected 'circle' | 'square' | 'rect'"
// { type: "circle", radius: "x" } reporta solo la rama circle: invalid_type en ["radius"]
```

## Por qué

`discriminatedUnion` verifica primero el campo discriminador y luego valida solo la rama que coincide. No prueba las otras ramas, así que los issues nombran el campo que está mal. En Zod 4, un discriminador puede ser un literal, un enum, una unión de literales, `null` o `undefined`, y una unión discriminada puede ser una opción de otra (zod.dev/v4). `z.getDiscriminatedOption(Shape, "circle")` (Zod 4.5) devuelve una rama como un `ZodObject`. Para exigir que coincida exactamente una rama, usa `z.xor([a, b])`.
