const getAllData = async (store) => {
  const { setFetching } = store
  setFetching(true)
  // load faellige geschaefte first
  // te get ui tu show quicker
  await store.geschaefte?.fetchFaellige()
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
  await store.geschaefte?.fetchRest()
  console.log('fetched initial data')
  return
}

export default getAllData
