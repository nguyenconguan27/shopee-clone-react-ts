import classNames from 'classnames'
import { Link, createSearchParams } from 'react-router-dom'
import path from 'src/constants/path'
import { QueryConfig } from 'src/hooks/useQueryConfig'

interface Props {
  queryConfig: QueryConfig
  pageSize: number
}

const RANGE = 2
export default function Pagination({ queryConfig, pageSize }: Props) {
  const page = Number(queryConfig.page)
  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false
    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <span className='bg-white px-3 py-2 shadow-sm border' key={index}>
            ...
          </span>
        )
      }
      return null
    }
    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <span className='bg-white px-3 py-2 shadow-sm border' key={index}>
            ...
          </span>
        )
      }
      return null
    }
    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1
        if (page <= RANGE * 2 + 1 && pageNumber < pageSize - RANGE + 1 && pageNumber > page + RANGE) {
          return renderDotAfter(index)
        } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
          if (pageNumber < page - RANGE && pageNumber > RANGE) {
            return renderDotBefore(index)
          } else if (pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
            return renderDotAfter(index)
          }
        } else if (page >= pageSize - RANGE * 2 && pageNumber < page - RANGE && pageNumber > RANGE) {
          return renderDotBefore(index)
        }
        return (
          <Link
            to={{
              pathname: path.home,
              search: createSearchParams({
                ...queryConfig,
                page: pageNumber.toString()
              }).toString()
            }}
            className={classNames('bg-white px-3 py-2 shadow-sm cursor-pointer border hover:bg-gray-200', {
              'border-cyan-500': page === pageNumber
            })}
            key={index}
          >
            {pageNumber}
          </Link>
        )
      })
  }

  return (
    <div className='flex flex-wrap mt-6 justify-center text-xs'>
      {page === 1 ? (
        <span className='bg-gray-300 px-4 py-2 shadow-sm cursor-not-allowed border rounded-tl-md rounded-es-md'>
          Pre
        </span>
      ) : (
        <Link
          to={{
            pathname: path.home,
            search: createSearchParams({ ...queryConfig, page: (page - 1).toString() }).toString()
          }}
          className='bg-white px-3 py-2 shadow-sm cursor-pointer border-gray-200 border-[1px] hover:bg-gray-200 rounded-tl-md rounded-es-md'
        >
          Pre
        </Link>
      )}
      {renderPagination()}
      {page === pageSize ? (
        <span className='bg-gray-300 px-4 py-2 shadow-sm cursor-not-allowed border rounded-tr-md rounded-ee-md'>
          Next
        </span>
      ) : (
        <Link
          to={{
            pathname: path.home,
            search: createSearchParams({ ...queryConfig, page: (page + 1).toString() }).toString()
          }}
          className='bg-white px-3 py-2 shadow-sm cursor-pointer border-gray-200 border-[1px] hover:bg-gray-200 rounded-tr-md rounded-ee-md'
        >
          Next
        </Link>
      )}
    </div>
  )
}
