import type { RegisterOptions, UseFormGetValues } from 'react-hook-form'
import * as yup from 'yup'

type Rules = { [key in 'email' | 'password' | 'confirmPassword']?: RegisterOptions }

export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  email: {
    required: {
      value: true,
      message: 'email la bat buoc'
    },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: 'email khong dung dinh dang'
    },
    maxLength: {
      value: 160,
      message: 'do dai tu 5 - 160 ky tu'
    },
    minLength: {
      value: 5,
      message: 'do dai tu 5 - 160 ky tu'
    }
  },
  password: {
    required: {
      value: true,
      message: 'password la bat buoc'
    },
    maxLength: {
      value: 160,
      message: 'do dai tu 5 - 160 ky tu'
    },
    minLength: {
      value: 5,
      message: 'do dai tu 5 - 160 ky tu'
    }
  },
  confirmPassword: {
    required: {
      value: true,
      message: 'Nhap lai la bat buoc'
    },
    maxLength: {
      value: 160,
      message: 'do dai tu 5 - 160 ky tu'
    },
    minLength: {
      value: 5,
      message: 'do dai tu 5 - 160 ky tu'
    },
    validate:
      typeof getValues === 'function'
        ? (value) => value === getValues('password') || 'Nhap lai mat khau khong dung'
        : undefined
  }
})

const handleSchema = (refString: string) => {
  return yup
    .string()
    .required('Nhap la mat khau la bat buoc')
    .max(160, 'Độ dài trong khoảng 6 - 160 ký tự')
    .min(6, 'Độ dài trong khoảng 6 - 160 ký tự')
    .oneOf([yup.ref(refString)], 'Nhập lại mật khẩu không đúng')
}

function testPrice(this: yup.TestContext<yup.AnyObject>) {
  const { price_max, price_min } = this.parent
  if (price_min !== '' && price_max !== '') {
    return Number(price_min) <= Number(price_max)
  }
  return price_min !== '' || price_max !== ''
}

export const schema = yup.object({
  email: yup
    .string()
    .required('Email la bat buoc')
    .email('Email khong dung dinh dang')
    .min(5, 'Email khong dung dinh dang'),
  password: yup
    .string()
    .required('password la bat buoc')
    .max(160, 'ĐĐộ dài trong khoảng 6 - 160 ký tự')
    .min(6, 'Độ dài trong khoảng 6 - 160 ký tự'),
  confirmPassword: handleSchema('password'),
  price_min: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPrice
  }),
  price_max: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPrice
  }),
  searchString: yup.string().trim().required()
})

export const userSchema = yup.object({
  name: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  phone: yup.string().max(20, 'Độ dài tối đa là 20 ký tự'),
  address: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  avatar: yup.string().max(1000, 'Độ dài tối đa là 1000 ký tự'),
  date_of_birth: yup.date().max(new Date(), 'Ngày sinh không phù hợp'),
  password: schema.fields['password'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  new_password: schema.fields['password'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  confirm_password: handleSchema('new_password')
})

export const loginScheam = schema.pick(['email', 'password'])

export type LoginSchema = yup.InferType<typeof loginScheam>

export const registerScheam = schema.pick(['email', 'password', 'confirmPassword'])

export type RegisterSchema = yup.InferType<typeof registerScheam>

export const priceFilterSchema = schema.pick(['price_min', 'price_max'])

export type PriceFilterSchema = yup.InferType<typeof priceFilterSchema>

export const searchSchema = schema.pick(['searchString'])

export type SearchSchema = yup.InferType<typeof searchSchema>

export type UserSchema = yup.InferType<typeof userSchema>
// export type LoginSchema = Omit<RegisterSchema, 'confirmPassword'>
