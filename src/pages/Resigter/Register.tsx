import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import omit from 'lodash/omit'

import Input from 'src/components/Input/Input'
import { RegisterSchema, registerScheam } from 'src/utils/rules'
import authApi from 'src/apis/auth.api'
import { isAxiosUnprocessableEntity } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import Button from 'src/components/Button'
import path from 'src/constants/path'

// interface FormData {
//   email: string
//   password: string
//   confirmPassword: string
// }
// const rules = getRules(getValues)

//validate trên front end
export default function Register() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<RegisterSchema>({
    resolver: yupResolver(registerScheam)
    // defaultValues: {
    //   email: '',
    //   password: '',
    //   confirmPassword: ''
    // }
  })
  // console.log('error', errors)

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<RegisterSchema, 'confirmPassword'>) => authApi.registerAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirmPassword'])
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate('/')
      },
      //validata phía back end
      onError: (error) => {
        if (isAxiosUnprocessableEntity<ErrorResponse<Omit<RegisterSchema, 'confirmPassword'>>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<RegisterSchema, 'confirmPassword'>, {
                message: formError[key as keyof Omit<RegisterSchema, 'confirmPassword'>],
                type: 'server'
              })
            })
          }
        }
        // if (isAxiosUnprocessableEntity<ErrorResponse<Omit<RegisterSchema, 'confirmPassword'>>>(error)) {
        //   const formError = error.response?.data.data
        //   if (formError) {
        //     setError('email', {
        //       message: formError.email,
        //       type: 'server'
        //     })
        //   }
        // }
      }
    })
  })

  // console.log(errors)
  return (
    <div className='bg-orange h-700 max-h-700'>
      <div className='container'>
        <div className='grid grid-cols-1 py-10 lg:grid-cols-7 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-5'>
            <form className='form-account' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Đăng ký</div>
              <Input
                name='email'
                placeholder='Email'
                register={register}
                errorMessage={errors.email?.message}
                className='mt-6'
                type='email'
              />
              <Input
                name='password'
                placeholder='Password'
                register={register}
                errorMessage={errors.password?.message}
                className='mt-3'
                classNameEye='absolute right-[5px] top-[12px] w-5 h-5'
                type='password'
              />
              <Input
                name='confirmPassword'
                placeholder='confirm password'
                register={register}
                errorMessage={errors.confirmPassword?.message}
                className='mt-3'
                classNameEye='absolute right-[5px] top-[12px] w-5 h-5'
                type='password'
              />
              <div className='mt-3'>
                <Button
                  type='submit'
                  className='w-full py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600'
                  isLoading={registerAccountMutation.isLoading}
                  disabled={registerAccountMutation.isLoading}
                >
                  Đăng ký
                </Button>
              </div>
              <div className='mt-3 text-center'>
                <div className='flex justify-center items-center'>
                  <span className='text-slate-400'>Bạn đã có tài khoản?</span>
                  <Link className='text-red-400 ml-1' to={path.login}>
                    Đăng nhập
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
