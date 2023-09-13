import SortProductList from './components/SortProductList'
import { useQuery } from '@tanstack/react-query'

import AsideFilter from './components/AsideFilter'
import productApi from 'src/apis/product.api'
import Product from './components/Product'
import Pagination from 'src/components/Pagination/Pagination'
import { ProductListConfig } from 'src/types/product.type'
import categoryApi from 'src/apis/category.api'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'

export default function ProductList() {
  // console.log(searchParams)
  const queryConfig = useQueryConfig()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [queryConfig])
  const { data: productData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => productApi.getProducts(queryConfig as ProductListConfig),
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000
  })
  // console.log(data)
  const { data: categoryData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories()
  })
  return (
    <div className='bg-gray-100 pt-6'>
      <Helmet>
        <title>Shopee clone</title>
        <meta name='description' content='Trang chủ' />
      </Helmet>
      <div className='container'>
        <div className='grid grid-cols-12 gap-4'>
          <div className='col-span-2'>
            <AsideFilter queryConfig={queryConfig} categories={categoryData?.data.data || []} />
          </div>
          {productData && (
            <div className='col-span-10 col-start-3'>
              <SortProductList queryConfig={queryConfig} pageSize={productData.data.data.pagination.page_size} />
              <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:gird-cols-4 xl:grid-cols-5 gap-4'>
                {productData.data.data.products.map((product) => (
                  <div className='col-span-1' key={product._id}>
                    <Product product={product} />
                  </div>
                ))}
              </div>
              <Pagination queryConfig={queryConfig} pageSize={productData.data.data.pagination.page_size} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
