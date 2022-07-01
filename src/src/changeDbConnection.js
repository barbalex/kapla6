import { process } from '@tauri-apps/api'

import chooseDbPath from './chooseDbPath'

const changeDbConnection = async (store) => {
  try {
    await chooseDbPath(store)
  } catch (chooseError) {
    return console.log('Error after choosing db:', chooseError)
  }
  setTimeout(async () => {
    process.relaunch()
  })
}

export default changeDbConnection
