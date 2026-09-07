import { ErrorHandlerHelperService } from '@/shared/http-client/response/error-handling/services/error-handler-helper.service';
import ToastService from '@/shared/services/Toast.service';
import { inject, Service } from '@angular/core';
import { Router } from '@angular/router';

const TOAST_MESSAGE = 'Inicie sesión para continuar';

/**
 * maneja el status 401 (unauthenticated): el usuario no está autenticado o la sesión expiró.
 * Redirige a /iniciar-sesion y notifica con Toast si no se está ya en el login */
@Service()
export class UnauthenticatedErrorHandlerService {
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly helper = inject(ErrorHandlerHelperService);

  /**
   * ejecuta las acciones globales para el status 401 */
  handle(url: string): void {
    console.error('❌ [unauthenticated-error.handler.service.ts] error: ', {
      status: 'Error 401: unauthenticated',
      detail: 'El usuario no está autenticado o la sesión ha expirado',
      action: `Mostrar toast '${TOAST_MESSAGE}' y re-dirigir al usuario a la página de inicio de sesión`,
      url,
    });

    this.router.navigate(['/iniciar-sesion']);

    if (!this.helper.pathnameIsLogin()) {
      this.toast.info(TOAST_MESSAGE);
    }
  }
}
