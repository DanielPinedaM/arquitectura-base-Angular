import { IBodyLogin } from '@/app/features/auth/data-types/interfaces/auth.interfaces';
import { ILoginForm, loginSchema } from '@/app/features/auth/login/login.schema';
import { environment } from '@/environments/environment';
import { ApiResponse } from '@/shared/http-client/data-types/interfaces/http-client.interface';
import CryptoService from '@/shared/services/Crypto.service';
import DataTypeService from '@/shared/services/DataType.service';
import SessionStorageService from '@/shared/services/SessionStorage.service';
import ToastService from '@/shared/services/Toast.service';
import { HttpClient } from '@angular/common/http';
import { Component, DOCUMENT, inject, OnInit, signal } from '@angular/core';
import { form, FormField, FormRoot, validateStandardSchema } from '@angular/forms/signals';
import { Router, RouterModule } from '@angular/router';
import { HlmCheckboxImports } from '@spartan-ng/checkbox';
import { HlmInputEmailImports } from '@spartan-ng/input-email';
import { HlmInputPasswordImports } from '@spartan-ng/input-password';
import { HlmLabelImports } from '@spartan-ng/label';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    RouterModule,
    FormField,
    FormRoot,
    HlmCheckboxImports,
    HlmInputEmailImports,
    HlmInputPasswordImports,
    HlmLabelImports,
  ],
})
export class LoginComponent implements OnInit {
  storage = inject(SessionStorageService);
  cryptoServiceClass = inject(CryptoService);
  dataTypeClass = inject(DataTypeService);
  http = inject(HttpClient);
  toast = inject(ToastService);
  router = inject(Router);

  private readonly document = inject(DOCUMENT);

  private readonly dataLoginBurned = signal(this.document.location.hostname === 'localhost');

  private readonly formModel = signal<ILoginForm>({
    email: this.dataLoginBurned() ? environment.auth.user : '',
    password: this.dataLoginBurned() ? environment.auth.password : '',
  });

  protected readonly formLogin = form(
    this.formModel,
    (path) => validateStandardSchema(path, loginSchema(this.dataLoginBurned())),
    {
      submission: {
        action: async () => {
          await this.onSubmitLogin();
          return undefined;
        },
      },
    },
  );

  ngOnInit() {
    this.storage.deleteAll();

    // cuando el dominio es local host, quemar las credenciales e iniciar sesion automaticamente
    if (this.dataLoginBurned()) this.onSubmitLogin();
  }

  setSessionStorage(data: Record<string, any>): void {
    if (!data) {
      console.error(
        '❌ error, NO se puede setear Session Storage porque la api ha respondido con un valor falsy\n',
        data,
      );
      return;
    }

    if (!this.dataTypeClass.isLiteralObject(data)) {
      console.error(
        '❌ error, NO se puede setear Session Storage porque la api NO ha respondido con un objeto literal\n',
        data,
      );
      return;
    }

    if (this.dataTypeClass.literalObjectLength(data) <= 0) {
      console.error(
        '❌ error, NO se puede setear Session Storage porque la api ha respondido con un objeto literal vacio\n',
        data,
      );
      return;
    }

    Object.entries(data).forEach((entry) => {
      const [key, value] = entry;

      if (!key || !value) {
        console.error(
          '❌ error, en la data q responde el back al loguearse alguna key o value es falsy \n',
          'key ',
          key,
          'value ',
          value,
        );
        return;
      }

      this.storage.saveAndUpdate(key, value);
    });
  }

  async encryptCredentials(
    decryptedEmail: string,
    decryptedPassword: string,
  ): Promise<{ encryptedEmail: string; encryptedPassword: string }> {
    const [encryptedEmail, encryptedPassword] = await Promise.all([
      this.cryptoServiceClass.encrypt(decryptedEmail) as Promise<string>,
      this.cryptoServiceClass.encrypt(decryptedPassword) as Promise<string>,
    ]);

    return { encryptedEmail, encryptedPassword };
  }

  private async onSubmitLogin(): Promise<void> {
    const { email, password } = this.formModel();

    const { encryptedEmail, encryptedPassword } = await this.encryptCredentials(
      email,
      password,
    );

    const body: IBodyLogin = {
      email: encryptedEmail,
      password: encryptedPassword,
    };

    const { success, data, message } = await firstValueFrom(
      this.http.post<ApiResponse<Record<string, string>>>(`${environment.api}`, body),
    );

    /* EL SIGUIENTE CODIGO DEBERIA ESTAR DESCOMENTADO CUANDO FUNCIONE LA CONEXION A LA API  */
    /* if (!success) {
      this.hotToast.errorNotification(message);
      return;
    } */

    this.setSessionStorage(data);
    this.router.navigate(['/bots']);
  }
}
