export enum ErrorType {
  AUTH = 'AUTH',
  DATABASE = 'DATABASE',
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  UNKNOWN = 'UNKNOWN'
}

export interface AppError {
  message: string;
  type: ErrorType;
  originalError?: any;
  code?: string;
}

export class ErrorHandler {
  static handle(error: any, type: ErrorType = ErrorType.UNKNOWN): AppError {
    console.error(`[${type}] Error:`, error);

    let message = 'Ha ocurrido un error inesperado.';
    let code = error?.code;

    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }

    // Traducir errores comunes de Supabase
    if (type === ErrorType.AUTH) {
      if (message.includes('Invalid login credentials') || message.includes('invalid_credentials')) {
        message = 'El correo o la contraseña son incorrectos. Por favor, verifica tus datos.';
      } else if (message.includes('Email not confirmed')) {
        message = 'Tu correo electrónico aún no ha sido confirmado. Por favor, revisa tu bandeja de entrada.';
      } else if (message.includes('User not found')) {
        message = 'No se encontró ninguna cuenta con este correo electrónico.';
      } else if (message.includes('Rate limit exceeded')) {
        message = 'Demasiados intentos. Por favor, inténtalo de nuevo más tarde.';
      } else if (message.includes('Password is too short')) {
        message = 'La contraseña es demasiado corta (mínimo 6 caracteres).';
      } else if (message.includes('User already registered')) {
        message = 'Ya existe una cuenta con este correo electrónico.';
      }
    }

    if (code === '23505') {
      message = 'Este registro ya existe.';
      type = ErrorType.VALIDATION;
    }

    return { message, type, originalError: error, code };
  }

  static isAuthError(error: any): boolean {
    return error?.message?.includes('Refresh Token Not Found') || 
           error?.message?.includes('invalid_refresh_token') ||
           error?.status === 401;
  }
}
