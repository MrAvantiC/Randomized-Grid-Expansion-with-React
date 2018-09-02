import React from 'react'

const DimensionInput = ({ title, name, value, onChange }) => (
  <label htmlFor={name}>
    Columns:
    <input type="number" name={name} value={value} onChange={onChange} />
  </label>
)

export default DimensionInput
