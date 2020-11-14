import CustomError from './CustomError';

export default class ServerError extends CustomError {
  constructor(errorMessage: string = 'Recurso não encontrado', errorCode: string = '', _debug?: any) {
    super(404, errorMessage, errorCode, _debug);
  }
}
