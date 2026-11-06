# Guía de testing de schemas de Zod

Verificado con Zod 4.6.7, Vitest 5, fast-check 4 y zod-schema-faker 3. La skill zod-testing incluye la misma guía; `.github/check/sync-testing.ts` genera su copia a partir de este archivo.

**IMPORTANTE:** Tus datos de entrenamiento sobre el testing de schemas de Zod pueden estar desactualizados — Zod 4 cambia los códigos de issue y el formateo de errores, depreca `z.nativeEnum()` y agrega APIs como `z.toJSONSchema()` y `.validate()`. Apóyate siempre en los archivos de referencia de esta skill y en el código fuente real del proyecto como fuente de verdad.

## Prioridad del testing

1. **Corrección del schema** — ¿el schema acepta los datos válidos y rechaza los inválidos?
2. **Mensajes de error** — ¿el schema produce los mensajes y los códigos de error correctos?
3. **Integración** — ¿el schema funciona correctamente con los handlers de API, los formularios y las capas de base de datos?
4. **Casos límite** — valores límite, combinaciones de optional/nullable, entradas vacías

## Patrón principal

```typescript
import { describe, it, expect } from "vitest" // o jest
import * as z from "zod"

const UserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  age: z.number().min(0).max(150),
})

describe("UserSchema", () => {
  it("accepts valid data", () => {
    const result = UserSchema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      age: 30,
    })
    expect(result.success).toBe(true)
  })

  it("rejects missing required fields", () => {
    const result = UserSchema.safeParse({})
    expect(result.success).toBe(false)
    if (!result.success) {
      const flat = z.flattenError(result.error)
      expect(flat.fieldErrors.name).toBeDefined()
      expect(flat.fieldErrors.email).toBeDefined()
    }
  })

  it("rejects invalid email", () => {
    const result = UserSchema.safeParse({
      name: "Alice",
      email: "not-an-email",
      age: 30,
    })
    expect(result.success).toBe(false)
  })

  it("rejects negative age", () => {
    const result = UserSchema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      age: -1,
    })
    expect(result.success).toBe(false)
  })
})
```

## Enfoques de testing

| Enfoque | Propósito | Úsalo cuando |
|----------|---------|----------|
| Verificación del resultado de `safeParse()` | Corrección del schema | Por defecto — usa siempre safeParse en los tests |
| Aserciones con `z.flattenError()` | Testing de los mensajes de error | Verificar errores de campos específicos |
| Snapshots de `z.toJSONSchema()` | Testing de la forma del schema | Detectar cambios no intencionados en el schema |
| Generación de datos mock | Creación de fixtures | Se necesitan datos de test válidos/aleatorios |
| Property-based testing | Fuzz testing | Los schemas deben manejar entradas válidas arbitrarias |
| Testing estructural | Arquitectura | Verificar que los schemas solo se importan en los límites |
| Detección de deriva | Regresión | Detectar cambios no intencionados en el schema mediante snapshots de JSON Schema |

## Testing de la corrección del schema

### Usar siempre safeParse() en los tests

```typescript
const AgeField = z.int().min(0)
const invalidData = -1

// BIEN: verifica que la validación falló, y puede hacer aserciones sobre los issues
const result = AgeField.safeParse(invalidData)
expect(result.success).toBe(false)
expect(result.error?.issues[0]?.code).toBe("too_small")

// MAL: pasa con cualquier error lanzado, incluido un TypeError de un bug en una transformación
expect(() => AgeField.parse(invalidData)).toThrow()
```

Cuando solo importa el sí o el no, `.validate()` devuelve un booleano: `expect(AgeField.validate(invalidData)).toBe(false)`.

### Probar tanto la aceptación como el rechazo

```typescript
describe("EmailSchema", () => {
  const valid = ["user@example.com", "a@b.co", "user+tag@domain.org"]
  const invalid = ["", "not-email", "@missing.com", "user@", "user @space.com"]

  it.each(valid)("accepts %s", (email) => {
    expect(z.email().safeParse(email).success).toBe(true)
  })

  it.each(invalid)("rejects %s", (email) => {
    expect(z.email().safeParse(email).success).toBe(false)
  })
})
```

### Probar los valores límite

```typescript
const AgeSchema = z.number().min(0).max(150)

it("accepts minimum boundary", () => {
  expect(AgeSchema.safeParse(0).success).toBe(true)
})

it("accepts maximum boundary", () => {
  expect(AgeSchema.safeParse(150).success).toBe(true)
})

it("rejects below minimum", () => {
  expect(AgeSchema.safeParse(-1).success).toBe(false)
})

it("rejects above maximum", () => {
  expect(AgeSchema.safeParse(151).success).toBe(false)
})
```

## Patrones de aserción de errores

### Hacer aserciones sobre errores de campos específicos

