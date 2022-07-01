import validateDate from './validateDate'

const getDateValidationStateDate = (date) => {
  switch (validateDate(date)) {
    case true:
      return null
    case false:
      return 'error'
    default:
      return null
  }
}

export default getDateValidationStateDate
