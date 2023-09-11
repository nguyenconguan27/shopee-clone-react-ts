import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import classNames from 'classnames'

import Button from 'src/components/Button'
import { sortBy, order as orderSort } from 'src/constants/productFilter'
import { ProductListConfig } from 'src/types/product.type'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import path from 'src/constants/path'
import omit from 'lodash/omit'

interface Props {
  queryConfig: QueryConfig
  pageSize: number
}

export default function SortProductList({ queryConfig, pageSize }: Props) {
  const { sort_by = '', order, page = '1' } = queryConfig
  const navigate = useNavigate()

  const isActiveFilter = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    return sort_by === sortByValue
  }

  const handleSort = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: sortByValue
          },
          ['order']
        )
      ).toString()
    })
  }

  const handlePriceOrder = (orderValue: Exclude<ProductListConfig['order'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        order: orderValue,
        sort_by: sortBy.price
      }).toString()
    })
  }

  return (
    <div className='bg-gray-200 py-4 px-3'>
      <div className='flex justify-between text-sm items-center'>
        <div className='flex gap-3 items-center flex-wrap'>
          <div>Sắp xếp theo</div>
          <Button
            className={classNames('px-3 py-2', {
              'bg-orange text-white hover:bg-orange/80': isActiveFilter(sortBy.view),
              'bg-white text-black hover:bg-slate-100': !isActiveFilter(sortBy.view)
            })}
            onClick={() => handleSort(sortBy.view)}
          >
            Phổ Biến
          </Button>
          <Button
            className={classNames('px-3 py-2', {
              'bg-orange text-white hover:bg-orange/80': isActiveFilter(sortBy.createdAt),
              'bg-white text-black hover:bg-slate-100': !isActiveFilter(sortBy.createdAt)
            })}
            onClick={() => handleSort(sortBy.createdAt)}
          >
            Mới Nhất
          </Button>
          <Button
            className={classNames('px-3 py-2', {
              'bg-orange text-white hover:bg-orange/80': isActiveFilter(sortBy.sold),
              'bg-white text-black hover:bg-slate-100': !isActiveFilter(sortBy.sold)
            })}
            onClick={() => handleSort(sortBy.sold)}
          >
            Bán chạy
          </Button>
          <select
            className={classNames('px-3 py-2 outline-none border-none', {
              'bg-orange text-white hover:bg-orange/80': isActiveFilter(sortBy.price),
              'bg-white text-black hover:bg-slate-100': !isActiveFilter(sortBy.price)
            })}
            value={order || ''}
            onChange={(event) => handlePriceOrder(event.target.value as Exclude<ProductListConfig['order'], undefined>)}
          >
            <option className='bg-gray-300 text-black py-3' value='' disabled>
              Giá
            </option>
            <option className='bg-white text-black py-3' value={orderSort.asc}>
              Giá: Thấp đến cao
            </option>
            <option className='bg-white text-black py-3' value={orderSort.desc}>
              Giá: Cao đến thấp
            </option>
          </select>
        </div>
        <div className='flex items-center'>
          <div>
            <span className='text-orange'>{page}</span>
            <span>/{pageSize}</span>
          </div>
          <div className='ml-2 flex'>
            {page !== '1' ? (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({ ...queryConfig, page: (Number(page) - 1).toString() }).toString()
                }}
                className='h-8 w-8 rounded-tl-sm border-[1px] bg-white flex justify-center items-center shadow hover:bg-slate-100'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-3 h-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </Link>
            ) : (
              <span className='h-8 w-8 rounded-tl-sm border-[1px] bg-gray-300 flex justify-center items-center shadow'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-3 h-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </span>
            )}

            {page !== pageSize.toString() ? (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({ ...queryConfig, page: (Number(page) + 1).toString() }).toString()
                }}
                className='h-8 w-8 rounded-tl-sm border-[1px] bg-white flex justify-center items-center shadow hover:bg-slate-100'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-3 h-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </Link>
            ) : (
              <span className='h-8 w-8 rounded-tl-sm border-[1px] bg-gray-300 flex justify-center items-center shadow'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-3 h-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
