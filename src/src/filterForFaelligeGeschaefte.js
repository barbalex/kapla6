import moment from 'moment'

const filterForFaelligeGeschaefte = [
  {
    field: 'fristMitarbeiter',
    value: moment().format('YYYY-MM-DD'),
    comparator: '<=',
  },
  {
    field: 'kannFaelligSein',
    value: true,
    comparator: '===',
  },
]

export default filterForFaelligeGeschaefte
