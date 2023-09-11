import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import keyBy from 'lodash/keyBy'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

import purchaseApi from 'src/apis/purchase.api'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import path from 'src/constants/path'
import { purchasesStatus } from 'src/constants/purchase'
import { Purchase } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import noproduct from 'src/assets/image/no-product.png'

interface ExtendedPurchases extends Purchase {
  checked: boolean
  disable: boolean
}

export default function Cart() {
  const [extendedPurchases, setExtendedPurchases] = useState<ExtendedPurchases[]>([])
  console.log(extendedPurchases)
  const { data: purchasesData, refetch } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart })
  })
  const queryClient = useQueryClient()
  const updataMutation = useMutation({
    mutationFn: (body: { product_id: string; buy_count: number }) => purchaseApi.updatePurchase(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] })
    }
  })
  const deletePurchaseMutation = useMutation({
    mutationFn: (purchaseIds: string[]) => purchaseApi.deletePurchases(purchaseIds),
    onSuccess: () => {
      refetch()
    }
  })
  const buyPurchaseMutation = useMutation({
    mutationFn: (body: { product_id: string; buy_count: number }[]) => purchaseApi.buyProduct(body),
    onSuccess: () => {
      toast.success('Mua hàng thành công', {
        autoClose: 1000
      })
      refetch()
    }
  })
  const purchasesInCart = purchasesData?.data.data
  const location = useLocation()
  const choosenPurchaseIdFromLocation = (location.state as { purchaseId: string } | null)?.purchaseId
  // console.log(choosenPurchaseIdFromLocation)
  const isAllChecked = useMemo(
    () => extendedPurchases.every((purchase) => purchase.checked === true),
    [extendedPurchases]
  )
  const checkedPurchases = useMemo(() => extendedPurchases.filter((purchase) => purchase.checked), [extendedPurchases])
  useEffect(() => {
    setExtendedPurchases((prev) => {
      const exteneddpurchasesObject = keyBy(prev, '_id')
      return (
        purchasesInCart?.map((purchase) => ({
          ...purchase,
          checked:
            choosenPurchaseIdFromLocation === purchase._id || Boolean(exteneddpurchasesObject[purchase._id]?.checked),
          disable: false
        })) || []
      )
    })
  }, [purchasesInCart, choosenPurchaseIdFromLocation])

  const handleChecked = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases((prev) =>
      prev.map((purchase, index) => {
        if (index === purchaseIndex) {
          return { ...purchase, checked: event.target.checked }
        }
        return purchase
      })
    )
  }

  const handleAllChecked = () => {
    setExtendedPurchases((prev) => prev.map((purchase) => ({ ...purchase, checked: !isAllChecked })))
  }

  const handleUpdate = (purchaseIndex: number, value: number, enable: boolean) => {
    if (value === 0) {
      value = 1
      setExtendedPurchases((prev) =>
        prev.map((purchase, index) => {
          if (index === purchaseIndex) {
            return { ...purchase, buy_count: value }
          }
          return purchase
        })
      )
    } else if (enable) {
      const purchase = extendedPurchases[purchaseIndex]
      setExtendedPurchases((prev) =>
        prev.map((purchase, index) => {
          if (index === purchaseIndex) {
            return { ...purchase, disable: true }
          }
          return purchase
        })
      )
      updataMutation.mutate({ product_id: purchase.product._id, buy_count: value })
    }
  }

  const handleQuatityChange = (purchaseIndex: number, value: number, enable: boolean) => {
    if (enable) {
      setExtendedPurchases((prev) =>
        prev.map((purchase, index) => {
          if (index === purchaseIndex) {
            return { ...purchase, buy_count: value }
          }
          return purchase
        })
      )
    }
  }

  const handleDelete = (purchaseId: string) => {
    deletePurchaseMutation.mutate([purchaseId])
  }

  const handleDeleteMultiPurchase = () => {
    const purchaseIds = checkedPurchases.map((purchase) => purchase._id)
    deletePurchaseMutation.mutate(purchaseIds)
  }

  const totalCheckedPurchasePrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + current.product.price * current.buy_count
      }, 0),
    [checkedPurchases]
  )

  const totalCheckedPurchaseSavingPrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + (current.product.price_before_discount - current.product.price) * current.buy_count
      }, 0),
    [checkedPurchases]
  )

  const handleBuyPurchases = () => {
    if (checkedPurchases.length > 0) {
      const buyPurchases = extendedPurchases.filter((purchase) => purchase.checked)
      const body = buyPurchases.map((purchase) => ({ product_id: purchase.product._id, buy_count: purchase.buy_count }))
      buyPurchaseMutation.mutate(body)
    }
  }
  return (
    <div className='bg-neutral-100'>
      <div className='container'>
        <div className='overflow-auto'>
          <div className='pt-8'>
            <div className='min-w-[1000px]'>
              <div className='bg-white grid grid-cols-12 py-2 px-3 shadow-sm rounded-sm border border-gray-200'>
                <div className='col-span-6'>
                  <div className='flex items-center ml-8'>
                    <input
                      type='checkbox'
                      className='accent-orange h-4 w-4'
                      checked={isAllChecked}
                      onChange={handleAllChecked}
                    />
                    <span className='capitalize text-sm ml-4'>sản phẩm</span>
                  </div>
                </div>
                <div className='col-span-6'>
                  <div className='text-gray-400 capitalize'>
                    <div className='grid grid-cols-5 text-center'>
                      <span className='text-sm col-span-2'>Đơn giá</span>
                      <span className='text-sm col-span-1'>Số lượng</span>
                      <span className='text-sm col-span-1'>số tiền</span>
                      <span className='text-sm col-span-1'>thao tác</span>
                    </div>
                  </div>
                </div>
              </div>
              {extendedPurchases.length > 0 && (
                <div className='bg-white border border-gray-200 mt-3 py-4 px-3 shadow-sm rounded-sm'>
                  {extendedPurchases.map((purchase, index) => (
                    <div key={purchase._id} className='grid grid-cols-12 py-4 border shadow-sm last:mb-0 mb-4'>
                      <div className='col-span-6'>
                        <div className='flex items-center ml-8'>
                          <div className='flex items-center justify-center'>
                            <input
                              type='checkbox'
                              className='accent-orange h-4 w-4'
                              checked={purchase.checked}
                              onChange={handleChecked(index)}
                            />
                          </div>
                          <Link
                            to={`${path.home}${generateNameId({
                              name: purchase.product.name,
                              id: purchase.product._id
                            })}`}
                            className='ml-4 flex'
                          >
                            <img src={purchase.product.image} alt='' className='object-cover h-20 w-20' />
                            <span className='line-clamp-2 text-xs max-h-[30px] max-w-[150px] pl-2 mt-2'>
                              {purchase.product.name}
                            </span>
                          </Link>
                        </div>
                      </div>
                      <div className='col-span-6'>
                        <div className='grid grid-cols-5'>
                          <div className='col-span-2 text-center flex justify-center'>
                            <span className='line-through text-xs text-gray-400'>
                              {formatCurrency(purchase.product.price_before_discount)}
                            </span>
                            <span className='ml-3 text-sm text-gray-600'>{formatCurrency(purchase.product.price)}</span>
                          </div>
                          <div className='col-span-1'>
                            <QuantityController
                              productQuantity={purchase.product.quantity}
                              value={purchase.buy_count}
                              disabled={purchase.disable}
                              classNameWrapper='flex justify-center'
                              increase={(value) =>
                                handleUpdate(
                                  index,
                                  value,
                                  value <= purchase.product.quantity && purchase.buy_count !== value
                                )
                              }
                              decrease={(value) =>
                                handleUpdate(index, value, value >= 1 && purchase.buy_count !== value)
                              }
                              onType={(value) => handleQuatityChange(index, value, true)}
                              onFocusOut={(value) =>
                                handleUpdate(
                                  index,
                                  value,
                                  value <= purchase.product.quantity &&
                                    value >= 1 &&
                                    (purchasesInCart as Purchase[])[index].buy_count !== value
                                )
                              }
                            />
                          </div>
                          <div className='col-span-1 flex justify-center text-orange'>
                            {formatCurrency(purchase.price * purchase.buy_count)}
                          </div>
                          <div className='col-span-1 flex justify-center'>
                            <button
                              className='bg-none text-black outline-none hover:text-orange text-sm'
                              onClick={() => handleDelete(purchase._id)}
                            >
                              Xoá
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {extendedPurchases.length > 0 ? (
          <div className='sticky bg-white mt-4 shadow-sm border border-gray-200 bottom-0 z-10 flex flex-col sm:flex-row sm:items-center rounded-sm px-3 py-5 text-sm'>
            <div className='flex items-center'>
              <div className='flex flex-shrink-0 justify-center'>
                <input
                  type='checkbox'
                  className='accent-orange h-4 w-4'
                  checked={isAllChecked}
                  onChange={handleAllChecked}
                />
              </div>
              <button className='mx-3 bg-none border-none outline-none' onClick={handleAllChecked}>
                Chọn Tất Cả
              </button>
              <button className='mx-3 bg-none border-none outline-none' onClick={handleDeleteMultiPurchase}>
                Xoá
              </button>
            </div>

            <div className='sm:flex sm:items-center sm:ml-auto'>
              <div>
                <div className='flex items-center sm:justify-center'>
                  <div>Tổng thanh toán ({checkedPurchases.length} sản phẩm)</div>
                  <div className='ml-2 text-xl text-orange'>₫{formatCurrency(totalCheckedPurchasePrice)}</div>
                </div>
                <div className='flex items-center sm:justify-end text-sm'>
                  <div className='text-gray-500'> Tiết kiệm</div>
                  <div className='ml-2 text-sm text-orange'>₫{formatCurrency(totalCheckedPurchaseSavingPrice)}</div>
                </div>
              </div>
              <div className='flex'>
                <Button
                  className='text-center px-3 py-2 ml-auto sm:ml-4 uppercase bg-red-500 text-white text-sm flex-shrink-0 hover:bg-red-600'
                  onClick={handleBuyPurchases}
                >
                  Mua Hàng
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center mt-8'>
            <img src={noproduct} alt='' className='w-24 h-24' />
            <span className='text-gray-400 text-sm capitalize mt-4'>giỏ hàng của bạn trống</span>
            <Link to={path.home} className='bg-orange px-8 py-2 mt-4 text-white hover:bg-orange/90 uppercase'>
              mua hàng
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
