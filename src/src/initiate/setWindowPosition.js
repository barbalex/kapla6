import { window } from '@tauri-apps/api'
import getConfig from '../getConfig'

const setWindowPosition = async () => {
  // get last window state
  // and set it again
  const { lastWindowState } = await getConfig()
  if (lastWindowState) {
    const { x, y, width, height, maximized } = lastWindowState
    if (maximized) {
      window.appWindow.maximize()
    } else {
      if (x !== undefined && y !== undefined) {
        window.appWindow.setPosition(new window.LogicalPosition(x, y))
      }
      if (width !== undefined && height !== undefined) {
        window.appWindow.setSize(new window.LogicalSize(width, height))
      }
    }
  }
}

export default setWindowPosition
