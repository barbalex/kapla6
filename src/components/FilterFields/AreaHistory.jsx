import React from 'react'
import { Label } from 'reactstrap'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import ErrorBoundary from '../shared/ErrorBoundary'
import Input from './Input'

const Container = styled.div`
  grid-area: areaHistory;
  background-color: white;
  box-shadow: inset 1em 1em 2em rgb(227, 232, 255),
    inset -1em -1em 2em rgb(227, 232, 255);
  outline: 1px solid #efefef;
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 2px;
  padding: 8px;
`
const Title = styled.div`
  font-weight: 900;
  font-size: 16px;
  grid-column: 1;
`
const FieldVorgeschaeft = styled.div`
  grid-column: 1;
  width: 175px;
`
const StyledLabel = styled(Label)`
  font-size: 12px;
  color: #757575;
  margin: 0 0 -6px 0;
`

const AreaHistory = ({ values, change, changeComparator, firstTabIndex }) => (
  <ErrorBoundary>
    <Container>
      <Title>Historie</Title>
      <StyledLabel>Vorgeschäft</StyledLabel>
      <FieldVorgeschaeft>
        <Input
          name="idVorgeschaeft"
          type="number"
          change={change}
          values={values}
          changeComparator={changeComparator}
          tabIndex={1 + firstTabIndex}
        />
      </FieldVorgeschaeft>
    </Container>
  </ErrorBoundary>
)

export default observer(AreaHistory)
