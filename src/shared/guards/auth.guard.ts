import { environment } from '@/environments/environment';
import { ApiResponse } from '@/shared/http-client/data-types/interfaces/http-client.interface';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

const LOGIN_URL: string = '/iniciar-sesion';

export const AuthGuard: CanActivateFn = async (route, state) => {
  const http = inject(HttpClient);
  const router = inject(Router);

  // TODO: 🚨 ⚠️
  // - Reemplazar URL "reemplazar-por-endpoint-de-autenticacion" por el endpoint de backend encargado de validar la sesión.
  // - Descomentar el código de validación ubicado más abajo para activar la protección de rutas.
  // Actualmente se encuentra comentado únicamente para facilitar pruebas y permitir la navegación sin restricciones durante el desarrollo.
  /* const { success, message, status } = await firstValueFrom(
    http.get<ApiResponse<unknown>>(`${environment.api}reemplazar-por-endpoint-de-autenticacion`),
  );

  if (!success) {
    console.error('❌ [auth.guard.ts] Error de autenticación, respuesta de la API: ', {
      success,
      message,
      status,
    });
    return router.createUrlTree([LOGIN_URL]);
  } */

  return true;
};
