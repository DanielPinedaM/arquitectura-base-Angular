import { IEnvironment } from '@/environments/data-types/interfaces/environment.interface';

/** variables de PRUEBAS */
export const environment: IEnvironment = {
  NODE_ENV: 'test',
  api: 'https://aqui escribir dominio de PRUEBAS/api/v1/',

  auth: {
    user: 'aqui escribir usuario quemado en login en PRUEBAS',
    password: 'aqui escribir contraseña quemada en login en PRUEBAS',
  },
};
