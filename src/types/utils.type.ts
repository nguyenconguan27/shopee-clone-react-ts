export interface SuccessResponse<Data> {
  message: string
  data: Data
}

export interface ErrorResponse<Data> {
  message: string
  data?: Data
}

export type NoUndefindField<T> = {
  [P in keyof T]-?: NoUndefindField<NonNullable<T[P]>>
}
