const getAllData = async (store) => {
  const { setFetching } = store
  setFetching(true)
  // load geschaefte first
  // hope that ui shows more quicker
  await store.geschaefte?.fetchAll()
  setFetching(false)
  await Promise.all([
    store.faelligeStatiOptionsGet(),
    store.geschaefte?.fetchAllGeko(),
    store.geschaefte?.fetchLinks(),
    store.interneOptionsGet(),
    store.externeOptionsGet(),
    store.getGeschaefteKontakteIntern(),
    store.getGeschaefteKontakteExtern(),
    store.rechtsmittelErledigungOptionsGet(),
    store.parlVorstossTypOptionsGet(),
    store.statusOptionsGet(),
    store.geschaeftsartOptionsGet(),
    store.aktenstandortOptionsGet(),
    store.rechtsmittelInstanzOptionsGet(),
    store.abteilungOptionsGet(),
  ])
  console.log('fetched initial data')
  return
}

export default getAllData
