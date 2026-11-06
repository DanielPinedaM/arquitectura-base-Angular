---
name: zod-4
description: Buenas prácticas, patrones y guía de la API de Zod v4 para la validación de schemas, el parseo, el manejo de errores y la inferencia de tipos en aplicaciones TypeScript. Cubre safeParse, composición de objetos, refinamientos, transformaciones, codecs, branded types, migración v3→v4 y testing de schemas con Jest o Vitest. Versión base: zod ^4.6.0. Se activa con: imports de zod, z.object, z.string, z.infer, safeParse, menciones de "zod", "validación de schemas", "zod v4", "z enum", o el testing de un schema — "test de schema", "mock de zod", zod-schema-faker.
---

# Zod

**IMPORTANTE:** Tus datos de entrenamiento sobre `zod` pueden estar desactualizados o ser incorrectos — Zod 4 cambia los formatos de string, los enums, la personalización de errores, los códigos de issue, los valores por defecto y las funciones. Apóyate siempre en los archivos de reglas de esta skill y en el código fuente real del proyecto como fuente de verdad. No recurras a patrones memorizados de v3 cuando entren en conflicto con la referencia consultada.

## Cuándo usar Zod

Zod sirve para la **validación de tipos en runtime** — parsear datos no confiables en los límites del sistema (entrada de APIs, datos de formularios, variables de entorno, servicios externos). Para tipos solo en tiempo de compilación, TypeScript puro es suficiente.

| Necesidad | Herramienta recomendada |
|------|-----------------|
| Validación de entrada/salida de APIs | **Zod** |
| Validación de formularios (React, Vue) | **Zod** (con react-hook-form, formik, etc.) |
| Parseo de variables de entorno | **Zod** (con t3-env o manual) |
| Solo tipos en tiempo de compilación | TypeScript puro |
| Presupuesto estricto del bundle del cliente | Zod Mini (`zod/mini`), o Valibot |
| Máxima inferencia de tipos | ArkType |

## Categorías de reglas por prioridad

| Prioridad | Categoría | Impacto | Prefijo |
|----------|----------|--------|--------|
| 1 | Parseo y seguridad de tipos | CRÍTICO | `parse-` |
| 2 | Diseño de schemas | CRÍTICO | `schema-` |
| 3 | Refinamientos y transformaciones | ALTO | `refine-` |
| 4 | Manejo de errores | ALTO | `error-` |
| 5 | Rendimiento y composición | MEDIO | `perf-` |
| 6 | Migración a v4 | MEDIO | `migrate-` |
| 7 | Patrones avanzados | MEDIO | `pattern-` |
| 8 | Arquitectura y límites | CRÍTICO/ALTO | `arch-` |
| 9 | Observabilidad | ALTO/MEDIO | `observe-` |

## Referencia rápida

### 1. Parseo y seguridad de tipos (CRÍTICO)

- `parse-use-safeParse` — Usa `safeParse()` para la entrada del usuario en lugar de `parse()`, que lanza excepciones
- `parse-async-required` — Debes usar `parseAsync()`/`safeParseAsync()` cuando el schema tiene refinamientos asíncronos
- `parse-infer-types` — Usa `z.infer<typeof Schema>` para los tipos de salida; nunca dupliques tipos manualmente
- `parse-validate-boolean` — Usa `.validate()` para un sí o un no; estrecha al tipo de entrada, así que usa `safeParse()` para la salida

### 2. Diseño de schemas (CRÍTICO)

- `schema-object-unknowns` — `z.object()` elimina las claves desconocidas; usa `strictObject` o `looseObject`
- `schema-union-discriminated` — Usa `z.discriminatedUnion()` para las uniones etiquetadas, no `z.union()`
- `schema-coercion-pitfalls` — `z.coerce.boolean()` convierte `"false"` → `true`; usa `z.stringbool()`
- `schema-recursive-types` — Usa un getter para los schemas recursivos; la entrada cíclica se parsea desde 4.5
- `schema-json-string` — `z.json()` no parsea un string; decodifica el texto JSON con un codec

### 3. Refinamientos y transformaciones (ALTO)

- `refine-never-throw` — Nunca lances excepciones dentro de `.refine()` o `.transform()`; devuelve false, o agrega issues mediante `ctx`
- `refine-vs-transform` — `.refine()` para la validación, `.transform()` para la conversión, `.pipe()` para las etapas
- `refine-cross-field` — Refina el objeto padre y establece `path`; `.superRefine()` para varios issues

### 4. Manejo de errores (ALTO)

- `error-custom-messages` — Usa el parámetro `error`; `required_error`/`invalid_type_error` ya no existen, `message` está deprecado
- `error-formatting` — `z.flattenError()` para formularios, `z.treeifyError()` para datos anidados; `formatError` deprecado
- `error-input-security` — Nunca uses `reportInput: true` en producción; filtra datos sensibles

### 5. Rendimiento y composición (MEDIO)

- `perf-extend-spread` — Usa el spread `{ ...Schema.shape }` en lugar de `.extend()` encadenados para schemas grandes
- `perf-reuse-schemas` — Define una vez, deriva con `.pick()`, `.omit()`, `.partial()`
- `perf-zod-mini` — Usa Zod Mini (`zod/mini`) solo con un presupuesto estricto del bundle del cliente; carga un locale
- `perf-compile` — Compila el schema final con `z.compile()`; demuestra que se compiló con `strict: true` en un test

### 6. Migración a v4 (MEDIO)

