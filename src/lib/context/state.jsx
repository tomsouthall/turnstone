import React, { createContext, useReducer, useEffect } from 'react'
import reducer from '../reducers/reducer'
import {setQuery} from '../actions/actions'
import undef from '../utils/undef'

const StateContext = createContext()

const StateContextProvider = (props) => {
  const { styles = {}, text = '', items = [] } = props
  const { children, ...propsMinusChildren} = props
  const [state, dispatch] = useReducer(reducer, {
    query: text,
    items,
    itemsError: false,
    canShowListbox: false,
    highlighted: undef,
    selected: undef,
    customStyles: styles,
    props: propsMinusChildren
  })

  useEffect(() => dispatch(setQuery(text)), [text]) // TODO: Is this needed?

  return (
    <StateContext.Provider
      value={{state, dispatch}}>
      {children}
    </StateContext.Provider>
  )
}

export { StateContext, StateContextProvider }
