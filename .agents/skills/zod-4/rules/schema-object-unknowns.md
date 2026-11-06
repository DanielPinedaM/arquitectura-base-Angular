---
title: Manejar las claves desconocidas de forma explícita
impact: CRÍTICO
description: Por defecto, z.object() elimina las claves desconocidas. Usa strictObject o looseObject para un comportamiento explícito.
tags: object, claves-desconocidas, strict, passthrough
---

# Manejar las claves desconocidas de forma explícita

## Problema

`z.object()` elimina silenciosamente cualquier clave que no esté definida en el schema. Esto puede causar pérdida de datos al reenviar payloads, al almacenar metadata extra o al hacer proxy de las respuestas de una API.

## Incorrecto

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

## Correcto

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

## Por qué

| Variante | Claves desconocidas | Úsalo cuando |
|---------|-------------|----------|
| `z.object()` | Las elimina | Sanitizas la entrada del usuario, solo quieres los campos conocidos |
| `z.strictObject()` | Las rechaza (error) | Contratos de API, validación de configuración — sin sorpresas |
| `z.looseObject()` | Las conserva | Hacer proxy de datos, reenviar payloads, middleware |
