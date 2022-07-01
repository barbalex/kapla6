const tableStandardState = {
  table: null,
  rows: {
    interne: [],
    externe: [],
    aktenstandort: [],
    geschaeftsart: [],
    parlVorstossTyp: [],
    rechtsmittelInstanz: [],
    rechtsmittelErledigung: [],
    status: [],
  },
  // following: state for active row
  id: null,
  willDelete: false,
  error: [],
}

export default tableStandardState
