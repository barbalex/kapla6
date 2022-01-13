import React, { useEffect } from 'react'
import { fs, path } from '@tauri-apps/api'

import Database from 'tauri-plugin-sql-api'

function App() {
  useEffect(async () => {
    const run = async () => {
      const userPath = await path.appDir() // C:\Users\alexa\AppData\Roaming\Kapla\
      const dataFilePath = `${userPath}kaplaConfig.json`
      const configFile = await fs.readTextFile(dataFilePath)
      const config = configFile ? JSON.parse(configFile) : {}
      console.log('config:', config)
      let db
      try {
        db = await Database.load(`sqlite:${config.dbPath}`)
        console.log('getDb, db:', db)
      } catch (error) {
        console.log(error)
      }
      const stati = await db.select(`
      SELECT
        *
      FROM
        status`)
      console.log('stati:', stati)
    }
    run()
  }, [])

  return <div>hello world</div>
}

export default App
