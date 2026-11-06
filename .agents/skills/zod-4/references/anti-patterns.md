# Anti-patterns de Zod

Documentación: zod.dev/api, zod.dev/v4/changelog · Zod 4.6.7

## Tabla de contenido

- Usar parse() con try/catch en lugar de safeParse()
- Parseo síncrono con refinamientos asíncronos
- Definiciones de tipos manuales junto a los schemas
- Métodos de formato de string deprecados
- Usar z.nativeEnum()
- Usar required_error, invalid_type_error y message
- Usar z.formatError()
- Lanzar excepciones dentro de refinamientos o transformaciones
- z.coerce.boolean() para strings booleanos
- Asumir que z.object() conserva las claves desconocidas
- z.union() para objetos etiquetados
- reportInput en producción
- z.lazy() con un tipo escrito a mano para schemas recursivos
- Duplicar definiciones de campos
- Reimplementar a mano lo que Zod 4 hace de forma nativa

## Usar parse() con try/catch en lugar de safeParse()

```typescript
const UserSchema = z.object({ name: z.string(), email: z.email() })

// MAL: verboso, captura errores no relacionados
function readUserThrowing(data: unknown) {
  try {
    const user = UserSchema.parse(data)
    return { success: true, data: user }
  } catch (e) {
    if (e instanceof z.ZodError) {
      return { success: false, errors: e.issues }
    }
    throw e
  }
}

// BIEN: resultado discriminado
function readUser(data: unknown) {
  const result = UserSchema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: result.error.issues }
}
```

## Parseo síncrono con refinamientos asíncronos

```typescript
// MAL: lanza $ZodAsyncError porque el refinamiento es asíncrono
const Schema = z.email().refine(async (e) => !(await db.exists(e)))
Schema.safeParse(data) // lanza una excepción

// BIEN: usar safeParseAsync
await Schema.safeParseAsync(data)
```

## Definiciones de tipos manuales junto a los schemas

```typescript
// MAL: los tipos se desvían del schema
interface UserShape {
  name: string
  email: string
}

const UserSchema = z.object({
  name: z.string(),
  email: z.email(),
  age: z.number(), // se agregó al schema, se olvidó en la interfaz
})
```

```typescript
// BIEN: inferir a partir del schema
const UserSchema = z.object({
  name: z.string(),
  email: z.email(),
  age: z.number(),
})

type User = z.infer<typeof UserSchema>
```

## Métodos de formato de string deprecados

```typescript
// MAL: las formas de método todavía se ejecutan, y sus tipos las marcan como deprecadas
z.string().email() // deprecado: usar z.email()
z.string().url() // deprecado: usar z.url()
z.string().uuid() // deprecado: usar z.uuid()

// BIEN: funciones de formato de nivel superior
z.email()
z.url()
z.uuid()
```

## Usar z.nativeEnum()

```typescript
enum Status { Active = "active", Inactive = "inactive" }

// MAL: todavía se ejecuta, pero está deprecado
z.nativeEnum(Status) // deprecado: usar z.enum()

// BIEN: z.enum() unificado
z.enum(Status)
```

## Usar required_error, invalid_type_error y message

```typescript
// MAL: Zod 4 eliminó required_error e invalid_type_error; JavaScript puro los ignora
// @ts-expect-error no son parámetros de Zod 4
z.string({ required_error: "Required", invalid_type_error: "Not a string" })
// todavía funciona, pero `message` está deprecado
z.number().min(5, { message: "Too small" })

// BIEN: parámetro error unificado
z.string({ error: (issue) => (issue.input === undefined ? "Required" : "Not a string") })
z.number().min(5, { error: "Too small" })
z.number().min(5, "Too small") // forma abreviada
```

## Usar z.formatError()

```typescript
const result = z.object({ email: z.email() }).safeParse(data)

if (!result.success) {
  // MAL: la documentación marca z.formatError() como deprecado
  z.formatError(result.error)

  // BIEN: usar el formateador adecuado
  z.flattenError(result.error)   // para formularios planos
  z.treeifyError(result.error)   // para estructuras anidadas
  z.prettifyError(result.error)  // para logging
}
```

## Lanzar excepciones dentro de refinamientos o transformaciones

```typescript
// MAL: el throw escapa de safeParse() como un Error plano
z.number().refine((n) => {
  if (n <= 0) throw new Error("Must be positive")
  return true
})

z.string().transform((val) => {
  const n = Number.parseInt(val, 10)
  if (Number.isNaN(n)) throw new Error("Not a number")
  return n
})

// BIEN: devolver un booleano desde refine
z.number().refine((n) => n > 0, { error: "Must be positive" })

// BIEN: verificar el string, convertirlo y luego verificar el número
z.string().regex(z.regexes.integer).transform(Number).pipe(z.int().positive())
```

`Number.parseInt("12abc", 10)` es `12`, así que un check con `parseInt` acepta strings que solo empiezan con dígitos.

## z.coerce.boolean() para strings booleanos

```typescript
// MAL: Boolean("false") === true
z.coerce.boolean().parse("false") // true
z.coerce.boolean().parse("0")     // true

// BIEN: z.stringbool() maneja correctamente los strings booleanos
z.stringbool().parse("false") // false
z.stringbool().parse("0")     // false
```

## Asumir que z.object() conserva las claves desconocidas

