import React, { useContext, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import Linkify from 'react-linkify'
import $ from 'jquery'
import styled from 'styled-components'

import storeContext from '../../storeContext'

const StyledRow = styled.div`
  border-bottom: 1px solid #bbbbbb;
  cursor: pointer;
  min-height: 38px;
  max-height: 38px;
  background-color: ${(props) => (props.isActive ? '#FFBF73' : 'inherit')};
  display: flex;
  padding: 5px;
`
const StyledBodyCell = styled.div`
  flex: 1;
  padding: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  overflow: hidden;
  max-width: ${(props) => `${props.maxWidth}px`};
`

const TableItem = ({ index, rows, headers }) => {
  const store = useContext(storeContext)
  const { id, toggleActivatedRow } = store.table
  const row = rows[index]
  const { tableColumnWidth } = store.app
  const windowWidth = $(window).width()
  const tableWidth = (windowWidth * tableColumnWidth) / 100
  const normalFieldWidth = (tableWidth - 50) / (headers.length - 1)
  const isActive = !!id && id === row.id

  const onClickTableRow = useCallback(
    () => toggleActivatedRow(row.id),
    [row.id, toggleActivatedRow],
  )

  return (
    <StyledRow isActive={isActive}>
      {headers.map((val, i) => (
        <StyledBodyCell
          key={i}
          maxWidth={val === 'id' ? 50 : normalFieldWidth}
          onClick={onClickTableRow}
        >
          <Linkify>{row[val]}</Linkify>
        </StyledBodyCell>
      ))}
    </StyledRow>
  )
}

export default observer(TableItem)
