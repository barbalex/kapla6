import { relaunch } from '@tauri-apps/api/process'

import chooseDbPath from './chooseDbPath'

const changeDbConnection = async (store) => {
  try {
    await chooseDbPath(store)
  } catch (chooseError) {
    return console.log('Error after choosing db:', chooseError)
  }
  setTimeout(async () => {
    relaunch()
  })
}

export default changeDbConnection
