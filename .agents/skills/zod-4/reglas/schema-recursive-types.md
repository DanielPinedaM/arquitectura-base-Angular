---
title: Diseño de schemas recursivos
impact: CRÍTICO
description: Define los schemas recursivos con un getter. La entrada cíclica se parsea desde Zod 4.5.
tags: recursivo, getter, lazy, árbol, cíclico
---

# Diseño de schemas recursivos

## Problema

Un schema para un árbol (categorías, comentarios, un organigrama) se refiere a sí mismo. Una autorreferencia directa falla, porque la variable todavía no está definida cuando se ejecuta el literal de objeto. El patrón de Zod 3, `z.lazy()` con una interfaz escrita a mano, todavía funciona en Zod 4, pero la interfaz duplica el schema y se desvía de él.

## Incorrecto

```typescript
// BUG: la interfaz escrita a mano y el schema pueden desincronizarse
interface CategoryShape {
  name: string
  children: CategoryShape[]
}

const Category: z.ZodType<CategoryShape> = z.object({
  name: z.string(),
  children: z.lazy(() => z.array(Category)),
})
```

## Correcto

```typescript
// BIEN: un getter difiere la referencia hasta el momento del parseo, y z.infer resuelve el tipo
const Category = z.object({
  name: z.string(),
  get children() {
    return z.array(Category)
  },
})

type Category = z.infer<typeof Category>
// { name: string; children: Category[] }
```

Cuando TypeScript reporta TS7023 ("implicitly has return type 'any'") en un getter, anota el tipo de retorno del getter:

```typescript
const Activity = z.object({
  name: z.string(),
  get subactivities(): z.ZodNullable<z.ZodArray<typeof Activity>> {
    return z.nullable(z.array(Activity))
  },
})
```

## Por qué

El getter es la forma documentada de definir objetos recursivos en Zod 4 (zod.dev/api, "Recursive objects"). El resultado es un `ZodObject` normal, así que `.pick()`, `.omit()`, `.partial()` y `.extend()` siguen funcionando. Los schemas mutuamente recursivos (un `User` con `posts`, un `Post` con un `author`) usan el mismo patrón.

Desde Zod 4.5, la entrada cíclica se parsea: un objeto que se contiene a sí mismo vuelve como un grafo de salida con los mismos ciclos. Zod Mini necesita un memoizer registrado para esto (zod.dev/api). `z.lazy()` no se eliminó ni está deprecado; `z.json()` está construido sobre él.
