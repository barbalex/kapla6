/**
 * writes a dataArray to an Excel workbook
 */
<<<<<<< HEAD
import { writeBinaryFile } from '@tauri-apps/api/fs'
=======
import { fs } from '@tauri-apps/api'
>>>>>>> a79a3ecd31038633eb9c0ef7e88351a2fa1bbc45
import Excel from 'exceljs'

const writeExport = async (path, dataArray) => {
  const workbook = new Excel.Workbook()
  const numberOfColumns =
    dataArray && dataArray[0] && dataArray[0].length ? dataArray[0].length : 0
  const worksheet = workbook.addWorksheet('Geschäfte', {
    views: [
      {
        state: 'frozen',
        xSplit: 0,
        ySplit: 1,
      },
    ],
    autoFilter: {
      from: {
        row: 1,
        column: 1,
      },
      to: {
        row: 1,
        column: numberOfColumns,
      },
    },
  })
  worksheet.addRows(dataArray)
  worksheet.getRow(1).fill = {
    type: 'gradient',
    gradient: 'angle',
    degree: 0,
    stops: [
      { position: 0, color: { argb: 'FFD3D3D3' } },
      { position: 1, color: { argb: 'FFD3D3D3' } },
    ],
  }
  worksheet.getRow(1).font = {
    bold: true,
  }
  worksheet.getRow(1).border = {
    bottom: {
      style: 'thin',
    },
  }
  // exceljs workbook.xlsx.writeFile does not work
  // so export in main thread
  const buffer = await workbook.xlsx.writeBuffer()
<<<<<<< HEAD
  await writeBinaryFile(path, buffer)
=======
  // TODO: how to do this with scoped fs in tauri.conf.json????
  await fs.writeBinaryFile({ contents: buffer, path })
>>>>>>> a79a3ecd31038633eb9c0ef7e88351a2fa1bbc45
  return
}

export default writeExport
