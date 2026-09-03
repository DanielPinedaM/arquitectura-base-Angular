import { AuthGuard } from '@/shared/guards/auth.guard';
import { Routes } from '@angular/router';

// #region - error 404 ruta inexistente
import { NotFound404Component } from '@/shared/design/ui/not-found-404/not-found-404.component';
// #endregion

// #region - contenedor principal de paginas despues de loguearse
import { MainWrapperComponent } from '@/shared/design/layouts/main-wrapper/main-wrapper.component';
// #endregion

// #region autenticacion
import { AssignPasswordComponent } from '@/app/features/auth/assign-password/assign-password.component';
import { MainAuthComponent } from '@/app/features/auth/design/layouts/main-auth/main-auth.component';
import { LoginComponent } from '@/app/features/auth/login/login.component';
import { RecoverPasswordComponent } from '@/app/features/auth/recover-password/recover-password.component';
import { RegisterComponent } from '@/app/features/auth/register/register.component';
// #endregion

import { BotsComponent } from '@/app/features/bots/bots.component';

export const routes: Routes = [
  // cuando NO se copia una ruta, se re-dirige al login
  {
    path: '',
    redirectTo: '/iniciar-sesion',
    pathMatch: 'full',
  },

  {
    path: '',
    component: MainAuthComponent,
    children: [
      {
        path: 'iniciar-sesion',
        component: LoginComponent,
      },
      {
        path: 'recuperar-clave',
        component: RecoverPasswordComponent,
      },
      {
        path: 'asignar-nueva-clave/:id',
        component: AssignPasswordComponent,
      },
      {
        path: 'registrarme',
        component: RegisterComponent,
      },
    ],
  },

  {
    path: '',
    component: MainWrapperComponent,

    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],

    children: [
      {
        // /bots
        path: 'bots',
        component: BotsComponent,
      },
    ],
  },

  {
    path: '**',
    component: NotFound404Component,
  },
];
