<<<<<<< HEAD
import { relaunch } from '@tauri-apps/api/process'
=======
import { process } from '@tauri-apps/api'
>>>>>>> a79a3ecd31038633eb9c0ef7e88351a2fa1bbc45

import chooseDbPath from './chooseDbPath'

const changeDbConnection = async (store) => {
  try {
    await chooseDbPath(store)
  } catch (chooseError) {
    return console.log('Error after choosing db:', chooseError)
  }
  setTimeout(async () => {
<<<<<<< HEAD
    relaunch()
=======
    process.relaunch()
>>>>>>> a79a3ecd31038633eb9c0ef7e88351a2fa1bbc45
  })
}

export default changeDbConnection
