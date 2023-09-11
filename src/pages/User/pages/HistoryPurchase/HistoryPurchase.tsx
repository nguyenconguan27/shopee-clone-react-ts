import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { Link, createSearchParams } from 'react-router-dom'
import purchaseApi from 'src/apis/purchase.api'
import path from 'src/constants/path'
import { purchasesStatus } from 'src/constants/purchase'
import useQueryParams from 'src/hooks/useQueryParams'
import { PurchaseListStatus } from 'src/types/purchase.type'
import { generateNameId } from 'src/utils/utils'

const purchaseTabs = [
  { status: purchasesStatus.all, name: 'Tất cả' },
  { status: purchasesStatus.waitForConfirmation, name: 'Chờ xác nhận' },
  { status: purchasesStatus.waitForGetting, name: 'Chờ lấy hàng' },
  { status: purchasesStatus.inProgress, name: 'Đang giao' },
  { status: purchasesStatus.delivered, name: 'Đã giao' },
  { status: purchasesStatus.cancelled, name: 'Đã hủy' }
]

export default function HistoryPurchase() {
  const params: { status?: string } = useQueryParams()
  const status = Number(params.status) || purchasesStatus.all
  const { data: purchasesData } = useQuery({
    queryKey: ['purchases', { status: status }],
    queryFn: () => purchaseApi.getPurchases({ status: status as PurchaseListStatus })
  })
  const purchases = purchasesData?.data.data
  console.log(purchasesData)

  const purchaseTapLinks = purchaseTabs.map((tap) => (
    <Link
      key={tap.status}
      to={{
        pathname: path.historyPurchase,
        search: createSearchParams({ status: String(tap.status) }).toString()
      }}
      className={classNames('text-center py-3 flex-1', {
        'text-orange border-b border-b-orange': status === tap.status,
        'text-gray-600': status !== tap.status
      })}
    >
      {tap.name}
    </Link>
  ))

  return (
    <div>
      <div className='sticky top-0'>
        <div className='flex bg-white rounded-sm shadow-sm'>{purchaseTapLinks}</div>
        <div>
          {purchases?.map((purchase) => (
            <div key={purchase._id} className='bg-white shadow-sm rounded-sm my-3 hover:bg-gray-100'>
              <Link
                to={{
                  pathname: `${path.home}${generateNameId({
                    name: purchase.product.name,
                    id: purchase.product._id
                  })}`
                }}
              >
                <div className='p-3'>
                  <div className='flex justify-between'>
                    <div className='flex'>
                      <img src={purchase.product.image} alt='' className='h-14 w-14 object-cover' />
                      <div className='ml-3 overflow-hidden max-w-[500px]'>
                        <div className='truncate text-sm'>{purchase.product.name}</div>
                        <div className='text-xs'>x{purchase.buy_count}</div>
                      </div>
                    </div>
                    <div className='flex-shrink-0 flex-grow-0'>
                      <span className='text-xs line-through text-gray-400'>
                        {purchase.product.price_before_discount}
                      </span>
                      <span className='text-orange text-xs ml-2'>{purchase.product.price}</span>
                    </div>
                  </div>
                  <div className='text-right flex-shrink-0'>
                    <span className='text-gray-500'>Tổng số tiền</span>
                    <span className='text-orange ml-3'>{purchase.price}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
