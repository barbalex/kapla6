import { dialog } from '@tauri-apps/api'

const options = {
  title: 'Datenbank für Kapla wählen',
  filters: [{ name: 'sqlite-Datenbanken', extensions: ['db'] }],
  multiple: false,
  directory: false,
}

const chooseDbPath = async (store) => {
  const { setDbPath, saveConfig } = store.app

  const dbPath = await dialog.open(options)
  setDbPath(dbPath)
  console.log('chooseDbPath will saveConfig to dbPath:', dbPath)
  await saveConfig({ dbPath })

  return dbPath
}

export default chooseDbPath
