# Reglas de linting y CI para Zod

Verificado con Zod 4.6.7, ESLint 10.14.0 con typescript-eslint 8.72.1 y madge 8.0.0. Los comandos de knip y ts-prune no se ejecutaron.

## Visión general

La aplicación mecánica de las reglas detecta errores antes de la revisión de código. Usa reglas de ESLint, checks de CI y herramientas de análisis estático para aplicar automáticamente las buenas prácticas de Zod.

## ESLint: reglas `no-restricted-syntax`

ESLint 10 solo lee el formato flat config, `eslint.config.js`; ya no soporta `.eslintrc`. La siguiente config se ejecutó con ESLint 10.14 y typescript-eslint 8.72: marcó cada llamada prohibida, omitió `JSON.parse()` y `Date.parse()`, y omitió `config/env.ts`.

```js
// eslint.config.js
import { defineConfig } from "eslint/config"
import tseslint from "typescript-eslint"

const zodRules = [
  {
    // parse() lanza excepciones; JSON.parse, Date.parse y URL.parse no son de Zod
    selector: "CallExpression[callee.property.name='parse']:not([callee.object.name=/^(JSON|Date|URL)$/])",
    message: "Use safeParse() instead of parse(). parse() throws on invalid input. See: reglas/parse-use-safeParse.md",
  },
  {
    selector: "Property[key.name='reportInput'][value.value=true]",
    message: "reportInput: true leaks sensitive data. Use: reportInput: process.env.NODE_ENV === 'development'. See: reglas/error-input-security.md",
  },
  {
    selector: "CallExpression[callee.property.name='nativeEnum']",
    message: "z.nativeEnum() is deprecated. Use z.enum(YourTSEnum). See: reglas/migrate-native-enum.md",
  },
  {
    selector: "CallExpression[callee.property.name='email'][callee.object.callee.property.name='string']",
    message: "Use z.email() instead of z.string().email(). See: reglas/migrate-string-formats.md",
  },
]

export default defineConfig([
  {
    files: ["src/**/*.ts"],
    languageOptions: { parser: tseslint.parser },
    rules: { "no-restricted-syntax": ["error", ...zodRules] },
  },
  {
    // fallar al arrancar con un entorno inválido es intencional
    files: ["**/config/env.ts", "**/env.ts"],
    rules: { "no-restricted-syntax": "off" },
  },
])
```

Los selectores coinciden con la sintaxis, no con los tipos. La regla de `parse` también marca `.parse()` de otras librerías, como `path.parse()`; amplía la lista de exclusiones con las que use tu código. Para checks con información de tipos, las APIs deprecadas de Zod llevan tags `@deprecated`, que `@typescript-eslint/no-deprecated` reporta. En la misma ejecución, reportó `z.nativeEnum()` y `z.string().email()` con el propio texto de reemplazo de Zod:

```js
// eslint.config.js: regla con información de tipos; necesita un tsconfig.json
{
  files: ["src/**/*.ts"],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
  },
  plugins: { "@typescript-eslint": tseslint.plugin },
  rules: { "@typescript-eslint/no-deprecated": "error" },
}
```

## CI: regresión de snapshots de schemas

Detecta cambios no intencionados en los schemas haciendo commit de snapshots de JSON Schema y haciendo fallar el CI cuando se desvían.

### Configuración

```typescript
// scripts/export-schemas.ts
import * as z from "zod"
import { writeFileSync, mkdirSync } from "node:fs"
import { UserSchema, OrderSchema } from "../src/api/schemas"

const schemas = {
  User: UserSchema,
  Order: OrderSchema,
}

mkdirSync("snapshots", { recursive: true })

for (const [name, schema] of Object.entries(schemas)) {
  const jsonSchema = z.toJSONSchema(schema)
  writeFileSync(
    `snapshots/${name}.json`,
    JSON.stringify(jsonSchema, null, 2) + "\n"
  )
}
```

### Check de CI

```yaml
# .github/workflows/schema-check.yml
name: Schema Snapshot Check
on: [pull_request]

jobs:
  schema-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx tsx scripts/export-schemas.ts
      - name: Check for schema drift
        run: |
          if git diff --exit-code snapshots/; then
            echo "Schemas unchanged"
          else
            echo "::error::Schema snapshots have changed. Review the diff and update snapshots if intentional."
            git diff snapshots/
            exit 1
          fi
```

### Flujo de trabajo

1. El desarrollador cambia un schema
2. El CI ejecuta `export-schemas.ts` y hace diff contra los snapshots versionados
3. Si hay diff, el CI falla y muestra los cambios exactos
4. El desarrollador revisa el diff, ejecuta `npx tsx scripts/export-schemas.ts` en local y hace commit de los snapshots actualizados

## Detección de schemas sin usar

Encuentra los schemas que están definidos pero que nunca se importan.

### Con knip

```bash
npx knip --include exports
```

knip detecta los exports sin usar, incluidos los schemas. Configúralo en `knip.json`:

```jsonc
{
  "entry": ["src/index.ts"],
  "project": ["src/**/*.ts"],
  "ignore": ["**/*.test.ts", "**/*.spec.ts"]
}
```

### Con ts-prune

```bash
npx ts-prune | grep -i schema
```

Muestra los símbolos exportados que no tienen imports. Revisa y elimina los schemas muertos.

## Detección de dependencias circulares

Los módulos de schemas que se importan entre sí pueden fallar en el momento del import: un schema que lee el export de otro módulo antes de que ese módulo se haya ejecutado lanza un `ReferenceError`. Dentro de un mismo módulo, usa un getter (consulta `schema-recursive-types`).

### Con madge

```bash
# Encontrar dependencias circulares
npx madge --circular --extensions ts src/

# Generar el grafo de dependencias
npx madge --image graph.svg --extensions ts src/
```

### Integración con CI

```yaml
# madge termina con el código 1 cuando encuentra un ciclo, lo que hace fallar el paso
- name: Check circular dependencies
  run: npx madge --circular --extensions ts src/
```

## Mensajes personalizados para las reglas de ESLint

Incluye instrucciones de corrección en los mensajes de ESLint para que los desarrolladores sepan exactamente qué hacer. Agrega la entrada a `zodRules` de arriba:

```js
{
  selector: "CallExpression[callee.property.name='parse']:not([callee.object.name=/^(JSON|Date|URL)$/])",
  message: "Use safeParse() instead of parse().\n\nparse() throws ZodError on invalid input.\nsafeParse() returns { success, data | error }.\n\nReplace:\n  schema.parse(data)\nWith:\n  const result = schema.safeParse(data)\n  if (!result.success) { /* handle error */ }\n\nSee: reglas/parse-use-safeParse.md",
}
```

## Resumen

| Herramienta | Qué detecta | Cuándo |
|------|----------------|------|
| ESLint `no-restricted-syntax` | Uso de APIs prohibidas (parse, reportInput, nativeEnum) | Al guardar / en pre-commit |
| CI de snapshots de schemas | Cambios no intencionados en los schemas | En el pull request |
| knip / ts-prune | Schemas sin usar | En el pull request / periódicamente |
| madge | Dependencias circulares entre schemas | En el pull request |
