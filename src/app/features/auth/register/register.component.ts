import { IBodyRegister } from '@/app/features/auth/data-types/interfaces/auth.interfaces';
import { IRegisterForm, registerSchema } from '@/app/features/auth/register/register.schema';
import { environment } from '@/environments/environment';
import { ApiResponse } from '@/shared/http-client/data-types/interfaces/http-client.interface';
import CryptoService from '@/shared/services/Crypto.service';
import ToastService from '@/shared/services/Toast.service';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { form, FormField, FormRoot, validateStandardSchema } from '@angular/forms/signals';
import { Router, RouterModule } from '@angular/router';
import { HlmInputEmailImports } from '@spartan-ng/input-email';
import { HlmInputPasswordImports } from '@spartan-ng/input-password';
import { HlmInputTextImports } from '@spartan-ng/input-text';
import { HlmLabelImports } from '@spartan-ng/label';
import { firstValueFrom } from 'rxjs';

const INITIAL_FORM_MODEL: IRegisterForm = {
  nameUser: '',
  email: '',
  password: '',
  confirmPassword: '',
};

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    RouterModule,
    FormField,
    FormRoot,
    HlmInputTextImports,
    HlmInputEmailImports,
    HlmInputPasswordImports,
    HlmLabelImports,
  ],
})
export class RegisterComponent implements OnInit {
  cryptoServiceClass = inject(CryptoService);
  http = inject(HttpClient);
  toast = inject(ToastService);
  router = inject(Router);

  private readonly formModel = signal<IRegisterForm>({ ...INITIAL_FORM_MODEL });

  protected readonly formRegister = form(
    this.formModel,
    (path) => validateStandardSchema(path, registerSchema),
    {
      submission: {
        action: async () => {
          await this.onSubmitRegister();
          return undefined;
        },
      },
    },
  );

  ngOnInit() {}

  async encryptRegister(
    decryptedNameUser: string,
    decryptedEmail: string,
    decryptedPassword: string,
  ): Promise<{
    encryptedNameUser: string;
    encryptedEmail: string;
    encryptedPassword: string;
  }> {
    const [encryptedNameUser, encryptedEmail, encryptedPassword] = await Promise.all([
      this.cryptoServiceClass.encrypt(decryptedNameUser) as Promise<string>,
      this.cryptoServiceClass.encrypt(decryptedEmail) as Promise<string>,
      this.cryptoServiceClass.encrypt(decryptedPassword) as Promise<string>,
    ]);

    return { encryptedNameUser, encryptedEmail, encryptedPassword };
  }

  async onSubmitRegister(): Promise<void> {
    const { nameUser, email, password } = this.formModel();

    const { encryptedNameUser, encryptedEmail, encryptedPassword } = await this.encryptRegister(
      nameUser.trim(),
      email.trim(),
      password.trim(),
    );

    const body: IBodyRegister = {
      nameUser: encryptedNameUser,
      email: encryptedEmail,
      password: encryptedPassword,
    };

    const { success, message } = await firstValueFrom(
      this.http.post<ApiResponse<unknown>>(`${environment.api}`, body),
    );

    if (!success) {
      this.toast.error(message);
      return;
    }

    this.toast.success(`Usuario ${nameUser} registrado, inicie sesión para continuar `);
    this.formRegister().reset({ ...INITIAL_FORM_MODEL });
    this.router.navigate(['/iniciar-sesion']);
  }
}
