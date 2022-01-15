import { fs, path } from '@tauri-apps/api'

const saveConfig = async (data) => {
  const userPath = await path.appDir() // C:\Users\alexa\AppData\Roaming\Kapla\
  // tauri: https://tauri.studio/en/docs/api/js/modules/fs#writefile
  return fs.writeFile({
    contents: JSON.stringify(data, null, 2),
    path: `${userPath}kaplaConfig.json`,
  })
}

export default saveConfig
