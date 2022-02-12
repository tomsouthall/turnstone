import React from 'react'
import { TurnstoneContextProvider } from './context/turnstone'
import AutocompleteInput from './components/input'

export default function Turnstone(props) {
  const { splitChar, styles, text } = props
  return (
    <TurnstoneContextProvider
      splitChar={splitChar}
      styles={styles}
      text={text}>
      <AutocompleteInput {...props} />
    </TurnstoneContextProvider>
  )
}
