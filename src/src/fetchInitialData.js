import fetchUsername from './fetchUsername'

const fetchInitialData = async (store) => {
  const { fetching, setFetching } = store
  !fetching && setFetching(true)
  await fetchUsername(store)
  // TODO: run DELETE FROM geschaefte WHERE cast(cast(idVorgeschaeft AS integer) AS text) != idVorgeschaeft;?
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
    await store.geschaefte?.fetchAll(),
  ])
  setFetching(false)
  console.log('fetched initial data')
}

export default fetchInitialData
