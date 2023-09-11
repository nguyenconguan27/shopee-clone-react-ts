import range from 'lodash/range'
import React, { useEffect, useState } from 'react'

interface Props {
  onChange?: (value: Date) => void
  value?: Date
  errorMessage?: string
}

export default function DateSelect({ value, onChange, errorMessage }: Props) {
  const [date, setDate] = useState({
    date: value ? value.getDate() : 1,
    month: value ? value.getMonth() : 0,
    year: value ? value.getFullYear() : 1990
  })

  useEffect(() => {
    if (value) {
      setDate({
        date: value.getDate(),
        month: value.getMonth(),
        year: value.getFullYear()
      })
    }
  }, [value])

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = event.target
    const newDate = {
      ...date,
      [name]: value
    }
    setDate(newDate)
    onChange && onChange(new Date(newDate.year, newDate.month, newDate.date))
  }
  return (
    <div className='flex items-center'>
      <div className='md:w-[20%] text-right text-gray-600'>Ngày</div>
      <div className='flex justify-center pl-3'>
        <select
          onChange={handleChange}
          name='name'
          className='border border-gray-300 px-3 py-2 hover:border-orange cursor-pointer'
          value={value?.getDate() || date.date}
        >
          {range(1, 32).map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          onChange={handleChange}
          name='month'
          className='border border-gray-300 px-3 py-2 hover:border-orange cursor-pointer mx-3'
          value={value?.getMonth() || date.month}
        >
          {range(0, 13).map((item) => (
            <option value={item} key={item}>
              {item + 1}
            </option>
          ))}
        </select>
        <select
          onChange={handleChange}
          name='year'
          className='border border-gray-300 px-3 py-2 hover:border-orange cursor-pointer'
          value={value?.getFullYear() || date.year}
        >
          {range(1990, 2024).map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className='m'>{errorMessage}</div>
    </div>
  )
}
