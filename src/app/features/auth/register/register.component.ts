import { MIN_LENGTH_PASSWORD } from '@/app/features/auth/data-types/constants/auth.const';
import {
  IBodyRegister,
  IInputValuePassword,
  IObjValidatePassword,
} from '@/app/features/auth/data-types/interfaces/auth.interfaces';
import { environment } from '@/environments/environment';
import CONST_REGEX from '@/shared/data-types/constants/regex.const';
import { ApiResponse } from '@/shared/http-client/data-types/interfaces/http-client.interface';
import CryptoService from '@/shared/services/Crypto.service';
import GeneralService from '@/shared/services/General.service';
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
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MessageModule,
    PasswordModule,
    InputTextModule,
  ],
})
export class RegisterComponent implements OnInit {
  cryptoServiceClass = inject(CryptoService);
  generalClass = inject(GeneralService);
  http = inject(HttpClient);
  toast = inject(ToastService);
  router = inject(Router);

  // necesario para validar <input> contraseña y confirmar contraseña
  objValidatePassword = signal<IObjValidatePassword | undefined>(undefined);
  inputValuePassword = signal<IInputValuePassword>({
    password: '',
    confirmPassword: '',
  });

  ngOnInit() {}

  formRegister = new FormGroup({
    nameUser: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(CONST_REGEX.text.any),
    ]),

    email: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.email,
    ]),

    password: new FormControl('', [
      Validators.required,
      Validators.minLength(MIN_LENGTH_PASSWORD),
      Validators.pattern(CONST_REGEX.text.strongPassword),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(MIN_LENGTH_PASSWORD),
      Validators.pattern(CONST_REGEX.text.strongPassword),
    ]),
  });

  onChangeValidatePassword(
    value = '',
    formControlName: 'password' | 'confirmPassword'
  ): void {
    if (!formControlName) {
      console.error(
        '❌ error: no existe el formControlName en onChangeValidatePassword \n',
        formControlName
      );
      return;
    }

    // guardar en un estado los input value de contraseña y confirmar contraseña
    this.inputValuePassword.update((prev: IInputValuePassword) => ({
      ...prev,
      [formControlName]: value,
    }));

    /* validar que...
    1) Sea igual lo escrito en los <input> contraseña y confirmar contraseña
    2) la contraseña sea segura */
    const { password, confirmPassword } = this.inputValuePassword();

    this.objValidatePassword.set(
      this.generalClass.validatePasswords(password, confirmPassword)
    );
  }

  async encryptRegister(
    decryptedNameUser: string,
    decryptedEmail: string,
    decryptedPassword: string
  ): Promise<{
    encryptedNameUser: string;
    encryptedEmail: string;
    encryptedPassword: string;
  }> {
    const [encryptedNameUser, encryptedEmail, encryptedPassword] =
      await Promise.all([
        this.cryptoServiceClass.encrypt(decryptedNameUser) as Promise<string>,
        this.cryptoServiceClass.encrypt(decryptedEmail) as Promise<string>,
        this.cryptoServiceClass.encrypt(decryptedPassword) as Promise<string>,
      ]);

    return { encryptedNameUser, encryptedEmail, encryptedPassword };
  }

  async onSubmitRegister(): Promise<void> {
    this.formRegister.markAllAsTouched();

    if (this.formRegister.invalid || this.objValidatePassword()?.error) return;

    const { nameUser, email, password } = this.formRegister.value;

    const { encryptedNameUser, encryptedEmail, encryptedPassword } =
      await this.encryptRegister(
        nameUser!.trim(),
        email!.trim(),
        password!.trim()
      );

    const body: IBodyRegister = {
      nameUser: encryptedNameUser as string,
      email: encryptedEmail as string,
      password: encryptedPassword as string,
    };

    const { success, data, message } = await firstValueFrom(
      this.http.post<ApiResponse<unknown>>(`${environment.api}`, body)
    );

    if (success) {
      this.toast.success(
        `Usuario ${nameUser} registrado, inicie sesión para continuar `
      );
      this.formRegister.reset();
      this.router.navigate(['/iniciar-sesion']);
    } else {
      this.toast.error(message);
    }
  }
}
