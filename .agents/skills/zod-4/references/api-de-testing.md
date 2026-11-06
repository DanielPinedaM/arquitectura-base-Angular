# Referencia de la API de testing de Zod

Verificado con Zod 4.6.7, Vitest 5.1, fast-check 4 y zod-schema-faker 3.

## Testing de la corrección del schema

### safeParse() para los tests

Haz aserciones sobre los resultados de `safeParse()`. `expect(() => schema.parse(data)).toThrow()` pasa con cualquier error lanzado, como un `TypeError` de un bug en una transformación, así que no demuestra que la validación rechazó la entrada.

```typescript
const UserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  age: z.int().min(0).max(150),
})

// BIEN: basado en aserciones
const result = UserSchema.safeParse(data)
expect(result.success).toBe(false)
expect(result.error?.issues.map((i) => i.code)).toContain("invalid_type")

// BIEN: solo un sí o un no
expect(UserSchema.validate(data)).toBe(false)

// MAL: pasa con cualquier error
expect(() => UserSchema.parse(data)).toThrow()
```

### Testing de datos válidos

```typescript
describe("UserSchema", () => {
  const validUsers = [
    { name: "Alice", email: "alice@example.com", age: 30 },
    { name: "B", email: "b@c.co", age: 0 },
    { name: "Zed", email: "zed+tag@domain.org", age: 150 },
  ]

  it.each(validUsers)("accepts valid user: $name", (user) => {
    const result = UserSchema.safeParse(user)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(user)
    }
  })
})
```

### Testing de datos inválidos

```typescript
const invalidInputs = [
  { input: {}, desc: "empty object" },
  { input: { name: "" }, desc: "empty name" },
  { input: { name: "A", email: "bad" }, desc: "invalid email" },
  { input: { name: "A", email: "a@b.com", age: -1 }, desc: "negative age" },
  { input: { name: "A", email: "a@b.com", age: 151 }, desc: "age over max" },
]

it.each(invalidInputs)("rejects $desc", ({ input }) => {
  expect(UserSchema.safeParse(input).success).toBe(false)
})
```

### Testing de valores límite

```typescript
const NumberSchema = z.number().min(0).max(100)

const boundaries = [
  { value: 0, expected: true, desc: "minimum" },
  { value: 100, expected: true, desc: "maximum" },
  { value: -1, expected: false, desc: "below minimum" },
  { value: 101, expected: false, desc: "above maximum" },
  { value: -0.001, expected: false, desc: "fractionally below min" },
  { value: 100.001, expected: false, desc: "fractionally above max" },
]

it.each(boundaries)("$desc ($value) → $expected", ({ value, expected }) => {
  expect(NumberSchema.safeParse(value).success).toBe(expected)
})
```

### Testing de optional y nullable

```typescript
const Schema = z.object({
  required: z.string(),
  optional: z.string().optional(),
  nullable: z.string().nullable(),
  both: z.string().optional().nullable(),
})

it("accepts all optional/nullable combinations", () => {
  expect(Schema.safeParse({ required: "a" }).success).toBe(true)
  expect(Schema.safeParse({ required: "a", optional: undefined }).success).toBe(true)
  expect(Schema.safeParse({ required: "a", nullable: null }).success).toBe(true)
  expect(Schema.safeParse({ required: "a", both: null }).success).toBe(true)
  expect(Schema.safeParse({ required: "a", both: undefined }).success).toBe(true)
})

it("rejects null for non-nullable", () => {
  expect(Schema.safeParse({ required: "a", optional: null }).success).toBe(false)
})

it("rejects undefined for non-optional", () => {
  expect(Schema.safeParse({ required: undefined }).success).toBe(false)
})
```

## Patrones de aserción de errores

### Usar z.flattenError()

```typescript
it("reports field-level errors", () => {
  const result = UserSchema.safeParse({ name: "", email: "bad", age: -1 })
  expect(result.success).toBe(false)
  if (!result.success) {
    const flat = z.flattenError(result.error)
    expect(flat.fieldErrors).toHaveProperty("email")
    expect(flat.fieldErrors).toHaveProperty("age")
  }
})
```

### Hacer aserciones sobre los mensajes de error

