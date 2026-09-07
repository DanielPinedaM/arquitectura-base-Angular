import { HttpLogService } from '@/shared/http-client/services/http-log.service';
import ToastService from '@/shared/services/Toast.service';
import { inject, Service } from '@angular/core';

const TOAST_MESSAGE = 'No pudimos conectarnos. Revise su conexión a internet e intente de nuevo en unos minutos';

/**
 * maneja el status 0 (network error): la petición NUNCA recibió respuesta del servidor.
 *
 * 🚨 PROHIBIDO usar navigator.onLine (y los eventos window.online / window.offline) ⚠️
 *
 * navigator.onLine MIENTE: su resultado NO es confiable, por lo que desde el navegador es
 * IMPOSIBLE saber con certeza si el usuario tiene internet:
 *
 * 1. navigator.onLine SOLO informa si el sistema operativo cree tener una interfaz de red
 *    activa (wifi/LAN), NUNCA si esa red tiene salida a internet. Devuelve true con portales
 *    cautivos (wifi de hotel/aeropuerto sin aceptar términos), router sin salida, DNS caído,
 *    VPN o firewall bloqueando, es decir, afirma "hay internet" cuando NO lo hay; y también
 *    puede devolver false teniendo conexión real, porque adaptadores virtuales (VPN, Docker,
 *    máquinas virtuales) y cada navegador/sistema operativo lo calculan de forma distinta.
 *
 * 2. Los eventos window.online / window.offline heredan exactamente la misma limitación
 *    porque se disparan a partir de navigator.onLine.
 *
 * 3. La ÚNICA prueba real de conectividad es hacer una petición HTTP y ver si responde,
 *    que es justo lo que acaba de fallar. Y aun así ese fallo NO prueba falta de internet:
 *    el status 0 también ocurre por CORS bloqueado, DNS que no resuelve, servidor caído o
 *    inalcanzable, certificado TLS inválido o petición abortada.
 *
 * Por eso este handler NO intenta adivinar la causa ni afirma que el usuario está sin internet:
 * muestra un único mensaje neutro y deja el detalle técnico en los logs. */
@Service()
export class NetworkErrorHandlerService {
  private readonly toast = inject(ToastService);
  private readonly log = inject(HttpLogService);

  /**
   * ejecuta las acciones globales para el status 0 */
  handle(url: string): void {
    this.log.errorHandlerLogs({
      fileName: 'network-error.handler.service.ts',
      status: 0,
      detail: 'La petición HTTP nunca recibió respuesta del servidor. La causa puede ser falta de internet, CORS bloqueado, DNS que no resuelve, servidor caído o inalcanzable, certificado TLS inválido o petición abortada. Desde el frontend es IMPOSIBLE distinguir cuál de ellas ocurrió',
      action: `Mostrar toast '${TOAST_MESSAGE}'`,
      url,
    });

    this.toast.error(TOAST_MESSAGE);
  }
}
