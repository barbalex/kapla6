/**
 * writes a dataArray to an Excel workbook
 */

//import { ipcRenderer } from 'electron'
import { fs } from '@tauri-apps/api'
import Excel from 'exceljs'

const writeExport = async (path, dataArray, callback) => {
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
  await fs.writeBinaryFile({ contents: buffer, path })
  return
}

export default writeExport