```typescript
it("shows custom error message", () => {
  const Schema = z.string({ error: "Name is required" })
  const result = Schema.safeParse(undefined)
  expect(result.success).toBe(false)
  if (!result.success) {
    expect(result.error.issues[0].message).toBe("Name is required")
  }
})
```

### Hacer aserciones sobre los códigos de error

```typescript
it("produces invalid_type for wrong type", () => {
  const result = z.number().safeParse("string")
  expect(result.success).toBe(false)
  if (!result.success) {
    expect(result.error.issues[0].code).toBe("invalid_type")
  }
})

it("produces too_small for under minimum", () => {
  const result = z.number().min(5).safeParse(3)
  expect(result.success).toBe(false)
  if (!result.success) {
    expect(result.error.issues[0].code).toBe("too_small")
  }
})
```

### Hacer aserciones sobre los paths de error

```typescript
const FormSchema = z
  .object({ password: z.string().min(8), confirm: z.string() })
  .refine((v) => v.password === v.confirm, { error: "Passwords don't match", path: ["confirm"] })

it("targets the correct field", () => {
  const result = FormSchema.safeParse({
    password: "12345678",
    confirm: "different",
  })
  expect(result.success).toBe(false)
  if (!result.success) {
    const confirmError = result.error.issues.find(
      (i) => i.path.join(".") === "confirm"
    )
    expect(confirmError).toBeDefined()
    expect(confirmError!.message).toBe("Passwords don't match")
  }
})
```

### Contar los errores

```typescript
it("reports all validation errors at once", () => {
  const result = UserSchema.safeParse({})
  expect(result.success).toBe(false)
  if (!result.success) {
    // Zod reporta todos los issues, no solo el primero
    expect(result.error.issues.length).toBeGreaterThanOrEqual(3)
  }
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
import { fake, seed, setFaker } from "zod-schema-faker/v4"
import * as z from "zod"

// Llamarlo una vez en el setup de los tests (beforeAll o setupFiles)
setFaker(faker)

const UserSchema = z.object({
  name: z.string().min(1).max(50),
  email: z.email(),
  age: z.number().int().min(0).max(150),
  role: z.enum(["admin", "user", "guest"]),
})

describe("with generated data", () => {
  beforeEach(() => seed(42)) // determinista

  it("schema accepts its own generated data", () => {
    const user = fake(UserSchema)
    expect(UserSchema.safeParse(user).success).toBe(true)
  })

  it("generates array of valid items", () => {
    const users = Array.from({ length: 10 }, () => fake(UserSchema))
    users.forEach((u) => {
      expect(UserSchema.safeParse(u).success).toBe(true)
    })
  })
})
```

### No @anatine/zod-mock

`@anatine/zod-mock` solo soporta Zod 3: su última versión (3.14.0) declara `zod ^3.21.4`, y con un schema de Zod 4
`generateMock()` devuelve `undefined`. Usa `zod-schema-faker/v4`.

## Snapshot testing

### Snapshots de JSON Schema

```typescript
it("schema shape matches snapshot", () => {
  const jsonSchema = z.toJSONSchema(UserSchema)
  expect(jsonSchema).toMatchSnapshot()
})
```

Actualiza los snapshots cuando los cambios en el schema sean intencionados:
```bash
vitest --update  # o jest --updateSnapshot
```

### Snapshots de errores formateados

```typescript
it("error output matches snapshot", () => {
  const result = UserSchema.safeParse({ name: 123, email: "bad" })
  expect(result.success).toBe(false)
  if (!result.success) {
    const flat = z.flattenError(result.error)
    expect(flat).toMatchSnapshot()
  }
})
```

## Testing de integración

### Handler de API de Express/Fastify

```typescript
import request from "supertest"

it("validates request body", async () => {
  const res = await request(app)
    .post("/api/users")
    .send({ name: "", email: "invalid" })
    .expect(400)

  expect(res.body.errors.fieldErrors).toHaveProperty("email")
})

it("accepts valid request", async () => {
  const res = await request(app)
    .post("/api/users")
    .send({ name: "Alice", email: "alice@example.com", age: 30 })
    .expect(201)

  expect(res.body.id).toBeDefined()
})
```

### Validación de formularios

