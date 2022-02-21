import { useEffect, useContext } from 'react'
import setify from 'setify' // Sets input value without changing cursor position
import { StateContext } from '../../context/state'
import { setItems } from '../../actions/actions'
import isUndefined from '../../utils/isUndefined'
import undef from '../../utils/undef'
import startsWithCaseInsensitive from '../../utils/startsWithCaseInsensitive'

export const useItemsState = (swrData) => {
  const { dispatch } = useContext(StateContext)

  useEffect(() => {
    dispatch(setItems(swrData || []))
  }, [swrData])
}

export const useAutoFocus = (queryInput, autoFocus) => { // TODO: might be able to use autofocus property of input for this - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-autofocus
  useEffect(() => {
    if (autoFocus) queryInput.current.focus()
  }, [autoFocus])
}

export const useQueryChange = (query, queryInput, typeaheadInput, onChange) => {
  useEffect(() => {
    // console.log('query changed', { query })
    const value = (() => {
      const currentValue = typeaheadInput.current.value
      if (!query) return ''
      if (!currentValue.startsWith(query)) return ''
      return currentValue
    })()

    typeaheadInput.current.value = value

    setify(queryInput.current, query)
    if (typeof onChange === 'function') onChange(query)
  }, [query, onChange])
}

export const useHighlight = (highlighted, hasFocus, queryInput, typeaheadInput) => {
  useEffect(() => {
    const typeAheadValue =
      highlighted &&
      hasFocus &&
      queryInput.current.value.length > 0 &&
      startsWithCaseInsensitive(highlighted.text, queryInput.current.value)
        ? highlighted.text
        : ''
    const queryValue = formatQuery(queryInput.current.value, typeAheadValue)

    typeaheadInput.current.value = typeAheadValue

    setify(queryInput.current, queryValue)
  }, [highlighted, hasFocus])
}

export const useSelected = (selected, queryInput, typeaheadInput, onSelect) => {
  useEffect(() => {
    let callbackValue

    if (isUndefined(selected)) {
      callbackValue = undef
    }
    else {
      typeaheadInput.current.value = ''
      queryInput.current.blur()
      callbackValue = selected.value
    }

    if (typeof onSelect === 'function') onSelect(callbackValue)
  }, [selected, onSelect])
}

//////////////////////////////
// Helper functions         //
//////////////////////////////

export const formatQuery = (query, typeahead) => {
  const formattedQuery = typeahead.substring(0, query.length)
  return formattedQuery.length > 0 &&
    query.toLowerCase() === formattedQuery.toLowerCase() &&
    query !== formattedQuery
    ? formattedQuery
    : query
}