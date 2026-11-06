# Referencia de metadata y JSON Schema

Documentación: zod.dev/metadata, zod.dev/json-schema, zod.dev/blog/zod-4-6 · Zod 4.6.7

## Registries

Un registry asocia schemas con metadata tipada.

```typescript
const myRegistry = z.registry<{ description: string }>()
const mySchema = z.string()

myRegistry.add(mySchema, { description: "A cool schema" })
myRegistry.has(mySchema) // true
myRegistry.get(mySchema) // { description: "A cool schema" }
myRegistry.remove(mySchema)
myRegistry.clear()
```

TypeScript verifica la metadata contra el tipo del registry. Un segundo argumento de tipo limita qué schemas acepta el registry.

```typescript
const stringsOnly = z.registry<{ description: string }, z.ZodString>()
stringsOnly.add(z.string(), { description: "ok" })
// @ts-expect-error ZodNumber no es asignable a ZodString
stringsOnly.add(z.number(), { description: "no" })
```

`z.$output` y `z.$input` en el tipo de la metadata representan los tipos de salida y de entrada del schema.

```typescript
const examples = z.registry<{ examples: z.$output[] }>()
examples.add(z.number(), { examples: [1, 2, 3] })
```

### `.register()`

`schema.register(registry, meta)` agrega el schema y devuelve el mismo schema, no una copia. Úsalo para registrar inline.

```typescript
const Labels = z.registry<{ label: string }>()
const Signup = z.object({
  name: z.string().register(Labels, { label: "Full name" }),
  age: z.number().register(Labels, { label: "Age" }),
})
```

## Metadata global: `.meta()` y `.describe()`

`.meta(meta)` agrega una copia del schema a `z.globalRegistry` y devuelve la copia. `.meta()` sin argumentos lee la metadata. `.describe(text)` es una forma abreviada de `.meta({ description: text })`; la documentación recomienda `.meta()`.

```typescript
const Email = z.email().meta({
  id: "email_address",
  title: "Email address",
  description: "Your email address",
})

Email.meta() // { id: "email_address", title: "Email address", description: "Your email address" }
```

`z.globalRegistry` acepta `id`, `title`, `description`, `deprecated` y otras claves. El declaration merging agrega claves tipadas:

```typescript
declare module "zod" {
  interface GlobalMeta {
    examples?: unknown[]
  }
}
```

### La metadata pertenece a una sola instancia de schema

Cada método devuelve un schema nuevo. Cuáles conservan la metadata, medido en 4.6.7:

| Método | Conserva la metadata |
|---|---|
| `.refine()`, `.min()` y otros checks | Sí |
| `.optional()`, `.nullable()`, `.transform()` y otros wrappers | No |

La página de metadata de zod.dev dice que `.refine()` la descarta; en 4.6.7 no lo hace. Llama a `.meta()` al final, en el schema que exportas.

### Ids del registry

La página de metadata de zod.dev dice que un registry lanza una excepción cuando dos schemas reciben el mismo `id`. En 4.6.7, medido:

- `.add()` y `.meta()` aceptan un `id` duplicado sin ningún error.
- `z.toJSONSchema()` lanza "Duplicate schema id" cuando una conversión encuentra dos schemas con el mismo `id`.
- `z.toJSONSchema(registry)` conserva uno de los dos schemas y descarta el otro sin ningún error.

Mantén los ids únicos, y prueba la salida de JSON Schema de cada registry que publiques.

## `z.toJSONSchema()`

El target por defecto es JSON Schema Draft 2020-12, y la salida es para el tipo de salida.

```typescript
const User = z.object({ name: z.string(), age: z.number() })

z.toJSONSchema(User)
// {
//   $schema: "https://json-schema.org/draft/2020-12/schema",
//   type: "object",
//   properties: { name: { type: "string" }, age: { type: "number" } },
//   required: ["name", "age"],
//   additionalProperties: false,
// }
```

`z.object()` da `additionalProperties: false` porque elimina las claves desconocidas. `z.looseObject()` nunca lo establece; `z.strictObject()` siempre lo hace. En el modo `io: "input"`, `z.object()` no lo establece.

| Opción | Valores | Efecto |
|---|---|---|
| `target` | `"draft-2020-12"` (por defecto), `"draft-07"`, `"draft-04"`, `"openapi-3.0"` | El dialecto de JSON Schema |
| `io` | `"output"` (por defecto), `"input"` | El lado de los pipes, los valores por defecto, los codecs y los schemas con coerción que se describe |
| `unrepresentable` | `"throw"` (por defecto), `"any"`, o una función | Qué hacer con `z.bigint()`, `z.date()`, `z.map()`, `z.set()`, `z.symbol()`, `z.undefined()`, `z.void()`, `z.nan()`, `z.custom()` y las transformaciones |
| `cycles` | `"ref"` (por defecto), `"throw"` | Un ciclo se convierte en `{ $ref: "#" }`, o lanza una excepción |
| `reused` | `"inline"` (por defecto), `"ref"` | Un schema que se usa dos veces se pone inline, o se mueve a `$defs` |
| `metadata` | un registry | Dónde leer la metadata; `z.registry()` la descarta toda |
| `override` | `(ctx) => void` | Cambiar `ctx.jsonSchema` para cada schema |
| `uri` | `(id) => string` | La URI del `$ref` para un `id`, cuando conviertes un registry |

```typescript
const Lengthy = z.string().transform((val) => val.length).pipe(z.number())
z.toJSONSchema(Lengthy)                  // { type: "number" }
z.toJSONSchema(Lengthy, { io: "input" }) // { type: "string" }

// Representar un Date como un string ISO; lanzar una excepción con cualquier otro schema no representable
z.toJSONSchema(z.object({ at: z.date() }), {
  unrepresentable: ({ zodSchema }) =>
    zodSchema._zod.def.type === "date" ? { type: "string", format: "date-time" } : "throw",
})
```

La metadata se copia en la salida y gana sobre las palabras clave que genera Zod.

### Convertir un registry

Pasa un registry para obtener un JSON Schema por cada schema que tenga un `id`. Un schema sin `id` queda fuera.

```typescript
const Schemas = z.registry<{ id: string }>()
Schemas.add(z.object({ title: z.string() }), { id: "Post" })

z.toJSONSchema(Schemas)
// { schemas: { Post: { $schema: "https://json-schema.org/draft/2020-12/schema", type: "object", ... } } }
```

Desde 4.6, los checks encadenados se combinan: `z.number().min(0).max(23).int()` da `minimum: 0, maximum: 23` en cualquier orden (consulta `references/cambios-de-comportamiento.md`).

## `z.fromJSONSchema()`

Convierte un JSON Schema en un schema de Zod. La página de JSON Schema de zod.dev lo marca como experimental y fuera de la API estable, así que fija la versión de Zod donde lo uses.

```typescript
const FromSpec = z.fromJSONSchema({
  type: "object",
  properties: { name: { type: "string" }, age: { type: "integer", minimum: 0 } },
  required: ["name"],
})

z.fromJSONSchema({ type: "object", minProperties: 2 }).safeParse({ a: 1 }).success          // false
z.fromJSONSchema({ type: "array", uniqueItems: true }).safeParse([{ a: 1 }, { a: 1 }]).success // false
```

Desde 4.6 lee `minProperties`, `maxProperties`, `uniqueItems`, `contains`, `minContains` y `maxContains`. La unicidad es estructural, así que `[{ a: 1 }, { a: 1 }]` tiene un duplicado.

## Zod Mini

Zod Mini tiene registries y `z.toJSONSchema()`. Establece una descripción mediante un check: `z.string().check(z.describe("a name"))`.
