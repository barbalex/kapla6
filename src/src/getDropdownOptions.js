const getDropdownOptions = async (store, name) => {
  let result = []
  try {
    result = await store.app.db
      // TODO: update when removing historisch field
      .select(`SELECT ${name} FROM ${name} WHERE historisch = 0 ORDER BY sort`)
  } catch (error) {
    store.addErrorMessage(error.message)
  }
  const options = result.map((res) => res[name])
  return options
}

export default getDropdownOptions
