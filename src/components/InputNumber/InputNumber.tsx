import { InputHTMLAttributes, forwardRef } from 'react'
import { UseFormRegister, RegisterOptions } from 'react-hook-form'

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  register?: UseFormRegister<any>
  classNameError?: string
  classNameInput?: string
  rules?: RegisterOptions<any> //không sử dụng yup thì tạo ra các rules.
  errorMessage?: string
  //   ref: React.ForwardedRef<HTMLInputElement>
}

export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputInner(
  {
    className,
    errorMessage,
    name,
    classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm',
    classNameError = 'mt-1 text-red-600 min-h-[1.25rem] text-sm',
    onChange,
    ...rest
  }: InputNumberProps,
  ref
) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if ((/^\d+$/.test(value) || value === '') && onChange) {
      //
      onChange(event)
    }
  }
  return (
    <div className={className}>
      <input className={classNameInput} {...rest} onChange={handleChange} ref={ref} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
})

// export default function InputNumber({
//   className,
//   errorMessage,
//   name,
//   classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm',
//   classNameError = 'mt-1 text-red-600 min-h-[1.25rem] text-sm',
//   onChange,
//   ref,
//   ...rest
// }: FormData) {
//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const { value } = event.target
//     if ((/^\d+$/.test(value) || value === '') && onChange) {
//       //
//       onChange(event)
//     }
//   }
//   return (
//     <div className={className}>
//       <input className={classNameInput} {...rest} onChange={handleChange} ref={ref} />
//       <div className={classNameError}>{errorMessage}</div>
//     </div>
//   )
// }
