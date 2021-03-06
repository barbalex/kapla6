const whereStringForFieldsAnd = (fieldFilter) => {
  const whereArray = Object.keys(fieldFilter).map(
    (key) => `${key} LIKE "%${String(fieldFilter[key])}%"`,
  )
  const whereString =
    whereArray.length > 0 ? ` WHERE ${whereArray.join(' AND ')}` : ''
  return whereString
}

export default whereStringForFieldsAnd
