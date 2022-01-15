import { dialog } from '@tauri-apps/api'

const options = {
  //title: 'Datenbank für Kapla wählen',
  filters: [{ name: 'sqlite-Datenbanken', extensions: ['db'] }],
  multiple: false,
  directory: false,
}

const chooseDb = async () => {
  const path = await dialog.open(options)
  return path
}

export default chooseDb
