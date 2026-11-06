# Referencia de parseo e inferencia de tipos

Documentación: zod.dev/basics, zod.dev/api · Zod 4.6.7

## Métodos de parseo

### parse(data)

Parsea la entrada y devuelve los datos validados. Lanza `ZodError` cuando falla.

```typescript
const UserSchema = z.object({ name: z.string(), email: z.email() })

const result = UserSchema.parse(data) // devuelve el valor parseado o lanza una excepción
```

Úsalo cuando los datos inválidos sean verdaderamente excepcionales (configuración interna, constantes).

### safeParse(data)

Devuelve una unión discriminada — nunca lanza excepciones.

```typescript
const result = UserSchema.safeParse(data)
if (result.success) {
  result.data // { name: string; email: string }
} else {
  result.error // ZodError
}
```

Preferido para toda la entrada del usuario, los límites de API, los datos de formularios.

### parseAsync(data)

Obligatorio cuando el schema contiene refinamientos o transformaciones asíncronos. Lanza una excepción cuando falla.

```typescript
const result = await UserSchema.parseAsync(data)
```

### safeParseAsync(data)

Versión asíncrona de safeParse. Obligatorio para refinamientos/transformaciones asíncronos.

```typescript
const result = await UserSchema.safeParseAsync(data)
if (result.success) {
  result.data
} else {
  result.error
}
```

### validate(data)

Zod 4.6. Devuelve un booleano y no construye ningún error. Se detiene en el primer fallo y estrecha `data` al tipo de entrada del schema. La página basics de zod.dev lo mide como hasta 16x más rápido que `.safeParse().success` con una entrada inválida. Zod Mini usa la forma de nivel superior, `z.validate(schema, data)`.

```typescript
if (UserSchema.validate(data)) {
  data.email // tipado
}
```

Usa `.validateAsync()` para refinamientos y transformaciones asíncronos.

### Cuándo usar cada uno

| Método | Lanza | Asíncrono | Úsalo cuando |
|--------|--------|-------|----------|
| `parse()` | Sí | No | Datos internos, config — inválido = bug |
| `safeParse()` | No | No | Entrada del usuario, API — inválido = esperado |
| `parseAsync()` | Sí | Sí | Refinamientos asíncronos, datos internos |
| `safeParseAsync()` | No | Sí | Refinamientos asíncronos, entrada del usuario |
| `validate()` | No | No | Solo se necesita un sí o un no; entrada grande no confiable |
| `validateAsync()` | No | Sí | Lo mismo, con refinamientos asíncronos |
| `decode()` / `encode()` | Sí | No | Codecs: entrada tipada, ambas direcciones (también existen `safeDecode`, `decodeAsync`, etc.) |

`.safeParse()` reporta todos los issues, así que su trabajo crece con la entrada: un millón de elementos de array inválidos producen un millón de issues. Acota esa entrada con `.max()` o con un límite de tamaño del body, o usa `.validate()`.

## Inferencia de tipos

### z.infer<typeof Schema>

Extrae el tipo de **salida** (después de las transformaciones).

```typescript
const UserSchema = z.object({
  name: z.string(),
  createdAt: z.string().transform((s) => new Date(s)),
})

type User = z.infer<typeof UserSchema>
// { name: string; createdAt: Date }
```

### z.input<typeof Schema>

Extrae el tipo de **entrada** (antes de las transformaciones).

```typescript
type UserInput = z.input<typeof UserSchema>
// { name: string; createdAt: string }
```

Útil para el estado de los formularios, los bodies de las peticiones o cualquier contexto donde trabajes con datos previos a la transformación.

### z.output<typeof Schema>

Alias de `z.infer`. Extrae el tipo de salida.

```typescript
type User = z.output<typeof UserSchema>
// Igual que z.infer<typeof UserSchema>
```

### Ejemplos de entrada vs salida

```typescript
const FormSchema = z.object({
  age: z.string().pipe(z.coerce.number()),        // string → number
  active: z.stringbool(),                          // string → boolean
  date: z.string().transform((s) => new Date(s)), // string → Date
})

type FormInput = z.input<typeof FormSchema>
// { age: string; active: string; date: string }

type FormOutput = z.infer<typeof FormSchema>
// { age: number; active: boolean; date: Date }
```

## Namespace de coerción

Los schemas de coerción aplican constructores de JavaScript antes de la validación. Su tipo de entrada es `unknown`; estréchalo con un argumento de tipo, p. ej. `z.coerce.number<string>()`.

```typescript
z.coerce.string()   // String(input) → luego valida como string
z.coerce.number()   // Number(input) → luego valida como number
z.coerce.boolean()  // Boolean(input) → luego valida como boolean
z.coerce.bigint()   // BigInt(input) → luego valida como bigint
z.coerce.date()     // new Date(input) → luego valida como date
```

### Trampa de la coerción: Boolean

```typescript
z.coerce.boolean().parse("false") // true — Boolean("false") es true
z.coerce.boolean().parse("")      // false — Boolean("") es false
z.coerce.boolean().parse("0")     // true — Boolean("0") es true

// Usar z.stringbool() para string→boolean desde formularios/variables de entorno
z.stringbool().parse("false") // false
z.stringbool().parse("0")     // false
```

## Opciones de parseo

```typescript
const schema = z.object({ password: z.string().min(12) })

// reportInput — incluye la entrada cruda en los issues de error
schema.safeParse(data, { reportInput: true })
// error.issues[0].input contendrá el valor crudo

// Usar solo en desarrollo — filtra datos sensibles en producción
schema.safeParse(data, {
  reportInput: process.env.NODE_ENV === "development",
})
```

## Standard Schema

Los schemas de Zod implementan Standard Schema, así que una librería que acepta un `StandardSchemaV1` acepta un schema de Zod sin un adaptador.

```typescript
import type { StandardSchemaV1 } from "@standard-schema/spec"

function check(schema: StandardSchemaV1, value: unknown) {
  return schema["~standard"].validate(value)
}

check(z.object({ name: z.string() }), { name: "Ada" })
```
