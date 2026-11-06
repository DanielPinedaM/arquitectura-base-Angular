---
title: Branded types para tipado nominal
impact: MEDIO
description: Usa .brand<"Name">() para el tipado nominal y así evitar mezclar tipos estructuralmente idénticos.
tags: brand, nominal, seguridad-de-tipos, USD, EUR
---

# Branded types para tipado nominal

## Problema

TypeScript usa tipado estructural — dos tipos con la misma forma son intercambiables. Esto significa que puedes pasar por accidente un valor en USD donde se espera EUR, o un UserId donde se espera un PostId.

## Incorrecto

```typescript
// MAL: nada impide confundirlos
type USD = number
type EUR = number

function convert(amount: USD, rate: number): EUR {
  return amount * rate
}

const priceInEur: EUR = 100
convert(priceInEur, 1.1) // ¡Sin error! Se pasó EUR como USD
```

## Correcto

```typescript
// BIEN: los branded types impiden mezclarlos
const USD = z.number().brand<"USD">()
const EUR = z.number().brand<"EUR">()

type USD = z.infer<typeof USD> // number & z.$brand<"USD">
type EUR = z.infer<typeof EUR> // number & z.$brand<"EUR">

function convert(amount: USD, rate: number): EUR {
  return EUR.parse(amount * rate)
}

const priceInEur = EUR.parse(100)
// @ts-expect-error EUR no es asignable a USD
convert(priceInEur, 1.1)
```

## Por qué

`.brand()` agrega un brand solo de tipo, `z.$brand<"USD">`, que hace incompatibles los tipos estructuralmente idénticos. No cambia nada en runtime: la única forma de obtener un valor con brand es parsearlo. Por defecto, solo el tipo de salida lleva el brand; desde Zod 4.2, un segundo argumento de tipo establece la dirección: `.brand<"Cat", "in">()`, `"out"` (por defecto) o `"inout"` (zod.dev/api, "Branded types"). Usa brands para IDs (UserId vs PostId), monedas, unidades o cualquier dominio donde mezclar valores sea un error lógico.
