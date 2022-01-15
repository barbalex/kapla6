const { app, BrowserWindow, ipcMain, Menu, dialog, shell } = require('electron')
const fs = require('fs-extra')
const path = require('path')

const createWindow = () => {

ipcMain.handle('open-dialog-get-path', async (event, dialogOptions) => {
  // tauri: https://tauri.studio/en/docs/api/js/modules/dialog#open
  const { filePath } = await dialog.showOpenDialog(dialogOptions)
  return filePath
})