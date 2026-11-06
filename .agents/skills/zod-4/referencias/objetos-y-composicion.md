# Referencia de objetos y composición

Documentación: zod.dev/api · Zod 4.6.7

## Variantes de objeto

### z.object() — elimina las claves desconocidas

```typescript
const User = z.object({
  name: z.string(),
  email: z.email(),
})

User.parse({ name: "Alice", email: "a@b.com", extra: true })
// { name: "Alice", email: "a@b.com" } — extra se elimina
```

### z.strictObject() — rechaza las claves desconocidas

```typescript
const Config = z.strictObject({
  host: z.string(),
  port: z.number(),
})

Config.parse({ host: "localhost", port: 3000, debug: true })
// ZodError: Unrecognized key: "debug"
```

### z.looseObject() — conserva las claves desconocidas

```typescript
const Proxy = z.looseObject({
  id: z.string(),
})

Proxy.parse({ id: "123", extra: true, nested: { a: 1 } })
// { id: "123", extra: true, nested: { a: 1 } }
```

## Métodos de objeto

### .shape

Accede al objeto shape crudo para hacer spread.

```typescript
const User = z.object({ name: z.string(), email: z.email() })
User.shape // { name: ZodString, email: ZodEmail }

// Usar para hacer spread
const Extended = z.object({ ...User.shape, age: z.number() })
```

### .keyof()

Devuelve un `z.enum()` con las claves del objeto.

```typescript
const UserKey = User.keyof()
// z.enum(["name", "email"])

UserKey.parse("name")  // "name"
UserKey.parse("age")   // ZodError
```

### .extend()

Agrega campos nuevos a un schema de objeto.

```typescript
const WithAge = User.extend({ age: z.number() })
```

### .safeExtend()

Como `.extend()`, pero una clave sobrescrita debe mantener un tipo asignable al original, así que el resultado todavía hace `extends` del tipo original. Úsalo para agregar o estrechar claves en un objeto con refinamientos, donde `.extend()` lanza una excepción al sobrescribir.

```typescript
const Narrowed = User.safeExtend({ name: z.string().min(1) }) // OK: sigue siendo un string
// User.safeExtend({ name: z.number() }) es un error de TypeScript
```

### .pick()

Selecciona campos específicos.

```typescript
const NameOnly = User.pick({ name: true })
// z.object({ name: z.string() })
```

### .omit()

Elimina campos específicos.

```typescript
const NoEmail = User.omit({ email: true })
// z.object({ name: z.string() })
```

### .partial()

Hace opcionales todos los campos. `.exactPartial()` (Zod 4.5) hace que se puedan omitir sin aceptar un `undefined` explícito. `z.deepPartial(schema)` recorre recursivamente los objetos, arrays y uniones anidados. `.partial()` y `z.deepPartial()` lanzan una excepción en un objeto que tiene su propio refinamiento.

```typescript
const PartialUser = User.partial()
// { name?: string; email?: string }

// Hacer parciales campos específicos
const PartialName = User.partial({ name: true })
// { name?: string; email: string }
```

### .required()

Hace obligatorios todos los campos.

```typescript
const RequiredUser = PartialUser.required()
```

### .catchall(schema)

Valida las claves desconocidas contra un schema.

```typescript
const Config = z.object({ host: z.string() }).catchall(z.string())
// Las claves conocidas se validan con sus schemas, las claves desconocidas deben ser strings
```

### Claves opcionales: `.optional()`, `.exactOptional()`, `.nonoptional()`

`.optional()` acepta una clave ausente y un `undefined` explícito. `.exactOptional()` acepta una clave ausente y rechaza `undefined`, lo que coincide con JSON y con `exactOptionalPropertyTypes`. `.nonoptional()` vuelve a hacer obligatorio un campo, por ejemplo después de `.partial()`.

```typescript
const Profile = z.object({ nickname: z.string().exactOptional() })
Profile.safeParse({}).success                      // true
Profile.safeParse({ nickname: undefined }).success // false

const Patch = User.partial()
const PatchWithName = Patch.extend({ name: Patch.shape.name.nonoptional() })
```

### Claves symbol

Un shape puede declarar una clave symbol (Zod 4.5). Un symbol `const` se infiere como `unique symbol`, así que la clave es obligatoria en el tipo inferido. Las claves symbol no declaradas se ignoran.

```typescript
const TAG = Symbol("tag")
const Tagged = z.object({ name: z.string(), [TAG]: z.number() })
Tagged.safeParse({ name: "alice", [TAG]: 42 }).success // true
Tagged.safeParse({ name: "alice" }).success            // false
```

