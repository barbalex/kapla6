import React, { useContext } from 'react'
import SplitPane from 'react-split-pane'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
<<<<<<< HEAD
import useDetectPrint from 'use-detect-print'
=======
>>>>>>> a79a3ecd31038633eb9c0ef7e88351a2fa1bbc45
import { useDebouncedCallback } from 'use-debounce'

import Geschaeft from './Geschaeft'
import Pages from './Pages'
import GeschaeftPdf from './GeschaeftPdf'
import Geschaefte from './Geschaefte'
import storeContext from '../storeContext'
<<<<<<< HEAD
=======
import useDetectPrint from '../src/useDetectPrint'
>>>>>>> a79a3ecd31038633eb9c0ef7e88351a2fa1bbc45

const StyledSplitPane = styled(SplitPane)`
  @media print {
    top: 0;
  }
`

const GeschaefteLayout = () => {
  const store = useContext(storeContext)

  const isPrinting = useDetectPrint()

  const location = store.location.toJSON()
  const activeLocation = location[0]
  const { geschaefteColumnWidth, setGeschaefteColumnWidth, saveConfig } =
    store.app
  const { activeId } = store.geschaefte
  const showGeschaeft = activeLocation === 'geschaefte' && !!activeId
  const showPages = activeLocation === 'pages'
  const showGeschaeftPdf = activeLocation === 'geschaeftPdf' && !!activeId

  const saveConfigDebounced = useDebouncedCallback((size) => {
    saveConfig()
  }, 200)

  return (
    <StyledSplitPane
      split="vertical"
      minSize={100}
      defaultSize={isPrinting ? 0 : geschaefteColumnWidth}
      onChange={(value) => {
        setGeschaefteColumnWidth(value)
        saveConfigDebounced(value)
      }}
    >
      <Geschaefte />
      {showGeschaeft && <Geschaeft />}
      {showPages && <Pages />}
      {showGeschaeftPdf && <GeschaeftPdf />}
      {!showGeschaeftPdf && !showPages && !showGeschaeftPdf && <div />}
    </StyledSplitPane>
  )
}

export default observer(GeschaefteLayout)
