# Arquitectura de límites — dónde encaja Zod

Verificado con Zod 4.6.7, Express 5, tRPC 11, React Hook Form 7 con @hookform/resolvers 7 y @t3-oss/env-nextjs 0.13.

## Visión general

Zod pertenece a los **límites del sistema** — los puntos donde tu aplicación recibe datos que no controla. Parsea una sola vez en el límite y luego pasa los datos tipados hacia adentro. La lógica de dominio nunca debería ver `unknown`.

## Express / Fastify — handler de la ruta vs middleware

### En el handler de la ruta (recomendado en la mayoría de los casos)

```typescript
const CreateUserSchema = z.object({ name: z.string().min(1), email: z.email() })
type CreateUser = z.infer<typeof CreateUserSchema>

async function createUser(input: CreateUser) {
  return { id: crypto.randomUUID(), ...input }
}

app.post("/api/users", async (req, res) => {
  const result = CreateUserSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({
      errors: z.flattenError(result.error).fieldErrors,
    })
  }
  const user = await createUser(result.data)
  res.status(201).json(user)
})
```

### Como middleware (para lógica de validación compartida)

```typescript
import type * as express from "express"

function validate<T extends z.ZodType>(schema: T) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({
        errors: z.flattenError(result.error).fieldErrors,
      })
    }
    req.body = result.data // tipado a partir de aquí
    next()
  }
}

app.post("/api/users", validate(CreateUserSchema), async (req, res) => {
  // req.body está validado, pero Express todavía lo tipa como any
  const user = await createUser(req.body)
  res.status(201).json(user)
})
```

### Cuándo usar cada uno

| Enfoque | Úsalo cuando |
|----------|----------|
| Handler de la ruta | El schema es específico de una ruta, se necesitan respuestas de error personalizadas |
| Middleware | El mismo schema/formato de error en muchas rutas; el handler pierde el tipo inferido |

## tRPC — parseo con `.input()`

tRPC se encarga del parseo en el límite por ti mediante `.input()`:

```typescript
import { initTRPC } from "@trpc/server"

const t = initTRPC.create()
const router = t.router
const publicProcedure = t.procedure

async function getUser(id: string) {
  return { id, name: "Ada", email: "ada@example.com" }
}

export const userRouter = router({
  create: publicProcedure
    .input(CreateUserSchema) // tRPC llama a safeParse internamente
    .mutation(async ({ input }) => {
      // input está completamente tipado — z.infer<typeof CreateUserSchema>
      return createUser(input)
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return getUser(input.id)
    }),
})
```

No llamas a `safeParse()` tú mismo. tRPC acepta cualquier Standard Schema, incluidos los schemas de Zod 4, y responde a una entrada inválida con un error `BAD_REQUEST`.

## Server Actions de Next.js

```typescript
"use server"
import { revalidatePath } from "next/cache"

const CreatePostSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(10),
})

export async function createPost(formData: FormData) {
  // Parsear al inicio de la action
  const result = CreatePostSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
  })

  if (!result.success) {
    return { errors: z.flattenError(result.error).fieldErrors }
  }

  // Tipado a partir de aquí
  await db.posts.create({ data: result.data })
  revalidatePath("/posts")
}
```

### Route Handlers de Next.js

```typescript
export async function POST(request: Request) {
  // request.json() rechaza un body que no es JSON; capturarlo y responder con 400 en código de producción
  const body = await request.json()
  const result = CreateUserSchema.safeParse(body)

  if (!result.success) {
    return Response.json(
      { errors: z.flattenError(result.error).fieldErrors },
      { status: 400 }
    )
  }

  const user = await createUser(result.data)
  return Response.json(user, { status: 201 })
}
```

## React Hook Form — zodResolver

La librería de formularios se encarga del límite:

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const ProfileSchema = z.object({
  name: z.string().min(1),
  bio: z.string().max(500).optional(),
})

type ProfileForm = z.infer<typeof ProfileSchema>

declare function updateProfile(profile: ProfileForm): Promise<void>

function ProfileEditor() {
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(ProfileSchema),
  })

  const onSubmit = (data: ProfileForm) => {
    // data ya está validado — no se necesita safeParse
    updateProfile(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} />
      {errors.name && <span>{errors.name.message}</span>}
    </form>
  )
}
```

## Variables de entorno — parseo al arrancar

Parsea las variables de entorno una sola vez al arrancar la aplicación. Falla rápido si el entorno está mal configurado.

### Enfoque manual

```typescript
// config/env.ts — se parsea en el momento del import
const EnvSchema = z.object({
  DATABASE_URL: z.url(),
  API_KEY: z.string().min(1),
  PORT: z.coerce.number().pipe(z.int().min(1).max(65535)).default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
})

export const env = EnvSchema.parse(process.env)
// La app se cae al arrancar si el env es inválido — esto es intencional
```

### Con t3-env

```typescript
import { createEnv } from "@t3-oss/env-nextjs"

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    API_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.url(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    API_KEY: process.env.API_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
})
```

## Respuestas de APIs externas

Valida siempre los datos que vienen de servicios externos — sus schemas pueden cambiar sin previo aviso.

```typescript
class ExternalServiceError extends Error {}

const WeatherResponse = z.object({
  temperature: z.number(),
  humidity: z.number().min(0).max(100),
  conditions: z.string(),
})

async function getWeather(city: string) {
  const res = await fetch(`https://api.weather.example/v1/${city}`)
  const json = await res.json()

  // Parsear en el límite — no confiar en los datos externos
  const result = WeatherResponse.safeParse(json)
  if (!result.success) {
    logger.warn("weather_api_schema_mismatch", {
      schema: "WeatherResponse",
      fieldErrors: z.flattenError(result.error).fieldErrors,
    })
    throw new ExternalServiceError("Weather API returned unexpected shape")
  }

  return result.data // Weather tipado
}
```

## Capa de base de datos

Parsea los resultados de la BD cuando el schema podría desviarse de la forma real de la BD (p. ej., después de migraciones, con ORMs sin tipos o con SQL crudo).

```typescript
const UserRow = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  created_at: z.coerce.date(),
})

async function getUserById(id: string) {
  const row = await db.query("SELECT * FROM users WHERE id = $1", [id])
  // Validar si se usa SQL crudo o un ORM sin tipos
  return UserRow.parse(row)
}
```

Si usas un ORM completamente tipado como Prisma o Drizzle, que genera los tipos a partir de tu schema, el parseo adicional con Zod de los resultados de la BD suele ser innecesario.

## Resumen: checklist de la capa de límite

| Límite | Quién parsea | Ubicación del schema |
|----------|------------|-----------------|
| Ruta de Express/Fastify | Tu middleware o handler | `api/[resource]/schemas.ts` |
| Procedure de tRPC | tRPC mediante `.input()` | Inline o coubicado |
| Server Action de Next.js | Al inicio de la función de la action | Junto a la action |
| React Hook Form | zodResolver | `features/[name]/form-schema.ts` |
| Variables de entorno | Al arrancar (parse, no safeParse) | `config/env.ts` |
| Respuesta de una API externa | Después del fetch, antes de usarla | Junto al cliente de la API |
| Resultados de la base de datos | Después de la consulta (si no está tipada) | Junto al acceso a datos |
| Cola de mensajes | Al inicio del handler del consumidor | Junto al consumidor |
