import CustomError from './CustomError';

export default class BadRequestError extends CustomError {
  constructor(errorMessage: string = 'Bad Request', errorCode: string = '', _debug?: any) {
    super(400, errorMessage, errorCode, _debug);
  }
}
