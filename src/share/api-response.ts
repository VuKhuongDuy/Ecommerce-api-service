export class ApiSuccessResponse<TData> {
  data?: TData

  message?: string = 'success'

  success: number

  static create<TData>(data?: TData, message?: string): ApiSuccessResponse<TData> {
    const apiSuccessResponse = new ApiSuccessResponse<TData>()
    apiSuccessResponse.success = 1
    if (data) {
      apiSuccessResponse.data = data
    }
    if (message) {
      apiSuccessResponse.message = message
    }
    return apiSuccessResponse
  }
}
