import moment from 'moment'

const convertDateToYyyyMmDd = (date) => {
  // make sure not to convert empty values
  if (!date) return ''
  return moment(date, 'DD.MM.YYYY').format('YYYY-MM-DD')
}

export default convertDateToYyyyMmDd
