import React, { createContext, useState, useEffect } from 'react'

const AutocompleteContext = createContext()

const AutocompleteContextProvider = (props) => {
  const { children, splitChar, styles = {}, text = '' } = props
  const [queryState, setQueryState] = useState(text)
  const [highlightedState, setHighlightedState] = useState()
  const [selectedState, setSelectedState] = useState()
  const [customStyles] = useState(styles)
  const [splitCharState] = useState(splitChar)

  useEffect(() => setQueryState(text), [text])

  return (
    <AutocompleteContext.Provider
      value={{
        queryState,
        setQueryState,
        highlightedState,
        setHighlightedState,
        selectedState,
        setSelectedState,
        customStyles,
        splitCharState
      }}>
      {children}
    </AutocompleteContext.Provider>
  )
}

export { AutocompleteContext, AutocompleteContextProvider }
