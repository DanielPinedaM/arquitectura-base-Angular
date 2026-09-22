import {
  assignPasswordSchema,
  IAssignPasswordForm,
} from '@/app/features/auth/asignar-nueva-clave/assign-password.schema';
import { environment } from '@/environments/environment';
import { ApiResponse } from '@/shared/http-client/data-types/interfaces/http-client.interface';
import CryptoService from '@/shared/services/Crypto.service';
import DataTypeService from '@/shared/services/DataType.service';
import ToastService from '@/shared/services/Toast.service';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { form, FormField, FormRoot, validateStandardSchema } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HlmInputPasswordImports } from '@spartan-ng/input-password';
import { HlmLabelImports } from '@spartan-ng/label';
import { firstValueFrom } from 'rxjs';

interface IBodyAssignPassword {
  id: number;
  password: string;
}

const INITIAL_FORM_MODEL: IAssignPasswordForm = {
  password: '',
  confirmPassword: '',
};

@Component({
  selector: 'app-assign-password',
  templateUrl: './assign-password.component.html',
  imports: [RouterModule, FormField, FormRoot, HlmInputPasswordImports, HlmLabelImports],
})
export class AssignPasswordComponent implements OnInit {
  cryptoServiceClass = inject(CryptoService);
  dataTypeClass = inject(DataTypeService);
  http = inject(HttpClient);
  toast = inject(ToastService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  idParams = signal<string | null>(null);

  private readonly formModel = signal<IAssignPasswordForm>({ ...INITIAL_FORM_MODEL });

  protected readonly formAssignPassword = form(
    this.formModel,
    (path) => validateStandardSchema(path, assignPasswordSchema),
    {
      submission: {
        action: async () => {
          await this.onSubmitAssignPassword();
          return undefined;
        },
      },
    },
  );

  ngOnInit() {
    this.idParams.set(this.route.snapshot.paramMap.get('id'));
  }

  async onSubmitAssignPassword(): Promise<void> {
    if (!this.idParams) {
      console.error(
        '❌ error, en el params NO existe el ID de recuperar clave ',
        '\nthis.idParams',
        this.idParams,
      );
      return;
    }

    const { password } = this.formModel();

    const body: IBodyAssignPassword = {
      id: this.dataTypeClass.convertToNumber(this.idParams)!,
      password: (await this.cryptoServiceClass.encrypt(password.trim())) as string,
    };

    const { success, message } = await firstValueFrom(
      this.http.post<ApiResponse<unknown>>(`${environment.api}`, body),
    );

    if (!success) {
      this.toast.error(message);
      return;
    }

    this.toast.success('Se ha restablecido su contraseña, inicie sesion para continuar');
    this.formAssignPassword().reset({ ...INITIAL_FORM_MODEL });
    this.router.navigate(['/iniciar-sesion']);
  }
}
