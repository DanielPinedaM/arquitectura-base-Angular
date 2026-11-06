# Anti-patterns de testing de Zod

Verificado con Zod 4.6.7, Vitest 5, fast-check 4 y zod-schema-faker 3.

## Tabla de contenido

- Probar los detalles internos del schema en lugar del comportamiento
- No probar los caminos de error
- Usar parse() con toThrow() en los tests
- No probar los valores límite
- Escribir a mano los datos mock en lugar de generarlos
- Duplicar la lógica del schema en las aserciones
- Probar la salida de una transformación sin probar la validación de la entrada
- No probar las combinaciones de optional/nullable
- Hacer snapshot testing del ZodError crudo
- No usar un seed en los generadores de datos aleatorios
- Una propiedad sobre una constante
- No probar en los límites
- Sin testing de regresión con snapshots
- Probar la forma del schema pero no la observabilidad de los errores
- Sin un flujo de detección de deriva

## Probar los detalles internos del schema en lugar del comportamiento

```typescript
const UserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  age: z.int().min(0).max(150).optional(),
})

// MAL: probar la estructura interna — se rompe con los refactors y las actualizaciones
it("has correct shape", () => {
  expect(UserSchema.shape.name).toBeDefined()
  expect(UserSchema._zod.def.type).toBe("object")
  // Los tests de Zod 3 leen _def.typeName, que es undefined en Zod 4
})

// BIEN: probar el comportamiento del parseo — estable entre refactors
it("accepts valid user", () => {
  const result = UserSchema.safeParse({
    name: "Alice",
    email: "alice@example.com",
  })
  expect(result.success).toBe(true)
})

it("rejects missing name", () => {
  const result = UserSchema.safeParse({ email: "alice@example.com" })
  expect(result.success).toBe(false)
})
```

## No probar los caminos de error

```typescript
const validUser = { name: "Alice", email: "alice@example.com", age: 30 }

// MAL: solo se prueban entradas válidas
describe("UserSchema", () => {
  it("accepts valid user", () => {
    expect(UserSchema.safeParse(validUser).success).toBe(true)
  })
  // No hay tests para datos inválidos — las regresiones pasan desapercibidas
})

// BIEN: probar tanto lo válido como lo inválido
describe("UserSchema", () => {
  it("accepts valid user", () => {
    expect(UserSchema.safeParse(validUser).success).toBe(true)
  })

  it("rejects empty name", () => {
    expect(
      UserSchema.safeParse({ ...validUser, name: "" }).success
    ).toBe(false)
  })

  it("rejects invalid email", () => {
    expect(
      UserSchema.safeParse({ ...validUser, email: "not-email" }).success
    ).toBe(false)
  })

  it("rejects negative age", () => {
    expect(
      UserSchema.safeParse({ ...validUser, age: -1 }).success
    ).toBe(false)
  })
})
```

## Usar parse() con toThrow() en los tests

```typescript
const invalidData = { name: "", email: "bad" }

// MAL: pasa con cualquier error lanzado, no solo con un fallo de validación;
// un TypeError de un bug en una transformación también pasa
it("rejects invalid data", () => {
  expect(() => UserSchema.parse(invalidData)).toThrow()
})

// MAL: el try/catch oculta la intención del test
it("rejects invalid data", () => {
  try {
    UserSchema.parse(invalidData)
    throw new Error("should have thrown")
  } catch (e) {
    expect(e).toBeInstanceOf(z.ZodError)
  }
})

// BIEN: hacer aserciones sobre el resultado y los issues
it("rejects invalid data", () => {
  const result = UserSchema.safeParse(invalidData)
  expect(result.success).toBe(false)
  if (!result.success) {
    expect(result.error.issues.map((i) => i.code)).toEqual(["too_small", "invalid_format"])
  }
})
```

## No probar los valores límite

```typescript
const AgeSchema = z.number().min(0).max(150)

// MAL: solo se prueban valores intermedios
it("validates age", () => {
  expect(AgeSchema.safeParse(25).success).toBe(true)
  expect(AgeSchema.safeParse(-5).success).toBe(false)
})

// BIEN: probar los límites
it.each([
  [0, true],    // límite mínimo
  [150, true],  // límite máximo
  [-1, false],  // uno por debajo del mínimo
  [151, false], // uno por encima del máximo
  [75, true],   // valor intermedio
])("age %i → %s", (age, expected) => {
  expect(AgeSchema.safeParse(age).success).toBe(expected)
})
```

## Escribir a mano los datos mock en lugar de generarlos