```typescript
it("shows correct error for invalid email", () => {
  const result = UserSchema.safeParse({ name: "Alice", email: "bad", age: 30 })
  expect(result.success).toBe(false)
  if (!result.success) {
    const flat = z.flattenError(result.error)
    expect(flat.fieldErrors.email).toBeDefined()
    expect(flat.fieldErrors.email![0]).toContain("email")
  }
})
```

### Hacer aserciones sobre los códigos de error

```typescript
it("produces correct error code", () => {
  const result = z.number().safeParse("not a number")
  expect(result.success).toBe(false)
  if (!result.success) {
    expect(result.error.issues[0].code).toBe("invalid_type")
  }
})
```

### Hacer aserciones sobre los mensajes de error personalizados

```typescript
const Schema = z.string({ error: "Name is required" }).min(1, "Name cannot be empty")

it("shows custom error for missing field", () => {
  const result = Schema.safeParse(undefined)
  expect(result.success).toBe(false)
  if (!result.success) {
    expect(result.error.issues[0].message).toBe("Name is required")
  }
})
```

### Hacer aserciones sobre los mensajes con una sola configuración

Desde Zod 4.6, los error maps se ejecutan cuando se lee `result.error` por primera vez, no en el momento del parseo. Un test que cambia `z.config()` entre el parseo y la aserción obtiene el mensaje de la nueva configuración. `.parse()` construye su error de inmediato. Restaura el locale después de cada test para que el locale de un test no se filtre al siguiente.

```typescript
afterEach(() => {
  z.config(z.locales.en())
})

it("reports the message in French", () => {
  z.config(z.locales.fr())
  const result = z.string().safeParse(12)
  expect(result.error?.issues[0]?.message).toMatch(/^Entrée invalide/)
})
```

## Generación de datos mock

### Usar zod-schema-faker

Importa desde `zod-schema-faker/v4`. La raíz del paquete es el punto de entrada de Zod 3 de la librería y lanza `Unsupported schema type` con un schema de Zod 4. `fake()` devuelve el tipo de entrada del schema; parsea el valor para obtener la salida de un schema con una transformación.

```bash
npm install -D zod-schema-faker @faker-js/faker randexp
```

```typescript
import { faker } from "@faker-js/faker"
import { fake, setFaker } from "zod-schema-faker/v4"
import { z } from "zod"

setFaker(faker) // llamarlo una vez en el setup de los tests (beforeAll o setupFiles)

const UserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  age: z.number().min(0).max(150),
})

it("schema accepts generated data", () => {
  const mockUser = fake(UserSchema)
  expect(UserSchema.safeParse(mockUser).success).toBe(true)
})
```

### Seed para tests deterministas

```typescript
import { seed, fake } from "zod-schema-faker/v4"

beforeEach(() => {
  seed(12345) // salida determinista
})

it("generates consistent mock data", () => {
  const user = fake(UserSchema)
  expect(user.name).toBeDefined()
})
```

## Snapshot testing con JSON Schema

```typescript
it("schema shape has not changed", () => {
  const jsonSchema = z.toJSONSchema(UserSchema)
  expect(jsonSchema).toMatchSnapshot()
})
```

Esto detecta los cambios no intencionados en el schema durante la revisión de código. El snapshot muestra la representación en JSON Schema de tu schema de Zod.

## Testing de integración

### Testing de handlers de API

```typescript
import request from "supertest"

it("API rejects invalid request body", async () => {
  const response = await request(app)
    .post("/api/users")
    .send({ name: "", email: "invalid" })
    .expect(400)

  expect(response.body.errors).toBeDefined()
  expect(response.body.errors.fieldErrors.email).toBeDefined()
})
```

### Testing de la validación de formularios

```typescript
const FormSchema = z.object({ name: z.string().min(1), email: z.email() })
const formData = { name: "Ada", email: "not-an-email" }

it("form shows validation errors", () => {
  const result = FormSchema.safeParse(formData)
  expect(result.success).toBe(false)
  if (!result.success) {
    const errors = z.flattenError(result.error)
    // Pasar los errores a la librería de formularios
    expect(errors.fieldErrors).toHaveProperty("email")
  }
})
```

## Property-based testing

Una propiedad enuncia una regla que se cumple para toda entrada. fast-check genera las entradas, reporta el seed de un fallo y reduce una entrada que falla al caso más pequeño. Construye las entradas con arbitraries de fast-check para que un fallo se reduzca, y enuncia la regla como una relación entre resultados, no repitiendo la lógica del schema (regla 10).

