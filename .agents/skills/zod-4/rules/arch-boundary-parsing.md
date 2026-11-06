---
title: Parsear en los límites del sistema, no en la lógica de dominio
impact: CRÍTICO
description: Llama a safeParse() en los puntos de entrada (handlers de API, arranque del env, resolvers de formularios, fetches externos) y pasa los datos tipados hacia adentro. La lógica de dominio recibe valores tipados, no unknown.
tags: arquitectura, límites, parseo, safeParse, separation-of-concerns
---

# Parsear en los límites del sistema, no en la lógica de dominio

## Problema

Cuando las llamadas a `safeParse()` están dispersas por toda la lógica de dominio, cada función debe manejar la entrada `unknown` y los errores de validación. Esto mezcla las responsabilidades del parseo con la lógica de negocio, hace que el manejo de errores sea inconsistente y crea validaciones redundantes.

## Incorrecto

```typescript
const OrderSchema = z.object({ id: z.string(), total: z.number().nonnegative() })

// BUG: la lógica de dominio maneja la entrada unknown y el parseo
function calculateDiscount(data: unknown) {
  const result = OrderSchema.safeParse(data)
  if (!result.success) {
    throw new Error("Invalid order")
  }
  const order = result.data
  if (order.total > 100) {
    return order.total * 0.1
  }
  return 0
}

// BUG: la capa de servicio vuelve a parsear lo que ya se validó
function processOrder(data: unknown) {
  const result = OrderSchema.safeParse(data)
  if (!result.success) return { error: "Invalid" }
  const discount = calculateDiscount(data) // ¡parsea de nuevo!
  return { total: result.data.total - discount }
}
```

## Correcto

```typescript
// Parsear UNA SOLA VEZ en el límite
app.post("/orders", (req, res) => {
  const result = OrderSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({
      errors: z.flattenError(result.error).fieldErrors,
    })
  }
  // Pasar los datos tipados hacia adentro — se acabó el unknown
  const response = processOrder(result.data)
  res.json(response)
})

// La lógica de dominio recibe datos tipados — no necesita parseo
function calculateDiscount(order: Order): number {
  return order.total > 100 ? order.total * 0.1 : 0
}

function processOrder(order: Order) {
  const discount = calculateDiscount(order)
  return { total: order.total - discount }
}

type Order = z.infer<typeof OrderSchema>
```

## Tabla de decisión: dónde parsear

| Límite | Dónde llamar a safeParse() |
|----------|--------------------------|
| Ruta de Express/Fastify | En el handler de la ruta, antes de llamar a las funciones de servicio |
| tRPC | `.input(Schema)` — el framework parsea por ti |
| Server Action de Next.js | Al inicio de la función de la action, antes de cualquier lógica |
| React Hook Form | `zodResolver(Schema)` — el resolver parsea al hacer submit |
| Variables de entorno | Al arrancar la app (p. ej., `envSchema.parse(process.env)`) |
| Respuesta de una API externa | Inmediatamente después de `fetch()`, antes de usar los datos |
| Resultados de la base de datos | Después de la consulta, si el schema podría desviarse de la forma de la BD |
| Consumidor de una cola de mensajes | Al inicio del handler, antes de procesar |

## Por qué

Parsear en el límite significa que las funciones de dominio son puras — aceptan valores tipados y devuelven valores tipados. Esto elimina la validación redundante, centraliza el manejo de errores y hace que la lógica de negocio sea más fácil de testear (no hace falta construir entradas inválidas). La capa de límite es el único lugar que trata con datos `unknown`.
