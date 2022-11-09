import { appDir } from '@tauri-apps/api/path'
import { readTextFile } from '@tauri-apps/api/fs'

const getConfig = async () => {
  // use BaseDirectory instead (https://tauri.app/v1/api/js/fs#readtextfile)
  const userPath = await appDir() // C:\Users\alexa\AppData\Roaming\Kapla\
  const dataFilePath = `${userPath}kaplaConfig.json`
  const configFile = await readTextFile(dataFilePath)
  // use exists instead (https://tauri.app/v1/api/js/fs#exists)
  const config = configFile ? JSON.parse(configFile) : {}
  return config
}

export default getConfig
