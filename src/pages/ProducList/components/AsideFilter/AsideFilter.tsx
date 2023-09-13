import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import Button from 'src/components/Button'
import path from 'src/constants/path'
import { Category } from 'src/types/category.type'

import { PriceFilterSchema, priceFilterSchema } from 'src/utils/rules'
import { NoUndefindField } from 'src/types/utils.type'
import { ObjectSchema } from 'yup'
import RatingStar from '../RatingStar'
import omit from 'lodash/omit'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import { InputNumber } from 'src/components/InputNumber'

import { useTranslation } from 'react-i18next'

interface Props {
  queryConfig: QueryConfig
  categories: Category[]
}

type FormData = NoUndefindField<PriceFilterSchema>

export default function AsideFilter({ queryConfig, categories }: Props) {
  const { t } = useTranslation('home')
  const { category } = queryConfig
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: { price_min: '', price_max: '' },
    resolver: yupResolver<FormData>(priceFilterSchema as ObjectSchema<FormData>)
  })
  // const value = watch()
  // console.log(errors)
  const navigate = useNavigate()
  const onSubmit = handleSubmit((data) => {
    // console.log(data)
    navigate({
      pathname: path.home,
      search: createSearchParams({ ...queryConfig, price_max: data.price_max, price_min: data.price_min }).toString()
    })
  })

  const removeFilter = () => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit({ ...queryConfig }, ['rating_filter', 'price_min', 'price_max', 'category'])
      ).toString()
    })
  }
  return (
    <div>
      <Link className='font-bold flex items-center' to={path.home}>
        <svg viewBox='0 0 12 10' className='mr-3 h-4 w-3 fill-current'>
          <g fillRule='evenodd' stroke='none' strokeWidth={1}>
            <g transform='translate(-373 -208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                </g>
              </g>
            </g>
          </g>
        </svg>
        <span>{t('aside filter.all categories')}</span>
      </Link>
      <div className='bg-gray-300 h-[1px] my-4' />
      <ul className='pl-2'>
        {categories.map((categoryItem) => {
          const isActive = categoryItem._id === category
          return (
            <li className='py-1 relative' key={categoryItem._id}>
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({ ...queryConfig, category: categoryItem._id }).toString()
                }}
                className={classNames('flex items-center ml-2', {
                  'text-orange hover:text-orange/80': isActive,
                  'text-black': !isActive
                })}
              >
                {isActive && (
                  <svg viewBox='0 0 4 7' className='absolute -left-2 h-2 w-2 fill-orange'>
                    <polygon points='4 3.5 0 0 0 7' />
                  </svg>
                )}
                <span>{categoryItem.name}</span>
              </Link>
            </li>
          )
        })}
      </ul>
      <Link to={path.home} className='flex items-center mt-4 uppercase font-bold'>
        <svg
          enableBackground='new 0 0 15 15'
          viewBox='0 0 15 15'
          x={0}
          y={0}
          className='mr-3 h-4 w-3 fill-current stroke-current'
        >
          <g>
            <polyline
              fill='none'
              points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeMiterlimit={10}
            />
          </g>
        </svg>
        <span>{t('aside filter.fileter')}</span>
      </Link>
      <div className='bg-gray-300 h-[1px] my-4' />

      <div className='my-4'>
        <div>{t('aside filter.price range')}</div>
        <form className='mt-2 flex-col' onSubmit={onSubmit}>
          <div className='flex items-start'>
            <Controller
              control={control}
              name='price_min'
              render={(arg) => (
                <InputNumber
                  type='text'
                  className='grow'
                  classNameError='hidden'
                  placeholder={`đ ${t('aside filter.from')}`}
                  classNameInput='p-1 w-full outline-none border border-gray-300 rounded-sm focus:shadow-sm'
                  onChange={(event) => {
                    arg.field.onChange(event)
                    trigger('price_max')
                  }}
                  value={arg.field.value}
                  ref={arg.field.ref}
                ></InputNumber>
              )}
            />
            <div className='mx-2 shrink-0'>-</div>
            <Controller
              control={control}
              name='price_max'
              render={(arg) => (
                <InputNumber
                  type='text'
                  className='grow'
                  classNameError='hidden'
                  placeholder={`đ ${t('aside filter.to')}`}
                  classNameInput='p-1 w-full outline-none border border-gray-300 rounded-sm focus:shadow-sm'
                  onChange={(event) => {
                    arg.field.onChange(event)
                    trigger('price_min')
                  }}
                  value={arg.field.value}
                  ref={arg.field.ref}
                ></InputNumber>
              )}
            />
          </div>
          <div className='mt-2 text-red-600 min-h-[1.25rem] text-sm text-center'>{errors.price_min?.message}</div>
          <Button className='bg-orange hover:opacity-90 text-white px-8 py-2 w-full uppercase'>
            {t('aside filter.apply')}
          </Button>
        </form>
      </div>
      <div className='bg-gray-300 h-[1px] my-4' />
      <div className='text-sm'>{t('aside filter.rate')}</div>
      <RatingStar queryConfig={queryConfig} />
      <Button className='bg-orange hover:opacity-90 text-white px-8 py-2 w-full uppercase' onClick={removeFilter}>
        {t('aside filter.delete all')}
      </Button>
    </div>
  )
}
