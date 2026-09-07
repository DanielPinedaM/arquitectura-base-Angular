import { environment } from '@/environments/environment';
import { HttpInterceptorFn } from '@angular/common/http';

/**
 * endpoints del backend PROPIO a los que NO se les envia la cookie HttpOnly,
 * porque el usuario aun NO ha iniciado sesion y todavia no existe cookie que enviar */
const URLS_WITHOUT_CREDENTIALS: readonly string[] = [
  `${environment.api}login`,
  `${environment.api}register`,
  `${environment.api}recoverPassword`,
  `${environment.api}assignPassword`,
];

/**
 * agrega withCredentials a cada peticion HTTP de forma centralizada, evitando tener que escribir
 * { withCredentials: true } o { withCredentials: false } en cada llamada a la API.
 *
 * La cookie HttpOnly (withCredentials: true) SOLO se envia cuando se cumplen AMBAS condiciones:
 *
 * 1. la URL empieza por environment.api, es decir, el servicio consumido es INTERNO
 *    (backend propio) y NO una API EXTERNA de terceros.
 *
 * 2. la URL NO esta en URLS_WITHOUT_CREDENTIALS.
 *
 * Las APIs EXTERNAS (ej: https://rickandmortyapi.com) NUNCA reciben la cookie porque:
 *
 * a) es un riesgo de seguridad exponer la cookie de sesion a un dominio de terceros, y ellos
 *    tampoco la necesitan: la ignoran o la rechazan.
 *
 * b) el navegador BLOQUEA por CORS toda respuesta con Access-Control-Allow-Origin: * cuando la
 *    peticion viaja con withCredentials: true. Ese bloqueo hace que la peticion nunca reciba
 *    respuesta y termine en status 0, manejado por network-error.handler.service.ts */
export const withCredentialsInterceptor: HttpInterceptorFn = (req, next) => {
  /** ¿el servicio consumido es INTERNO (backend propio)? -> los demas son APIs EXTERNAS de terceros */
  const isInternalApi: boolean = req.url.startsWith(environment.api);

  /** ¿la URL esta en URLS_WITHOUT_CREDENTIALS? -> NO enviar la cookie HttpOnly */
  const isWithoutCredentials: boolean = URLS_WITHOUT_CREDENTIALS.includes(req.url);

  const withCredentials: boolean = isInternalApi && !isWithoutCredentials;

  return next(req.clone({ withCredentials }));
};
