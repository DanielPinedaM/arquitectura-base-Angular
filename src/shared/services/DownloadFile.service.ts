/* ********************************
 * metodos para descargar archivo *
 * ******************************** */

import LuxonService from '@/shared/services/Luxon.service';
import { TitleCasePipe } from '@angular/common';
import { inject, Service } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import ToastService from './Toast.service';

@Service()
export default class DownloadFileService {
  luxonClass = inject(LuxonService);
  toast = inject(ToastService);
  private readonly titleCasePipe = inject(TitleCasePipe);

  /**
  Funcion para descargar archivo */
  public downloadBlob = (blob: Blob, fileName: string | undefined): void => {
    const message = 'Ocurrió un error al descargar archivo';

    if (!(blob instanceof Blob)) {
      console.error(
        '❌ error, no se puede descargar archivo ',
        fileName,
        'porque no hay un blob ',
        blob,
      );

      this.toast.error(message);
      return;
    }

    if (!fileName) {
      this.toast.error(message);
      console.error('❌ el nombre del archivo fileName NO puede ser falsy\n', fileName);
      return;
    }

    const extension: string | undefined = fileName?.split('.')?.at(-1);
    if (!fileName?.includes('.') || !extension) {
      console.error(
        '❌ error, no se puede descargar archivo ',
        fileName,
        'porque se necesita el nombre de la extension ',
        extension,
      );

      this.toast.error(message);
      return;
    }

    const lastDotIndex: number = fileName.lastIndexOf('.');
    const baseFileName: string = lastDotIndex > -1 ? fileName.slice(0, lastDotIndex) : fileName;
    const date: string = this.luxonClass
      .currentDateAndTime()
      .replaceAll(':', '_')
      .replaceAll(' ', '-');

    this.toast.success(`Archivo descargado ${baseFileName}.${extension}`);

    saveAs(blob, `${date}-${baseFileName}.${extension}`);
  };

  /**
  Funcion para ver archivo */
  public viewBlob = (blob: Blob): void => {
    if (blob instanceof Blob) {
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, '_blank');

      setTimeout(() => URL.revokeObjectURL(fileURL), 5000);
    } else {
      this.toast.error('Al ver archivo');
      console.error('❌ error, para poder ver el archivo, tiene q ser tipo blob\n', blob);
    }
  };

  /**
  descargar Excel a partir de un array de objetos NO anidado */
  public downloadExcel = (
    nonNestedArrayOfObjects: Record<string, any>[],
    fileName: string,
  ): void => {
    const errroMessage = 'Ocurrió un error al descargar Excel';

    if (!nonNestedArrayOfObjects) {
      this.toast.error(errroMessage);
      console.error('❌ el array de objetos NO puede ser falsy\n', nonNestedArrayOfObjects);
      return;
    }

    if (!Array.isArray(nonNestedArrayOfObjects)) {
      this.toast.error(errroMessage);
      console.error(
        '❌ el parametro nonNestedArrayOfObjects tiene q ser un array de objetos NO anidado\n',
        nonNestedArrayOfObjects,
      );
      return;
    }

    if (nonNestedArrayOfObjects.length === 0) {
      this.toast.error(errroMessage);
      console.error(
        '❌ el array de objetos NO puede estar vacio, NI puede ser falsy\n',
        nonNestedArrayOfObjects,
      );
      return;
    }

    if (!fileName) {
      this.toast.error(errroMessage);
      console.error('❌ el nombre del archivo fileName NO puede ser falsy\n', fileName);
      return;
    }

    if (!String(fileName).includes('.xlsx')) {
      this.toast.error(errroMessage);
      console.error('❌ fileName tiene q contener la extension .xlsx\n', fileName);
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Datos');
    const keys: string[] = Object.keys(nonNestedArrayOfObjects[0]);

    // Mayusculas iniciales a los nombres de las columnas del Excel
    const header: string[] = keys.map((key: string) => this.titleCasePipe.transform(key ?? ''));

    // Agregar encabezados con estilos
    worksheet.addRow(header);
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4F81BD' }, // Color azul
      };
      cell.font = { bold: true, color: { argb: 'FFFFFF' } }; // Texto blanco
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    // Agregar datos a la tabla
    nonNestedArrayOfObjects.forEach((obj) => {
      worksheet.addRow(Object.values(obj));
    });

    // Ajustar el ancho de las columnas automáticamente
    worksheet.columns.forEach((column) => {
      column.width = 15;
    });

    // Aplicar autofiltro a los datos
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: worksheet.rowCount, column: keys.length },
    };

    workbook.xlsx
      .writeBuffer()
      .then((excelBuffer) => {
        this.downloadBlob(new Blob([excelBuffer]), fileName);
      })
      .catch((error) => {
        console.error('❌ error al generar el archivo Excel\n', error);
        this.toast.error(errroMessage);
      });
  };
}
