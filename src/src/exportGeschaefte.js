/**
 * gets save path
 */

//import { ipcRenderer } from 'electron'
<<<<<<< HEAD
import { save } from '@tauri-apps/api/dialog'
import { open } from '@tauri-apps/api/shell'
=======
import { dialog, shell } from '@tauri-apps/api'
>>>>>>> a79a3ecd31038633eb9c0ef7e88351a2fa1bbc45
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
<<<<<<< HEAD
  const path = await save(dialogOptions)
=======
  const path = await dialog.save(dialogOptions)
>>>>>>> a79a3ecd31038633eb9c0ef7e88351a2fa1bbc45
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
<<<<<<< HEAD
      open({ defaultPath: path })
=======
      shell.open(path)
>>>>>>> a79a3ecd31038633eb9c0ef7e88351a2fa1bbc45
    })
  }
}

export default exportGeschaefte
