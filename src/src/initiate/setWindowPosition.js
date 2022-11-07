<<<<<<< HEAD
import { appWindow, LogicalPosition, LogicalSize } from '@tauri-apps/api/window'
=======
import { window } from '@tauri-apps/api'
>>>>>>> a79a3ecd31038633eb9c0ef7e88351a2fa1bbc45
import getConfig from '../getConfig'

const setWindowPosition = async () => {
  // get last window state
  // and set it again
<<<<<<< HEAD
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
=======
  const config = await getConfig()
  
  if (config?.lastWindowState) {
    const { x, y, width, height, maximized } = config
    if (maximized) {
      window.appWindow.maximize()
    } else {
      if (x !== undefined && y !== undefined) {
        window.appWindow.setPosition(new window.LogicalPosition(x, y))
      }
      if (width !== undefined && height !== undefined) {
        window.appWindow.setSize(new window.LogicalSize(width, height))
>>>>>>> a79a3ecd31038633eb9c0ef7e88351a2fa1bbc45
      }
    }
  }
}

export default setWindowPosition
