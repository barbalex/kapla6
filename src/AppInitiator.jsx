import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import { de } from 'date-fns/locale'

import App from './components/App'
import { Provider as StoreProvider } from './storeContext'
import createStore from './store'
import './styles.css'
import getDb from './src/getDb'
import initiate from './src/initiate'

registerLocale('de', de)
setDefaultLocale('de')

const AppInitator = () => {
  const [store, setStore] = useState()

  useEffect(() => {
    const store = createStore().create()
    setStore(store)
    getDb({ store })
      .then((db) => {
        store.app.setDb(db)
        initiate(store)
      })
      .catch((error) => {
        console.log('error getting db:', error)
        store.addErrorMessage(error.message)
      })
  }, [])

  if (!store) return null

  return (
    <StoreProvider value={store}>
      <App />
    </StoreProvider>
  )
}

export default AppInitator
