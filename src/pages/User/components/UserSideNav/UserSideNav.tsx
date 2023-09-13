import classNames from 'classnames'
import { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import path from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import { getAvatarURL } from 'src/utils/utils'
import { useTranslation } from 'react-i18next'

export default function UserSideNav() {
  const { t } = useTranslation('profile')
  const { profile } = useContext(AppContext)
  return (
    <div>
      <div className='py-3 flex items-center border-b border-gray-200'>
        <Link to='/'>
          <div className='h-12 w-12'>
            <img src={getAvatarURL(profile?.avatar)} alt='' className='rounded-full w-full h-full object-cover' />
          </div>
        </Link>
        <div className='flex flex-col ml-2 overflow-hidden'>
          <span className='ml-2 font-bold truncate'>{profile?.email}</span>
          <Link to='/' className='flex items-center capitalize mt-2 text-gray-600 text-sm'>
            <svg
              width={12}
              height={12}
              viewBox='0 0 12 12'
              xmlns='http://www.w3.org/2000/svg'
              style={{ marginRight: 4 }}
            >
              <path
                d='M8.54 0L6.987 1.56l3.46 3.48L12 3.48M0 8.52l.073 3.428L3.46 12l6.21-6.18-3.46-3.48'
                fill='#9B9B9B'
                fillRule='evenodd'
              />
            </svg>
            <span>{t('profile.edit profile')}</span>
          </Link>
        </div>
      </div>
      <div>
        <div className='mt-8 text-sm'>
          <NavLink
            to={path.profile}
            className={({ isActive }) =>
              classNames('flex items-center hover:text-orange focus:text-orange', {
                'text-orange': isActive,
                'text-gray-500': !isActive
              })
            }
          >
            <div className='h-6 w-6'>
              <img src='https://cf.shopee.vn/file/ba61750a46794d8847c3f463c5e71cc4' alt='' className='h-full w-full' />
            </div>
            <span className='capitalize ml-2'>{t('profile.my account')}</span>
          </NavLink>
          <NavLink
            to={path.changePassword}
            className={({ isActive }) =>
              classNames('flex items-center hover:text-orange focus:text-orange mt-4', {
                'text-orange': isActive,
                'text-gray-500': !isActive
              })
            }
          >
            <div className='h-6 w-6'>
              <img src='https://cf.shopee.vn/file/ba61750a46794d8847c3f463c5e71cc4' alt='' className='h-full w-full' />
            </div>
            <span className='capitalize ml-2'>{t('profile.change password')}</span>
          </NavLink>
          <NavLink
            to={path.historyPurchase}
            className={({ isActive }) =>
              classNames('flex items-center hover:text-orange focus:text-orange mt-4', {
                'text-orange': isActive,
                'text-gray-500': !isActive
              })
            }
          >
            <div className='h-6 w-6'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-6 h-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z'
                />
              </svg>
            </div>
            <span className='capitalize ml-2'>{t('profile.bill')}</span>
          </NavLink>
        </div>
      </div>
    </div>
  )
}
