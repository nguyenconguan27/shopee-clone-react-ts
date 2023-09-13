import { UserSchema, userSchema } from 'src/utils/rules'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import userApi from 'src/apis/user.api'
import { isAxiosUnprocessableEntity } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import omit from 'lodash/omit'
import { yupResolver } from '@hookform/resolvers/yup'
import { Helmet } from 'react-helmet-async'

type FormData = Pick<UserSchema, 'password' | 'confirm_password' | 'new_password'>

export default function ChangePassword() {
  const updateProfileMutation = useMutation(userApi.updateProfile)
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError
  } = useForm<FormData>({
    defaultValues: {
      password: '',
      new_password: '',
      confirm_password: ''
    },
    resolver: yupResolver<FormData>(userSchema)
  })
  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updateProfileMutation.mutateAsync(omit(data, ['confirm_password']))
      toast.success(res.data.message)
    } catch (error) {
      if (isAxiosUnprocessableEntity<ErrorResponse<FormData>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
              type: 'server'
            })
          })
        }
      }
    }
  })
  return (
    <div className='bg-white shadow-sm rounded-sm p-5 text-sm'>
      <Helmet>
        <title>Đổi mật khẩu</title>
        <meta name='description' content='Đổi mật khẩu' />
      </Helmet>
      <div className='border-b border-gray-200 pb-6 pl-3'>
        <span className='capitalize block'>đổi mật khẩu</span>
        <span className='text-gray-600'>Quản lý thông tin hồ sơ để bảo mật tài khoản</span>
      </div>

      <form onSubmit={onSubmit} className='pt-3 flex flex-col flex-col-reverse md:flex-row md:ml-10'>
        <div className='md:w-[70%]'>
          <div className='mt-4 flex items-start flex-wrap'>
            <div className='md:w-[20%] text-gray-600 text-right'>Mật khẩu cũ</div>
            <div className='md:ml-3 md:w-[70%] w-[100%]'>
              <Input
                className='relative'
                type='password'
                classNameInput='p-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                name='password'
                placeholder='Mật khẩu cũ'
                register={register}
                errorMessage={errors.password?.message}
              />
            </div>
          </div>
          <div className='mt-4 flex items-start flex-wrap'>
            <div className='md:w-[20%] text-gray-600 text-right'>Mật khẩu mới</div>
            <div className='md:ml-3 md:w-[70%] w-[100%]'>
              <Input
                className='relative'
                type='password'
                classNameInput='p-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                name='new_password'
                placeholder='Mật khẩu mới'
                register={register}
                errorMessage={errors.new_password?.message}
              />
            </div>
          </div>
          <div className='mt-4 flex items-start flex-wrap'>
            <div className='md:w-[20%] text-gray-600 text-right'>Nhập lại</div>
            <div className='md:ml-3 md:w-[70%] w-[100%]'>
              <Input
                className='relative'
                type='password'
                classNameInput='p-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                name='confirm_password'
                placeholder='Nhập lại mật khẩu mới'
                register={register}
                errorMessage={errors.confirm_password?.message}
              />
            </div>
          </div>
          <div className='flex flex-wrap'>
            <div className='md:w-[20%]'></div>
            <div className='mt-2 pl-3 md:w-[70%] w-[100%]'>
              <Button className='bg-orange text-white px-3 py-2' type='submit'>
                Lưu
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
