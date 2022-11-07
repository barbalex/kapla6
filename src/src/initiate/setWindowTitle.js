<<<<<<< HEAD
import { getVersion } from '@tauri-apps/api/app'
import { appWindow } from '@tauri-apps/api/window'

const setWindowTitle = async () => {
  const appVersion = await getVersion()
  appWindow.setTitle(`Kapla v${appVersion}`)
=======
import { app, window } from '@tauri-apps/api'

const setWindowTitle = async () => {
  const appVersion = await app.getVersion()
  window.appWindow.setTitle(`Kapla v${appVersion}`)
>>>>>>> a79a3ecd31038633eb9c0ef7e88351a2fa1bbc45
}

export default setWindowTitle
