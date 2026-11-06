---
title: Validación entre campos
impact: ALTO
description: Refina el objeto padre y establece path en el campo que muestra el error.
tags: refine, superRefine, entre-campos, password, confirm, path, when
---

# Validación entre campos

## Problema

Un refinamiento sobre un campo solo ve el valor de ese campo. Una regla que compara dos campos, como una contraseña y su confirmación, pertenece al objeto padre, con `path` establecido para que el error se muestre en el campo correcto.

## Incorrecto

```typescript
// BUG: el refinamiento sobre confirm no puede ver password, así que no puede compararlos
const Form = z.object({
  password: z.string().min(8),
  confirm: z.string().refine((val) => val.length > 0, {
    error: "Passwords don't match",
  }),
})
```

## Correcto

```typescript
// BIEN: refinar el objeto y poner el issue en confirm
const Form = z
  .object({
    password: z.string().min(8),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    error: "Passwords don't match",
    path: ["confirm"],
  })
```

Un refinamiento de objeto no se ejecuta cuando algún campo tiene un error de tipo, incluso un campo que no lee. Un check fallido como `.min()` no lo detiene. Usa `when` para ejecutarlo en cuanto los campos que lee sean válidos:

```typescript
const Base = z.object({
  password: z.string().min(8),
  confirm: z.string(),
  nickname: z.string(),
})

const Signup = Base.refine((data) => data.password === data.confirm, {
  error: "Passwords don't match",
  path: ["confirm"],
  when(payload) {
    return Base.pick({ password: true, confirm: true }).safeParse(payload.value).success
  },
})
```

Para reportar más de un issue, usa `.superRefine()` y agrega cada issue con su propio `path`:

```typescript
const DateRange = z
  .object({ start: z.date(), end: z.date(), label: z.string() })
  .superRefine((data, ctx) => {
    if (data.end < data.start) {
      ctx.addIssue({ code: "custom", path: ["end"], message: "End is before start", input: data.end })
    }
    if (data.label.trim() === "") {
      ctx.addIssue({ code: "custom", path: ["label"], message: "Label is empty", input: data.label })
    }
  })
```

## Por qué

`path` coloca el issue bajo el campo, así que `z.flattenError()` lo reporta en `fieldErrors.confirm` y una librería de formularios lo muestra junto a ese input. `.refine()` cubre una sola condición (zod.dev/api, "Refinements"). La página de zod.dev del paquete `zod` lista `.superRefine()` como deprecado en favor de `.check()`, pero la página de la API lo documenta y las definiciones de tipos de 4.6.7 no lo marcan como deprecado.
