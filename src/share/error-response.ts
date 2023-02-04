export class ApiErrorResponse {
  errors?: [];
  message = 'Internal Server Error';
  success: number;

  static create(message: string, errors?: []): ApiErrorResponse {
    const apiErrorResponse = new ApiErrorResponse();
    apiErrorResponse.success = 0;
    apiErrorResponse.message = message;
    if (errors) apiErrorResponse.errors = errors;
    return apiErrorResponse;
  }
}