- `migrate-string-formats` — Usa `z.email()`, `z.uuid()`, `z.url()`, no `z.string().email()`
- `migrate-native-enum` — Usa el `z.enum()` unificado para los enums de TS; `z.nativeEnum()` está deprecado
- `migrate-error-api` — Usa el parámetro `error`; `errorMap` ya no existe y `message` está deprecado

### 7. Patrones avanzados (MEDIO)

- `pattern-branded-types` — `.brand<"Name">()` para el tipado nominal (USD vs EUR)
- `pattern-codecs` — `z.codec()` para transformaciones bidireccionales (parsear + serializar)
- `pattern-pipe` — `.pipe()` para el parseo por etapas (string → number → validar el rango)

### 8. Arquitectura y límites (CRÍTICO/ALTO)

- `arch-boundary-parsing` — Parsea en los límites del sistema (handler de API, env, formulario, fetch); pasa datos tipados a la lógica de dominio
- `arch-schema-organization` — Ubica los schemas junto a su capa de límite; los tipos de dominio usan `z.infer`
- `arch-schema-versioning` — Solo cambios aditivos para una evolución sin breaking changes; los campos nuevos usan `.optional()`

### 9. Observabilidad (ALTO/MEDIO)

- `observe-structured-errors` — Usa `z.flattenError()` para logs estructurados compactos con IDs de correlación de la petición
- `observe-error-metrics` — Wrapper `trackedSafeParse()` para incrementar contadores por schema y por campo cuando falla

## Referencia rápida de tipos de schema

| Tipo | Sintaxis |
|------|--------|
| String | `z.string()` |
| Number | `z.number()`, `z.int()`, `z.float32()`, `z.float64()` |
| Boolean | `z.boolean()` |
| BigInt | `z.bigint()` |
| Date | `z.date()` |
| Undefined | `z.undefined()` |
| Null | `z.null()` |
| Void | `z.void()` |
| Any | `z.any()` |
| Unknown | `z.unknown()` |
| Never | `z.never()` |
| Literal | `z.literal("foo")`, `z.literal(42)` |
| Enum | `z.enum(["a", "b"])`, `z.enum(TSEnum)` |
| Email | `z.email()` |
| URL | `z.url()` |
| UUID | `z.uuid()` |
| String→Bool | `z.stringbool()` |
| DateTime ISO | `z.iso.datetime()` |
| File | `z.file()` |
| Valor JSON | `z.json()` (valida un valor; no parsea un string) |
| Array | `z.array(schema)` |
| Tupla | `z.tuple([a, b])` |
| Objeto | `z.object({})` |
| Objeto estricto | `z.strictObject({})` |
| Objeto laxo | `z.looseObject({})` |
| Record | `z.record(keySchema, valueSchema)` |
| Map | `z.map(keySchema, valueSchema)` |
| Set | `z.set(schema)` |
| Unión | `z.union([a, b])` |
| Unión disc. | `z.discriminatedUnion("key", [...])` |
| Intersección | `z.intersection(a, b)` |

## Cómo usar

Lee los archivos de reglas individuales para ver explicaciones detalladas y ejemplos de código:

```text
reglas/parse-use-safeParse.md
reglas/schema-object-unknowns.md
```

Cada archivo de reglas contiene:

- Breve explicación de por qué importa
- Ejemplo de código incorrecto con su explicación
- Ejemplo de código correcto con su explicación
- Contexto adicional y tablas de decisión

## Referencias

| Prioridad | Referencia | Cuándo leerla |
|----------|-----------|-------------|
| 1 | `referencias/tipos-de-schema.md` | Primitivos, formatos de string, números, enums, fechas, funciones, branded types |
| 2 | `referencias/parseo-e-inferencia.md` | parse, safeParse, validate, z.infer, coerción, Standard Schema |
| 3 | `referencias/objetos-y-composicion.md` | Objetos, claves opcionales, arrays, uniones, pick/omit/partial, recursivos, propiedades |
| 4 | `referencias/refinamientos-y-transformaciones.md` | refine, superRefine, transform, pipe, valores por defecto |
| 5 | `referencias/manejo-de-errores.md` | ZodError, flattenError, treeifyError, personalización de errores |
| 6 | `referencias/breaking-changes-de-zod-4.md` | Lo que se parsea de forma distinta en 4.0, 4.4, 4.5 y 4.6; léelo antes de una actualización |
| 7 | `referencias/codecs.md` | z.codec, decode y encode, qué se ejecuta en cada dirección, recetas para copiar |
| 8 | `referencias/metadata-y-json-schema.md` | Registries, .meta(), opciones de z.toJSONSchema, z.fromJSONSchema |
| 9 | `referencias/compilacion.md` | z.compile, zod/compile, lo que no se compila, z.withParser, costo en el bundle |
| 10 | `referencias/anti-patterns.md` | Errores comunes con ejemplos MAL/BIEN |
| 11 | `referencias/arquitectura-de-limites.md` | Dónde encaja Zod: Express, tRPC, Next.js, React Hook Form, env, APIs externas |
| 12 | `referencias/linter-y-ci.md` | Reglas de ESLint, snapshots de schemas en CI, detección de schemas sin usar, deps circulares |
| 13 | `referencias/testing.md` | Testing de schemas: safeParse en los tests, valores límite, aserciones de errores, datos mock, property-based testing |
| 14 | `referencias/api-de-testing.md` | Referencia de la API de Jest y Vitest para tests de schemas |
| 15 | `referencias/anti-patterns-de-testing.md` | Errores de testing con ejemplos MAL/BIEN |
