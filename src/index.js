import React from 'react'
import { createRoot } from 'react-dom/client'

import AppInitator from './AppInitiator'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(<AppInitator />)
