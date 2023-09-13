import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Fragment, useContext, useEffect, useMemo, useState } from 'react'
import { useForm, useFormContext, Controller, FormProvider } from 'react-hook-form'
import userApi from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { InputNumber } from 'src/components/InputNumber'
import { UserSchema, userSchema } from 'src/utils/rules'
import DateSelect from '../../components/DateSelect'
import { toast } from 'react-toastify'
import { AppContext } from 'src/contexts/app.context'
import { saveProfileToLS } from 'src/utils/auth'
import { getAvatarURL, isAxiosUnprocessableEntity } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import InputFile from 'src/components/InputFile'
import { useTranslation } from 'react-i18next'

function Info() {
  const methods = useFormContext<FormData>()
  const {
    register,
    control,
    formState: { errors }
  } = methods
  return (
    <Fragment>
      <div className='mt-8 flex items-start flex-wrap'>
        <div className='md:w-[20%] text-gray-600 text-right'>Tên </div>
        <div className='md:ml-3 md:w-[70%] w-[100%]'>
          <Input
            classNameInput='p-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
            name='name'
            placeholder='Tên'
            register={register}
            errorMessage={errors.name?.message}
          />
        </div>
      </div>
      <div className='mt-4 flex items-start flex-wrap'>
        <div className='md:w-[20%] text-gray-600 text-right'>Số điện thoại</div>
        <div className='md:ml-3 md:w-[70%] w-[100%]'>
          <Controller
            name='phone'
            control={control}
            render={({ field }) => (
              <InputNumber
                classNameInput='p-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                {...field}
                placeholder='Số điện thoại'
                onChange={field.onChange}
                errorMessage={errors.phone?.message}
              />
            )}
          ></Controller>
        </div>
      </div>
      <div className='mt-4 flex items-start flex-wrap'>
        <div className='md:w-[20%] text-gray-600 text-right'>Đại chỉ</div>
        <div className='md:ml-3 md:w-[70%] w-[100%]'>
          <Input
            classNameInput='p-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
            name='address'
            placeholder='Địa chỉ'
            register={register}
            errorMessage={errors.address?.message}
          />
        </div>
      </div>
      <Controller
        control={control}
        name='date_of_birth'
        render={({ field }) => (
          <DateSelect value={field.value} onChange={field.onChange} errorMessage={errors.date_of_birth?.message} />
        )}
      />
    </Fragment>
  )
}
type FormError = Omit<FormData, 'date_of_birth'> & {
  date_of_birth: string
}
type FormData = Pick<UserSchema, 'name' | 'address' | 'phone' | 'date_of_birth' | 'avatar'>
export default function Profile() {
  const { t } = useTranslation('profile')
  const { setProfile } = useContext(AppContext)
  const [file, setFile] = useState<File>()
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])
  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: () => userApi.getProfile()
  })
  const updateProfileMutation = useMutation(userApi.updateProfile)

  const profileSchema = userSchema.pick(['name', 'address', 'phone', 'date_of_birth', 'avatar'])
  const uploadAvatarMutation = useMutation(userApi.uploadAvatar)
  const methods = useForm<FormData>({
    defaultValues: {
      name: '',
      address: '',
      avatar: '',
      phone: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver<FormData>(profileSchema)
  })

  const { handleSubmit, setValue, setError, watch } = methods

  const avatar = watch('avatar')
  const profile = profileData?.data.data
  useEffect(() => {
    setValue('name', profile?.name || '')
    setValue('address', profile?.address || '')
    setValue('phone', profile?.phone || '')
    setValue('date_of_birth', profile?.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1))
  }, [profile, setValue])

  const onSubmit = handleSubmit(async (data) => {
    // console.log(data)
    try {
      let avatarName = avatar
      if (file) {
        const form = new FormData()
        form.append('image', file)
        const uploadResp = await uploadAvatarMutation.mutateAsync(form)
        avatarName = uploadResp.data.data
        setValue('avatar', avatarName)
      }
      const res = await updateProfileMutation.mutateAsync({
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        avatar: avatarName
      })
      toast.success(res.data.message)
      refetch()
      setProfile(res.data.data)
      saveProfileToLS(res.data.data)
    } catch (error) {
      if (isAxiosUnprocessableEntity<ErrorResponse<FormError>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormError, {
              message: formError[key as keyof FormError],
              type: 'server'
            })
          })
        }
      }
    }
  })

  const handleUploadFile = (file?: File) => {
    setFile(file)
  }
  return (
    <div className='bg-white shadow-sm rounded-sm p-5 text-sm'>
      <div className='border-b border-gray-200 pb-6 pl-3'>
        <span className='capitalize block'>{t('profile.my profile')}</span>
        <span className='text-gray-600'>{t('profile.manage profile')}</span>
      </div>
      <FormProvider {...methods}>
        <form onSubmit={onSubmit} className='pt-3 flex flex-col flex-col-reverse md:flex-row md:ml-10'>
          <div className='md:w-[70%]'>
            <div className='mt-4 flex items-start flex-wrap'>
              <div className='md:w-[20%] text-gray-600 text-right'>Email</div>
              <div className='ml-3 md:w-[70%] w-[100%]'>{profile?.email}</div>
            </div>
            <Info />
            <div className='flex flex-wrap'>
              <div className='md:w-[20%]'></div>
              <div className='mt-2 pl-3 md:w-[70%] w-[100%]'>
                <Button className='bg-orange text-white px-3 py-2' type='submit'>
                  Lưu
                </Button>
              </div>
            </div>
          </div>
          <div className='flex justify-center flex-grow items-center flex-shrink-0'>
            <div className='flex flex-col items-center'>
              <div className='h-24 w-24'>
                <img
                  src={previewImage || getAvatarURL(profile?.avatar)}
                  alt=''
                  className='object-cover rounded-full h-full w-full'
                />
              </div>
              <InputFile onChange={handleUploadFile} />
              <div className='mt-4 flex flex-col items-center text-gray-500'>
                <div>Dụng lượng file tối đa 1 MB</div>
                <div>Định dạng:.JPEG, .PNG</div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
