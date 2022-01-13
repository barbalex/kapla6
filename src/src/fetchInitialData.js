import fetchUsername from './fetchUsername'

const fetchInitialData = async (store) => {
  // TODO: run these in parallel
  console.log('will fetch initial data')
  const { fetching, setFetching } = store
  !fetching && setFetching(true)
  await fetchUsername(store)
  await store.faelligeStatiOptionsGet()
  await store.geschaefte?.fetchAllGeko()
  await store.geschaefte?.fetchLinks()
  await store.interneOptionsGet()
  await store.externeOptionsGet()
  await store.getGeschaefteKontakteIntern()
  await store.getGeschaefteKontakteExtern()
  await store.rechtsmittelErledigungOptionsGet()
  await store.parlVorstossTypOptionsGet()
  await store.statusOptionsGet()
  await store.geschaeftsartOptionsGet()
  await store.aktenstandortOptionsGet()
  await store.rechtsmittelInstanzOptionsGet()
  await store.abteilungOptionsGet()
  console.log('fetched fetched abteilungOptions')
  await store.geschaefte?.fetchAll()
  console.log('fetched fetched all geschaefte')
  setFetching(false)
  console.log('fetched initial data')
}

export default fetchInitialData
