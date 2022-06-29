import React from 'react'
import { createRoot } from 'react-dom/client'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import { de } from 'date-fns/locale'

import App from './components/App'
import { Provider as StoreProvider } from './storeContext'
import createStore from './store'
import './styles.css'
import getDb from './src/getDb'
import initiate from './src/initiate'

const run = async () => {
  const store = await createStore().create()

  let db
  try {
    db = await getDb(store)
  } catch (error) {
    console.log('error getting db:', error)
    store.addErrorMessage(error.message)
  }
  store.app.setDb(db)
  initiate(store)

  registerLocale('de', de)
  setDefaultLocale('de')

  const container = document.getElementById('root')
  const root = createRoot(container) // create

  root.render(
    <StoreProvider value={store}>
      <App />
    </StoreProvider>,
  )
}

run()
