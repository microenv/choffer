export default class CustomError extends Error {
  public httpStatus: number = 500;
  public errorMessage: string = '';
  public errorCode: string = '';
  public _debug: any;
  public isChofferError: boolean = true;

  constructor(httpStatus?: string | number, errorMessage?: string, errorCode?: string, _debug?: any) {
    super(errorMessage);

    this.httpStatus = Number(httpStatus) || 500;
    this.errorMessage = String(errorMessage || '');
    this.errorCode = String(errorCode || '');
    this._debug = _debug;
  }
}
