import * as z from 'zod';

const loginSchemaWithoutValidations = z.object({
  email: z.string({ error: 'Correo es obligatorio' }),
  password: z.string({ error: 'Contraseña es obligatoria' }),
});

const loginSchemaWithValidations = z.object({
  email: z
    .string({ error: 'Correo es obligatorio' })
    .min(1, 'Correo es obligatorio')
    .pipe(z.email('Correo invalido')),

  password: z.string({ error: 'Contraseña es obligatoria' }).min(1, 'Contraseña es obligatoria'),
});

export type ILoginForm = z.input<typeof loginSchemaWithoutValidations>;

export const loginSchema = (hasBurnedCredentials: boolean) =>
  hasBurnedCredentials ? loginSchemaWithoutValidations : loginSchemaWithValidations;
