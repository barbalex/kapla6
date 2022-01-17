import React, { useContext, useEffect, useCallback } from 'react'
import { AutoSizer, List } from 'react-virtualized'
import $ from 'jquery'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { toJS } from 'mobx'

import ErrorBoundary from '../shared/ErrorBoundary'
import TableItem from './TableItem'
import storeContext from '../../storeContext'

const Container = styled.div`
  background-image: linear-gradient(
    45deg,
    rgba(235, 255, 229, 0.5) 10%,
    rgba(216, 255, 200, 0.7)
  );
  height: 100vh;
`
const StyledTable = styled.div`
  top: 58px;
  width: 100%;
`
const StyledTableHeader = styled.div`
  border-bottom: 2px solid #717171;
  font-weight: 700;
`
const StyledTableHeaderRow = styled.div`
  display: flex;
  padding: 5px;
  padding-right: ${(props) => props.paddingRight};
`
const StyledTableHeaderCell = styled.div`
  flex: 1;
  padding: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  overflow: hidden;
  max-width: ${(props) => `${props.maxWidth}px`};
`
const StyledTableBody = styled.div`
  overflow: auto;
  height: calc(100vh - 96px);
`
const StyledNoRowsDiv = styled.div`
  padding: 10px;
  font-weight: bold;
`
const StyledList = styled(List)`
  overflow-y: overlay !important;
`

const noRowsRenderer = () => <StyledNoRowsDiv>lade Daten...</StyledNoRowsDiv>

const Table = () => {
  const store = useContext(storeContext)
  const { tableColumnWidth } = store.app
  const { rows: rowsPassed, id, table, reset } = store.table

  const rows = table ? [...toJS(rowsPassed)[table]] : []

  let rowsSorted
  switch (table) {
    case 'interne':
    case 'externe':
      rowsSorted = rows.sort((a, b) => (a?.name ?? '').localeCompare(b.name))
      break
    case 'abteilung':
      rowsSorted = rows.sort((a, b) =>
        (a?.abteilung ?? '').localeCompare(b.abteilung),
      )
      break
    case 'aktenstandort':
      rowsSorted = rows.sort((a, b) =>
        (a?.aktenstandort ?? '').localeCompare(b.aktenstandort),
      )
      break
    case 'geschaeftsart':
      rowsSorted = rows.sort((a, b) =>
        (a?.geschaeftsart ?? '').localeCompare(b.geschaeftsart),
      )
      break
    case 'parlVorstossTyp':
      rowsSorted = rows.sort((a, b) =>
        (a?.parlVorstossTyp ?? '').localeCompare(b.parlVorstossTyp),
      )
      break
    case 'rechtsmittelInstanz':
      rowsSorted = rows.sort((a, b) =>
        (a?.rechtsmittelInstanz ?? '').localeCompare(b.rechtsmittelInstanz),
      )
      break
    case 'rechtsmittelErledigung':
      rowsSorted = rows.sort((a, b) =>
        (a?.rechtsmittelErledigung ?? '').localeCompare(
          b.rechtsmittelErledigung,
        ),
      )
      break
    case 'status':
      rowsSorted = rows.sort((a, b) =>
        (a?.status ?? '').localeCompare(b.status),
      )
      break
    default:
      rowsSorted = []
  }

  const indexOfActiveId = rowsSorted.findIndex((r) => r.id === id)
  const headers = Object.keys(rowsSorted[0] || {})
  const windowWidth = $(window).width()
  const tableWidth = (windowWidth * tableColumnWidth) / 100
  const normalFieldWidth = (tableWidth - 50) / (headers.length - 1)

  const rowRenderer = useCallback(
    ({ key, index, style }) => (
      <div key={key} style={style}>
        <TableItem index={index} rows={rowsSorted} headers={headers} />
      </div>
    ),
    [rowsSorted, headers],
  )

  useEffect(() => {
    return () => reset()
  }, [reset])

  return (
    <ErrorBoundary>
      <Container>
        <StyledTable>
          <StyledTableHeader>
            <StyledTableHeaderRow>
              {headers.map((header, index) => (
                <StyledTableHeaderCell
                  key={index}
                  maxWidth={header === 'id' ? 50 : normalFieldWidth}
                >
                  {header}
                </StyledTableHeaderCell>
              ))}
            </StyledTableHeaderRow>
          </StyledTableHeader>
          <StyledTableBody>
            <AutoSizer>
              {({ height, width }) => (
                <StyledList
                  height={height}
                  rowCount={rowsSorted.length}
                  rowHeight={38}
                  rowRenderer={rowRenderer}
                  noRowsRenderer={noRowsRenderer}
                  width={width}
                  scrollToIndex={indexOfActiveId}
                  {...rowsSorted}
                />
              )}
            </AutoSizer>
          </StyledTableBody>
        </StyledTable>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Table)
