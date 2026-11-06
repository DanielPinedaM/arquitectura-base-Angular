---
title: Trampas de la coerción — strings booleanos
impact: CRÍTICO
description: z.coerce.boolean() usa el Boolean() de JavaScript, que convierte "false" → true. Usa z.stringbool().
tags: coerción, boolean, formularios, variables-de-entorno
---

# Trampas de la coerción — strings booleanos

## Problema

`z.coerce.boolean()` envuelve la entrada en el constructor `Boolean()` de JavaScript. `Boolean("false")` es `true` porque cualquier string no vacío es truthy. Esto corrompe silenciosamente los datos de los formularios y las variables de entorno.

## Incorrecto

```typescript
// BUG: Boolean("false") === true, Boolean("0") === true
const Settings = z.object({
  debug: z.coerce.boolean(),
  verbose: z.coerce.boolean(),
})

Settings.parse({ debug: "false", verbose: "0" })
// { debug: true, verbose: true } — ¡ambos están mal!
```

## Correcto

```typescript
// BIEN: z.stringbool() maneja correctamente las representaciones booleanas en string
const Settings = z.object({
  debug: z.stringbool(),
  verbose: z.stringbool(),
})

Settings.parse({ debug: "false", verbose: "0" })
// { debug: false, verbose: false }

// z.stringbool() acepta, sin distinguir mayúsculas de minúsculas: "true"/"false", "1"/"0", "yes"/"no",
// "on"/"off", "y"/"n", "enabled"/"disabled". Cualquier otra cosa es un issue invalid_value.
// Cambiar los conjuntos con z.stringbool({ truthy: [...], falsy: [...] }) o { case: "sensitive" }.
```

## Por qué

`z.stringbool()` está hecho específicamente para la conversión de string a booleano desde formularios, variables de entorno y parámetros de query. Entiende las representaciones comunes en string de los valores booleanos. `z.coerce.boolean()` solo debería usarse cuando realmente quieres la semántica de truthiness de JavaScript.