```typescript
import fc from "fast-check"

const LineSchema = z.object({
  priceMinor: z.number().int().min(0),
  qty: z.number().int().min(1),
})

const OrderSchema = z
  .object({ lines: z.array(LineSchema).min(1) })
  .transform((order) => ({
    ...order,
    totalMinor: order.lines.reduce((sum, l) => sum + l.priceMinor * l.qty, 0),
  }))

const lineArb = fc.record({
  priceMinor: fc.integer({ min: 0, max: 100_000 }),
  qty: fc.integer({ min: 1, max: 20 }),
})
const linesArb = fc.array(lineArb, { minLength: 1, maxLength: 30 })

const totalOf = (lines: z.input<typeof LineSchema>[]) => {
  const result = OrderSchema.safeParse({ lines })
  expect(result.success).toBe(true)
  return result.data!.totalMinor
}

it("one unit costs its price", () => {
  fc.assert(
    fc.property(fc.integer({ min: 0, max: 100_000 }), (priceMinor) => {
      expect(totalOf([{ priceMinor, qty: 1 }])).toBe(priceMinor)
    }),
  )
})

it("a line of quantity n costs the same as n lines of quantity 1", () => {
  fc.assert(
    fc.property(lineArb, (line) => {
      const units = Array.from({ length: line.qty }, () => ({ priceMinor: line.priceMinor, qty: 1 }))
      expect(totalOf([line])).toBe(totalOf(units))
    }),
  )
})

it("the total of two sets of lines is the sum of their totals", () => {
  fc.assert(
    fc.property(linesArb, linesArb, (a, b) => {
      expect(totalOf([...a, ...b])).toBe(totalOf(a) + totalOf(b))
    }),
  )
})

it("any integer age outside 0..150 is rejected", () => {
  fc.assert(
    fc.property(fc.oneof(fc.integer({ max: -1 }), fc.integer({ min: 151 })), (age) => {
      expect(UserSchema.safeParse({ name: "a", email: "a@example.com", age }).success).toBe(false)
    }),
  )
})
```

Para verificar que un schema acepta sus propios datos generados, deja que fast-check elija el seed del faker. Así, un fallo
reporta un seed que reproduce los datos; no se reduce.

```typescript
import { fake, seed } from "zod-schema-faker/v4"

it("schema accepts its own generated data", () => {
  fc.assert(
    fc.property(fc.integer({ min: 0, max: 2 ** 31 - 1 }), (s) => {
      seed(s)
      expect(UserSchema.safeParse(fake(UserSchema)).success).toBe(true)
    }),
    { numRuns: 200 },
  )
})
```

Nunca escribas `fc.property(fc.constant(null), ...)`: no genera nada, su contraejemplo es `[null]` y los
datos que fallaron se pierden.

## Reglas

1. **Haz aserciones sobre los resultados de `safeParse()`** — `expect(() => parse()).toThrow()` pasa con cualquier error, no solo con un fallo de validación
2. **Prueba tanto lo válido como lo inválido** — no pruebes solo el happy path
3. **Prueba los valores límite** — min, max, min-1, max+1 para las restricciones numéricas
4. **Prueba las combinaciones de optional/nullable** — undefined, null, clave ausente
5. **Haz aserciones sobre campos de error específicos** — usa `z.flattenError()` para verificar qué campo falló
6. **No pruebes los detalles internos del schema** — prueba los resultados del parseo, no `.shape` ni `._def`
7. **Usa snapshots de `z.toJSONSchema()`** — detecta los cambios no intencionados en el schema
8. **Usa un seed en los generadores aleatorios** — toma la aleatoriedad de fast-check, o de un seed que elija fast-check, para que un fallo se pueda reproducir; los tests no deterministas son tests flaky
9. **Prueba las transformaciones por separado** — verifica la validación de la entrada Y la conversión de la salida
10. **No dupliques la lógica del schema en las aserciones** — prueba el comportamiento, no la implementación

## Anti-patterns

Consulta [anti-patterns-de-testing.md](anti-patterns-de-testing.md) para ver ejemplos MAL/BIEN de:

- Probar los detalles internos del schema en lugar del comportamiento
- No probar los caminos de error
- Usar `parse()` con `toThrow()` en los tests (pasa con cualquier error)
- No probar los valores límite
- Escribir a mano los datos mock en lugar de generarlos
- Una propiedad sobre una constante (`fc.constant(null)`), que no genera nada
- Hacer snapshot testing del ZodError crudo en lugar de la salida formateada
- No probar en los límites (los tests del schema pasan, pero el handler no valida)
- Sin testing de regresión con snapshots (la eliminación de un campo pasa desapercibida)
- Probar la forma del schema pero no la observabilidad de los errores (nunca se hacen aserciones sobre flattenError)
- Sin un flujo de detección de deriva (los cambios en el schema llegan sin revisión mecánica)

## Referencias

- [Referencia de la API](api-de-testing.md) — Patrones de testing, helpers de aserción, generación de mocks
- [Anti-patterns](anti-patterns-de-testing.md) — Errores comunes de testing que hay que evitar
