---
title: reportInput filtra datos sensibles
impact: ALTO
description: Nunca habilites reportInput en producción. Incrusta los valores de entrada crudos en los mensajes de error.
tags: seguridad, reportInput, logging, producción
---

# reportInput filtra datos sensibles

## Problema

La opción de parseo `reportInput` incluye el valor de entrada crudo en cada issue. Zod lo omite por defecto por esta razón (zod.dev/error-customization). Si se habilita en producción, los datos sensibles (contraseñas, tokens, PII) terminan en los logs de errores, en los sistemas de monitoreo y en las respuestas de la API.

## Incorrecto

```typescript
const UserSchema = z.object({ email: z.email(), password: z.string().min(12) })

// BUG: filtra contraseñas, tokens, PII en los mensajes de error
app.post("/register", (req, res) => {
  const result = UserSchema.safeParse(req.body, { reportInput: true })
  if (!result.success) {
    // error.issues[0].input podría contener: "myP@ssw0rd123"
    logger.error(result.error.issues)
    res.status(400).json({ errors: result.error.issues })
  }
})
```

## Correcto

```typescript
// BIEN: usar reportInput solo en desarrollo/depuración
const parseOptions = {
  reportInput: process.env.NODE_ENV === "development",
}

app.post("/register", (req, res) => {
  const result = UserSchema.safeParse(req.body, parseOptions)
  if (!result.success) {
    // En producción, los issues no contendrán los valores de entrada crudos
    const flat = z.flattenError(result.error)
    res.status(400).json({ errors: flat.fieldErrors })
  }
})
```

## Por qué

Los issues de error se registran habitualmente en logs, se envían a herramientas de monitoreo de errores (Sentry, Datadog) y a veces se devuelven en las respuestas de la API. Incluir los valores de entrada crudos en estos flujos viola los principios de privacidad de datos y puede exponer datos sensibles de los usuarios.
