# Referencia de compilación

Documentación: zod.dev/compile, zod.dev/blog/zod-4-5, zod.dev/blog/zod-4-6 · Zod 4.6.7

`z.compile()` convierte un schema en JavaScript plano que verifica rápido la entrada válida. El schema compilado devuelve los mismos datos, los mismos issues y los mismos mensajes que el original. Tiene los mismos métodos y tipos inferidos. Se agregó en Zod 4.5.

## `z.compile(schema)`

`z.compile()` devuelve una copia compilada y no cambia el original.

```typescript
const Player = z.object({ username: z.string(), bio: z.string(), xp: z.number() })
const CompiledPlayer = z.compile(Player)

CompiledPlayer.parse({ username: "a", bio: "b", xp: 1 }) // el mismo resultado que Player.parse()
```

Un método que deriva un schema (`.refine()`, `.extend()`, `.optional()`, `.meta()`) devuelve un schema sin compilar. Compila el schema final:

```typescript
const notCompiled = z.compile(z.string()).refine((val) => val.length > 1) // el resultado de .refine() no está compilado
const compiled = z.compile(z.string().refine((val) => val.length > 1))
```

## `import "zod/compile"`

Este import compila todos los schemas que se construyen después de él, la primera vez que el schema parsea. Debe ejecutarse antes de los módulos que definen schemas. Es para aplicaciones, no para librerías.

```sh
node --import zod/compile app.js     # ESM
node --require zod/compile app.cjs   # CommonJS
```

En Bun, agrega `zod/compile` a `preload` en `bunfig.toml`.

## Lo que no se compila

Para estos casos, `z.compile()` devuelve el schema original, sin compilar:

- refinamientos, transformaciones y checks asíncronos
- `z.xor()`
- schemas recursivos
- `z.coerce.*`
- checks con un `when` personalizado
- `.catch()` con una función (`.catch(value)` se compila)

Dentro de un objeto, array, tupla, record o intersección, un hijo no soportado usa el parser estándar y el resto sigue compilado: `z.compile(z.object({ page: z.coerce.number() }))` devuelve un schema compilado. Una función de `.catch()` o cualquier cosa asíncrona en el árbol hace que todo el schema haga fallback (medido en 4.6.7). La documentación dice lo mismo de una unión con un miembro no soportado; en 4.6.7, una unión con un miembro `z.coerce` dentro de un objeto todavía se compila con `strict: true` (medido). La codificación y el parseo asíncrono siempre usan el parser estándar.

Pasa `strict: true` para lanzar una excepción en lugar de hacer fallback. Úsalo en un test para demostrar que un schema de un hot path se compiló:

```typescript
test("the player schema compiles", () => {
  expect(() => z.compile(Player, { strict: true })).not.toThrow()
})
```

Lanza `z.ZodCompileAsyncError` para los schemas asíncronos y `z.ZodCompileUnsupportedError` para el resto. Ambos son subclases de `Error`, no `ZodError`.

## La entrada inválida cuesta lo mismo

El código compilado solo responde "válido o no". Con una entrada inválida, Zod vuelve a ejecutar el parser estándar para construir los issues. Por eso:

- la compilación no hace que los fallos sean más rápidos;
- un refinamiento o una transformación pueden ejecutarse dos veces con una entrada inválida, así que mantenlos libres de efectos secundarios;
- `.validate()` se salta la construcción del error. Cuando solo necesites un booleano, usa `.validate()` en el schema compilado.

## Content Security Policy

La compilación usa `new Function`. Donde una Content Security Policy estricta lo bloquea, el schema queda sin compilar. `z.config({ jitless: true })` desactiva el modo global de `zod/compile`; un `z.compile()` directo todavía lo intenta.

`z.withParser(schema, parser)` (Zod 4.6) instala un parser que generaste en otro lugar, en tiempo de build o con un compilador nativo. El parser devuelve lo que devolvería el schema, o `z.INVALID` para pasarle la entrada al parser estándar, que construye los issues.

```typescript
const isPlayer = (input: unknown): input is { username: string; bio: string; xp: number } =>
  typeof input === "object" && input !== null &&
  typeof (input as { username?: unknown }).username === "string" &&
  typeof (input as { bio?: unknown }).bio === "string" &&
  typeof (input as { xp?: unknown }).xp === "number"

const FastPlayer = z.withParser(Player, (input) =>
  isPlayer(input) ? { username: input.username, bio: input.bio, xp: input.xp } : z.INVALID
)
```

El parser reconstruye el objeto en lugar de devolver `input`, porque `z.object()` elimina las claves desconocidas.

## Tamaño del bundle

El compilador agrega unos 7 KB en gzip (28 KB minificados) a un bundle que llama a `z.compile()` o importa `zod/compile`. Un bundle que no hace ninguna de las dos cosas no paga nada.

| Bundle, schema de objeto de cuatro claves | Sin compilador | Con compilador |
|---|---|---|
| Zod | 24.1 KB | 31.1 KB |
| Zod Mini | 4.6 KB | 13.2 KB |

Para un bundle del cliente, compila solo donde un profiling muestre un hot path.

## Velocidad

La documentación mide cada schema por separado en un bucle cerrado: 1.8x para un objeto de 5 claves, 5.0x para 20 claves, 10.2x para 50 claves, de 2.2x a 3.7x para tuplas. Los objetos y las tuplas son los que más ganan. Mide tus propios schemas antes de decidir.
