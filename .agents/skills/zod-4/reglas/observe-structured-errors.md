---
title: Registrar errores estructurados, no el ZodError crudo
impact: ALTO
description: Usa z.flattenError() para logs compactos y estructurados con IDs de correlación de la petición. Nunca hagas console.log de un ZodError crudo — es ruidoso, no está estructurado y es imposible de consultar.
tags: observabilidad, logging, errores, flattenError, logging-estructurado
---

# Registrar errores estructurados, no el ZodError crudo

## Problema

Los objetos `ZodError` crudos contienen arrays de issues profundamente anidados con metadata interna. Registrarlos directamente en los logs produce una salida ruidosa y sin estructura que es imposible de filtrar, de usar para alertas o de consultar en las herramientas de agregación de logs (Datadog, Grafana, ELK).

## Incorrecto

```typescript
const UserSchema = z.object({ name: z.string(), email: z.email() })

// BUG: el ZodError crudo es ruidoso y no se puede consultar
app.post("/api/users", (req, res) => {
  const result = UserSchema.safeParse(req.body)
  if (!result.success) {
    logger.error("Validation failed", { error: result.error })
    // Registra en el log un objeto anidado enorme con metadata interna de Zod
    // No se puede buscar por nombre de campo, schema o petición
    return res.status(400).json({ error: "Invalid input" })
  }
})
```

```typescript
// BUG: console.log — sin estructura, sin correlación
const result = UserSchema.safeParse(data)
if (!result.success) {
  console.log("Validation failed:", result.error)
}
```

## Correcto

```typescript
app.post("/api/users", (req, res) => {
  const result = UserSchema.safeParse(req.body)
  if (!result.success) {
    const flat = z.flattenError(result.error)
    logger.warn("validation_failed", {
      requestId: req.get("x-request-id"),
      schema: "UserSchema",
      path: req.path,
      formErrors: flat.formErrors,
      fieldErrors: flat.fieldErrors,
    })
    return res.status(400).json({ errors: flat.fieldErrors })
  }
})
```

```typescript
// Helper reutilizable para un logging estructurado consistente
type Logger = { warn(event: string, fields: Record<string, unknown>): void }

function logValidationError(
  logger: Logger,
  opts: {
    requestId: string
    schema: string
    error: z.ZodError
    path?: string
  }
) {
  const flat = z.flattenError(opts.error)
  logger.warn("validation_failed", {
    requestId: opts.requestId,
    schema: opts.schema,
    path: opts.path,
    formErrors: flat.formErrors,
    fieldErrors: flat.fieldErrors,
    fieldCount: Object.keys(flat.fieldErrors).length,
  })
}
```

## Por qué

Los logs estructurados con `z.flattenError()` son compactos (nombre del campo → mensajes de error), consultables (búsqueda por nombre de schema o por campo que falla) y correlacionables (el ID de la petición vincula el error con una petición específica). Esto permite dashboards que muestran qué schemas y campos fallan con más frecuencia, alertas sobre picos en las tasas de validación y la depuración de peticiones específicas de los usuarios.
