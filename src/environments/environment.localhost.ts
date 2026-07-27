import { IEnvironment } from '@/environments/data-types/interfaces/environment.interface';

/** variables de DESARROLLO (LOCAL HOST) */
export const environment: IEnvironment = {
  NODE_ENV: 'localhost',
  api: 'http://localhost:3000/api/v1/',

  auth: {
    user: 'aqui escribir usuario quemado en login en LOCAL HOST',
    password: 'aqui escribir contraseña quemada en login en LOCAL HOST',
  },
};
