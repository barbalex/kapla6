import { appWindow, LogicalPosition, LogicalSize } from '@tauri-apps/api/window'
import getConfig from '../getConfig'

const setWindowPosition = async () => {
  // get last window state
  // and set it again
  const { lastWindowState } = await getConfig()
  if (lastWindowState) {
    const { x, y, width, height, maximized } = lastWindowState
    if (maximized) {
      appWindow.maximize()
    } else {
      if (x !== undefined && y !== undefined) {
        appWindow.setPosition(new LogicalPosition(x, y))
      }
      if (width !== undefined && height !== undefined) {
        appWindow.setSize(new LogicalSize(width, height))
      }
    }
  }
}

export default setWindowPosition
