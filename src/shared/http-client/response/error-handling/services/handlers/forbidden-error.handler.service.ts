import { ErrorHandlerHelperService } from '@/shared/http-client/response/error-handling/services/error-handler-helper.service';
import ToastService from '@/shared/services/Toast.service';
import { inject, Service } from '@angular/core';

const TOAST_MESSAGE = 'Acceso denegado, no tiene permisos para realizar esta acción';

/**
 * maneja el status 403 (forbidden): el usuario está autenticado pero no tiene permisos.
 * Vuelve a la página anterior del historial y notifica "acceso denegado". */
@Service()
export class ForbiddenErrorHandlerService {
  private readonly toast = inject(ToastService);
  private readonly helper = inject(ErrorHandlerHelperService);

  /**
   * ejecuta las acciones globales para el status 403 */
  handle(url: string): void {
    console.error('❌ [forbidden-error.handler.service.ts] error: ', {
      status: 'Error 403: Forbidden',
      detail: 'El usuario está autenticado pero no tiene permisos para acceder al recurso',
      action: `Mostrar toast ${TOAST_MESSAGE} y re-dirigir a la pagina anterior del historial`,
      url,
    });

    /** devolverme a la web anterior en el historial cuando el status sea 403 */
    this.helper.returnToBrowserHistory();

    this.toast.info(TOAST_MESSAGE);
  }
}
