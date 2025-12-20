// httpsCode, success, type, Msg

export default class ApiError extends Error {
  httpsCode: number;
  type?: string | undefined;
  message: string;
  payload: any;
  success: boolean;
  errors: any;

  constructor(
    httpsCode: number,
    errMsg: string,
    payload?: any,
    type?: string | undefined,
    errors = [] as any,
    stack = ""
  ) {
    super(errMsg);

    this.httpsCode = httpsCode;
    this.type = type; // zod error // db
    this.message = errMsg; // validation failes , user already created
    this.success = false;
    this.payload = payload || null;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
