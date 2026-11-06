<!-- Generado por .github/check/agents.ts. No editar. -->

# Zod: reglas compiladas

Todas las reglas de `rules/`, expandidas, para los agentes que leen un solo archivo. Fuente: `SKILL.md` y `rules/*.md`.
Versión base: zod ^4.6.0, verificado con zod 4.6.7. Versión de la skill 2.0.0.

## Resumen

Zod sirve para la **validación de tipos en runtime** — parsear datos no confiables en los límites del sistema (entrada de APIs, datos de formularios, variables de entorno, servicios externos). Para tipos solo en tiempo de compilación, TypeScript puro es suficiente.

## Tabla de contenido

1. [Parseo y seguridad de tipos](#1-parseo-y-seguridad-de-tipos) — CRÍTICO
2. [Diseño de schemas](#2-diseño-de-schemas) — CRÍTICO
3. [Refinamientos y transformaciones](#3-refinamientos-y-transformaciones) — ALTO
4. [Manejo de errores](#4-manejo-de-errores) — ALTO
5. [Rendimiento y composición](#5-rendimiento-y-composición) — MEDIO
6. [Migración a v4](#6-migración-a-v4) — MEDIO
7. [Patrones avanzados](#7-patrones-avanzados) — MEDIO
8. [Arquitectura y límites](#8-arquitectura-y-límites) — CRÍTICO/ALTO
9. [Observabilidad](#9-observabilidad) — ALTO/MEDIO

## 1. Parseo y seguridad de tipos

**Impacto: CRÍTICO**

### Usar safeParse() para la entrada del usuario

`parse-use-safeParse` · **CRÍTICO** · Usa safeParse() en lugar de parse() para evitar lanzar excepciones con una entrada inválida.

#### Problema

`parse()` lanza un `ZodError` con una entrada inválida. Envolverlo en un try/catch es verboso y propenso a errores — pierdes el resultado discriminado de éxito/error y te arriesgas a capturar errores no relacionados.

#### Incorrecto

```typescript
const UserSchema = z.object({ name: z.string(), email: z.email() })

// BUG: try/catch es verboso y captura errores no relacionados
function validateInput(data: unknown) {
  try {
    const result = UserSchema.parse(data)
    return { success: true, data: result }
  } catch (e) {
    if (e instanceof z.ZodError) {
      return { success: false, errors: e.issues }
    }
    throw e // relanzar los errores que no son de Zod
  }
}
```

#### Correcto

```typescript
function validateInput(data: unknown) {
  const result = UserSchema.safeParse(data)
  if (!result.success) {
    return { success: false, errors: result.error.issues }
  }
  return { success: true, data: result.data }
}
```

#### Por qué

`safeParse()` devuelve una unión discriminada `{ success: true, data } | { success: false, error }`. Sin excepciones, sin try/catch, sin riesgo de capturar errores no relacionados. Usa `parse()` solo cuando los datos inválidos sean verdaderamente excepcionales (p. ej., una configuración interna que nunca debería estar mal). Cuando solo necesitas un sí o un no, `.validate()` devuelve un booleano sin construir un error (zod.dev/basics). `ZodError.errors` de Zod 3 se eliminó; lee `.issues`.

### Usar parseAsync para refinamientos asíncronos

`parse-async-required` · **CRÍTICO** · Debes usar parseAsync()/safeParseAsync() cuando el schema tiene refinamientos o transformaciones asíncronos.

#### Problema

Cuando un schema contiene refinamientos asíncronos (`.refine(async ...)`) o transformaciones asíncronas (`.transform(async ...)`), llamar a `.parse()` o a `.safeParse()` síncronos lanzará un error. El refinamiento asíncrono no se ejecutará.

#### Incorrecto

```typescript
const UniqueEmail = z.email().refine(
  async (email) => !(await db.users.exists(email)),
  { error: "Email already registered" }
)

// BUG: un parseo síncrono con un refinamiento asíncrono lanza $ZodAsyncError
const result = UniqueEmail.safeParse(input)
```

#### Correcto

```typescript
const UniqueEmail = z.email().refine(
  async (email) => !(await db.users.exists(email)),
  { error: "Email already registered" }
)

// CORRECTO: usar safeParseAsync para schemas con refinamientos asíncronos
const result = await UniqueEmail.safeParseAsync(input)
if (!result.success) {
  console.log(result.error.issues)
}
```

#### Por qué

Zod separa el parseo síncrono del asíncrono. Si algún refinamiento o transformación de la cadena del schema es asíncrono, debes usar `parseAsync()` o `safeParseAsync()`. La versión síncrona lanza `$ZodAsyncError` ("Encountered Promise during synchronous parse"); no omite el refinamiento. Lo mismo aplica a `.validate()`, cuya forma asíncrona es `.validateAsync()`. Prueba el camino asíncrono, porque un test del happy path de otro schema no llega a él.

### Inferir los tipos a partir de los schemas

`parse-infer-types` · **CRÍTICO** · Usa z.infer<typeof Schema> para los tipos de salida. Nunca dupliques tipos manualmente.

#### Problema

Definir manualmente interfaces de TypeScript junto a los schemas de Zod crea definiciones de tipos duplicadas que se desincronizan. Cuando el schema cambia, el tipo manual se olvida.

#### Incorrecto

```typescript
// BUG: el tipo manual se desviará del schema
interface User {
  name: string
  email: string
  age: number
}

const UserSchema = z.object({
  name: z.string(),
  email: z.email(),
  age: z.number().min(0),
})

// Estos pueden divergir silenciosamente cuando se actualiza el schema
```

#### Correcto

```typescript
const UserSchema = z.object({
  name: z.string(),
  email: z.email(),
  age: z.number().min(0),
})

// Tipo de salida (después del parseo/las transformaciones)
type User = z.infer<typeof UserSchema>

// Tipo de entrada (antes de las transformaciones — útil para formularios)
type UserInput = z.input<typeof UserSchema>
```

#### Por qué

`z.infer` extrae el tipo de salida (después de las transformaciones). `z.input` extrae el tipo de entrada (antes de las transformaciones). Estos siempre se mantienen sincronizados con el schema. Usa `z.infer` en la mayoría de los casos; usa `z.input` cuando necesites la forma previa a la transformación (p. ej., el estado de un formulario donde un campo de fecha es un string antes de transformarse en Date).

Cuando el tipo viene primero, de un cliente generado o de un tipo que no te pertenece, verifica el schema contra él con `z.toZod<T>()` (Zod 4.5). Falla al compilar ante cualquier diferencia, mientras que `satisfies z.ZodType<T>` deja pasar claves extra y `z.any()`:

```typescript
type Player = { username: string; xp: number }

const Player = z.toZod<Player>()(
  z.object({
    username: z.string(),
    xp: z.number(),
  })
)
```

### Usar .validate() cuando solo necesitas un booleano

`parse-validate-boolean` · **MEDIO** · Usa .validate() para un sí o un no, porque no construye ningún error; usa safeParse() cuando necesites el valor parseado.

#### Problema

`.safeParse(x).success` construye un `ZodError` completo por cada fallo y luego lo descarta. `.validate()` (Zod 4.6) devuelve un booleano, se detiene en el primer fallo y no construye ningún error. Tiene una trampa: estrecha el valor al tipo de entrada del schema y no devuelve ninguna salida, así que después de una transformación, un valor por defecto o un codec, el valor estrechado es la entrada cruda.

#### Incorrecto

```typescript
const Item = z.object({ id: z.string(), price: z.number().nonnegative() })

// Construye y descarta un ZodError por cada elemento inválido
function validItems(items: unknown[]) {
  return items.filter((item) => Item.safeParse(item).success)
}

const Port = z.string().regex(z.regexes.integer).transform(Number)

function nextPort(raw: unknown) {
  if (Port.validate(raw)) {
    return raw + 1 // BUG: raw tiene el tipo de entrada, string, así que "8080" + 1 es "80801"
  }
  return undefined
}
```

#### Correcto

```typescript
function validItems(items: unknown[]) {
  return items.filter((item) => Item.validate(item))
}

function nextPort(raw: unknown) {
  const result = Port.safeParse(raw)
  return result.success ? result.data + 1 : undefined
}
```

#### Por qué

La página basics de zod.dev mide `.validate()` como hasta 16x más rápido que `.safeParse().success` con una entrada inválida, y el post del lanzamiento de la 4.6 mide hasta 35x en un schema compilado con `z.compile()`. Úsalo para filtros, guards y decisiones de enrutamiento. Usa `.safeParse()` cuando necesites el valor transformado o los issues.

En un schema con un refinamiento asíncrono, `.validate()` lanza una excepción, como lo hace `.safeParse()`; usa `.validateAsync()`.

---

## 2. Diseño de schemas

**Impacto: CRÍTICO**

### Manejar las claves desconocidas de forma explícita

`schema-object-unknowns` · **CRÍTICO** · Por defecto, z.object() elimina las claves desconocidas. Usa strictObject o looseObject para un comportamiento explícito.

#### Problema

`z.object()` elimina silenciosamente cualquier clave que no esté definida en el schema. Esto puede causar pérdida de datos al reenviar payloads, al almacenar metadata extra o al hacer proxy de las respuestas de una API.

#### Incorrecto

```typescript
const Config = z.object({
  host: z.string(),
  port: z.number(),
})

// BUG: las claves desconocidas se descartan silenciosamente
const input = { host: "localhost", port: 3000, debug: true, logLevel: "verbose" }
const result = Config.parse(input)
// result = { host: "localhost", port: 3000 } — debug y logLevel desaparecieron
```

#### Correcto

```typescript
// RECHAZAR las claves desconocidas (validación de la entrada de la API)
const StrictConfig = z.strictObject({
  host: z.string(),
  port: z.number(),
})
// Lanza una excepción con { host: "localhost", port: 3000, debug: true }

// CONSERVAR las claves desconocidas (proxy, reenvío)
const LooseConfig = z.looseObject({
  host: z.string(),
  port: z.number(),
})
// Deja pasar { host: "localhost", port: 3000, debug: true, logLevel: "verbose" }

// ELIMINAR las claves desconocidas (por defecto — cuando quieres eliminarlas explícitamente)
const SafeConfig = z.object({
  host: z.string(),
  port: z.number(),
})
```

#### Por qué

| Variante | Claves desconocidas | Úsalo cuando |
|---------|-------------|----------|
| `z.object()` | Las elimina | Sanitizas la entrada del usuario, solo quieres los campos conocidos |
| `z.strictObject()` | Las rechaza (error) | Contratos de API, validación de configuración — sin sorpresas |
| `z.looseObject()` | Las conserva | Hacer proxy de datos, reenviar payloads, middleware |

### Usar uniones discriminadas

`schema-union-discriminated` · **CRÍTICO** · Usa z.discriminatedUnion() para uniones de objetos etiquetadas en lugar de z.union().

#### Problema

`z.union()` prueba cada rama secuencialmente hasta que una coincide. Para uniones de objetos con un campo discriminador compartido (como `type` o `kind`), esto es lento y produce mensajes de error confusos que muestran los issues de todas las ramas.

#### Incorrecto

```typescript
// MAL: prueba cada rama secuencialmente, el error muestra los issues de todas las ramas
const Shape = z.union([
  z.object({ type: z.literal("circle"), radius: z.number() }),
  z.object({ type: z.literal("square"), side: z.number() }),
  z.object({ type: z.literal("rect"), width: z.number(), height: z.number() }),
])
// { type: "triangle" } falla con un único issue invalid_union en el path [], con el mensaje "Invalid input",
// y un array `errors` que contiene los issues de cada rama
```

#### Correcto

```typescript
// BIEN: elige la rama según el discriminador; los issues nombran el campo que falla
const Shape = z.discriminatedUnion("type", [
  z.object({ type: z.literal("circle"), radius: z.number() }),
  z.object({ type: z.literal("square"), side: z.number() }),
  z.object({ type: z.literal("rect"), width: z.number(), height: z.number() }),
])
// { type: "triangle" } falla en el path ["type"]:
//   "Invalid discriminator value. Expected 'circle' | 'square' | 'rect'"
// { type: "circle", radius: "x" } reporta solo la rama circle: invalid_type en ["radius"]
```

#### Por qué

`discriminatedUnion` verifica primero el campo discriminador y luego valida solo la rama que coincide. No prueba las otras ramas, así que los issues nombran el campo que está mal. En Zod 4, un discriminador puede ser un literal, un enum, una unión de literales, `null` o `undefined`, y una unión discriminada puede ser una opción de otra (zod.dev/v4). `z.getDiscriminatedOption(Shape, "circle")` (Zod 4.5) devuelve una rama como un `ZodObject`. Para exigir que coincida exactamente una rama, usa `z.xor([a, b])`.

### Trampas de la coerción — strings booleanos

`schema-coercion-pitfalls` · **CRÍTICO** · z.coerce.boolean() usa el Boolean() de JavaScript, que convierte "false" → true. Usa z.stringbool().

#### Problema

`z.coerce.boolean()` envuelve la entrada en el constructor `Boolean()` de JavaScript. `Boolean("false")` es `true` porque cualquier string no vacío es truthy. Esto corrompe silenciosamente los datos de los formularios y las variables de entorno.

#### Incorrecto

```typescript
// BUG: Boolean("false") === true, Boolean("0") === true
const Settings = z.object({
  debug: z.coerce.boolean(),
  verbose: z.coerce.boolean(),
})

Settings.parse({ debug: "false", verbose: "0" })
// { debug: true, verbose: true } — ¡ambos están mal!
```

#### Correcto

```typescript
// BIEN: z.stringbool() maneja correctamente las representaciones booleanas en string
const Settings = z.object({
  debug: z.stringbool(),
  verbose: z.stringbool(),
})

Settings.parse({ debug: "false", verbose: "0" })
// { debug: false, verbose: false }

// z.stringbool() acepta, sin distinguir mayúsculas de minúsculas: "true"/"false", "1"/"0", "yes"/"no",
// "on"/"off", "y"/"n", "enabled"/"disabled". Cualquier otra cosa es un issue invalid_value.
// Cambiar los conjuntos con z.stringbool({ truthy: [...], falsy: [...] }) o { case: "sensitive" }.
```

#### Por qué

`z.stringbool()` está hecho específicamente para la conversión de string a booleano desde formularios, variables de entorno y parámetros de query. Entiende las representaciones comunes en string de los valores booleanos. `z.coerce.boolean()` solo debería usarse cuando realmente quieres la semántica de truthiness de JavaScript.

### Diseño de schemas recursivos

`schema-recursive-types` · **CRÍTICO** · Define los schemas recursivos con un getter. La entrada cíclica se parsea desde Zod 4.5.

#### Problema

Un schema para un árbol (categorías, comentarios, un organigrama) se refiere a sí mismo. Una autorreferencia directa falla, porque la variable todavía no está definida cuando se ejecuta el literal de objeto. El patrón de Zod 3, `z.lazy()` con una interfaz escrita a mano, todavía funciona en Zod 4, pero la interfaz duplica el schema y se desvía de él.

#### Incorrecto

```typescript
// BUG: la interfaz escrita a mano y el schema pueden desincronizarse
interface CategoryShape {
  name: string
  children: CategoryShape[]
}

const Category: z.ZodType<CategoryShape> = z.object({
  name: z.string(),
  children: z.lazy(() => z.array(Category)),
})
```

#### Correcto

```typescript
// BIEN: un getter difiere la referencia hasta el momento del parseo, y z.infer resuelve el tipo
const Category = z.object({
  name: z.string(),
  get children() {
    return z.array(Category)
  },
})

type Category = z.infer<typeof Category>
// { name: string; children: Category[] }
```

Cuando TypeScript reporta TS7023 ("implicitly has return type 'any'") en un getter, anota el tipo de retorno del getter:

```typescript
const Activity = z.object({
  name: z.string(),
  get subactivities(): z.ZodNullable<z.ZodArray<typeof Activity>> {
    return z.nullable(z.array(Activity))
  },
})
```

#### Por qué

El getter es la forma documentada de definir objetos recursivos en Zod 4 (zod.dev/api, "Recursive objects"). El resultado es un `ZodObject` normal, así que `.pick()`, `.omit()`, `.partial()` y `.extend()` siguen funcionando. Los schemas mutuamente recursivos (un `User` con `posts`, un `Post` con un `author`) usan el mismo patrón.

Desde Zod 4.5, la entrada cíclica se parsea: un objeto que se contiene a sí mismo vuelve como un grafo de salida con los mismos ciclos. Zod Mini necesita un memoizer registrado para esto (zod.dev/api). `z.lazy()` no se eliminó ni está deprecado; `z.json()` está construido sobre él.

### Parsear un string JSON con un codec, no con z.json()

`schema-json-string` · **ALTO** · z.json() verifica un valor que ya está parseado y no parsea un string; decodifica el texto JSON con un codec que reporte el JSON inválido como un issue.

#### Problema

`z.json()` verifica que un valor se pueda codificar como JSON. Un string se puede, así que `z.json().parse('{"name":"Ada"}')` devuelve el mismo string. El código que le pasa texto JSON a `z.json()` obtiene un string donde espera un objeto. `JSON.parse()` dentro de `.transform()` no es mejor: con un texto inválido lanza un `SyntaxError`, y el error escapa de `safeParse()`.

#### Incorrecto

```typescript
const Body = z.object({ name: z.string() })

// BUG: el resultado es el string '{"name":"Ada"}', no un objeto
const notParsed = z.json().parse('{"name":"Ada"}')

// BUG: con "{bad", JSON.parse lanza una excepción fuera de safeParse() en lugar de devolver success: false
const FromText = z.string().transform((s) => JSON.parse(s)).pipe(Body)
```

#### Correcto

```typescript
const jsonCodec = <T extends z.core.$ZodType>(schema: T) =>
  z.codec(z.string(), schema, {
    decode: (text, ctx) => {
      try {
        return JSON.parse(text)
      } catch (err) {
        ctx.issues.push({
          code: "invalid_format",
          format: "json",
          input: text,
          message: err instanceof Error ? err.message : "Invalid JSON",
        })
        return z.NEVER
      }
    },
    encode: (value) => JSON.stringify(value),
  })

const BodyFromText = jsonCodec(Body)
BodyFromText.decode('{"name":"Ada"}')     // { name: "Ada" }
BodyFromText.safeDecode("{bad").success  // false: un issue invalid_format con format "json"
BodyFromText.encode({ name: "Ada" })      // '{"name":"Ada"}'
```

#### Por qué

Usa `z.json()` para un valor que ya está parseado, como una columna JSON o un campo tipado como JSON arbitrario. Para texto JSON, el codec convierte el texto inválido en un issue, valida el resultado con tu schema y vuelve a codificar el valor. Zod no exporta el codec; es una receta de zod.dev/codecs. Consulta `references/codecs.md` para ver las otras recetas.

---

## 3. Refinamientos y transformaciones

**Impacto: ALTO**

### Nunca lanzar excepciones en los refinamientos

`refine-never-throw` · **ALTO** · Las funciones de refinamiento y de transformación nunca deben lanzar excepciones. Devuelve false desde .refine(), agrega issues en .superRefine(), haz push en ctx.issues en .transform().

#### Problema

Una excepción lanzada dentro de una función de `.refine()` o de `.transform()` no se convierte en un issue de Zod. Escapa de `.parse()` y de `.safeParse()` como un `Error` plano, así que quien llama y confía en que `safeParse()` nunca lanza excepciones recibe una excepción no manejada.

#### Incorrecto

```typescript
// BUG: el throw escapa de safeParse()
const PositiveNumber = z.number().refine((n) => {
  if (n <= 0) throw new Error("Must be positive")
  return true
})
```

#### Correcto

```typescript
// BIEN: .refine() devuelve un booleano; su función solo recibe el valor
const PositiveNumber = z.number().refine((n) => n > 0, { error: "Must be positive" })

// BIEN: .superRefine() recibe ctx y puede agregar varios issues
const Password = z.string().superRefine((val, ctx) => {
  if (val.length < 8) {
    ctx.addIssue({ code: "custom", message: "Password must be at least 8 characters", input: val })
  }
  if (!/[A-Z]/.test(val)) {
    ctx.addIssue({ code: "custom", message: "Password must contain an uppercase letter", input: val })
  }
})

// BIEN: una transformación reporta un fallo haciendo push en ctx.issues y devolviendo z.NEVER
const NumericString = z.string().transform((val, ctx) => {
  const n = Number(val)
  if (Number.isNaN(n)) {
    ctx.issues.push({ code: "custom", message: "Not a number", input: val })
    return z.NEVER
  }
  return n
})
```

#### Por qué

`.refine()` espera un booleano, o una `Promise<boolean>` para un check asíncrono. Su función solo recibe el valor, sin `ctx`. `.superRefine()` recibe `(value, ctx)` y reporta con `ctx.addIssue()`. Un `.transform()` recibe `(value, ctx)` y reporta con `ctx.issues.push()` (zod.dev/api, "Refinements" y "Transforms"). Cada uno de estos se convierte en un issue de Zod en el resultado; un throw no.

### Refine para la validación, transform para la conversión

`refine-vs-transform` · **ALTO** · Usa .refine() para validar, .transform() para convertir y .pipe() para validar el valor convertido.

#### Problema

Validar dentro de `.transform()` lanzando una excepción se salta los errores de Zod: la excepción escapa de `safeParse()`. Verificar un string numérico con `parseInt` acepta strings que solo empiezan con dígitos, porque `parseInt("12abc")` devuelve `12`.

#### Incorrecto

```typescript
// BUG: el throw escapa de safeParse() como un Error plano
const ThrowingInt = z.string().transform((val) => {
  const n = Number.parseInt(val, 10)
  if (Number.isNaN(n)) throw new Error("Not a number")
  return n
})

// BUG: parseInt("12abc") es 12, así que "12abc" pasa
const LooseInt = z
  .string()
  .refine((val) => !Number.isNaN(Number.parseInt(val, 10)), { error: "Must be a numeric string" })
  .transform((val) => Number.parseInt(val, 10))
```

#### Correcto

```typescript
// BIEN: verificar el string, convertirlo y luego verificar el número
const StringToInt = z.string().regex(z.regexes.integer).transform(Number).pipe(z.int().min(0))

StringToInt.parse("42") // 42
StringToInt.safeParse("12abc").success // false
```

Cuando el valor también debe volver a ser un string, usa un codec en su lugar (consulta `pattern-codecs`).

#### Por qué

`.refine()` responde "¿es esto válido?" y agrega un issue cuando no lo es. `.transform()` devuelve un valor nuevo y no debe lanzar excepciones (zod.dev/api, "Transforms"). `.pipe()` pasa la salida de un schema al siguiente, así que el valor convertido se valida con sus propios checks. Para reportar un issue desde dentro de una transformación, haz push de él en `ctx.issues` y devuelve `z.NEVER`.

### Validación entre campos

`refine-cross-field` · **ALTO** · Refina el objeto padre y establece path en el campo que muestra el error.

#### Problema

Un refinamiento sobre un campo solo ve el valor de ese campo. Una regla que compara dos campos, como una contraseña y su confirmación, pertenece al objeto padre, con `path` establecido para que el error se muestre en el campo correcto.

#### Incorrecto

```typescript
// BUG: el refinamiento sobre confirm no puede ver password, así que no puede compararlos
const Form = z.object({
  password: z.string().min(8),
  confirm: z.string().refine((val) => val.length > 0, {
    error: "Passwords don't match",
  }),
})
```

#### Correcto

```typescript
// BIEN: refinar el objeto y poner el issue en confirm
const Form = z
  .object({
    password: z.string().min(8),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    error: "Passwords don't match",
    path: ["confirm"],
  })
```

Un refinamiento de objeto no se ejecuta cuando algún campo tiene un error de tipo, incluso un campo que no lee. Un check fallido como `.min()` no lo detiene. Usa `when` para ejecutarlo en cuanto los campos que lee sean válidos:

```typescript
const Base = z.object({
  password: z.string().min(8),
  confirm: z.string(),
  nickname: z.string(),
})

const Signup = Base.refine((data) => data.password === data.confirm, {
  error: "Passwords don't match",
  path: ["confirm"],
  when(payload) {
    return Base.pick({ password: true, confirm: true }).safeParse(payload.value).success
  },
})
```

Para reportar más de un issue, usa `.superRefine()` y agrega cada issue con su propio `path`:

```typescript
const DateRange = z
  .object({ start: z.date(), end: z.date(), label: z.string() })
  .superRefine((data, ctx) => {
    if (data.end < data.start) {
      ctx.addIssue({ code: "custom", path: ["end"], message: "End is before start", input: data.end })
    }
    if (data.label.trim() === "") {
      ctx.addIssue({ code: "custom", path: ["label"], message: "Label is empty", input: data.label })
    }
  })
```

#### Por qué

`path` coloca el issue bajo el campo, así que `z.flattenError()` lo reporta en `fieldErrors.confirm` y una librería de formularios lo muestra junto a ese input. `.refine()` cubre una sola condición (zod.dev/api, "Refinements"). La página de zod.dev del paquete `zod` lista `.superRefine()` como deprecado en favor de `.check()`, pero la página de la API lo documenta y las definiciones de tipos de 4.6.7 no lo marcan como deprecado.

---

## 4. Manejo de errores

**Impacto: ALTO**

### Mensajes de error personalizados (API de v4)

`error-custom-messages` · **ALTO** · Personaliza los mensajes con el parámetro error. required_error e invalid_type_error ya no existen; message está deprecado.

#### Problema

Zod 4 eliminó `required_error` e `invalid_type_error`. TypeScript los rechaza; JavaScript puro los deja pasar y Zod los ignora, así que aparece el mensaje por defecto en lugar del tuyo. El parámetro `message` todavía funciona, pero está deprecado.

#### Incorrecto

```typescript
// BUG: Zod 4 eliminó estos parámetros, así que los mensajes personalizados nunca aparecen
const Name = z.string({
  // @ts-expect-error required_error e invalid_type_error no son parámetros de Zod 4
  required_error: "Name is required",
  invalid_type_error: "Name must be a string",
})

// `message` todavía funciona, pero Zod 4 lo documenta como deprecado
const Age = z.number().min(18, { message: "Must be 18+" })
```

#### Correcto

```typescript
// BIEN: el parámetro error acepta un string
const Age = z.number().min(18, { error: "Must be 18+" })

// BIEN: o solo el string
const AgeShort = z.number().min(18, "Must be 18+")

// BIEN: una función distingue un valor ausente de un tipo incorrecto
const Name = z.string({
  error: (issue) => (issue.input === undefined ? "Name is required" : "Name must be a string"),
})
```

#### Por qué

Zod 4 agrupa toda la personalización de errores bajo un único parámetro `error` (zod.dev/error-customization). Acepta un string, o una función que recibe el issue (`code`, `input`, `path` y campos como `minimum`) y devuelve un string, o `undefined` para pasar al siguiente error map. Un error a nivel de schema cubre los issues que generan sus propios checks, así que `z.string("Invalid name").min(5)` reporta "Invalid name" para un string corto.

### Funciones de formateo de errores

`error-formatting` · **ALTO** · Usa z.flattenError() para formularios planos, z.treeifyError() para datos anidados, z.prettifyError() para logs. z.formatError() está deprecado.

#### Problema

Zod 4 documenta `z.formatError()` y los métodos `.format()` y `.flatten()` de `ZodError` como deprecados. Todavía se ejecutan. Las funciones de nivel superior los reemplazan.

#### Incorrecto

```typescript
const Signup = z.object({ email: z.email(), age: z.number().min(18) })

const result = Signup.safeParse(data)
if (!result.success) {
  // la documentación marca z.formatError() como deprecado en favor de z.treeifyError()
  const formatted = z.formatError(result.error)
}
```

#### Correcto

```typescript
const Signup = z.object({
  email: z.email(),
  address: z.object({ zip: z.string().length(5) }),
})

const result = Signup.safeParse(data)
if (!result.success) {
  // formularios planos: { formErrors: string[], fieldErrors: { email?: string[], address?: string[] } }
  const flat = z.flattenError(result.error)
  flat.fieldErrors.email // p. ej. ["Invalid email address"]

  // datos anidados: un árbol que refleja el schema; usar optional chaining
  const tree = z.treeifyError(result.error)
  tree.properties?.address?.properties?.zip?.errors

  // logs y CLIs: una línea por issue, con "→ at <path>" debajo de cada uno
  const pretty = z.prettifyError(result.error)
}
```

#### Por qué

| Función | Salida | Caso de uso |
|----------|--------|----------|
| `z.flattenError()` | `{ formErrors, fieldErrors }` | Formularios de un nivel; los issues anidados quedan bajo la clave de nivel superior |
| `z.treeifyError()` | `{ errors, properties?, items? }`, anidado como el schema | Formularios anidados, arrays, schemas recursivos |
| `z.prettifyError()` | Un string de varias líneas | Logs, depuración, salida de CLI |

Fuente: zod.dev/error-formatting.

### reportInput filtra datos sensibles

`error-input-security` · **ALTO** · Nunca habilites reportInput en producción. Incrusta los valores de entrada crudos en los mensajes de error.

#### Problema

La opción de parseo `reportInput` incluye el valor de entrada crudo en cada issue. Zod lo omite por defecto por esta razón (zod.dev/error-customization). Si se habilita en producción, los datos sensibles (contraseñas, tokens, PII) terminan en los logs de errores, en los sistemas de monitoreo y en las respuestas de la API.

#### Incorrecto

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

#### Correcto

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

#### Por qué

Los issues de error se registran habitualmente en logs, se envían a herramientas de monitoreo de errores (Sentry, Datadog) y a veces se devuelven en las respuestas de la API. Incluir los valores de entrada crudos en estos flujos viola los principios de privacidad de datos y puede exponer datos sensibles de los usuarios.

---

## 5. Rendimiento y composición

**Impacto: MEDIO**

### Spread en lugar de extend para schemas grandes

`perf-extend-spread` · **MEDIO** · Usa la sintaxis spread con .shape en lugar de .extend() en schemas grandes para reducir el costo en tiempo de compilación.

#### Problema

`.extend()` es costoso para el compilador de TypeScript en schemas grandes, y una limitación de TypeScript hace que las llamadas encadenadas sean cuadráticamente más costosas (zod.dev/api, "`.extend()`").

#### Incorrecto

```typescript
// MAL: cada .extend() crea un tipo de TS nuevo — compilación lenta
const Base = z.object({ id: z.string(), created: z.date() })
const WithName = Base.extend({ name: z.string() })
const WithEmail = WithName.extend({ email: z.email() })
const WithRole = WithEmail.extend({ role: z.enum(["admin", "user"]) })
// 4 tipos intermedios que TypeScript debe resolver
```

#### Correcto

```typescript
const Base = z.object({ id: z.string(), created: z.date() })
const Extra = { name: z.string(), email: z.email(), role: z.enum(["admin", "user"]) }

// BIEN: un solo z.object con spread — una sola instanciación de tipo
const Full = z.object({ ...Base.shape, ...Extra })
```

#### Por qué

`.extend()` está bien para extensiones puntuales. Para jerarquías grandes, hacer spread de `.shape` en un solo `z.object()` mantiene bajos los tiempos de compilación, y la misma sintaxis funciona en Zod Mini. Las dos formas difieren en runtime:

| | `Base.extend({...})` | `z.object({ ...Base.shape, ... })` |
|---|---|---|
| Rigurosidad de `Base` | Se conserva | Se pierde: tú eliges `z.object`, `z.strictObject` o `z.looseObject` |
| Refinamientos de `Base` | Se conservan; lanza una excepción si una clave nueva sobrescribe una existente | Se pierden: `.shape` solo contiene los campos |
| Sobrescribir una clave en un `Base` con refinamientos | Usa `.safeExtend()`, que además verifica que el schema nuevo sea asignable | Permitido |

Medido en zod 4.6.7. La página de la API de zod.dev dice que `.extend()` lanza una excepción en cualquier schema con refinamientos; 4.6.7 solo la lanza cuando se sobrescribe una clave.

### Reutilizar schemas con composición

`perf-reuse-schemas` · **MEDIO** · Define los schemas una sola vez. Usa .pick(), .omit(), .partial() para derivar variantes.

#### Problema

Duplicar definiciones de campos entre schemas relacionados (Create, Update, Response) provoca deriva. Cuando un campo cambia, solo algunos schemas se actualizan.

#### Incorrecto

```typescript
// MAL: campos duplicados entre schemas
const UserCreate = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(8),
})

const UserUpdate = z.object({
  name: z.string().optional(),
  email: z.email().optional(),
  // se olvidó el campo password — deriva
})

const UserResponse = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  createdAt: z.date(),
})
```

#### Correcto

```typescript
// BIEN: una sola fuente, derivar variantes
const User = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  password: z.string().min(8),
  createdAt: z.date(),
})

const UserCreate = User.omit({ id: true, createdAt: true })
const UserUpdate = User.pick({ name: true, email: true }).partial()
const UserResponse = User.omit({ password: true })
```

#### Por qué

`pick()`, `omit()`, `partial()` y `required()` derivan schemas nuevos a partir de una base. Los cambios en la base se propagan automáticamente a todos los schemas derivados. Los tipos inferidos también se mantienen sincronizados. `.exactPartial()` (Zod 4.5) hace que las claves se puedan omitir sin aceptar un `undefined` explícito, y `z.deepPartial()` también hace parciales los objetos anidados. `.partial()` y `z.deepPartial()` lanzan una excepción en un objeto que tiene su propio refinamiento.

### Zod Mini solo con límites estrictos de bundle

`perf-zod-mini` · **MEDIO** · Usa Zod Mini solo para bundles del cliente con límites de tamaño estrictos; impórtalo desde zod/mini y carga un locale.

#### Problema

Zod Mini tiene las mismas funcionalidades que Zod detrás de una API funcional a la que los bundlers pueden aplicar tree-shaking. El ahorro es de unos pocos kilobytes, y la API es más difícil de descubrir. La página Zod Mini de zod.dev recomienda el Zod normal a menos que el tamaño del bundle sea una restricción inusualmente estricta, y dice que el ahorro no importa en un servidor. Además, Zod Mini no carga ningún locale, así que todos los mensajes dicen "Invalid input" hasta que cargues uno.

#### Incorrecto

```typescript
// MAL: Zod Mini en un servidor, donde unos pocos kilobytes no importan
import * as z from "zod/mini"

const Order = z.object({
  sku: z.string().check(z.minLength(1)),
  quantity: z.int().check(z.positive()),
})
// y sin ningún locale cargado, el mensaje de cada issue es "Invalid input"
```

#### Correcto

```typescript
// BIEN: un bundle del cliente con restricciones de tamaño que muestra mensajes a los usuarios
import * as z from "zod/mini"
import { en } from "zod/locales"

z.config(en())

const LoginForm = z.object({
  email: z.email(),
  password: z.string().check(z.minLength(8)),
})
```

#### Por qué

Medido por la página Zod Mini de zod.dev (gzip): `z.boolean().parse(true)` genera un bundle de 2.12 kB con Zod Mini y de 5.91 kB con Zod; un schema de objeto de tres claves genera un bundle de 4.0 kB y de 13.1 kB.

| | Zod | Zod Mini |
|---|---|---|
| Importación | `import * as z from "zod"` | `import * as z from "zod/mini"`, o el paquete `@zod/mini`, que sigue las versiones de `zod` |
| Checks | Métodos: `.min(8)`, `.trim()`, `.refine()` | `.check(z.minLength(8), z.trim(), z.refine(...))` |
| Wrappers | `.optional()`, `.nullable()` | `z.optional(s)`, `z.nullable(s)` |
| Mensajes de error | Locale en inglés cargado | Ninguno cargado: "Invalid input" hasta `z.config(en())` |
| JSON Schema, metadata | `z.toJSONSchema()`, `.meta()`, `.describe()` | `z.toJSONSchema()`; `z.meta()` y `z.describe()` son checks |
| Entrada cíclica en schemas recursivos | Funciona | Necesita un memoizer registrado |
| Úsalo cuando | Servidores, scripts, la mayoría de los frontends | Bundles del cliente con un presupuesto de tamaño estricto |

Una librería que debe aceptar schemas tanto de Zod como de Zod Mini compila contra `zod/v4/core` (zod.dev/library-authors).

### Compilar el schema final y demostrar que se compiló

`perf-compile` · **MEDIO** · Pasa el schema final a z.compile(); un schema derivado no está compilado, y un schema no soportado hace fallback sin ningún error.

#### Problema

`z.compile()` (Zod 4.5) hace que la entrada válida se parsee más rápido en un hot path. Puede fallar sin dar ninguna señal. Un método llamado sobre un schema compilado, como `.refine()` u `.optional()`, devuelve un schema nuevo que no está compilado. Un check asíncrono o una función de `.catch()` en cualquier parte del schema hace que `z.compile()` devuelva el schema original, sin compilar. Ningún error te lo indica.

#### Incorrecto

```typescript
// BUG: .refine() devuelve un schema nuevo, y el schema nuevo no está compilado
const Order = z.compile(z.object({ id: z.string(), qty: z.int() })).refine((o) => o.qty > 0)

// BUG: una función de .catch() en cualquier parte hace que z.compile() devuelva el schema original
const Query = z.compile(z.object({ page: z.int().catch(() => 1) }))
```

#### Correcto

```typescript
const OrderShape = z.object({ id: z.string(), qty: z.int() }).refine((o) => o.qty > 0)
export const Order = z.compile(OrderShape)

const QueryShape = z.object({ page: z.int().catch(1) }) // un .catch() constante se compila
export const Query = z.compile(QueryShape)

// Un test falla cuando un schema deja de compilarse
test("hot-path schemas compile", () => {
  expect(() => z.compile(OrderShape, { strict: true })).not.toThrow()
  expect(() => z.compile(QueryShape, { strict: true })).not.toThrow()
})
```

#### Por qué

Un schema compilado devuelve los mismos datos y los mismos issues que el original, así que compilar es seguro donde aplica. `strict: true` lanza `z.ZodCompileUnsupportedError` o `z.ZodCompileAsyncError` en lugar de hacer fallback, lo que hace visible el fallback en un test.

Con una entrada inválida, Zod vuelve a ejecutar el parser estándar para construir los issues: los fallos no se vuelven más rápidos, y un refinamiento puede ejecutarse dos veces, así que mantén los refinamientos libres de efectos secundarios. Usa `.validate()` cuando solo necesites un booleano. El compilador agrega unos 7 KB en gzip a un bundle que lo usa. Con una Content Security Policy estricta, `new Function` está bloqueado; instala un parser generado en tiempo de build con `z.withParser()`. Consulta `references/compilacion.md`.

---

## 6. Migración a v4

**Impacto: MEDIO**

### v4: formatos de string de nivel superior

`migrate-string-formats` · **MEDIO** · Usa z.email(), z.uuid(), z.url() de nivel superior en lugar de los métodos deprecados z.string().email().

#### Problema

Zod 4 movió los formatos de string a funciones de nivel superior. Las formas de método, como `z.string().email()`, todavía funcionan, y sus definiciones de tipos las marcan como deprecadas (zod.dev/v4/changelog).

#### Incorrecto

```typescript
// MAL: formas de método de Zod 3
const Email = z.string().email() // deprecado: usar z.email()
const Url = z.string().url() // deprecado: usar z.url()
const Uuid = z.string().uuid() // deprecado: usar z.uuid()
const Cuid = z.cuid() // deprecado: CUID v1 filtra información; usar z.cuid2()
```

#### Correcto

```typescript
const Email = z.email()
const Url = z.url()
const HttpUrl = z.httpUrl() // http o https, con un dominio válido
const Uuid = z.uuid() // bits de variante de RFC 9562; z.guid() para cualquier string hex 8-4-4-4-12
const Cuid2 = z.cuid2()
const Ulid = z.ulid()
const Ipv4 = z.ipv4()
const Cidrv6 = z.cidrv6()
const Jwt = z.jwt()
const Base64url = z.base64url() // sin padding
const IsoDate = z.iso.date()
const IsoDateTime = z.iso.datetime() // segundos obligatorios desde Zod 4.5
```

#### Por qué

Cada formato es su propio tipo de schema, y la forma de nivel superior es más corta y funciona mejor con el tree-shaking. `z.uuid()` verifica los bits de variante de RFC 9562; acepta todas las versiones a menos que pases `{ version }` o uses `z.uuidv4()`, `z.uuidv7()`. `z.string().ip()` y `z.string().cidr()` se eliminaron; usa `z.ipv4()`/`z.ipv6()` y `z.cidrv4()`/`z.cidrv6()`, o una unión. La lista completa está en `references/tipos-de-schema.md`.

### v4: z.enum() unificado

`migrate-native-enum` · **MEDIO** · Pasa los enums de TypeScript a z.enum(). z.nativeEnum() todavía se ejecuta, pero está deprecado.

#### Problema

Zod 3 tenía `z.enum()` para arrays de strings y `z.nativeEnum()` para los enums de TypeScript. En Zod 4, `z.enum()` acepta ambos. `z.nativeEnum()` todavía se ejecuta, y su definición de tipos lo marca como deprecado.

#### Incorrecto

```typescript
enum Role {
  Admin = "admin",
  User = "user",
}

const RoleSchema = z.nativeEnum(Role) // deprecado: usar z.enum(Role)
```

#### Correcto

```typescript
enum Role {
  Admin = "admin",
  User = "user",
}

const RoleSchema = z.enum(Role)

// un array de strings, escrito inline o con `as const` para que los valores sigan siendo tipos literales
const StatusSchema = z.enum(["active", "inactive", "pending"])

// .enum da el objeto tipo enum; .exclude() y .extract() derivan schemas nuevos
StatusSchema.enum.active // "active"
const Open = StatusSchema.exclude(["inactive"])
```

#### Por qué

`z.enum()` acepta un array de strings, un enum de TypeScript o un objeto tipo enum (zod.dev/api, "Enums"). Desde Zod 4.6, `.options` de un enum numérico lista solo los valores: `z.enum(Country).options` para `enum Country { UK, Germany }` es `[0, 1]`, sin las claves del mapeo inverso. `.Enum` y `.Values` de Zod 3 se eliminaron; usa `.enum`.

### v4: parámetro de error unificado

`migrate-error-api` · **MEDIO** · Reemplaza message, required_error, invalid_type_error y errorMap por el parámetro error.

#### Problema

Zod 3 tenía cuatro formas de personalizar los errores: `message`, `required_error`, `invalid_type_error` y `errorMap`. Zod 4 las reemplaza por un único parámetro `error`. `message` todavía funciona y está deprecado. Los otros tres ya no existen: TypeScript los rechaza y, en runtime, Zod los ignora.

#### Incorrecto

```typescript
// MAL: parámetros de Zod 3
const name = z.string({
  // @ts-expect-error no es un parámetro de Zod 4; se ignora en runtime
  required_error: "Required",
})
// @ts-expect-error errorMap ahora es `error`; se ignora en runtime
const email = z.email({ errorMap: () => ({ message: "Bad email" }) })
const age = z.number().min(18, { message: "Too young" }) // `message` está deprecado
```

#### Correcto

```typescript
// BIEN: un string
const age = z.number().min(18, { error: "Must be 18 or older" })
const ageShort = z.number().min(18, "Must be 18 or older")

// BIEN: una función, que reemplaza a errorMap; devuelve un string, o undefined para usar el siguiente error map
const email = z.email({
  error: (issue) => (issue.input === undefined ? "Email is required" : "Enter a valid email"),
})
```

#### Por qué

En Zod 4, un error map devuelve un string plano en lugar de `{ message }`. La precedencia también cambió: un error a nivel de schema ahora gana sobre un error map pasado a `.parse()` (zod.dev/v4/changelog). Para un map global, usa `z.config({ customError })`.

---

## 7. Patrones avanzados

**Impacto: MEDIO**

### Branded types para tipado nominal

`pattern-branded-types` · **MEDIO** · Usa .brand<"Name">() para el tipado nominal y así evitar mezclar tipos estructuralmente idénticos.

#### Problema

TypeScript usa tipado estructural — dos tipos con la misma forma son intercambiables. Esto significa que puedes pasar por accidente un valor en USD donde se espera EUR, o un UserId donde se espera un PostId.

#### Incorrecto

```typescript
// MAL: nada impide confundirlos
type USD = number
type EUR = number

function convert(amount: USD, rate: number): EUR {
  return amount * rate
}

const priceInEur: EUR = 100
convert(priceInEur, 1.1) // ¡Sin error! Se pasó EUR como USD
```

#### Correcto

```typescript
// BIEN: los branded types impiden mezclarlos
const USD = z.number().brand<"USD">()
const EUR = z.number().brand<"EUR">()

type USD = z.infer<typeof USD> // number & z.$brand<"USD">
type EUR = z.infer<typeof EUR> // number & z.$brand<"EUR">

function convert(amount: USD, rate: number): EUR {
  return EUR.parse(amount * rate)
}

const priceInEur = EUR.parse(100)
// @ts-expect-error EUR no es asignable a USD
convert(priceInEur, 1.1)
```

#### Por qué

`.brand()` agrega un brand solo de tipo, `z.$brand<"USD">`, que hace incompatibles los tipos estructuralmente idénticos. No cambia nada en runtime: la única forma de obtener un valor con brand es parsearlo. Por defecto, solo el tipo de salida lleva el brand; desde Zod 4.2, un segundo argumento de tipo establece la dirección: `.brand<"Cat", "in">()`, `"out"` (por defecto) o `"inout"` (zod.dev/api, "Branded types"). Usa brands para IDs (UserId vs PostId), monedas, unidades o cualquier dominio donde mezclar valores sea un error lógico.

### Codecs para transformaciones bidireccionales

`pattern-codecs` · **MEDIO** · Usa z.codec() para transformaciones bidireccionales (p. ej., string ISO ↔ Date). .transform() es unidireccional.

#### Problema

`.transform()` es unidireccional — convierte la entrada en la salida durante el parseo. Pero cuando necesitas volver a serializar los datos (p. ej., Date → string ISO para una respuesta de la API), una transformación unidireccional pierde la dirección de codificación.

#### Incorrecto

```typescript
// MAL: transform es unidireccional — no se puede volver a serializar a un string ISO
const DateField = z.string().transform((s) => new Date(s))

// El parseo funciona: "2024-01-01" → objeto Date
// Pero ¿cómo lo conviertes de vuelta a "2024-01-01" para la API?
```

#### Correcto

```typescript
// BIEN: el codec define ambas direcciones
const DateField = z.codec(z.iso.datetime(), z.date(), {
  decode: (s) => new Date(s), // string → Date (parseo)
  encode: (d) => d.toISOString(), // Date → string (serialización)
})

const parsed = DateField.parse("2024-01-01T00:00:00Z") // objeto Date
const serialized = DateField.encode(parsed) // "2024-01-01T00:00:00.000Z"
```

#### Por qué

Los codecs definen un par `decode` (dirección de parseo) y `encode` (dirección de serialización), para valores que hacen ida y vuelta entre representaciones: la entrada y la salida de una API, las filas de una base de datos, los valores de un formulario. `.parse()` acepta `unknown`; `.decode()` y `.encode()` aceptan una entrada tipada, así que TypeScript detecta un argumento incorrecto. Llamar a `.encode()` en un schema que contiene un `.transform()` lanza `$ZodEncodeError`, un error plano en lugar de un `ZodError`. Los valores por defecto, los prefaults y `.catch()` solo se aplican al decodificar. La página de codecs de zod.dev tiene recetas para copiar, como `stringToInt`, `epochSecondsToDate` y `jsonCodec`; Zod no las exporta.

| | `.transform()` | `z.codec()` |
|---|---|---|
| Dirección | Unidireccional (entrada → salida) | Bidireccional (decode + encode) |
| Úsalo cuando | Solo parseas (entrada de la API) | Ida y vuelta (entrada de la API ↔ salida) |
| Codificación | Lanza `$ZodEncodeError` | `schema.encode(value)` |

### Pipe para parseo por etapas

`pattern-pipe` · **MEDIO** · Usa .pipe() para encadenar etapas de validación. Parsear string → aplicar coerción a number → validar el rango.

#### Problema

Las cadenas de validación complejas que aplican coerción y validan en varias etapas se vuelven desordenadas cuando se hacen en una sola transformación. Cada etapa debería parsear la salida de la etapa anterior.

#### Incorrecto

```typescript
// MAL: todo en una transformación — sin validación intermedia
const PortNumber = z.string().transform((val) => {
  const n = parseInt(val, 10)
  if (isNaN(n)) throw new Error("Not a number") // incorrecto: no debería lanzar excepciones
  if (n < 1 || n > 65535) throw new Error("Invalid port") // incorrecto: no debería lanzar excepciones
  return n
})
```

#### Correcto

```typescript
// BIEN: parseo por etapas con pipe
const PortNumber = z
  .string()
  .pipe(z.coerce.number()) // etapa 1: string → number
  .pipe(z.int().min(1).max(65535)) // etapa 2: validar el rango

PortNumber.parse("8080") // 8080
PortNumber.safeParse("abc").success // false: falla la etapa 1
PortNumber.safeParse("99999").success // false: falla la etapa 2
```

#### Por qué

`.pipe()` pasa la salida de un schema a otro. Cada etapa produce issues de Zod cuando falla, y el tipo de cada etapa se infiere. `z.coerce.number()` acepta todo lo que acepta `Number()`, así que `"0x50"` se convierte en 80, `"1e3"` en 1000 y `" 80 "` en 80. Cuando solo los dígitos decimales son válidos, verifica primero el string: `z.string().regex(z.regexes.integer).transform(Number).pipe(z.int().min(1).max(65535))`.

---

## 8. Arquitectura y límites

**Impacto: CRÍTICO/ALTO**

### Parsear en los límites del sistema, no en la lógica de dominio

`arch-boundary-parsing` · **CRÍTICO** · Llama a safeParse() en los puntos de entrada (handlers de API, arranque del env, resolvers de formularios, fetches externos) y pasa los datos tipados hacia adentro. La lógica de dominio recibe valores tipados, no unknown.

#### Problema

Cuando las llamadas a `safeParse()` están dispersas por toda la lógica de dominio, cada función debe manejar la entrada `unknown` y los errores de validación. Esto mezcla las responsabilidades del parseo con la lógica de negocio, hace que el manejo de errores sea inconsistente y crea validaciones redundantes.

#### Incorrecto

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

#### Correcto

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

#### Tabla de decisión: dónde parsear

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

#### Por qué

Parsear en el límite significa que las funciones de dominio son puras — aceptan valores tipados y devuelven valores tipados. Esto elimina la validación redundante, centraliza el manejo de errores y hace que la lógica de negocio sea más fácil de testear (no hace falta construir entradas inválidas). La capa de límite es el único lugar que trata con datos `unknown`.

### Ubicar los schemas junto a su capa de límite

`arch-schema-organization` · **ALTO** · Coloca los schemas junto al límite que los usa. Los schemas de la API en api/users/schemas.ts, los schemas de formularios en features/profile/form-schema.ts. Los tipos de dominio usan z.infer, nunca reexportes schemas crudos entre capas.

#### Problema

Volcar todos los schemas en una sola carpeta `schemas/` crea un cajón de sastre de schemas no relacionados, sin ninguna indicación de dónde se usan. Los schemas de las rutas de la API, de la validación de formularios y del parseo del env se mezclan, lo que hace poco claro qué límite es dueño de qué schema.

#### Incorrecto

```text
# BUG: todo en una carpeta — sin capas, pertenencia poco clara
src/
  schemas/
    user.ts          # ¿lo usan la API Y el formulario Y el env?
    order.ts
    config.ts
    form-profile.ts
    api-response.ts
    db-result.ts
```

```typescript
// BUG: el módulo de dominio importa y reexporta schemas crudos
// src/domain/user.ts
import { UserSchema } from "../schemas/user"
export { UserSchema } // filtra el parseo hacia el dominio
```

#### Correcto

```text
src/
  api/
    users/
      route.ts
      schemas.ts       # schemas de petición/respuesta de la API para /users
    orders/
      route.ts
      schemas.ts       # schemas de la API para /orders
  features/
    profile/
      form-schema.ts   # schema de validación del formulario
      ProfileForm.tsx
  config/
    env.ts             # schema de las variables de entorno, parseado al arrancar
  domain/
    types.ts           # solo tipos z.infer — sin schemas crudos
```

```typescript
// api/users/schemas.ts — ubicado junto a la ruta
import * as z from "zod"

export const CreateUserBody = z.object({
  name: z.string().min(1),
  email: z.email(),
})

export const UserResponse = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
})
```

```typescript
// domain/types.ts — solo tipos inferidos, sin schemas crudos
import type { CreateUserBody, UserResponse } from "../api/users/schemas"
import type * as z from "zod"

export type CreateUser = z.infer<typeof CreateUserBody>
export type User = z.infer<typeof UserResponse>
```

#### Por qué

La coubicación deja clara la pertenencia: el handler de la ruta de la API y sus schemas viven en el mismo directorio. Cuando una ruta cambia, el schema cambia con ella. Los tipos de dominio se derivan mediante `z.infer`, así que la capa de dominio nunca depende directamente de Zod — solo de tipos de TypeScript. Esto mantiene el parseo en el límite y la lógica de negocio libre de responsabilidades de validación.

### Evolucionar los schemas sin romper a los consumidores

`arch-schema-versioning` · **MEDIO** · Usa cambios aditivos para una evolución sin breaking changes. Los campos nuevos usan .optional(). Nunca elimines campos obligatorios sin un incremento de versión major.

#### Problema

Eliminar campos de un schema de Zod o hacerlos más restrictivos rompe silenciosamente a los consumidores. Como `z.object()` elimina por defecto las claves desconocidas, los campos eliminados desaparecen de la salida parseada sin ningún error — los consumidores que leen ese campo obtienen `undefined` en runtime, a pesar de que TypeScript no muestra ningún error de compilación si no han actualizado sus tipos.

#### Incorrecto

```typescript
// v1 — los consumidores dependen de `role`
const UserV1 = z.object({
  name: z.string(),
  email: z.email(),
  role: z.enum(["admin", "user"]),
  nickname: z.string(),
})

// v2 — BREAKING: se eliminó `role`, los consumidores obtienen undefined silenciosamente
const UserV2 = z.object({
  name: z.string(),
  email: z.email(),
  nickname: z.string(),
  // role ya no existe — los consumidores que llaman a user.role obtienen undefined
})
```

#### Correcto

```typescript
// v2 — sin breaking change: mantener role, agregar displayName como opcional, deprecar nickname
const UserV2 = z.object({
  name: z.string(),
  email: z.email(),
  role: z.enum(["admin", "user"]),         // se mantiene — no se elimina
  nickname: z.string(),                     // se mantiene — deprecar en la documentación, eliminar en v3
  displayName: z.string().optional(),       // nuevo — opcional para que los payloads antiguos se sigan parseando
})

type UserV2 = z.infer<typeof UserV2>
```

#### Tabla de decisión: cambios en el schema

| Cambio | ¿Breaking? | Enfoque seguro |
|--------|-----------|---------------|
| Agregar un campo opcional | No | `.optional()` — los datos antiguos se siguen parseando |
| Agregar un campo obligatorio | **Sí** | Hacerlo opcional primero, exigirlo en la siguiente major |
| Eliminar un campo | **Sí** | Deprecarlo primero, eliminarlo en la siguiente major |
| Endurecer una restricción (p. ej., min 1 → min 5) | **Sí** | Los datos que antes eran válidos ahora fallan |
| Relajar una restricción (p. ej., min 5 → min 1) | No | Todos los datos existentes siguen siendo válidos |
| Renombrar un campo | **Sí** | Agregar el nombre nuevo como opcional, mantener el antiguo, migrar |
| Cambiar el tipo (p. ej., string → number) | **Sí** | Un campo nuevo con un nombre nuevo, deprecar el antiguo |
| Agregar un miembro a una unión | No | Los datos existentes siguen coincidiendo |
| Eliminar un miembro de una unión | **Sí** | Los datos existentes con ese valor fallan |

#### Por qué

Los schemas de Zod son contratos en runtime. Cambiarlos tiene el mismo impacto que cambiar una API — los consumidores que dependen de la forma se romperán. Los cambios aditivos (campos opcionales nuevos, restricciones relajadas, miembros nuevos en las uniones) siempre son seguros. Los cambios sustractivos (eliminar campos, endurecer restricciones) requieren una migración coordinada entre todos los consumidores.

---

## 9. Observabilidad

**Impacto: ALTO/MEDIO**

### Registrar errores estructurados, no el ZodError crudo

`observe-structured-errors` · **ALTO** · Usa z.flattenError() para logs compactos y estructurados con IDs de correlación de la petición. Nunca hagas console.log de un ZodError crudo — es ruidoso, no está estructurado y es imposible de consultar.

#### Problema

Los objetos `ZodError` crudos contienen arrays de issues profundamente anidados con metadata interna. Registrarlos directamente en los logs produce una salida ruidosa y sin estructura que es imposible de filtrar, de usar para alertas o de consultar en las herramientas de agregación de logs (Datadog, Grafana, ELK).

#### Incorrecto

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

#### Correcto

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

#### Por qué

Los logs estructurados con `z.flattenError()` son compactos (nombre del campo → mensajes de error), consultables (búsqueda por nombre de schema o por campo que falla) y correlacionables (el ID de la petición vincula el error con una petición específica). Esto permite dashboards que muestran qué schemas y campos fallan con más frecuencia, alertas sobre picos en las tasas de validación y la depuración de peticiones específicas de los usuarios.

### Hacer seguimiento de las tasas de error de validación por schema y campo

`observe-error-metrics` · **MEDIO** · Envuelve safeParse en un helper con seguimiento que incrementa contadores por schema y por campo cuando falla. Identifica los schemas demasiado estrictos (alta tasa de fallos) y los demasiado laxos (nunca fallan).

#### Problema

Sin métricas sobre los fallos de validación, no tienes visibilidad del comportamiento de los schemas en producción. Los schemas demasiado estrictos rechazan silenciosamente entradas válidas de los usuarios (lo que causa frustración en la UX), mientras que los schemas demasiado laxos que nunca fallan pueden no estar dando ninguna protección real.

#### Incorrecto

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

#### Correcto

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

#### Lo que te dicen las métricas

| Señal | Significado | Acción |
|--------|---------|--------|
| Alta tasa de fallos en un schema | El schema puede ser demasiado estricto | Revisar las restricciones, comprobar si los usuarios envían datos válidos que se rechazan |
| Un campo domina los fallos | Formato de entrada confuso | Mejorar la UX del formulario, agregar coerción, aclarar la documentación |
| El schema nunca falla | El schema puede ser demasiado laxo | Revisar si realmente está validando algo significativo |
| Pico de fallos tras un deploy | Un cambio en el schema rompió a los clientes | Revertir o hacer que el cambio sea aditivo |

#### Por qué

Las métricas de validación cierran el ciclo de retroalimentación entre el diseño de los schemas y el uso en el mundo real. Sin ellas, estás adivinando si los schemas ayudan o perjudican. Hacer seguimiento de las tasas de fallo por schema y por campo convierte a Zod de un guardián silencioso en un componente observable del sistema.

---

## Referencias

Las referencias no se expanden aquí. Léelas desde la carpeta de la skill:

- `references/anti-patterns.md`
- `references/cambios-de-comportamiento.md`
- `references/arquitectura-de-limites.md`
- `references/codecs.md`
- `references/compilacion.md`
- `references/manejo-de-errores.md`
- `references/linter-y-ci.md`
- `references/metadata-y-json-schema.md`
- `references/objetos-y-composicion.md`
- `references/parseo-e-inferencia.md`
- `references/refinamientos-y-transformaciones.md`
- `references/tipos-de-schema.md`
- `references/anti-patterns-de-testing.md`
- `references/api-de-testing.md`
- `references/testing.md`
