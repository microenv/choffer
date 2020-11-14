import CustomError from './CustomError';

export default class ServerError extends CustomError {
  constructor(errorMessage: string = 'Erro Interno no Servidor', errorCode: string = '', _debug?: any) {
    super(500, errorMessage, errorCode, _debug);
  }
}
