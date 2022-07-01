/**
 * gets save path
 */

//import { ipcRenderer } from 'electron'
import { dialog, shell } from '@tauri-apps/api'
import writeExport from './writeExport'

function getDataArrayFromExportObjects(exportObjects) {
  const dataArray = []
  // first the field names:
  dataArray.push(Object.keys(exportObjects[0]))
  // then the field values
  exportObjects.forEach((object) =>
    dataArray.push(
      Object.keys(object).map((key, index) => {
        /**
         * exceljs errors out if first member of array is null
         * see: https://github.com/guyonroche/exceljs/issues/111
         */
        if (object[key] === null && index === 0) {
          return ''
        }
        return object[key]
      }),
    ),
  )
  return dataArray
}

const dialogOptions = {
  title: 'exportierte Geschäfte speichern',
  filters: [
    {
      name: 'Excel-Datei',
      extensions: ['xlsx'],
    },
  ],
}

const exportGeschaefte = async (geschaefte, messageShow) => {
  // TODO: implement with tauri
  // const path = await ipcRenderer.invoke('save-dialog-get-path', dialogOptions)
  const path = await dialog.save(dialogOptions)
  if (path) {
    messageShow(true, 'Der Export wird aufgebaut...', '')
    // set timeout so message appears before exceljs starts working
    // and possibly blocks execution of message
    setTimeout(async () => {
      const dataArray = getDataArrayFromExportObjects(geschaefte)
      try {
        await writeExport(path, dataArray)
      } catch (error) {
        messageShow(true, 'Fehler:', error.message)
        setTimeout(() => messageShow(false, '', ''), 8000)
        return
      }
      messageShow(false, '', '')
      shell.open(path)
    })
  }
}

export default exportGeschaefte
