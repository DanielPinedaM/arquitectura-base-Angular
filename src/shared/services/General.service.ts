import DataTypeService from '@/shared/services/DataType.service';
import ToastService from '@/shared/services/Toast.service';
import { inject, Service } from '@angular/core';

@Service()
export default class GeneralService {
  dataTypeClass = inject(DataTypeService);
  toast = inject(ToastService);

  /**
  copiar texto en portapapeles */
  public copyText = (text: string): void => {
    const errorMessage = 'No se pudo copiar el texto';

    if (!this.dataTypeClass.isString(text)) {
      this.toast.error(errorMessage);
      console.error('❌ error, text NO es tipo string\ntypeof text ', typeof text);
      return;
    }

    if (text.trim() === '') {
      this.toast.error(errorMessage);
      console.error("❌ error, text es un string vacio ''\ntext ", text);
      return;
    }

    const selBox: HTMLTextAreaElement = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.toast.success('Texto copiado');
  };
}
