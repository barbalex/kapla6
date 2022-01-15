const { app, BrowserWindow, ipcMain, Menu, dialog, shell } = require('electron')
const fs = require('fs-extra')
const path = require('path')

const getConfig = () => {
  // tauri: https://tauri.studio/en/docs/api/js/modules/path#datadir
  const userPath = app.getPath('userData')
  const dataFilePath = path.join(userPath, 'kaplaConfig.json')
  if (!fs.existsSync(dataFilePath)) return {}
  // tauri: https://tauri.studio/en/docs/api/js/modules/fs#readtextfile
  const configFile = fs.readFileSync(dataFilePath, 'utf-8') || {}
  if (!configFile) return {}
  return JSON.parse(configFile)
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit()
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

const browserWindowOptions = {
  width: 1800,
  height: 1024,
  icon: path.join(__dirname, 'src/etc/app.ico'),
  // only show after it was sized
  show: false,
  webPreferences: {
    nodeIntegration: true,
    // needs to be false, see: https://github.com/electron/electron-quick-start/issues/463#issuecomment-869219170
    contextIsolation: false,
    nativeWindowOpen: true,
    preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
  },
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow(browserWindowOptions)

// exceljs workbook.xlsx.writeFile does not work
// so export in main thread
ipcMain.on('SAVE_FILE', (event, path, data) => {
  // tauri: https://tauri.studio/en/docs/api/js/modules/fs#writefile
  fs.outputFile(path, data)
    .then(() => event.sender.send('SAVED_FILE'))
    .catch((error) => event.sender.send('ERROR', error.message))
})

ipcMain.handle('open-dialog-get-path', async (event, dialogOptions) => {
  // tauri: https://tauri.studio/en/docs/api/js/modules/dialog#open
  const { filePath } = await dialog.showOpenDialog(dialogOptions)
  return filePath
})

ipcMain.handle('save-dialog-get-path', async (event, dialogOptions) => {
  // tauri: https://tauri.studio/en/docs/api/js/modules/dialog#save
  const { filePath } = await dialog.showSaveDialog(dialogOptions)
  return filePath
})