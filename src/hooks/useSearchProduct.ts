import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { SearchSchema, searchSchema } from 'src/utils/rules'
import useQueryConfig from './useQueryConfig'
import omit from 'lodash/omit'
import path from 'src/constants/path'

export default function useSearchProduct() {
  const navigate = useNavigate()
  const queryConfig = useQueryConfig()
  const { register, handleSubmit } = useForm<SearchSchema>({
    defaultValues: {
      searchString: ''
    },
    resolver: yupResolver(searchSchema)
  })

  const onSubmit = handleSubmit((data) => {
    const config = queryConfig.order
      ? createSearchParams(omit({ ...queryConfig, name: data.searchString }, ['order', 'sort_by'])).toString()
      : createSearchParams(omit({ ...queryConfig, name: data.searchString })).toString()
    navigate({
      pathname: path.home,
      search: config
    })
  })
  return { register, onSubmit }
}
