import React from 'react'

import Row from './Row'

const FaelligeGeschaefteRows = ({ geschaefte }) =>
  geschaefte.map((geschaeft, index) => (
    <Row geschaeft={geschaeft} key={geschaeft.idGeschaeft} rowIndex={index} />
  ))

export default FaelligeGeschaefteRows
