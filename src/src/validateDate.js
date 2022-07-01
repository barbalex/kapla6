import moment from 'moment'

const validateDate = (date) => {
  if (!date) return true
  return moment(date, 'DD.MM.YYYY').isValid()
}

export default validateDate
