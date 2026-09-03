import {
  IRecoverPasswordForm,
  recoverPasswordSchema,
} from '@/app/features/auth/recover-password/recover-password.schema';
import { environment } from '@/environments/environment';
import { ApiResponse } from '@/shared/http-client/data-types/interfaces/http-client.interface';
import CryptoService from '@/shared/services/Crypto.service';
import ToastService from '@/shared/services/Toast.service';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { form, FormField, FormRoot, validateStandardSchema } from '@angular/forms/signals';
import { RouterModule } from '@angular/router';
import { HlmInputEmailImports } from '@spartan-ng/input-email';
import { HlmLabelImports } from '@spartan-ng/label';
import { firstValueFrom } from 'rxjs';

export interface IBodyRecoverPassword {
  email: string;
}

const INITIAL_FORM_MODEL: IRecoverPasswordForm = {
  email: '',
};

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  imports: [RouterModule, FormField, FormRoot, HlmInputEmailImports, HlmLabelImports],
})
export class RecoverPasswordComponent implements OnInit {
  cryptoServiceClass = inject(CryptoService);
  http = inject(HttpClient);
  toast = inject(ToastService);

  private readonly formModel = signal<IRecoverPasswordForm>({ ...INITIAL_FORM_MODEL });

  protected readonly formRecoverPassword = form(
    this.formModel,
    (path) => validateStandardSchema(path, recoverPasswordSchema),
    {
      submission: {
        action: async () => {
          await this.onSubmitRecoverPassword();
          return undefined;
        },
      },
    },
  );

  ngOnInit() {}

  async onSubmitRecoverPassword(): Promise<void> {
    const { email } = this.formModel();

    const body: IBodyRecoverPassword = {
      email: (await this.cryptoServiceClass.encrypt(email)) as string,
    };

    const { success, message } = await firstValueFrom(
      this.http.post<ApiResponse<unknown>>(`${environment.api}`, body),
    );

    if (!success) {
      this.toast.error(message);
      return;
    }

    this.toast.success('Revise el correo que se le envio para continuar cambiando su contraseña');
    this.formRecoverPassword().reset({ ...INITIAL_FORM_MODEL });
  }
}
