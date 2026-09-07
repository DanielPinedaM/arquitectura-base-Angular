import { ForbiddenErrorHandlerService } from '@/shared/http-client/response/error-handling/services/handlers/forbidden-error.handler.service';
import { NotFoundErrorHandlerService } from '@/shared/http-client/response/error-handling/services/handlers/not-found-error.handler.service';
import { ServerErrorHandlerService } from '@/shared/http-client/response/error-handling/services/handlers/server-error.handler.service';
import { TooManyRequestsErrorHandlerService } from '@/shared/http-client/response/error-handling/services/handlers/too-many-requests-error.handler.service';
import { UnauthenticatedErrorHandlerService } from '@/shared/http-client/response/error-handling/services/handlers/unauthenticated-error.handler.service';
import { inject, Service } from '@angular/core';

/**
 * orquestador de errores HTTP globales (401/403/404/429/5xx),
 * NO contiene lógica de negocio de features.
 * Según el status recibido, delega en el handler correspondiente. */
@Service()
export class GlobalErrorHandlerService {
  private readonly unauthenticated = inject(UnauthenticatedErrorHandlerService);
  private readonly forbidden = inject(ForbiddenErrorHandlerService);
  private readonly notFound = inject(NotFoundErrorHandlerService);
  private readonly tooManyRequests = inject(TooManyRequestsErrorHandlerService);
  private readonly serverError = inject(ServerErrorHandlerService);

  /**
   * delega el manejo del error al handler que corresponda al status.
   * Si no hay status (0/undefined/null) no realiza ninguna acción. */
  handle(status: number, url: string): void {
    if (!status) return;

    this.resolveHandler(status)(url);
  }

  /**
   * decide qué handler ejecutar según el status usando un objeto INmutable (reemplaza el if-else).
   * Cualquier status >= 500 se normaliza al bucket 500 (errores de servidor).
   * Si el status no está mapeado, devuelve un noop (no hace nada) */
  private resolveHandler(status: number): (url: string) => void {
    const noop = (): void => {};

    /** objeto: status HTTP -> handler que lo resuelve */
    const HANDLER_BY_STATUS: Record<number, (url: string) => void> = {
      401: (url: string) => this.unauthenticated.handle(url),
      403: (url: string) => this.forbidden.handle(url),
      404: (url: string) => this.notFound.handle(url),
      429: (url: string) => this.tooManyRequests.handle(url),
      500: (url: string) => this.serverError.handle(status, url),
    };

    /** normaliza cualquier status >= 500 al bucket 500 (errores de servidor) */
    const key: number = status >= 500 ? 500 : status;

    return HANDLER_BY_STATUS[key] ?? noop;
  }
}
