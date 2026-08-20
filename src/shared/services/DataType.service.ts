/* *********************************************
 * metodos relacionadas con los tipos de datos *
 * ********************************************* */

import { TitleCasePipe } from '@angular/common';
import { inject, Service } from '@angular/core';

@Service()
export default class DataTypeService {
  private titleCasePipe = inject(TitleCasePipe);

  /**
   admite cualquier string */
  isString = (variable: string | any): boolean => {
    return typeof variable === 'string' || variable instanceof String;
  };

  /**
  string q contiene numero,
  admite numero decimal, comas, numero entero, positivo y negativo.
  Ejemplo: "-1,2.1", "-2", "3" */
  isStringNumber = (variable: string | any): boolean => {
    return typeof variable === 'string' && /^(-?\d{0,}(\,|\.)?){0,}$/.test(variable.trim());
  };

  /**
   true cuando el texto contiene cualquier tipo de letra */
  isLetter = (variable: string | any): boolean => {
    return typeof variable === 'string' && /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]+$/.test(variable.trim());
  };

  /**
   solamente tipo NUMERO, NO admite NaN */
  isNumber = (variable: number | any): boolean => {
    return typeof variable === 'number' && Number.isNaN(variable) === false;
  };

  /**
  SI es posible convierte a NUMERO,
  cuando NO es posible devuleve null */
  convertToNumber = (value: number | any): number | null => {
    const stringValue: string = String(value).trim();

    if (
      stringValue === '' ||
      value === null ||
      stringValue === 'null' ||
      value === undefined ||
      stringValue === 'undefined' ||
      typeof value === 'boolean' ||
      typeof value === 'function' ||
      typeof value === 'object' ||
      typeof value === 'symbol' ||
      Array.isArray(value)
    )
      return null;

    const number = Number(value);
    return isNaN(number) ? null : number;
  };

  /**
  SI es posible
  1) convertir a string
  2) pasar string a minuscula

  cuando NO es posible devuleve null */
  convertToStringAndLowerCase = (string: string | any): string | null | any => {
    if (String(string).trim() === '' || !string) {
      return null;
    }

    if (this.isString(string)) {
      return String(string).trim().toLowerCase();
    }

    return null;
  };

  trimLowerCase = (string: string | any): string | any => {
    if (this.isString(string)) {
      return string.trim().toLowerCase();
    }

    return string;
  };

  isValidBoolean = (variable: boolean | string | any): boolean => {
    const normalized: string = String(variable)?.trim()?.toLowerCase();

    if (
      typeof normalized === 'boolean' ||
      // true
      normalized === 'true' ||
      normalized === '1' ||
      this.normalizeStr(variable) === 'si' ||
      this.normalizeStr(variable) === 'yes' ||
      // false
      normalized === 'false' ||
      normalized === '0' ||
      this.normalizeStr(variable) === 'no'
    ) {
      return true;
    }

    return false;
  };

  /**
  SI es posible
  convertir a booleano
  cuando NO es posible devuleve null */
  convertToBoolean = (variable: boolean | string | any): boolean | null => {
    const normalized: string = String(variable)?.trim()?.toLowerCase();

    if (normalized === 'true' || normalized === '1' || this.normalizeStr(variable) === 'si') {
      return true;
    } else if (
      normalized === 'false' ||
      normalized === '0' ||
      this.normalizeStr(variable) === 'no'
    ) {
      return false;
    } else {
      return null;
    }
  };

  /**
  saber si puedo o no convertir de string a array u objeto con JSON.parse() */
  isValidJSONparse = (string: string): boolean => {
    if (!this.isString(string)) return false;

    try {
      JSON.parse(string);
      return true;
    } catch (error) {
      return false;
    }
  };

  /**
  ¿la variable es un objeto literal? */
  isLiteralObject = (literalObject: any): boolean => {
    return (
      typeof literalObject === 'object' &&
      literalObject !== null &&
      (Object.getPrototypeOf(literalObject) === Object.prototype ||
        Object.prototype.toString.call(literalObject) === '[object Object]')
    );
  };

  /**
  numero de keys (longitud) de un objeto literal {} */
  literalObjectLength = (literalObject: any): number => {
    if (this.isLiteralObject(literalObject)) {
      const length: number =
        Object.keys(literalObject).length + Object.getOwnPropertySymbols(literalObject).length;
      return length;
    }

    return -1;
  };

  /**
* Normalizar string
* Ejemplo:
* ' COMunicaciÓN    ' devuelve  'comunicacion'
* [1, 2, 3]           devuelve   [1, 2, 3]
*
* @param {string|any} string — valor a normalizar. Si no es string o está vacío, se devuelve tal cual

* @param {Object} [options]                           opciones de normalización

* @param {boolean} [options.clearAccents]             true: borrar las tildes
                                                      false: NO borrar las tildes

* @param {boolean} [options.clearSpecialCharacters]   true: BORRAR caracteres especiales
                                                      false: CONSERVAR caracteres especiales

* @param {boolean} [options.enyeWithN]                true: REEMPLAZAR "ñ" y "Ñ" por "n"
                                                      false: CONSERVAR letra "ñ"

* @param {boolean} [options.clearNumbers]             true: BORRAR numeros
                                                      false: CONSERVAR numeros

* @param {'upperCase' | 'lowerCase' | 'titleCase' | null}  [options.caseTransform]  "upperCase": convertir texto a MAYUSCULA
                                                                                    "lowerCase": convertir texto a minuscula
                                                                                    "titleCase": iniciales en mayuscula
                                                                                    null: NO modifica mayusculas ni minusculas

* @param {'trim' | 'trimStart' | 'trimEnd' | null}  [options.trimType] controla como borrar los espacios en blanco
                                                                      "trim": borrar espacio en blanco al PRINCIPIO Y FINAL
                                                                      "trimStart": borrar espacio en blanco al PRINCIPIO
                                                                      "trimEnd": borrar espacio en blanco al FINAL
                                                                      null: NO borrar espacios en blanco

* @param {boolean} [options.clearBlankSpaces] true: reemplazar tabs, multiples espacios en blanco '   ' y saltos de linea \n por espacio en blanco ' '
                                              false: conservar tabs, multiples espacios en blanco '   ' y saltos de linea \n

* @param {'-' | '_' | null} [options.typeOfDash] null: NO reemplazar espacios en blanco " " por guiones
                                                "-": reemplaza espacios por guion MEDIO
                                                "_" : reemplaza espacios por guion BAJO

* @returns {string|any}                               string normalizado o el valor original si no es string */
  normalizeStr = (
    string: string | any,
    options?: {
      clearAccents?: boolean;
      clearSpecialCharacters?: boolean;
      enyeWithN?: boolean;
      clearNumbers?: boolean;
      caseTransform?: 'upperCase' | 'lowerCase' | 'titleCase' | null;
      trimType?: 'trim' | 'trimStart' | 'trimEnd' | null;
      clearBlankSpaces?: boolean;
      typeOfDash?: '-' | '_' | null;
    },
  ): string | any => {
    if (!this.isString(string)) return string;
    if (String(string).trim() === '') return '';

    const {
      clearAccents = true,
      clearSpecialCharacters = false,
      enyeWithN = false,
      clearNumbers = false,
      caseTransform = 'lowerCase',
      trimType = 'trim',
      clearBlankSpaces = true,
      typeOfDash = null,
    } = options ?? {};

    let newString: string = string.normalize('NFD'); // hacer q funcionen las expresiones regulares

    if (clearAccents) {
      newString = newString.replaceAll(/[\u0300-\u0302\u0304-\u036f]/g, ''); // eliminar acentos (todos menos U+0303)
    }

    newString = newString.normalize('NFC'); // conservar la "ñ" "Ñ"

    if (enyeWithN) {
      newString = newString
        .replaceAll(/ñ/g, 'n') // reemplazar ñ minúscula por n minúscula
        .replaceAll(/Ñ/g, 'N'); // reemplazar Ñ MAYUSCULA por N MAYUSCULA
    }

    if (clearSpecialCharacters) {
      newString = newString.replaceAll(/[^a-zA-Z0-9 áéíóúüÁÉÍÓÚÜñÑ]/g, ''); // borrar caracteres especiales
    }

    if (clearNumbers) {
      newString = newString.replaceAll(/\d+/g, ''); // borrar todos los numeros 0123456789
    }

    /*
     *********************************************
     * esto TIENE q estar al final de la funcion *
     ********************************************* */

    if (trimType === 'trim') {
      newString = newString.trim(); // borrar espacio en blanco al PRINCIPIO Y FINAL
    } else if (trimType === 'trimStart') {
      newString = newString.trimStart(); // borrar espacio en blanco al PRINCIPIO
    } else if (trimType === 'trimEnd') {
      newString = newString.trimEnd(); // borrar espacio en blanco al FINAL
    }

    if (clearBlankSpaces) {
      newString = newString
        .replace(/(\r\n|\n|\r)/gm, ' ') // borrar saltos de linea
        .replace(/\t/g, ' ') // borrar tabs
        .replaceAll(/\s+/g, ' '); // reemplazar múltiples espacios en blanco '   ' por un solo espacio en blanco ' '
    }

    if (caseTransform === 'titleCase') {
      newString = this.titleCasePipe.transform(newString); // mayusculas iniciales
    } else if (caseTransform === 'lowerCase') {
      newString = newString.toLocaleLowerCase('es-ES'); // convertir a minuscula
    } else if (caseTransform === 'upperCase') {
      newString = newString.toLocaleUpperCase('es-ES'); // convertir a MAYUSCULA
    }

    if (typeOfDash === '-') {
      newString = newString.replaceAll(' ', '-'); // reemplaza espacios por guion MEDIO "-"
    } else if (typeOfDash === '_') {
      newString = newString.replaceAll(' ', '_'); // reemplaza espacios por guion BAJO "_"
    }

    return newString;
  };
}
