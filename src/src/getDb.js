import Database from 'tauri-plugin-sql-api'

import standardDbPath from './standardDbPath'
import getConfig from './getConfig'
import existsFile from './existsFile'
import chooseDbPath from './chooseDbPath'

const getDb = async ({store}) => {
  const { addErrorMessage } = store
  const {
    setDbPath,
    setTableColumnWidth,
    setGeschaefteColumnWidth,
    setLastWindowState,
  } = store.app

  const config = await getConfig() 
  console.log('getDb config:', config)

  if (config?.dbPath) {
    setDbPath(config.dbPath)
  }
  if (config?.tableColumnWidth) {
    setTableColumnWidth(config.tableColumnWidth)
  }
  if (config?.geschaefteColumnWidth) {
    setGeschaefteColumnWidth(config.geschaefteColumnWidth)
  }
  if (config?.lastWindowState) {
    setLastWindowState(config.lastWindowState)
  }
  let dbPath = config?.dbPath || standardDbPath

  console.log('getDb will see if file exists at dbPath:', dbPath)
  let dbExists
  try {
    dbExists = await existsFile(dbPath)
  } catch (error) {
    console.log('getDb error calling existsFile:', error)
  }
  console.log('getDb dbExists:', dbExists)
  if (!dbExists) {
    // TODO: because title can't be set in options, need to pop to tell user she needs to choose db path
    dbPath = await chooseDbPath(store)
  }

  let db
  // BEWARE
  // if db does not exist at path, a new one is created there!
  // first query catches sql error when table does not exist
  // and makes user choose db
  try {
    db = await Database.load(`sqlite:${dbPath}`)
  } catch (error) {
    console.log('error opening db:', error)
    addErrorMessage(error?.message ?? error)
  }
  console.log('getDb returning:', db)
  return db
}

export default getDb
