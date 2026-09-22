import * as z from 'zod';

export const recoverPasswordSchema = z.object({
  email: z
    .string({ error: 'Correo es obligatorio' })
    .min(1, 'Correo es obligatorio')
    .pipe(z.string().min(3, 'Correo es de mínimo 3 caracteres'))
    .pipe(z.email('Correo invalido')),
});

export type IRecoverPasswordForm = z.input<typeof recoverPasswordSchema>;
