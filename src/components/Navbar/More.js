import React, { useContext } from 'react'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { shell } from '@tauri-apps/api'

import storeContext from '../../storeContext'
import changeDbConnection from '../../src/changeDbConnection'

const DbPath = styled.span`
  color: #adadad;
  font-weight: 400;
`
const MoreMenu = styled(UncontrolledDropdown)`
  user-select: none;
`
const StyledDropdownToggle = styled(DropdownToggle)`
  padding-left: 18px !important;
  font-size: 1.7em;
  font-weight: 600;
  padding-top: 0 !important;
  margin-top: -4px;
  height: 38px;
`
const Version = styled.div`
  padding: 4px 24px;
  color: #adadad;
  user-select: none;
  font-weight: 400;
`
const StyledDropdownItem = styled(DropdownItem)`
  display: flex !important;
  justify-content: space-between;
`

const onGetProjektbeschreibung = () => {
  shell.open(
    'https://github.com/barbalex/kapla3/raw/master/app/etc/Projektbeschreibung.pdf',
  )
}
const onClickIssues = () => {
  shell.open('https://github.com/barbalex/kapla3/issues')
}

const OptionsNav = () => {
  const store = useContext(storeContext)
  const { dbPath, uiReset, saveConfig } = store.app

  return (
    <MoreMenu nav inNavbar>
      <StyledDropdownToggle nav title="Mehr...">
        &#8942;
      </StyledDropdownToggle>
      <DropdownMenu right>
        <DropdownItem onClick={() => changeDbConnection(store)}>
          Datenbank wählen
          <br />
          {dbPath && <DbPath>{`Aktuell: ${dbPath}`}</DbPath>}
        </DropdownItem>
        <DropdownItem divider />
        <StyledDropdownItem
          onClick={() => {
            uiReset()
            setTimeout(() => saveConfig())
          }}
        >
          Einstellungen zurücksetzen
        </StyledDropdownItem>
        <DropdownItem divider />
        <DropdownItem onClick={onGetProjektbeschreibung}>
          Projektbeschreibung herunterladen
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem onClick={onClickIssues}>
          Fehler und Wünsche melden
        </DropdownItem>
        <DropdownItem divider />
        <Version>Version: 2.1.7 vom 27.08.2021</Version>
      </DropdownMenu>
    </MoreMenu>
  )
}

export default observer(OptionsNav)
