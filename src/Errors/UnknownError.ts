import CustomError from './CustomError';

export default class UnknownError extends CustomError {
  constructor(errorMessage: string = 'Erro Desconhecido', errorCode: string = '', _debug?: any) {
    super(400, errorMessage, errorCode, _debug);
  }
}
