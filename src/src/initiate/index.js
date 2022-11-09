import { listen } from '@tauri-apps/api/event'
import { appWindow } from '@tauri-apps/api/window'
import { exit } from '@tauri-apps/api/process'

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
  listen('tauri://close-requested', async (e) => {
    // ensure data is saved if user entered it in a field, then directly clicked the app close icon
    document.activeElement.blur()

    // save configs
    const position = await appWindow.outerPosition()
    const outerSize = await appWindow.outerSize()
    const isMaximized = await appWindow.isMaximized()
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
    setTimeout(() => exit(), 500)
  })
}

export default fetchInitialData