```typescript
const formData = { password: "12345678", confirm: "different" }

it("produces form-compatible errors", () => {
  const result = FormSchema.safeParse(formData)
  expect(result.success).toBe(false)
  if (!result.success) {
    const errors = z.flattenError(result.error)
    // La estructura coincide con lo que esperan las librerías de formularios
    expect(errors).toEqual({
      formErrors: expect.any(Array),
      fieldErrors: expect.objectContaining({
        confirm: expect.any(Array),
      }),
    })
  }
})
```

### Capa de base de datos

Llama al código bajo test con un store mock y luego haz aserciones sobre el mock. Un test que solo parsea y luego revisa un mock que nunca pasó a ninguna parte no demuestra nada.

```typescript
type User = z.infer<typeof UserSchema>

async function saveUser(input: unknown, store: { insert(user: User): Promise<void> }) {
  const result = UserSchema.safeParse(input)
  if (!result.success) return { ok: false as const, error: result.error }
  await store.insert(result.data)
  return { ok: true as const }
}

it("does not insert invalid data", async () => {
  const store = { insert: vi.fn(async (_user: User) => {}) }
  const outcome = await saveUser({ name: "", email: "bad" }, store)
  expect(outcome.ok).toBe(false)
  expect(store.insert).not.toHaveBeenCalled()
})
```

## Property-based testing

### Con fast-check

```bash
npm install -D fast-check
```

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

### Testing de la salida de una transformación

```typescript
const InputSchema = z.object({ cents: z.string().regex(z.regexes.integer) })
const OutputSchema = z.object({ cents: z.int() })
const Transformed = InputSchema.transform((v) => ({ cents: Number(v.cents) }))

it("transform output satisfies the output schema", () => {
  fc.assert(
    fc.property(fc.integer({ min: 0, max: 2 ** 31 - 1 }), (s) => {
      seed(s)
      const result = Transformed.safeParse(fake(InputSchema))
      expect(result.success).toBe(true) // una entrada generada que no se parsea hace fallar el test
      expect(OutputSchema.safeParse(result.data).success).toBe(true)
    }),
  )
})
```

## Testing de schemas asíncronos

```typescript
it("validates async refinements", async () => {
  const UniqueEmail = z.email().refine(
    async (email) => !(await db.exists(email)),
    { error: "Already registered" }
  )

  // Hay que usar safeParseAsync
  const result = await UniqueEmail.safeParseAsync("taken@example.com")
  expect(result.success).toBe(false)
})
```

## Helpers de test

### helper de aserción reutilizable

```typescript
function expectValid<T>(schema: z.ZodType<T>, data: unknown) {
  const result = schema.safeParse(data)
  if (!result.success) {
    throw new Error(
      `Expected valid but got errors:\n${z.prettifyError(result.error)}`
    )
  }
  return result.data
}

function expectInvalid(schema: z.ZodType, data: unknown) {
  const result = schema.safeParse(data)
  expect(result.success).toBe(false)
  if (!result.success) return result.error
  throw new Error("Expected invalid but data was accepted")
}

// Uso
const validData = { name: "Alice", email: "alice@example.com", age: 30 }

it("accepts valid user", () => {
  const user = expectValid(UserSchema, validData)
  expect(user.name).toBe("Alice")
})

it("rejects invalid email", () => {
  const error = expectInvalid(UserSchema, { ...validData, email: "bad" })
  expect(error.issues[0].path).toEqual(["email"])
})
```

## Testing estructural

### Dirección de las dependencias de los schemas

Verifica con aserciones que los schemas se importan desde las capas de límite, no desde el código de dominio. Esto hace cumplir la regla arquitectónica de que el parseo ocurre en los límites.

```typescript
import { execSync } from "node:child_process"

describe("schema architecture", () => {
  it("domain layer does not import raw schemas", () => {
    // grep de los imports de schemas de Zod en el código de dominio
    const result = execSync(
      'grep -r "from.*schemas" src/domain/ || true',
      { encoding: "utf-8" }
    )
    // El dominio solo debería importar tipos (z.infer), no schemas crudos
    const rawImports = result
      .split("\n")
      .filter((line) => line && !line.includes("type {") && !line.includes("type{"))
    expect(rawImports).toHaveLength(0)
  })
})
```

### Detección de imports circulares

Usa madge para detectar dependencias circulares entre los archivos de schemas:

