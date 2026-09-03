/*
 ***************************************************
 * Interface para autenticacion:                   *
 * Iniciar sesion, registro y recuparar contraseña *
 *************************************************** */

/**
body para registrar usuario */
export interface IBodyRegister {
  nameUser: string;
  email: string;
  password: string;
}

/**
body para iniciar sesion */
export interface IBodyLogin {
  email: string;
  password: string;
}

/**
body para cambiar contraseña */
export interface IBodyAssignPassword {
  id: number;
  password: string;
}
