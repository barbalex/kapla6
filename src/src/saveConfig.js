import { appDir } from '@tauri-apps/api/path'
import { writeTextFile } from '@tauri-apps/api/fs'

const saveConfig = async (data) => {
  const userPath = await appDir() // C:\Users\alexa\AppData\Roaming\Kapla\

  return writeTextFile(
    `${userPath}kaplaConfig.json`,
    JSON.stringify(data, null, 2),
  )
}

export default saveConfig
