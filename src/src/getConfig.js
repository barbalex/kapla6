import { fs, path } from '@tauri-apps/api'

const getConfig = async () => {
  const userPath = await path.dataDir() // C:\Users\alexa\AppData\Roaming\Kapla\
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
  return config
}

export default getConfig