```typescript
const MemberSchema = UserSchema.extend({ role: z.enum(["admin", "member"]) })

// MAL: un fixture escrito a mano; cada cambio en el schema requiere editarlo a mano
const mockMember = {
  name: "Test User",
  email: "test@test.com",
  age: 25,
  // 'role' se agregó al schema y no aquí, así que este test ahora falla
}

it("accepts mock member", () => {
  expect(MemberSchema.safeParse(mockMember).success).toBe(true)
})
```

```typescript
// BIEN: generar a partir del schema — siempre sincronizado
import { faker } from "@faker-js/faker"
import { fake, seed, setFaker } from "zod-schema-faker/v4"

beforeAll(() => setFaker(faker))
beforeEach(() => seed(42))

it("accepts generated member", () => {
  const member = fake(MemberSchema)
  expect(MemberSchema.safeParse(member).success).toBe(true)
})
```

## Duplicar la lógica del schema en las aserciones

```typescript
const EmailSchema = z.email()

// MAL: reimplementar la validación en el test
it("validates email format", () => {
  const email = "test@example.com"
  const result = EmailSchema.safeParse(email)
  expect(result.success).toBe(true)
  // Se duplica en el test el propio check con regex del schema
  expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
})

// BIEN: confiar en el schema — probar el comportamiento, no la implementación
it("validates email format", () => {
  expect(EmailSchema.safeParse("test@example.com").success).toBe(true)
  expect(EmailSchema.safeParse("not-an-email").success).toBe(false)
})
```

## Probar la salida de una transformación sin probar la validación de la entrada

```typescript
const DateString = z.iso.date().transform((s) => new Date(s))

// MAL: solo se prueba la salida de la transformación
it("transforms to Date", () => {
  const result = DateString.parse("2024-01-01")
  expect(result).toBeInstanceOf(Date)
})

// BIEN: probar tanto la validación como la transformación
it("transforms valid date string", () => {
  const result = DateString.safeParse("2024-01-01")
  expect(result.success).toBe(true)
  if (result.success) {
    expect(result.data).toBeInstanceOf(Date)
    expect(result.data.getUTCFullYear()).toBe(2024)
  }
})

it("rejects invalid date string", () => {
  expect(DateString.safeParse("not-a-date").success).toBe(false)
  expect(DateString.safeParse("2024-02-30").success).toBe(false)
})
```

## No probar las combinaciones de optional/nullable

```typescript
const ProfileSchema = z.object({
  name: z.string(),
  bio: z.string().optional(),
  avatar: z.string().nullable(),
})

// MAL: solo se prueba con todos los campos presentes
it("accepts profile", () => {
  expect(ProfileSchema.safeParse({
    name: "Alice",
    bio: "Hello",
    avatar: "https://example.com/img.png",
  }).success).toBe(true)
})

// BIEN: probar todas las variantes de optional/nullable
it("accepts without optional field", () => {
  expect(ProfileSchema.safeParse({ name: "Alice", avatar: "https://example.com/img.png" }).success).toBe(true)
})

it("accepts with null nullable", () => {
  expect(ProfileSchema.safeParse({ name: "Alice", avatar: null }).success).toBe(true)
})

it("rejects null for non-nullable optional", () => {
  expect(ProfileSchema.safeParse({ name: "Alice", bio: null, avatar: null }).success).toBe(false)
})

it("rejects undefined for non-optional nullable", () => {
  expect(ProfileSchema.safeParse({ name: "Alice" }).success).toBe(false)
  // avatar es nullable pero no optional — debe proporcionarse explícitamente
})
```

## Hacer snapshot testing del ZodError crudo

```typescript
const invalid = { name: "Alice", email: "bad" }

// MAL: el snapshot contiene el texto de los mensajes por defecto de Zod y los campos de los issues,
// que cambian entre versiones de Zod
it("error matches snapshot", () => {
  const result = UserSchema.safeParse(invalid)
  if (!result.success) {
    expect(result.error).toMatchSnapshot()
  }
})

// BIEN: hacer snapshot de la salida formateada
it("error matches snapshot", () => {
  const result = UserSchema.safeParse(invalid)
  if (!result.success) {
    expect(z.flattenError(result.error)).toMatchSnapshot()
    // { formErrors: [], fieldErrors: { email: ["Invalid email address"] } }
  }
})

// BIEN: hacer snapshot del JSON Schema para la forma del schema
it("schema shape matches snapshot", () => {
  expect(z.toJSONSchema(UserSchema)).toMatchSnapshot()
})
```

Los mensajes por defecto siguen siendo el texto de Zod. Para las aserciones que deben sobrevivir a las actualizaciones, haz aserciones sobre el `code` y el `path` de los issues, o establece tus propios mensajes.

## No usar un seed en los generadores de datos aleatorios