```typescript
// MAL: las claves desconocidas se eliminan silenciosamente
const payload = { name: "Alice", role: "admin", debug: true }
z.object({ name: z.string() }).parse(payload)
// { name: "Alice" } — role y debug desaparecieron

// BIEN: elegir explícitamente
z.strictObject({ name: z.string() }) // rechaza las desconocidas
z.looseObject({ name: z.string() })  // conserva las desconocidas
```

## z.union() para objetos etiquetados

```typescript
// MAL: prueba todas las ramas; una etiqueta incorrecta da un único issue "Invalid input" en la raíz
z.union([
  z.object({ type: z.literal("a"), value: z.string() }),
  z.object({ type: z.literal("b"), count: z.number() }),
])

// BIEN: elige la rama según el discriminador; los issues nombran el campo que falla
z.discriminatedUnion("type", [
  z.object({ type: z.literal("a"), value: z.string() }),
  z.object({ type: z.literal("b"), count: z.number() }),
])
```

## reportInput en producción

```typescript
const LoginSchema = z.object({ email: z.email(), password: z.string() })

// MAL: filtra datos sensibles en los logs de errores
app.post("/login", (req, res) => {
  const result = LoginSchema.safeParse(req.body, { reportInput: true })
  if (!result.success) {
    logger.error(result.error.issues) // puede contener contraseñas
  }
})

// BIEN: solo en desarrollo
app.post("/session", (req, res) => {
  const result = LoginSchema.safeParse(req.body, {
    reportInput: process.env.NODE_ENV === "development",
  })
})
```

## z.lazy() con un tipo escrito a mano para schemas recursivos

`z.lazy()` no se eliminó ni está deprecado. El getter es la forma documentada para los objetos recursivos: no necesita un tipo escrito a mano y conserva los métodos de objeto.

```typescript
// MAL: la interfaz duplica el schema
interface TreeShape {
  value: string
  children?: TreeShape[]
}

const Tree: z.ZodType<TreeShape> = z.object({
  value: z.string(),
  children: z.lazy(() => z.array(Tree)).optional(),
})
```

```typescript
// BIEN: patrón getter
const Tree = z.object({
  value: z.string(),
  get children() {
    return z.array(Tree).optional()
  },
})
```

## Duplicar definiciones de campos

```typescript
// MAL: campos duplicados — se desincronizarán
const CreateUser = z.object({ name: z.string(), email: z.email() })
const UpdateUser = z.object({ name: z.string().optional(), email: z.email().optional() })
```

```typescript
// BIEN: derivar a partir de una base
const User = z.object({ name: z.string(), email: z.email() })
const CreateUser = User
const UpdateUser = User.partial()
```

## Reimplementar a mano lo que Zod 4 hace de forma nativa

Código que funciona y que una API de Zod 4 hace mejor. Tú mantienes la versión hecha a mano; Zod mantiene la API.

### Transformaciones unidireccionales donde el valor tiene que hacer ida y vuelta

```typescript
// FUNCIONA, pero la inversa es tuya
const DateIn = z.iso.datetime().transform((s) => new Date(s))
const toWire = (d: Date) => d.toISOString()   // y esto se desvía de lo anterior
```

```typescript
// MEJOR: una sola definición, ambas direcciones
const DateField = z.codec(z.iso.datetime(), z.date(), {
  decode: (s) => new Date(s),
  encode: (d) => d.toISOString(),
})
z.decode(DateField, "2024-01-01T00:00:00Z") // Date
z.encode(DateField, new Date())             // string
z.invertCodec(DateField)                    // cuando el límite va en la otra dirección
```

El par de transformaciones es donde viven los bugs de serialización: alguien cambia el lado del parseo
y el lado de escritura mantiene la forma antigua. Un codec hace que eso sea imposible de
expresar.

### Claves opcionales que no deben estar presentes con valor undefined

```typescript
// FUNCIONA, pero acepta { nickname: undefined }
z.object({ nickname: z.string().optional() })

// MEJOR cuando la clave debe estar ausente
z.object({ nickname: z.string().exactOptional() })
```

Importa frente a JSON, que no puede expresar un `undefined` explícito, y frente al
`exactOptionalPropertyTypes` de TypeScript.

### Uniones mutuamente excluyentes verificadas a mano

```typescript
const EmailLogin = z.object({ email: z.email() })
const PhoneLogin = z.object({ phone: z.e164() })

// FUNCIONA, pero tú mantienes el check de exclusividad
z.union([EmailLogin, PhoneLogin]).refine((v) => !("email" in v && "phone" in v))

// MEJOR: falla cuando coincide más de una rama
z.xor([EmailLogin, PhoneLogin])
```

`z.xor()` acepta un array, como `z.union()`.

### JSON Schema escrito o parseado a mano

```typescript
const User = z.object({ name: z.string() })

// MEJOR, en ambas direcciones
z.toJSONSchema(User)      // publicar un contrato
z.fromJSONSchema({ type: "object", properties: { name: { type: "string" } } }) // experimental
```

Un JSON Schema escrito a mano junto a un schema de Zod son dos fuentes de verdad que
coinciden solo hasta que alguien edita una de ellas.

### Checks de formato escritos como regex

```typescript
// FUNCIONA
z.string().regex(/^[0-9a-f]{64}$/i)

// MEJOR — con nombre, y correcto según el algoritmo
z.hash("sha256")
z.guid()
```