```typescript
import madge from "madge"

describe("schema dependencies", () => {
  it("has no circular dependencies", async () => {
    const result = await madge("src/", {
      fileExtensions: ["ts"],
      tsConfig: "tsconfig.json",
    })
    const circular = result.circular()
    expect(circular).toHaveLength(0)
  })
})
```

## Detección de deriva

### Flujo de trabajo con snapshots de JSON Schema

Exporta los schemas como JSON Schema y haz commit de los snapshots. El CI falla cuando los schemas cambian sin actualizar los snapshots.

```typescript
// scripts/export-schemas.ts
import * as z from "zod"
import { writeFileSync, mkdirSync } from "node:fs"
import { UserSchema, OrderSchema } from "../src/api/schemas"

const schemas = { User: UserSchema, Order: OrderSchema }

mkdirSync("snapshots", { recursive: true })
for (const [name, schema] of Object.entries(schemas)) {
  writeFileSync(
    `snapshots/${name}.json`,
    JSON.stringify(z.toJSONSchema(schema), null, 2) + "\n"
  )
}
```

### Test de snapshot

```typescript
import { readFileSync } from "node:fs"

describe("schema drift detection", () => {
  it("UserSchema matches committed snapshot", () => {
    const current = z.toJSONSchema(UserSchema)
    const committed = JSON.parse(
      readFileSync("snapshots/User.json", "utf-8")
    )
    expect(current).toEqual(committed)
  })
})
```

### Integración con CI

```yaml
# .github/workflows/schema-check.yml
- run: npx tsx scripts/export-schemas.ts
- name: Check for schema drift
  run: |
    if git diff --exit-code snapshots/; then
      echo "Schemas unchanged"
    else
      echo "::error::Schema snapshots changed. Update snapshots if intentional."
      git diff snapshots/
      exit 1
    fi
```

## Testing de errores observables

### Hacer aserciones sobre la estructura de flattenError

Prueba que los errores de validación producen la salida estructurada esperada para el logging y el monitoreo.

```typescript
describe("error observability", () => {
  it("flattenError has expected field keys", () => {
    const result = UserSchema.safeParse({ name: "", email: "bad" })
    expect(result.success).toBe(false)
    if (!result.success) {
      const flat = z.flattenError(result.error)
      // Verificar que la estructura coincide con lo que espera el logging
      expect(flat).toHaveProperty("formErrors")
      expect(flat).toHaveProperty("fieldErrors")
      expect(flat.fieldErrors).toHaveProperty("email")
    }
  })

  it("error messages are user-facing quality", () => {
    const Schema = z.object({
      email: z.email({ error: "Please enter a valid email" }),
      age: z.number({ error: "Age must be a number" }).min(0, "Age cannot be negative"),
    })

    const result = Schema.safeParse({ email: "bad", age: -1 })
    expect(result.success).toBe(false)
    if (!result.success) {
      const flat = z.flattenError(result.error)
      expect(flat.fieldErrors.email![0]).toBe("Please enter a valid email")
      expect(flat.fieldErrors.age![0]).toBe("Age cannot be negative")
    }
  })
})
```

## Testing de rendimiento

No hagas aserciones sobre un umbral de tiempo real en un unit test: el tiempo varía entre ejecuciones idénticas en las máquinas compartidas de CI, así que el test falla al azar. Usa un benchmark y lee la comparación.

### Con Vitest Bench

Vitest 5 ejecuta benchmarks dentro de los tests: el contexto del test lleva `bench`, y `bench.compare()` ejecuta los registros y los reporta. El fixture `bench` solo funciona en los archivos que coinciden con `benchmark.include` (por defecto `*.bench.ts`); en un archivo `*.test.ts` lanza una excepción. Vitest marca la API como experimental (vitest.dev/guide/benchmarking). Verificado con Vitest 5.1.

```typescript
// schema.bench.ts
test("compares validate() with safeParse() on invalid input", async ({ bench }) => {
  const invalidUser = { name: 123 }

  await bench.compare(
    bench("safeParse", () => {
      UserSchema.safeParse(invalidUser)
    }),
    bench("validate", () => {
      UserSchema.validate(invalidUser)
    }),
  )
})
```

Ejecútalo con:
```bash
vitest bench --run
```

Con Vitest 4 y versiones anteriores, importa en su lugar `bench` desde `"vitest"` como una función de nivel superior.
