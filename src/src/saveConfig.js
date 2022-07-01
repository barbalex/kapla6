import { fs, path } from '@tauri-apps/api'

const saveConfig = async (data) => {
  const userPath = await path.appDir() // C:\Users\alexa\AppData\Roaming\Kapla\

  return fs.writeFile({
    contents: JSON.stringify(data, null, 2),
    path: `${userPath}kaplaConfig.json`,
  })
}

export default saveConfig
