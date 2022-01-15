import { app, event, window } from '@tauri-apps/api'

import fetchUsername from './fetchUsername'
import saveConfig from './saveConfig'
import getConfig from './getConfig'

const fetchInitialData = async (store) => {
  const { fetching, setFetching } = store
  !fetching && setFetching(true)
  await fetchUsername(store)
  // TODO: run UPDATE geschaefte SET idVorgeschaeft = NULL WHERE cast(cast(idVorgeschaeft AS integer) AS text) != idVorgeschaeft;?
  await Promise.all([
    store.faelligeStatiOptionsGet(),
    store.geschaefte?.fetchAllGeko(),
    store.geschaefte?.fetchLinks(),
    store.interneOptionsGet(),
    store.externeOptionsGet(),
    store.getGeschaefteKontakteIntern(),
    store.getGeschaefteKontakteExtern(),
    store.rechtsmittelErledigungOptionsGet(),
    store.parlVorstossTypOptionsGet(),
    store.statusOptionsGet(),
    store.geschaeftsartOptionsGet(),
    store.aktenstandortOptionsGet(),
    store.rechtsmittelInstanzOptionsGet(),
    store.abteilungOptionsGet(),
    await store.geschaefte?.fetchAll(),
  ])
  console.log('fetched initial data')
  setFetching(false)

  const appVersion = await app.getVersion()
  window.appWindow.setTitle(`Kapla v${appVersion}`)

  // get last window state
  // and set it again
  const { lastWindowState } = await getConfig()
  if (lastWindowState) {
    if (lastWindowState.x !== undefined && lastWindowState.y !== undefined) {
      window.appWindow.setPosition(new window.LogicalPosition(x, y))
    }
    if (
      lastWindowState.width !== undefined &&
      lastWindowState.height !== undefined
    ) {
      window.appWindow.setSize(
        new window.LogicalSize(lastWindowState.width, lastWindowState.height),
      )
    }
    if (lastWindowState.maximized) {
      window.appWindow.maximize()
    }
  }

  // wait vor next version after tauri v1.0.0-beta.8
  // https://github.com/tauri-apps/tauri/issues/2996
  event.listen('tauri://close-requested', async (e) => {
    console.log('close requested')

    // TODO: needed? how to?
    e.preventDefault()

    // ensure data is saved if user entered it in a field, then directly clicked the app close icon
    document.activeElement.blur()

    // save configs
    const position = await window.appWindow.outerPosition()
    const outerSize = await window.appWindow.outerSize()
    const isMaximized = await window.appWindow.isMaximized()
    const config = getConfig()
    config.lastWindowState = {
      x: position.x,
      y: position.y,
      width: outerSize.width,
      height: outerSize.height,
      maximized: isMaximized,
    }
    saveConfig(config)

    // TODO: needed?
    setTimeout(() => window.appWindow.close(), 500)
  })
}

export default fetchInitialData
