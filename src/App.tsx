import { ToastContainer } from 'react-toastify'
import useRouteElements from './useRouteElements'
import 'react-toastify/dist/ReactToastify.css'
import { useContext, useEffect } from 'react'
import { LocalSotrageEventTarget } from './utils/auth'
import { AppContext } from './contexts/app.context'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  const routeElements = useRouteElements()
  const { reset } = useContext(AppContext)
  useEffect(() => {
    LocalSotrageEventTarget.addEventListener('clearLS', () => reset)
    return () => {
      LocalSotrageEventTarget.removeEventListener('clearLS', reset)
    }
  }, [reset])
  return (
    <ErrorBoundary>
      {routeElements}
      <ToastContainer />
    </ErrorBoundary>
  )
}

export default App
