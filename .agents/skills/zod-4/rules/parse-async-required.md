---
title: Usar parseAsync para refinamientos asíncronos
impact: CRÍTICO
description: Debes usar parseAsync()/safeParseAsync() cuando el schema tiene refinamientos o transformaciones asíncronos.
tags: parseo, async, refinamiento, transformación
---

# Usar parseAsync para refinamientos asíncronos

## Problema

Cuando un schema contiene refinamientos asíncronos (`.refine(async ...)`) o transformaciones asíncronas (`.transform(async ...)`), llamar a `.parse()` o a `.safeParse()` síncronos lanzará un error. El refinamiento asíncrono no se ejecutará.

## Incorrecto

```typescript
const UniqueEmail = z.email().refine(
  async (email) => !(await db.users.exists(email)),
  { error: "Email already registered" }
)

// BUG: un parseo síncrono con un refinamiento asíncrono lanza $ZodAsyncError
const result = UniqueEmail.safeParse(input)
```

## Correcto

```typescript
const UniqueEmail = z.email().refine(
  async (email) => !(await db.users.exists(email)),
  { error: "Email already registered" }
)

// CORRECTO: usar safeParseAsync para schemas con refinamientos asíncronos
const result = await UniqueEmail.safeParseAsync(input)
if (!result.success) {
  console.log(result.error.issues)
}
```

## Por qué

Zod separa el parseo síncrono del asíncrono. Si algún refinamiento o transformación de la cadena del schema es asíncrono, debes usar `parseAsync()` o `safeParseAsync()`. La versión síncrona lanza `$ZodAsyncError` ("Encountered Promise during synchronous parse"); no omite el refinamiento. Lo mismo aplica a `.validate()`, cuya forma asíncrona es `.validateAsync()`. Prueba el camino asíncrono, porque un test del happy path de otro schema no llega a él.
