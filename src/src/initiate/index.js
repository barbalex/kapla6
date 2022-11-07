<<<<<<< HEAD
import { listen } from '@tauri-apps/api/event'
import { appWindow } from '@tauri-apps/api/window'
import { exit } from '@tauri-apps/api/process'
=======
import { event, window, process } from '@tauri-apps/api'
>>>>>>> a79a3ecd31038633eb9c0ef7e88351a2fa1bbc45

import fetchUsername from '../fetchUsername'
import saveConfig from '../saveConfig'
import getConfig from '../getConfig'
import getAllData from '../getAllData'
import setInitialFilters from '../setInitialFilters'
import setWindowPosition from './setWindowPosition'
import setWindowTitle from './setWindowTitle'

const fetchInitialData = async (store) => {
  setInitialFilters(store)
  // run these all in parallel to start up faster
  await Promise.all([
    setWindowPosition(),
    setWindowTitle(),
    getAllData(store),
    fetchUsername(store),
  ])

  // wait vor next version after tauri v1.0.0-beta.8
  // https://github.com/tauri-apps/tauri/issues/2996
<<<<<<< HEAD
  listen('tauri://close-requested', async (e) => {
=======
  event.listen('tauri://close-requested', async (e) => {
>>>>>>> a79a3ecd31038633eb9c0ef7e88351a2fa1bbc45
    // ensure data is saved if user entered it in a field, then directly clicked the app close icon
    document.activeElement.blur()

    // save configs
<<<<<<< HEAD
    const position = await appWindow.outerPosition()
    const outerSize = await appWindow.outerSize()
    const isMaximized = await appWindow.isMaximized()
=======
    const position = await window.appWindow.outerPosition()
    const outerSize = await window.appWindow.outerSize()
    const isMaximized = await window.appWindow.isMaximized()
>>>>>>> a79a3ecd31038633eb9c0ef7e88351a2fa1bbc45
    const config = await getConfig()
    config.lastWindowState = {
      x: position.x,
      y: position.y,
      width: outerSize.width,
      height: outerSize.height,
      maximized: isMaximized,
    }
    await saveConfig(config)

    // without timeout blur will not work
<<<<<<< HEAD
    setTimeout(() => exit(), 500)
=======
    setTimeout(() => process.exit(), 500)
>>>>>>> a79a3ecd31038633eb9c0ef7e88351a2fa1bbc45
  })
}

export default fetchInitialData
