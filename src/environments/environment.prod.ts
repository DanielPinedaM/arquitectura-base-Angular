import { IEnvironment } from '@/environments/data-types/interfaces/environment.interface';

/** variables de PRODUCCIÓN */
export const environment: IEnvironment = {
  NODE_ENV: 'production',
  api: 'https://aqui escribir dominio de PRODUCCION/api/v1/',

  auth: {
    user: 'aqui escribir usuario quemado en login en PRODUCCION',
    password: 'aqui escribir contraseña quemada en login en PRODUCCION',
  },
};
