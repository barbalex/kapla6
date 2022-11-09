import React, { useContext, useState, useMemo } from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../shared/ErrorBoundary'
import Select from '../shared/Select'
import KontakteInternItems from './KontakteInternItems'
import storeContext from '../../storeContext'

const Container = styled.div`
  grid-column: 1 / span 2;
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 0;
`
// eslint-disable-next-line no-unused-vars
const RowfVDropdown = styled.div`
  grid-column: 1 / span 1;
  display: grid;
  grid-template-columns: 260px calc(100% - 260px);
  grid-gap: 4px;
  margin-top: 5px;
`
// eslint-disable-next-line no-unused-vars
const FvDropdown = styled.div`
  grid-column: 1 / span 1;
`

const GeschaefteKontakteIntern = ({ tabIndex }) => {
  const store = useContext(storeContext)
  const { geschaeftKontaktInternNewCreate } = store
  const { interneOptions: interneOptionsPassed, activeId } = store.geschaefte
  const { geschaefteKontakteIntern } = store.geschaefteKontakteIntern

  const [value, setValue] = useState('')

  const interneOptions = useMemo(() => {
    // filter out options already choosen
    const kontakteInternOfActiveGeschaeft = geschaefteKontakteIntern.filter(
      (g) => g.idGeschaeft === activeId,
    )
    const idKontakteOfGkiOfActiveGeschaeft =
      kontakteInternOfActiveGeschaeft.map((kI) => kI.idKontakt)
    const interneOptionsFiltered = interneOptionsPassed.filter(
      (o) => !idKontakteOfGkiOfActiveGeschaeft.includes(o.id),
    )
    // sort interneOptions by kurzzeichen
    const interneOptionsSorted = _.sortBy(interneOptionsFiltered, (o) => {
      const name = o.name ? o.name.toLowerCase() : 'zz'
      const vorname = o.vorname ? o.vorname.toLowerCase() : 'zz'
      return `${name} ${vorname} ${o.kurzzeichen}`
    }).map((o) => ({
      label: `${o.name || '(kein Nachname)'} ${
        o.vorname || '(kein Vorname)'
      } (${o.kurzzeichen || 'kein Kurzzeichen'})`,
      value: o.id,
    }))
    return interneOptionsSorted
    // value is added to update list after adding Kontakt to remove choosen Kontakt from list
  }, [activeId, geschaefteKontakteIntern, interneOptionsPassed, value])

  return (
    <ErrorBoundary>
      <Container>
        <KontakteInternItems
          refresh={async () => {
            await setValue(null)
            setValue('')
          }}
        />
        <RowfVDropdown>
          <FvDropdown>
            <Select
              value={value}
              field="not-relevant"
              placeholder="Internen Kontakt hinzufügen"
              options={interneOptions}
              saveToDb={async ({ value, field }) => {
                await setValue(value)
                await geschaeftKontaktInternNewCreate(activeId, value)
                // empty dropdown
                setTimeout(() => setValue(''), 1000)
              }}
              tabIndex={tabIndex}
            />
          </FvDropdown>
        </RowfVDropdown>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(GeschaefteKontakteIntern)
