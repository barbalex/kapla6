import { getVersion } from '@tauri-apps/api/app'
import { appWindow } from '@tauri-apps/api/window'

const setWindowTitle = async () => {
  const appVersion = await getVersion()
  appWindow.setTitle(`Kapla v${appVersion}`)
}

export default setWindowTitle
