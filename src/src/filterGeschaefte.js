import filterGeschaefteByFilterFields from './filterGeschaefteByFilterFields'

const filterGeschaefte = (store) => {
  const { filterFulltext, filterFulltextIds, filterFields, geschaefte } =
    store.geschaefte
  const existsFilterFulltext = !!filterFulltext
  const existsFilterFields = filterFields.length > 0

  if (existsFilterFulltext) {
    return geschaefte.filter((g) => filterFulltextIds.includes(g.idGeschaeft))
  } else if (existsFilterFields) {
    return filterGeschaefteByFilterFields(store)
  }
  return geschaefte
}

export default filterGeschaefte
