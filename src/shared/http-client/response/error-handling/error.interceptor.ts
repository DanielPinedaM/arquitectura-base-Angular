import {
  API_RESPONSE_KEYS,
  FALLBACK_MESSAGE,
} from '@/shared/http-client/data-types/constants/http-client.const';
import { ApiResponse } from '@/shared/http-client/data-types/interfaces/http-client.interface';
import { GlobalErrorHandlerService } from '@/shared/http-client/response/error-handling/services/global-error-handler.service';
import { ApiResponseNormalizerService } from '@/shared/http-client/services/api-response-normalizer.service';
import { HttpClientHelpersService } from '@/shared/http-client/services/http-client-helpers.service';
import { HttpLogService } from '@/shared/http-client/services/http-log.service';
import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, of } from 'rxjs';

/**
 * normaliza las respuestas HTTP ERRONEAS al contrato ApiResponse<T>, delegando la
 * validacion/normalizacion en ApiResponseNormalizerService, el manejo global de
 * errores (401/403/404/5xx) en GlobalErrorHandlerService y la validacion del
 * http status real en HttpClientHelpersService.getRealHttpStatus.
 * NO contiene logica de negocio de features */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const httpClientHelpers = inject(HttpClientHelpersService);
  const globalErrorHandler = inject(GlobalErrorHandlerService);
  const normalizer = inject(ApiResponseNormalizerService);
  const httpLog = inject(HttpLogService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      /**
       * error.error es any, se pasa a unknown para FORZAR tipado estricto
       * aqui SI hay conversion (any -> unknown), a diferencia de success.interceptor */
      const errorBody: unknown = error.error;

      /** status declarado en el body, SOLO si el backend respondio un objeto literal {} */
      const apiStatus: unknown = httpClientHelpers.isLiteralObject(errorBody)
        ? errorBody?.[API_RESPONSE_KEYS.status]
        : undefined;

      const httpStatus: number = error.status;

      const realStatus: number = httpClientHelpers.getRealHttpStatus(apiStatus, httpStatus);

      /** acciones globales de error (401/403/404/5xx) delegadas al orquestador */
      globalErrorHandler.handle(realStatus, req.url);

      /** acceder al mensaje de error de Angular */
      const errorMessage: string = error?.message ?? FALLBACK_MESSAGE(realStatus);

      /** normalizacion delegada al intermediario (mismo contrato que el success.interceptor) */
      const normalized: ApiResponse<unknown> = normalizer.normalize(
        errorBody,
        realStatus,
        errorMessage,
      );

      httpLog.errorLogs(req, normalized);

      /**
       * esto NO es un bug, es una desicion de arquitectura, intencional para estandarizar respuesta de APIs.
       *
       * El error se "traga", NUNCA se propaga con throw ni llega al consumidor;
       * en su lugar, se emite una respuesta sintetica envuelta en ApiResponse<T> mediante of(...)
       *
       * Esto significa que:
       * 1) Las peticiones HTTP erroneas NUNCA llegaran al bloque catch
       *
       * 2) NO necesitas envolver el consumo de la API en un
       * try/catch y sus equivalentes de Angular/RxJS:
       * `catchError()` de RxJS,
       * el callback `error` de `subscribe({ next, error })`,
       * `.catch()` de Promises con `firstValueFrom()`
       *
       * SOLUCION: validar con response.success cuando la peticion HTTP es exitosa y erronea
       *
       * Ejemplo basico de consumo de API con async/await y firstValueFrom:
       *
       *   import { environment } from '@/environments/environment';
       *
       *   async getTasks(): Promise<void> {
       *     const { success, data } = await firstValueFrom(
       *       this.http.get<ApiResponse<Task[]>>(`${environment.api}tasks`),
       *     );
       *
       *     // success === false -> el interceptor ya notifico el error globalmente
       *     if (!success) return;
       *
       *     // success === true -> usar data con seguridad
       *     this.tasks.set(data);
       *   } */
      return of(
        new HttpResponse({
          body: normalized,
          status: realStatus,
          url: req.url,
        }),
      );
    }),
  );
};