### .readonly()

El tipo de salida pasa a ser `Readonly<T>`, y el valor parseado se congela con `Object.freeze()`.

```typescript
const Config = z.object({ host: z.string(), port: z.number() }).readonly()

type Config = z.infer<typeof Config>
// Readonly<{ host: string; port: number }>
```

### Validar propiedades en el lugar: `.properties()`

`z.object()` devuelve un objeto plano nuevo. `.properties()` sobre `z.instanceof()` (Zod 4.6) verifica algunas propiedades de la entrada y devuelve la propia entrada, así que una instancia de clase conserva su prototipo y sus métodos.

```typescript
const OkResponse = z.instanceof(Response).properties({
  ok: z.literal(true),
  status: z.number().min(200).max(299),
})

const res = await fetch("/api/user")
OkResponse.parse(res) === res // true: sigue siendo un Response
```

`z.properties({ ... })` devuelve checks para pasar a `.check()`, en Zod y en Zod Mini. Los schemas de las propiedades validan, pero sus resultados se descartan, así que una transformación o un valor por defecto no cambia el valor.

## Objetos recursivos

Usa un getter. `z.lazy()` todavía funciona, pero el getter conserva los métodos de objeto e infiere el tipo. Desde Zod 4.5, la entrada cíclica también se parsea.

```typescript
const Category = z.object({
  name: z.string(),
  get children() {
    return z.array(Category).optional()
  },
})

type Category = z.infer<typeof Category>
// { name: string; children?: Category[] | undefined }
```

## Arrays

```typescript
z.array(z.string())           // string[]
z.array(z.string()).min(1)    // al menos 1 elemento
z.array(z.string()).max(10)   // como máximo 10 elementos
z.array(z.string()).length(5) // exactamente 5 elementos
z.array(z.string()).nonempty() // al menos 1 elemento
```

## Tuplas

```typescript
// Array tipado de longitud fija
z.tuple([z.string(), z.number(), z.boolean()])
// [string, number, boolean]

// Con elemento rest
z.tuple([z.string(), z.number()]).rest(z.boolean())
// [string, number, ...boolean[]]
```

## Records

```typescript
// Diccionario con claves string
z.record(z.string(), z.number())
// Record<string, number>

// Claves enum: todas las claves son obligatorias
z.record(z.enum(["a", "b"]), z.number())
// { a: number; b: number }; { a: 1 } falla
```

### z.partialRecord()

Las claves de un schema de clave enum o literal son opcionales.

```typescript
z.partialRecord(z.enum(["a", "b"]), z.number())
// { a?: number; b?: number }; { a: 1 } pasa
```

### z.looseRecord()

`z.record()` falla con una clave que no coincide con el schema de clave. `z.looseRecord()` deja pasar esas claves sin cambios, lo que encaja con las pattern properties combinadas con un objeto.

```typescript
const Contact = z
  .object({ name: z.string() })
  .and(z.looseRecord(z.string().regex(/_phone$/), z.e164()))
// home_phone y work_phone se validan como E.164; las demás claves pasan
```

## Maps y Sets

```typescript
z.map(z.string(), z.number())       // Map<string, number>
z.set(z.string())                    // Set<string>
z.set(z.string()).min(1)             // al menos 1 elemento
z.set(z.string()).max(10)            // como máximo 10 elementos
z.set(z.string()).nonempty()         // set no vacío
```

## Uniones

### z.union()

Coincidencia secuencial — prueba cada rama en orden.

```typescript
z.union([z.string(), z.number()])
// string | number
```

### z.discriminatedUnion()

Elige la rama según un campo discriminador compartido y valida solo esa rama.

```typescript
z.discriminatedUnion("type", [
  z.object({ type: z.literal("a"), value: z.string() }),
  z.object({ type: z.literal("b"), count: z.number() }),
])
```

### z.xor()

Exactamente una debe coincidir.

```typescript
z.xor([
  z.object({ email: z.email() }),
  z.object({ phone: z.string() }),
])
// { phone } pasa; { email, phone } falla porque coinciden ambas ramas
```

## Intersección

```typescript
z.intersection(
  z.object({ name: z.string() }),
  z.object({ age: z.number() }),
)
// { name: string; age: number }
```

Prefiere `.extend()` o el spread en lugar de la intersección para fusionar objetos: `z.intersection()` devuelve un `ZodIntersection`, que no tiene `.pick()`, `.omit()` ni otros métodos de objeto (zod.dev/api, "Intersections").
