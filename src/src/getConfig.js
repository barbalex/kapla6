import { fs, path } from '@tauri-apps/api'

const getConfig = async () => {
  const userPath = await path.appDir() // C:\Users\alexa\AppData\Roaming\Kapla\
  const dataFilePath = `${userPath}kaplaConfig.json`
  const configFile = await fs.readTextFile(dataFilePath)
  const config = configFile ? JSON.parse(configFile) : {}
  return config
}

export default getConfig
