import { InputNumber, InputNumberProps } from '../InputNumber'

interface Props extends InputNumberProps {
  onType?: (value: number) => void
  decrease?: (value: number) => void
  increase?: (value: number) => void
  onFocusOut?: (value: number) => void
  value: number
  productQuantity: number
  classNameWrapper: string
}

export default function QuantityController({
  onType,
  decrease,
  increase,
  onFocusOut,
  value,
  productQuantity,
  classNameWrapper
}: Props) {
  const handleDecrease = () => {
    if (value > 1) {
      value = value - 1
    }
    decrease && decrease(value)
  }
  const handleIncrease = () => {
    if (value < productQuantity) {
      value = value + 1
    }
    increase && increase(value)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let _value = Number(event.target.value)
    if (_value > productQuantity) {
      _value = productQuantity
    }
    onType && onType(_value)
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    onFocusOut && onFocusOut(Number(event.target.value))
  }

  return (
    <div className={classNameWrapper}>
      <button className='px-2 py-2 border border-gray-300' onClick={handleDecrease}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-3 h-3'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 12h-15' />
        </svg>
      </button>
      <InputNumber
        value={value}
        className='w-14'
        classNameError='hidden'
        classNameInput='px-2 py-2 outline-none border-t border-b border-gray-300 text-center w-full'
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <button className='px-2 py-2 border border-gray-300' onClick={handleIncrease}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-3 h-3'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
        </svg>
      </button>
    </div>
  )
}
