<<<<<<< HEAD
import { invoke } from '@tauri-apps/api/tauri'

const fetchUsername = async (store) => {
  const { setUsername } = store.app
  const username = await invoke('get_username')
=======
import { tauri } from '@tauri-apps/api'

const fetchUsername = async (store) => {
  const { setUsername } = store.app
  const username = await tauri.invoke('get_username')
>>>>>>> a79a3ecd31038633eb9c0ef7e88351a2fa1bbc45

  if (username) {
    setUsername(username)
  } else {
    store.addErrorMessage('keinen Benutzernamen erhalten')
  }
}

export default fetchUsername
