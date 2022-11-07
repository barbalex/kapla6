<<<<<<< HEAD
import { open } from '@tauri-apps/api/dialog'
=======
import { dialog } from '@tauri-apps/api'
>>>>>>> a79a3ecd31038633eb9c0ef7e88351a2fa1bbc45

const options = {
  title: 'Datenbank für Kapla wählen',
  filters: [{ name: 'sqlite-Datenbanken', extensions: ['db'] }],
  multiple: false,
  directory: false,
}

const chooseDbPath = async (store) => {
  const { setDbPath, saveConfig } = store.app

<<<<<<< HEAD
  const dbPath = await open(options)
  setDbPath(dbPath)
  saveConfig({ dbPath })
=======
  const dbPath = await dialog.open(options)
  setDbPath(dbPath)
  console.log('chooseDbPath will saveConfig to dbPath:', dbPath)
  await saveConfig({ dbPath })
>>>>>>> a79a3ecd31038633eb9c0ef7e88351a2fa1bbc45

  return dbPath
}

export default chooseDbPath
