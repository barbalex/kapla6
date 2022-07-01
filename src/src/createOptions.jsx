import React from 'react'

const createOptions = (values) => {
  if (!values) return []
  const options = values.map((val, index) => (
    <option key={index + 1} value={val}>
      {val}
    </option>
  ))
  options.unshift(<option key={0} value="" />)
  return options
}

export default createOptions
