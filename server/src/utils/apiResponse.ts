class ApiResponse {
  httpsCode: number;
  payload: any;
  message: string;
  success: boolean;

  constructor(
    httpsCode: number,
    payload: any,
    message: string,
    success = true
  ) {
    this.httpsCode = httpsCode;
    this.payload = payload;
    this.message = message;
    this.success = success;
  }
}

export default ApiResponse;
