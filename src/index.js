import React from 'react'
import { AutocompleteContextProvider } from './context/autocomplete'
import AutocompleteInput from './components/input'

export default function Autocomplete(props) {
  const { splitChar, styles, text } = props
  return (
    <AutocompleteContextProvider
      splitChar={splitChar}
      styles={styles}
      text={text}>
      <AutocompleteInput {...props} />
    </AutocompleteContextProvider>
  )
}