```typescript
// MAL: no determinista — el test pasa a veces y otras veces falla
it("accepts generated data", () => {
  const user = fake(UserSchema) // distinto en cada ejecución
  expect(UserSchema.safeParse(user).success).toBe(true)
  // Si esto falla, no puedes reproducirlo
})

// BIEN: con seed — determinista y reproducible
beforeEach(() => seed(42))

it("accepts generated data", () => {
  const user = fake(UserSchema) // igual en cada ejecución
  expect(UserSchema.safeParse(user).success).toBe(true)
})
```

## Una propiedad sobre una constante

```typescript
import fc from "fast-check"

// MAL: fc.constant(null) no genera nada. El contraejemplo es [null], y
// el seed de fast-check no llega al faker, así que los datos que fallaron se pierden
it("schema accepts generated data", () => {
  fc.assert(
    fc.property(fc.constant(null), () => {
      expect(UserSchema.safeParse(fake(UserSchema)).success).toBe(true)
    }),
  )
})

// BIEN: fast-check elige el seed del faker, así que el contraejemplo reproduce los datos
it("schema accepts generated data", () => {
  fc.assert(
    fc.property(fc.integer({ min: 0, max: 2 ** 31 - 1 }), (s) => {
      seed(s)
      expect(UserSchema.safeParse(fake(UserSchema)).success).toBe(true)
    }),
  )
})
```

## No probar en los límites

```typescript
// MAL: los unit tests del schema pasan, pero el handler nunca llama a safeParse
// tests/user-schema.test.ts
it("rejects invalid email", () => {
  expect(UserSchema.safeParse({ name: "Alice", email: "bad" }).success).toBe(false)
})

// Pero el handler real hace:
app.post("/users", async (req, res) => {
  // ¡Sin validación! req.body va directo a la base de datos
  res.status(201).json(await db.users.create(req.body))
})
```

```typescript
// BIEN: un test de integración verifica que el límite realmente valida
import request from "supertest"

it("API rejects invalid input with field errors", async () => {
  const res = await request(app)
    .post("/api/users")
    .send({ name: "", email: "bad" })
    .expect(400)

  expect(res.body.errors.fieldErrors).toHaveProperty("email")
})

it("API accepts valid input", async () => {
  await request(app)
    .post("/api/users")
    .send({ name: "Alice", email: "alice@example.com", age: 30 })
    .expect(201)
})
```

## Sin testing de regresión con snapshots

```typescript
// MAL: la eliminación de un campo pasa desapercibida
// Alguien elimina `role` de UserSchema — ningún test lo detecta
const UserSchema = z.object({
  name: z.string(),
  email: z.email(),
  // role estaba aquí — se eliminó sin que nadie lo notara
})

// BIEN: el snapshot de JSON Schema detecta los cambios en el schema
it("schema shape has not changed", () => {
  const jsonSchema = z.toJSONSchema(UserSchema)
  expect(jsonSchema).toMatchSnapshot()
  // Si se elimina `role`, el diff del snapshot lo muestra claramente en la revisión de código
})
```

## Probar la forma del schema pero no la observabilidad de los errores

```typescript
// MAL: los tests verifican que el schema acepta/rechaza, pero nunca revisan la estructura del error
it("rejects invalid input", () => {
  const result = UserSchema.safeParse({ email: "bad" })
  expect(result.success).toBe(false)
  // Nunca revisa cómo se ve el error — el logging podría estar roto
})

// BIEN: verificar que flattenError produce una estructura consultable
it("produces structured errors for logging", () => {
  const result = UserSchema.safeParse({ email: "bad" })
  expect(result.success).toBe(false)
  if (!result.success) {
    const flat = z.flattenError(result.error)
    expect(flat.fieldErrors).toHaveProperty("email")
    expect(flat.fieldErrors.email![0]).toBeTruthy()
    // Verifica que tu pipeline de logging recibirá datos útiles
  }
})
```

## Sin un flujo de detección de deriva

```typescript
// MAL: los cambios en el schema llegan sin revisión mecánica
// El desarrollador cambia OrderSchema, no hay check de CI ni diff de snapshots
// Los consumidores se rompen silenciosamente porque el campo del que dependen ya no está
```

```typescript
// BIEN: exportar los snapshots de JSON Schema y compararlos con diff en el CI
// scripts/export-schemas.ts
import * as z from "zod"
import { writeFileSync } from "node:fs"
import { OrderSchema } from "../src/api/schemas"

const jsonSchema = z.toJSONSchema(OrderSchema)
writeFileSync(
  "snapshots/Order.json",
  JSON.stringify(jsonSchema, null, 2) + "\n"
)

// Flujo de trabajo de CI:
// 1. Ejecutar export-schemas.ts
// 2. git diff snapshots/ — si cambió, el CI falla
// 3. El desarrollador revisa el diff y actualiza los snapshots intencionalmente
// 4. Los cambios en el schema siempre son visibles en la revisión de código
```
