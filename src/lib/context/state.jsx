import React, { createContext, useReducer, useState, useEffect } from 'react'
import reducer from '../reducers/reducer'
import {setQuery} from '../actions/actions'
import undef from '../utils/undef'

const StateContext = createContext() //TODO: Rename GlobalStateContext

const StateContextProvider = (props) => {
  const { children, splitChar, styles = {}, text = '', items = [] } = props
  const [state, dispatch] = useReducer(reducer, {
    query: text,
    items,
    highlighted: undef,
    selected: undef,
    customStyles: styles,
    splitChar
  })
  const [selectedState, setSelectedState] = useState()
  const [customStyles] = useState(styles)
  const [splitCharState] = useState(splitChar)

  useEffect(() => dispatch(setQuery(text)), [text]) // TODO: Is this needed?

  return (
    <StateContext.Provider
      value={{
        state,
        dispatch,
        selectedState,
        setSelectedState,
        customStyles,
        splitCharState
      }}>
      {children}
    </StateContext.Provider>
  )
}

export { StateContext, StateContextProvider }
