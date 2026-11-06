---
title: Parsear un string JSON con un codec, no con z.json()
impact: ALTO
description: z.json() verifica un valor que ya está parseado y no parsea un string; decodifica el texto JSON con un codec que reporte el JSON inválido como un issue.
tags: json, codec, parseo, body-de-la-petición
---

# Parsear un string JSON con un codec, no con z.json()

## Problema

`z.json()` verifica que un valor se pueda codificar como JSON. Un string se puede, así que `z.json().parse('{"name":"Ada"}')` devuelve el mismo string. El código que le pasa texto JSON a `z.json()` obtiene un string donde espera un objeto. `JSON.parse()` dentro de `.transform()` no es mejor: con un texto inválido lanza un `SyntaxError`, y el error escapa de `safeParse()`.

## Incorrecto

```typescript
const Body = z.object({ name: z.string() })

// BUG: el resultado es el string '{"name":"Ada"}', no un objeto
const notParsed = z.json().parse('{"name":"Ada"}')

// BUG: con "{bad", JSON.parse lanza una excepción fuera de safeParse() en lugar de devolver success: false
const FromText = z.string().transform((s) => JSON.parse(s)).pipe(Body)
```

## Correcto

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

## Por qué

Usa `z.json()` para un valor que ya está parseado, como una columna JSON o un campo tipado como JSON arbitrario. Para texto JSON, el codec convierte el texto inválido en un issue, valida el resultado con tu schema y vuelve a codificar el valor. Zod no exporta el codec; es una receta de zod.dev/codecs. Consulta `referencias/codecs.md` para ver las otras recetas.
