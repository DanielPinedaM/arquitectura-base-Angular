import { HttpLogService } from '@/shared/http-client/services/http-log.service';
import ToastService from '@/shared/services/Toast.service';
import { inject, Service } from '@angular/core';

const TOAST_MESSAGE = 'Ha ocurrido un error, por favor comuniquese con el administrador del sistema';

/**
 * maneja el status 404 (not found): el endpoint solicitado no existe en el servidor.
 * Loguea en consola y notifica un error genérico. */
@Service()
export class NotFoundErrorHandlerService {
  private readonly toast = inject(ToastService);
  private readonly log = inject(HttpLogService);

  /**
   * ejecuta las acciones globales para el status 404 */
  handle(url: string): void {
    this.log.errorHandlerLogs({
      fileName: 'not-found-error.handler.service.ts',
      status: 404,
      detail: `endpoint no encontrado, la URL solicitada "${url}" NO existe en el servidor`,
      action: `Mostrar toast '${TOAST_MESSAGE}'`,
      url,
    });

    this.toast.error(TOAST_MESSAGE);
  }
}
