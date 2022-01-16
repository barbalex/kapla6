import React from 'react'
import { render } from 'react-dom'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import { de } from 'date-fns/locale'

import App from './components/App'
import { Provider as StoreProvider } from './storeContext'
import createStore from './store'
import './styles.css'
import getDb from './src/getDb'
import initiate from './src/initiate'
import setInitialFilters from './src/setInitialFilters'

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
  setInitialFilters(store)

  registerLocale('de', de)
  setDefaultLocale('de')

  render(
    <StoreProvider value={store}>
      <App />
    </StoreProvider>,
    document.getElementById('root'),
  )
}

run()
