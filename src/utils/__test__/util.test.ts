import { describe, it, expect } from 'vitest'
import { AxiosError, isAxiosError } from 'axios'
import { isAxiosUnprocessableEntity } from '../utils'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'

describe('isAxiosError', () => {
  it('isAxiosError trả về boolean', () => {
    expect(isAxiosError(new Error())).toBe(false)
    expect(isAxiosError(new AxiosError())).toBe(true)
  })
})

describe('isAxiosUnprocessableEntity', () => {
  it('isAxiosUnprocessableEntity trả về blooean', () => {
    expect(isAxiosUnprocessableEntity(new Error())).toBe(false)
    expect(
      isAxiosUnprocessableEntity(
        new AxiosError(undefined, undefined, undefined, undefined, { status: HttpStatusCode.BadGateway } as any)
      )
    ).toBe(false)
  })
  expect(
    isAxiosUnprocessableEntity(
      new AxiosError(undefined, undefined, undefined, undefined, { status: HttpStatusCode.UnprocessableEntity } as any)
    )
  ).toBe(true)
})
