import { MIN_LENGTH_PASSWORD } from '@/app/features/auth/data-types/constants/auth.const';
import {
  IBodyAssignPassword,
  IInputValuePassword,
  IObjValidatePassword,
} from '@/app/features/auth/data-types/interfaces/auth.interfaces';
import { environment } from '@/environments/environment';
import CONST_REGEX from '@/shared/data-types/constants/regex.const';
import { ApiResponse } from '@/shared/http-client/data-types/interfaces/http-client.interface';
import CryptoService from '@/shared/services/Crypto.service';
import DataTypeService from '@/shared/services/DataType.service';
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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-assign-password',
  templateUrl: './assign-password.component.html',
  imports: [
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    PasswordModule,
    MessageModule,
  ],
})
export class AssignPasswordComponent implements OnInit {
  cryptoServiceClass = inject(CryptoService);
  generalClass = inject(GeneralService);
  dataTypeClass = inject(DataTypeService);
  http = inject(HttpClient);
  toast = inject(ToastService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  idParams = signal<string | null>(null);

  // necesario para validar <input> contraseña y confirmar contraseña
  objValidatePassword = signal<IObjValidatePassword | undefined>(undefined);
  inputValuePassword = signal<IInputValuePassword>({
    password: '',
    confirmPassword: '',
  });

  ngOnInit() {
    this.idParams.set(this.route.snapshot.paramMap.get('id'));
  }

  formAssignPassword = new FormGroup({
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

  async onSubmitAssignPassword(): Promise<void> {
    this.formAssignPassword.markAllAsTouched();

    if (this.formAssignPassword.invalid || this.objValidatePassword()?.error) return;

    if (!this.idParams) {
      console.error(
        '❌ error, en el params NO existe el ID de recuperar clave ',
        '\nthis.idParams',
        this.idParams
      );
      return;
    }

    const { password } = this.formAssignPassword.value;

    const body: IBodyAssignPassword = {
      id: this.dataTypeClass.convertToNumber(this.idParams)!,
      password: (await this.cryptoServiceClass.encrypt(
        password!.trim()
      )) as string,
    };

    const { success, message } = await firstValueFrom(
      this.http.post<ApiResponse<unknown>>(`${environment.api}`, body)
    );

    if (success) {
      this.toast.success(
        'Se ha restablecido su contraseña, inicie sesion para continuar'
      );
      this.formAssignPassword.reset();
      this.router.navigate(['/iniciar-sesion']);
    } else {
      this.toast.error(message);
    }
  }
}
