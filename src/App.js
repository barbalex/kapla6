import React, { useEffect } from 'react'
import { fs, path } from '@tauri-apps/api'

import logo from './logo.svg'
import tauriCircles from './tauri.svg'
import tauriWord from './wordmark.svg'
import './App.css'
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

  return (
    <div className="App">
      <header className="App-header">
        <div className="inline-logo">
          <img src={tauriCircles} className="App-logo rotate" alt="logo" />
          <img src={tauriWord} className="App-logo smaller" alt="logo" />
        </div>
        <a
          className="App-link"
          href="https://tauri.studio"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Tauri
        </a>
        <img src={logo} className="App-logo rotate" alt="logo" />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
      </header>
    </div>
  )
}

export default App
