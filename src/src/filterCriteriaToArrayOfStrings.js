const filterCriteriaToArrayOfStrings = (filterFields) =>
  filterFields
    .filter((ff) => ff.value || ff.value === 0)
    .map((ff) => `${ff.field} ${ff.comparator} '${ff.value}'`)
    .sort()

export default filterCriteriaToArrayOfStrings
