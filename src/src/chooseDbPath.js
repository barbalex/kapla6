import { open } from '@tauri-apps/api/dialog'

const options = {
  title: 'Datenbank für Kapla wählen',
  filters: [{ name: 'sqlite-Datenbanken', extensions: ['db'] }],
  multiple: false,
  directory: false,
}

const chooseDbPath = async (store) => {
  const { setDbPath, saveConfig } = store.app

  const dbPath = await open(options)
  setDbPath(dbPath)
  saveConfig({ dbPath })

  return dbPath
}

export default chooseDbPath
