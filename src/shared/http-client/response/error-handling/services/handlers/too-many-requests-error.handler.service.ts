import { HttpLogService } from '@/shared/http-client/services/http-log.service';
import ToastService from '@/shared/services/Toast.service';
import { inject, Service } from '@angular/core';

const TOAST_MESSAGE = 'Estás realizando esta acción muy seguido. Espera unos segundos e intenta de nuevo';

/**
 * maneja el status 429 (too many requests): el usuario ha excedido el límite de peticiones HTTP.
 * Loguea en consola y notifica que debe esperar antes de reintentar. */
@Service()
export class TooManyRequestsErrorHandlerService {
  private readonly toast = inject(ToastService);
  private readonly log = inject(HttpLogService);

  /**
   * ejecuta las acciones globales para el status 429 */
  handle(url: string): void {
    this.log.errorHandlerLogs({
      fileName: 'too-many-requests-error.handler.service.ts',
      status: 429,
      detail: 'El usuario ha superado el límite de peticiones HTTP permitidas en un periodo de tiempo',
      action: `Mostrar toast '${TOAST_MESSAGE}'`,
      url,
    });

    this.toast.warning(TOAST_MESSAGE);
  }
}
