import {
  MIN_LENGTH_PASSWORD,
  SECURE_PASSWORD_ERROR_MESSAGE,
} from '@/app/features/auth/data-types/constants/auth.const';
import CONST_REGEX from '@/shared/data-types/constants/regex.const';
import * as z from 'zod';

const CONTAIN_MINIMUM = `debe contener mínimo ${MIN_LENGTH_PASSWORD} caracteres`;

const isStrongPassword = (password: string): boolean =>
  CONST_REGEX.text.strongPassword.test(password);

export const registerSchema = z
  .object({
    nameUser: z
      .string({ error: 'Nombre completo es obligatorio' })
      .min(1, 'Nombre completo es obligatorio')
      .pipe(z.string().min(3, 'Nombre completo es de mínimo 3 caracteres'))
      .pipe(z.string().regex(CONST_REGEX.text.any, 'Nombre completo solo debe contener letras')),

    email: z
      .string({ error: 'Correo es obligatorio' })
      .min(1, 'Correo es obligatorio')
      .pipe(z.string().min(3, 'Correo es de mínimo 3 caracteres'))
      .pipe(z.email('Correo invalido')),

    password: z.string('Contraseña no es un texto'),

    confirmPassword: z.string('Confirmar contraseña no es un texto'),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (trimmedPassword === '') {
      ctx.addIssue({ code: 'custom', message: 'Digite contraseña', path: ['password'] });
      return;
    }

    if (trimmedPassword.length < MIN_LENGTH_PASSWORD) {
      ctx.addIssue({
        code: 'custom',
        message: `Contraseña ${CONTAIN_MINIMUM}`,
        path: ['password'],
      });
      return;
    }

    if (!isStrongPassword(trimmedPassword)) {
      ctx.addIssue({
        code: 'custom',
        message: `Contraseña no es segura, ${SECURE_PASSWORD_ERROR_MESSAGE}`,
        path: ['password'],
      });
      return;
    }

    if (trimmedConfirmPassword === '') {
      ctx.addIssue({
        code: 'custom',
        message: 'Digite confirmar contraseña',
        path: ['confirmPassword'],
      });
      return;
    }

    if (trimmedConfirmPassword.length < MIN_LENGTH_PASSWORD) {
      ctx.addIssue({
        code: 'custom',
        message: `Confirmar contraseña ${CONTAIN_MINIMUM}`,
        path: ['confirmPassword'],
      });
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
      });
      return;
    }

    if (!isStrongPassword(trimmedConfirmPassword)) {
      ctx.addIssue({
        code: 'custom',
        message: `Confirmar contraseña no es segura, ${SECURE_PASSWORD_ERROR_MESSAGE}`,
        path: ['confirmPassword'],
      });
    }
  });

export type IRegisterForm = z.input<typeof registerSchema>;
