import { event, window, process } from '@tauri-apps/api'

import fetchUsername from '../fetchUsername'
import saveConfig from '../saveConfig'
import getConfig from '../getConfig'
import getAllData from '../getAllData'
import setInitialFilters from '../setInitialFilters'
import setWindowPosition from './setWindowPosition'
import setWindowTitle from './setWindowTitle'

const fetchInitialData = async (store) => {
  setInitialFilters(store)
  await fetchUsername(store)
  await Promise.all([setWindowPosition(), setWindowTitle(), getAllData(store)])

  // wait vor next version after tauri v1.0.0-beta.8
  // https://github.com/tauri-apps/tauri/issues/2996
  event.listen('tauri://close-requested', async (e) => {
    // ensure data is saved if user entered it in a field, then directly clicked the app close icon
    document.activeElement.blur()

    // save configs
    const position = await window.appWindow.outerPosition()
    const outerSize = await window.appWindow.outerSize()
    const isMaximized = await window.appWindow.isMaximized()
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
    setTimeout(() => process.exit(), 500)
  })
}

export default fetchInitialData
