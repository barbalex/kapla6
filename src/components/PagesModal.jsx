import React, { useContext } from 'react'
import { Button, Modal, ModalBody } from 'reactstrap'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import storeContext from '../storeContext'

const Body = styled(ModalBody)`
  display: flex;
  justify-content: center;
  align-items: center;
`
const RightDiv = styled.div`
  padding-left: 30px;
`
const P = styled.p`
  text-align: center;
  margin-top: 3px;
  margin-bottom: 3px;
`

const PagesModal = () => {
  const store = useContext(storeContext)
  const { pages, remainingGeschaefte, stop } = store.pages

  const modalTextLine1 = remainingGeschaefte.length
    ? 'Der Bericht wird aufgebaut...'
    : ''
  const modalTextLine2 = remainingGeschaefte.length
    ? `Bisher ${pages.length} Seiten, ${remainingGeschaefte.length} Geschäfte noch zu verarbeiten`
    : ''

  return (
    <Modal isOpen={true} size={modalTextLine2 ? 'lg' : 'sm'}>
      <Body>
        <div>
          <P>{modalTextLine1}</P>
          {modalTextLine2 && <P>{modalTextLine2}</P>}
        </div>
        <RightDiv>
          <Button color="secondary" onClick={stop}>
            Abbrechen
          </Button>
        </RightDiv>
      </Body>
    </Modal>
  )
}

export default observer(PagesModal)
