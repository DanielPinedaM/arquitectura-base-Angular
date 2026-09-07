import { HttpLogService } from '@/shared/http-client/services/http-log.service';
import ToastService from '@/shared/services/Toast.service';
import { inject, Service } from '@angular/core';

const TOAST_MESSAGE = 'Ha ocurrido un error, intentalo de nuevo mas tarde, estamos trabajando para solucionarlo';

/**
 * maneja los status >= 500 (errores del servidor).
 * Loguea en consola y notifica un error genérico. */
@Service()
export class ServerErrorHandlerService {
  private readonly toast = inject(ToastService);
  private readonly log = inject(HttpLogService);

  /**
   * ejecuta las acciones globales para los status >= 500 */
  handle(url: string): void {
    this.log.errorHandlerLogs({
      fileName: 'server-error.handler.service.ts',
      status: 500,
      detail: `error en el servidor en la URL ${url}`,
      action: `Mostrar toast '${TOAST_MESSAGE}'`,
      url,
    });

    this.toast.error(TOAST_MESSAGE);
  }
}
