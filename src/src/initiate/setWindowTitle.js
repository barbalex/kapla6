import { app, window } from '@tauri-apps/api'

const setWindowTitle = async () => {
  const appVersion = await app.getVersion()
  window.appWindow.setTitle(`Kapla v${appVersion}`)
}

export default setWindowTitle
