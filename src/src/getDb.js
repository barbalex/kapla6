import Database from 'tauri-plugin-sql-api'

import standardDbPath from './standardDbPath'
import getConfig from './getConfig'
import existsFile from './existsFile'
import chooseDbPath from './chooseDbPath'

const getDb = async (store) => {
  const { addErrorMessage } = store
  const {
    setDbPath,
    setTableColumnWidth,
    setGeschaefteColumnWidth,
    setLastWindowState,
  } = store.app

  const config = await getConfig()

  if (config.dbPath) {
    setDbPath(config.dbPath)
  }
  if (config.tableColumnWidth) {
    setTableColumnWidth(config.tableColumnWidth)
  }
  if (config.geschaefteColumnWidth) {
    setGeschaefteColumnWidth(config.geschaefteColumnWidth)
  }
  if (config.lastWindowState) {
    setLastWindowState(config.lastWindowState)
  }
  let dbPath = config.dbPath || standardDbPath

  const dbExists = await existsFile(dbPath)
  if (!dbExists) {
    // TODO: because title can't be set in options, need to pop to tell user she needs to choose db path
    dbPath = await chooseDbPath(store)
  }

  let db
  // BEWARE
  // if db does not exist at path, a new one is created there!
  // first query catches sql error when table does not exist
  // and makes user choose db
  // TODO: remove the code added in geschaefte query
  try {
    db = await Database.load(`sqlite:${dbPath}`)
  } catch (error) {
    console.log('error opening db:', error)
    addErrorMessage(error?.message ?? error)
  }
  return db
}

export default getDb
