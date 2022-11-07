<<<<<<< HEAD
import { appDir } from '@tauri-apps/api/path'
import { readTextFile } from '@tauri-apps/api/fs'

const getConfig = async () => {
  // use BaseDirectory instead (https://tauri.app/v1/api/js/fs#readtextfile)
  const userPath = await appDir() // C:\Users\alexa\AppData\Roaming\Kapla\
  const dataFilePath = `${userPath}kaplaConfig.json`
  const configFile = await readTextFile(dataFilePath)
  // use exists instead (https://tauri.app/v1/api/js/fs#exists)
  const config = configFile ? JSON.parse(configFile) : {}
=======
import { fs, path } from '@tauri-apps/api'

const getConfig = async () => {
  const userPath = await path.appDir() // C:\Users\alexa\AppData\Roaming\Kapla\
  console.log('getConfig, userPath: ', userPath)
  const dataFilePath = `${userPath}kaplaConfig.json`
  let configFile
  try {
    configFile = await fs.readTextFile(dataFilePath)
  } catch (error) {
    console.log('getConfig, error reading file:',error) 
    console.log('getConfig, error message:',error?.message) 
    return null
  }
  const config = configFile ? JSON.parse(configFile) : {} 
>>>>>>> a79a3ecd31038633eb9c0ef7e88351a2fa1bbc45
  return config
}

export default getConfig
