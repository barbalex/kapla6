import { invoke } from '@tauri-apps/api/tauri'

const fetchUsername = async (store) => {
  const { setUsername } = store.app
  const username = await invoke('get_username')
  console.log('username:', username)

  if (username) {
    setUsername(username)
  } else {
    store.addErrorMessage('keinen Benutzernamen erhalten')
  }
}

export default fetchUsername
