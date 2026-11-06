---
title: Compilar el schema final y demostrar que se compiló
impact: MEDIO
description: Pasa el schema final a z.compile(); un schema derivado no está compilado, y un schema no soportado hace fallback sin ningún error.
tags: rendimiento, compile, hot-path, csp, tamaño-del-bundle
---

# Compilar el schema final y demostrar que se compiló

## Problema

`z.compile()` (Zod 4.5) hace que la entrada válida se parsee más rápido en un hot path. Puede fallar sin dar ninguna señal. Un método llamado sobre un schema compilado, como `.refine()` u `.optional()`, devuelve un schema nuevo que no está compilado. Un check asíncrono o una función de `.catch()` en cualquier parte del schema hace que `z.compile()` devuelva el schema original, sin compilar. Ningún error te lo indica.

## Incorrecto

```typescript
// BUG: .refine() devuelve un schema nuevo, y el schema nuevo no está compilado
const Order = z.compile(z.object({ id: z.string(), qty: z.int() })).refine((o) => o.qty > 0)

// BUG: una función de .catch() en cualquier parte hace que z.compile() devuelva el schema original
const Query = z.compile(z.object({ page: z.int().catch(() => 1) }))
```

## Correcto

```typescript
const OrderShape = z.object({ id: z.string(), qty: z.int() }).refine((o) => o.qty > 0)
export const Order = z.compile(OrderShape)

const QueryShape = z.object({ page: z.int().catch(1) }) // un .catch() constante se compila
export const Query = z.compile(QueryShape)

// Un test falla cuando un schema deja de compilarse
test("hot-path schemas compile", () => {
  expect(() => z.compile(OrderShape, { strict: true })).not.toThrow()
  expect(() => z.compile(QueryShape, { strict: true })).not.toThrow()
})
```

## Por qué

Un schema compilado devuelve los mismos datos y los mismos issues que el original, así que compilar es seguro donde aplica. `strict: true` lanza `z.ZodCompileUnsupportedError` o `z.ZodCompileAsyncError` en lugar de hacer fallback, lo que hace visible el fallback en un test.

Con una entrada inválida, Zod vuelve a ejecutar el parser estándar para construir los issues: los fallos no se vuelven más rápidos, y un refinamiento puede ejecutarse dos veces, así que mantén los refinamientos libres de efectos secundarios. Usa `.validate()` cuando solo necesites un booleano. El compilador agrega unos 7 KB en gzip a un bundle que lo usa. Con una Content Security Policy estricta, `new Function` está bloqueado; instala un parser generado en tiempo de build con `z.withParser()`. Consulta `referencias/compilacion.md`.
