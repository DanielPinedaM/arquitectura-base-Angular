import { AuthGuard } from '@/shared/guards/auth.guard';
import { Routes } from '@angular/router';

export const routes: Routes = [
  // cuando NO se copia una ruta, se re-dirige al login
  {
    path: '',
    redirectTo: '/iniciar-sesion',
    pathMatch: 'full',
  },

  // #region autenticacion
  {
    path: '',
    loadComponent: () =>
      import('@/app/features/auth/design/layouts/main-auth/main-auth.component').then(
        (c) => c.MainAuthComponent,
      ),

    children: [
      {
        path: 'iniciar-sesion',
        loadComponent: () =>
          import('@/app/features/auth/login/login.component').then((c) => c.LoginComponent),
      },
      {
        path: 'recuperar-clave',
        loadComponent: () =>
          import('@/app/features/auth/recover-password/recover-password.component').then(
            (c) => c.RecoverPasswordComponent,
          ),
      },
      {
        path: 'asignar-nueva-clave/:id',
        loadComponent: () =>
          import('@/app/features/auth/assign-password/assign-password.component').then(
            (c) => c.AssignPasswordComponent,
          ),
      },
      {
        path: 'registrarme',
        loadComponent: () =>
          import('@/app/features/auth/register/register.component').then(
            (c) => c.RegisterComponent,
          ),
      },
    ],
  },
  // #endregion

  // #region contenedor principal de paginas despues de loguearse
  {
    path: '',
    loadComponent: () =>
      import('@/shared/design/layouts/main-wrapper/main-wrapper.component').then(
        (c) => c.MainWrapperComponent,
      ),

    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],

    children: [
      {
        path: 'bots',
        loadComponent: () =>
          import('@/app/features/bots/bots.component').then((c) => c.BotsComponent),
      },
    ],
  },
  // #endregion

  // #region error 404 ruta inexistente
  {
    path: '**',
    loadComponent: () =>
      import('@/shared/design/ui/not-found-404/not-found-404.component').then(
        (c) => c.NotFound404Component,
      ),
  },
  // #endregion
];
