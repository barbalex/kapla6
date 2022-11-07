import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
<<<<<<< HEAD
import useDetectPrint from 'use-detect-print'
=======
>>>>>>> a79a3ecd31038633eb9c0ef7e88351a2fa1bbc45
import styled from 'styled-components'

import GeschaefteLayout from './GeschaefteLayout'
import FilterFieldsLayout from './FilterFieldsLayout'
import TableLayout from './TableLayout'
import Navbar from './Navbar'
import Errors from './Errors'
import storeContext from '../storeContext'
<<<<<<< HEAD
=======
import useDetectPrint from '../src/useDetectPrint'
>>>>>>> a79a3ecd31038633eb9c0ef7e88351a2fa1bbc45
//import GeschaeftPdf from './GeschaeftPdf'
//import Pages from './Pages'

// need this container to set Error component at bottom left
const Container = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;

  @media print {
    width: auto;
    height: auto;
    position: relative;
  }
`

const App = () => {
  const store = useContext(storeContext)

  const isPrinting = useDetectPrint()

  const location = store.location.toJSON()
  const activeLocation = location[0]
  const showGeschaefteLayout = ['geschaefte', 'pages', 'geschaeftPdf'].includes(
    activeLocation,
  )
  const showFilterFieldsLayout =
    activeLocation === 'filterFields' && !isPrinting
  const showTableLayout = activeLocation === 'table' && !isPrinting
  /**
   * leave this for testing printing problems
   */
  //return <GeschaeftPdf />
  /*if (isPrinting && activeLocation === 'geschaeftPdf') {
    return <GeschaeftPdf />
  } else if (isPrinting) {
    return <Pages />
  }*/

  return (
    <Container>
      <Navbar />
      {showGeschaefteLayout && <GeschaefteLayout />}
      {showFilterFieldsLayout && <FilterFieldsLayout />}
      {showTableLayout && <TableLayout />}
      <Errors />
    </Container>
  )
}

export default observer(App)
