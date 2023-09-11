import { Link } from 'react-router-dom'
import ProductRating from 'src/components/ProductRating'
import path from 'src/constants/path'
import { Product as ProductType } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocialStyle, generateNameId } from 'src/utils/utils'

interface Props {
  product: ProductType
}

export default function Product({ product }: Props) {
  return (
    <Link to={`${path.home}${generateNameId({ name: product.name, id: product._id })}`}>
      <div className='pb-2 my-3 bg-white shadow-sm rounded-sm hover:translate-y-[-0.03rem] hover:shadow-md duration-100 transition-transform overflow-hidden'>
        <div className='w-full pt-[100%] relative'>
          <img src={product.image} alt='' className='absolute top-0 left-0 w-full h-full object-cover' />
        </div>
        <div className='px-2 py-4'>
          <div className='min-h-[2rem] text-xs line-clamp-2 overflow-hidden'>{product.name}</div>
          <div className='pt-2 text-sm'>
            <span className=' text-gray-400'>₫</span>
            <span className='line-through text-gray-400'>{formatCurrency(product.price_before_discount)}</span>
            <span className='text-orange ml-1'>₫</span>
            <span className='text-orange'>{formatCurrency(product.price)}</span>
          </div>
        </div>
        <div className='mt-3 mr-2 flex items-center justify-end'>
          <ProductRating rating={product.rating} />
          <div className='ml-1 text-xs'>
            <span>{formatNumberToSocialStyle(product.sold)}</span>
            <span className='ml-1'>Đã bán</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
