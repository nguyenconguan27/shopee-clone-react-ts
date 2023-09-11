import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import productApi from 'src/apis/product.api'
import ProductRating from 'src/components/ProductRating'
import { Product as ProductType, ProductListConfig } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocialStyle, getIdFromNameId, perSale } from 'src/utils/utils'
import Product from '../ProducList/components/Product'
import QuantityController from 'src/components/QuantityController'
import purchaseApi from 'src/apis/purchase.api'
import { purchasesStatus } from 'src/constants/purchase'
import path from 'src/constants/path'

export default function ProductDetail() {
  const [buyCount, setBuyCount] = useState(1)
  const [activeImage, setActiveImage] = useState('')
  const { nameId } = useParams()
  const id = getIdFromNameId(nameId as string)
  const [currentIndexImages, setCurrentIndexImage] = useState([0, 5])
  const imageRef = useRef<HTMLImageElement>(null)
  const navigate = useNavigate()
  const { data: productDetailData } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductDetail(id as string)
  })
  const product = productDetailData?.data.data
  const purchaseMutation = useMutation(purchaseApi.addToCart)
  const queryConfig: ProductListConfig = {
    category: productDetailData?.data.data.category._id,
    limit: 20,
    page: 1
  }
  const queryClient = useQueryClient()
  // console.log(product)

  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImage(product.images[0])
    }
  }, [product])

  const currentImages: string[] = useMemo(
    () => (product ? product.images.slice(...currentIndexImages) : []),
    [product, currentIndexImages]
  )

  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => productApi.getProducts(queryConfig),
    staleTime: 2 * 60 * 1000,
    enabled: Boolean(product)
  })
  // console.log(productsData)
  const handleActiveImage = (image: string) => {
    setActiveImage(image)
  }

  const next = () => {
    if (currentIndexImages[1] < (product as ProductType).images.length) {
      setCurrentIndexImage((prev) => [prev[0] + 1, prev[1] + 1])
    }
  }

  const pre = () => {
    if (currentIndexImages[0] > 0) {
      setCurrentIndexImage((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }

  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const image = imageRef.current as HTMLImageElement
    const { naturalHeight, naturalWidth } = image
    // Cách 1: Lấy offsetX, offsetY đơn giản khi chúng ta đã xử lý được bubble event
    // const { offsetX, offsetY } = event.nativeEvent

    // Cách 2: Lấy offsetX, offsetY khi chúng ta không xử lý được bubble event
    const offsetX = event.pageX - (rect.x + window.scrollX)
    const offsetY = event.pageY - (rect.y + window.scrollY)

    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)
    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'
  }

  const handleRemoveZoom = () => {
    imageRef.current?.removeAttribute('style')
  }

  const handleChangeQuantity = (value: number) => {
    setBuyCount(value)
  }

  const handleAddToCart = () => {
    purchaseMutation.mutate(
      { product_id: product?._id as string, buy_count: buyCount },
      {
        onSuccess: () => {
          toast.success('Thêm giỏ hàng thành công', {
            autoClose: 1000
          })
          queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] })
        }
      }
    )
  }

  const handleByNow = async () => {
    const res = await purchaseMutation.mutateAsync({ product_id: (product as ProductType)?._id, buy_count: buyCount })
    const purchase = res.data.data
    navigate(path.cart, {
      state: { purchaseId: purchase._id }
    })
  }

  const handleFocusOut = (value: number) => {
    if (value === 0) {
      setBuyCount(1)
    }
  }
  if (!product) return null
  return (
    <div className='bg-gray-100 py-6'>
      <div className='container bg-white py-3 grid grid-cols-12 gap-4 shadow-sm'>
        <div className='col-span-5'>
          <div
            className='relative w-full pt-[100%] shadow overflow-hidden cursor-zoom-in'
            onMouseMove={handleZoom}
            onMouseLeave={handleRemoveZoom}
          >
            <img
              src={activeImage}
              alt={product.name}
              className='object-cover absolute left-0 top-0 w-full h-full'
              ref={imageRef}
            />
          </div>
          <div className='grid grid-cols-5 gap-4 mt-3 relative'>
            <button
              className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 text-white bg-black/20'
              onClick={pre}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-6 h-6'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
              </svg>
            </button>
            <button
              className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 text-white bg-black/20'
              onClick={next}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-6 h-6'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
              </svg>
            </button>
            {currentImages.map((image) => {
              const isActive = image === activeImage
              return (
                <div key={image} className='relative pt-[100%]' onMouseEnter={() => handleActiveImage(image)}>
                  <img className='absolute left-0 top-0 w-full h-full object-cover' src={image} alt='' />
                  {isActive && <div className='absolute inset-0 border-[2px] border-orange'></div>}
                </div>
              )
            })}
          </div>
        </div>
        <div className='col-span-7 ml-3'>
          <h1 className='uppercase font-medium text-2xl'>{product?.name}</h1>
          <div className='flex items-center mt-4'>
            <div className='flex items-center'>
              <span className='border-b-2 border-b-orange mr-2'>{product.rating}</span>
              <ProductRating
                activeClassname='w-4 h-4 fill-orange text-orange'
                noneActiveClassname='w-4 h-4 fill-gray-300 text-white'
                rating={product?.rating}
              />
            </div>
            <div className='pl-5 border-l-3 border-l-gray-300'>
              <span className='mr-1'>{formatNumberToSocialStyle(product.sold)}</span>
              <span className='text-sm text-gray-500'>Đã bán</span>
            </div>
          </div>
          <div className='mt-8 mx-4 flex items-center'>
            <span className='line-through text-gray-400 text-sm'>{formatCurrency(product.price_before_discount)}</span>
            <span className='text-orange ml-4'>₫</span>
            <span className='text-orange text-2xl'>{formatCurrency(product.price)}</span>
            <div className='rounded-sm bg-orange text-white uppercase text-sm ml-2 px-1 py-1'>
              {perSale(product.price_before_discount, product.price)} Giảm
            </div>
          </div>
          <div className='flex mt-6 items-center'>
            <span className='text-gray-400 capitalize text-sm'>số lượng</span>
            <QuantityController
              classNameWrapper='flex ml-5'
              value={buyCount}
              productQuantity={product.quantity}
              onType={(value) => handleChangeQuantity(value)}
              decrease={(value) => handleChangeQuantity(value)}
              increase={(value) => handleChangeQuantity(value)}
              onFocusOut={(value) => handleFocusOut(value)}
            />
            <span className='text-gray-400 capitalize text-xs ml-2'>{product.quantity} sản phẩm có sẵn</span>
          </div>
          <div className='flex mt-6'>
            <button
              className='px-3 py-2 bg-orange/10 flex border-orange rounded-sm border text-orange capitalize'
              onClick={handleAddToCart}
            >
              <svg
                enableBackground='new 0 0 15 15'
                viewBox='0 0 15 15'
                x={0}
                y={0}
                className='mr-[10px] h-5 w-5 fill-current stroke-orange text-orange'
              >
                <g>
                  <g>
                    <polyline
                      fill='none'
                      points='.5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeMiterlimit={10}
                    />
                    <circle cx={6} cy='13.5' r={1} stroke='none' />
                    <circle cx='11.5' cy='13.5' r={1} stroke='none' />
                  </g>
                  <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1='7.5' x2='10.5' y1={7} y2={7} />
                  <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1={9} x2={9} y1='8.5' y2='5.5' />
                </g>
              </svg>
              Thêm vào giỏ hàng
            </button>
            <button
              className=' ml-5 bg-orange rounded-sm text-white capitalize px-2 py-2 hover:bg-orange/90'
              onClick={handleByNow}
            >
              mua ngay
            </button>
          </div>
        </div>
      </div>
      <div className='container bg-white text-xs leading-loose mt-3 shadow-sm'>
        <span className='capitalize text-xl'>chi tiết sản phẩm</span>
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(product.description)
          }}
        />
      </div>
      {productsData && (
        <div className='mt-8'>
          <div className='container bg-gray-50 shadow pt-3'>
            <span className='uppercase mt-4 text-gray-400'>có thể bạn cũng thích</span>
            <div className='grid sm:grid-cols-3 md:grid-cols-4 lg:gird-cols-5 xl:grid-cols-6 gap-4'>
              {productsData.data.data.products.map((product) => (
                <div className='col-span-1' key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
