import { tauri } from '@tauri-apps/api'

const fetchUsername = async (store) => {
  console.log('fetchUsername')
  const { setUsername } = store.app
  const username = await tauri.invoke('get_username')

  if (username) {
    setUsername(username)
  } else {
    store.addErrorMessage('keinen Benutzernamen erhalten')
  }
}

export default fetchUsername
