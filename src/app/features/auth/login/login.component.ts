import { MIN_LENGTH_PASSWORD } from '@/app/features/auth/data-types/constants/auth.const';
import { IBodyLogin } from '@/app/features/auth/data-types/interfaces/auth.interfaces';
import { environment } from '@/environments/environment';
import { ApiResponse } from '@/shared/http-client/data-types/interfaces/http-client.interface';
import CryptoService from '@/shared/services/Crypto.service';
import DataTypeService from '@/shared/services/DataType.service';
import SessionStorageService from '@/shared/services/SessionStorage.service';
import ToastService from '@/shared/services/Toast.service';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MessageModule,
    PasswordModule,
    CheckboxModule,
    InputTextModule,
  ],
})
export class LoginComponent implements OnInit {
  storage = inject(SessionStorageService);
  cryptoServiceClass = inject(CryptoService);
  dataTypeClass = inject(DataTypeService);
  http = inject(HttpClient);
  toast = inject(ToastService);
  router = inject(Router);

  dataLoginBurned: boolean = ['localhost'].includes(environment.NODE_ENV);

  minLengthPassword = signal<number>(MIN_LENGTH_PASSWORD);

  formLogin = new FormGroup({
    email: new FormControl(
      this.dataLoginBurned ? environment.auth.user : '',
      this.dataLoginBurned
        ? []
        : [Validators.required, Validators.minLength(3), Validators.email]
    ),
    password: new FormControl(
      this.dataLoginBurned ? environment.auth.password : '',
      this.dataLoginBurned
        ? []
        : [Validators.required, Validators.minLength(this.minLengthPassword())]
    ),
    rememberMe: new FormControl(false),
  });

  ngOnInit() {
    this.storage.deleteAll();
  }

  setSessionStorage(data: Record<string, any>): void {
    if (!data) {
      console.error(
        '❌ error, NO se puede setear Session Storage porque la api ha respondido con un valor falsy\n',
        data
      );
      return;
    }

    if (!this.dataTypeClass.isLiteralObject(data)) {
      console.error(
        '❌ error, NO se puede setear Session Storage porque la api NO ha respondido con un objeto literal\n',
        data
      );
      return;
    }

    if (this.dataTypeClass.literalObjectLength(data) <= 0) {
      console.error(
        '❌ error, NO se puede setear Session Storage porque la api ha respondido con un objeto literal vacio\n',
        data
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
          value
        );
        return;
      }

      this.storage.saveAndUpdate(key, value);
    });
  }

  async encryptCredentials(
    decryptedEmail: string,
    decryptedPassword: string
  ): Promise<{ encryptedEmail: string; encryptedPassword: string }> {
    const [encryptedEmail, encryptedPassword] = await Promise.all([
      this.cryptoServiceClass.encrypt(decryptedEmail) as Promise<string>,
      this.cryptoServiceClass.encrypt(decryptedPassword) as Promise<string>,
    ]);

    return { encryptedEmail, encryptedPassword };
  }

  async onSubmitLogin(): Promise<void> {
    if (this.formLogin.invalid && !this.dataLoginBurned) return;

    const { email, password } = this.formLogin.value;

    const { encryptedEmail, encryptedPassword } = await this.encryptCredentials(
      email!.trim(),
      password!.trim()
    );

    const body: IBodyLogin = {
      email: encryptedEmail,
      password: encryptedPassword,
    };

    const { success, data, message } = await firstValueFrom(
      this.http.post<ApiResponse<Record<string, string>>>(`${environment.api}`, body)
    );

    /* EL SIGUIENTE CODIGO DEBERIA ESTAR DESCOMENTADO CUANDO FUNCIONE LA CONEXION A LA API  */
    //if (success) {
    this.setSessionStorage(data);
    this.router.navigate(['/bots']);
    //} else {
    //  this.hotToast.errorNotification(message);
    //}
  }
}
