---
title: Refine para la validación, transform para la conversión
impact: ALTO
description: Usa .refine() para validar, .transform() para convertir y .pipe() para validar el valor convertido.
tags: refine, transform, pipe, validación, codec
---

# Refine para la validación, transform para la conversión

## Problema

Validar dentro de `.transform()` lanzando una excepción se salta los errores de Zod: la excepción escapa de `safeParse()`. Verificar un string numérico con `parseInt` acepta strings que solo empiezan con dígitos, porque `parseInt("12abc")` devuelve `12`.

## Incorrecto

```typescript
// BUG: el throw escapa de safeParse() como un Error plano
const ThrowingInt = z.string().transform((val) => {
  const n = Number.parseInt(val, 10)
  if (Number.isNaN(n)) throw new Error("Not a number")
  return n
})

// BUG: parseInt("12abc") es 12, así que "12abc" pasa
const LooseInt = z
  .string()
  .refine((val) => !Number.isNaN(Number.parseInt(val, 10)), { error: "Must be a numeric string" })
  .transform((val) => Number.parseInt(val, 10))
```

## Correcto

```typescript
// BIEN: verificar el string, convertirlo y luego verificar el número
const StringToInt = z.string().regex(z.regexes.integer).transform(Number).pipe(z.int().min(0))

StringToInt.parse("42") // 42
StringToInt.safeParse("12abc").success // false
```

Cuando el valor también debe volver a ser un string, usa un codec en su lugar (consulta `pattern-codecs`).

## Por qué

`.refine()` responde "¿es esto válido?" y agrega un issue cuando no lo es. `.transform()` devuelve un valor nuevo y no debe lanzar excepciones (zod.dev/api, "Transforms"). `.pipe()` pasa la salida de un schema al siguiente, así que el valor convertido se valida con sus propios checks. Para reportar un issue desde dentro de una transformación, haz push de él en `ctx.issues` y devuelve `z.NEVER`.
