---
title: Hacer seguimiento de las tasas de error de validación por schema y campo
impact: MEDIO
description: Envuelve safeParse en un helper con seguimiento que incrementa contadores por schema y por campo cuando falla. Identifica los schemas demasiado estrictos (alta tasa de fallos) y los demasiado laxos (nunca fallan).
tags: observabilidad, métricas, monitoreo, validación, producción
---

# Hacer seguimiento de las tasas de error de validación por schema y campo

## Problema

Sin métricas sobre los fallos de validación, no tienes visibilidad del comportamiento de los schemas en producción. Los schemas demasiado estrictos rechazan silenciosamente entradas válidas de los usuarios (lo que causa frustración en la UX), mientras que los schemas demasiado laxos que nunca fallan pueden no estar dando ninguna protección real.

## Incorrecto

```typescript
const OrderSchema = z.object({ sku: z.string(), quantity: z.int().positive() })

// Sin monitoreo — la validación es una caja negra
app.post("/api/orders", (req, res) => {
  const result = OrderSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ error: "Invalid" })
  }
  // ¿Con qué frecuencia falla esto? ¿Qué campos? Nadie lo sabe.
})
```

## Correcto

```typescript
import * as z from "zod"

const OrderSchema = z.object({ sku: z.string(), quantity: z.int().positive() })

// Wrapper de safeParse con seguimiento
function trackedSafeParse<T extends z.ZodType>(
  schema: T,
  data: unknown,
  schemaName: string
): z.ZodSafeParseResult<z.output<T>> {
  const result = schema.safeParse(data)

  metrics.increment("zod.validation.attempt", { schema: schemaName })

  if (!result.success) {
    metrics.increment("zod.validation.failure", { schema: schemaName })

    // Hacer seguimiento de qué campos fallan
    const flat = z.flattenError(result.error)
    for (const field of Object.keys(flat.fieldErrors)) {
      metrics.increment("zod.validation.field_error", {
        schema: schemaName,
        field,
      })
    }
  }

  return result
}

function processOrder(order: z.infer<typeof OrderSchema>) {
  return { accepted: order.quantity }
}

// Uso
app.post("/api/orders", (req, res) => {
  const result = trackedSafeParse(OrderSchema, req.body, "OrderSchema")
  if (!result.success) {
    return res.status(400).json({
      errors: z.flattenError(result.error).fieldErrors,
    })
  }
  res.json(processOrder(result.data))
})
```

## Lo que te dicen las métricas

| Señal | Significado | Acción |
|--------|---------|--------|
| Alta tasa de fallos en un schema | El schema puede ser demasiado estricto | Revisar las restricciones, comprobar si los usuarios envían datos válidos que se rechazan |
| Un campo domina los fallos | Formato de entrada confuso | Mejorar la UX del formulario, agregar coerción, aclarar la documentación |
| El schema nunca falla | El schema puede ser demasiado laxo | Revisar si realmente está validando algo significativo |
| Pico de fallos tras un deploy | Un cambio en el schema rompió a los clientes | Revertir o hacer que el cambio sea aditivo |

## Por qué

Las métricas de validación cierran el ciclo de retroalimentación entre el diseño de los schemas y el uso en el mundo real. Sin ellas, estás adivinando si los schemas ayudan o perjudican. Hacer seguimiento de las tasas de fallo por schema y por campo convierte a Zod de un guardián silencioso en un componente observable del sistema.
