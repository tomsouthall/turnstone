import { useEffect, useContext } from 'react'
import setify from 'setify' // Sets input value without changing cursor position
import { StateContext } from '../../context/state'
import { setItems, setItemsError } from '../../actions/actions'
import isUndefined from '../../utils/isUndefined'
import undef from '../../utils/undef'
import startsWithCaseInsensitive from '../../utils/startsWithCaseInsensitive'

export const useItemsState = (swrData) => {
  const { dispatch } = useContext(StateContext)

  useEffect(() => {
    dispatch(setItems(swrData || []))
  }, [swrData, dispatch])
}

export const useItemsError = (error) => {
  const { dispatch } = useContext(StateContext)

  useEffect(() => {
    if(error) dispatch(setItemsError())
  }, [error, dispatch])
}

export const useQueryChange = (query, queryInput, typeaheadInput, onChange) => {
  useEffect(() => {
    const hasTypeahead = !!typeaheadInput.current
    const value = (() => {
      const currentValue = hasTypeahead ? typeaheadInput.current.value : ''
      if (!query) return ''
      if (!currentValue.startsWith(query)) return ''
      return currentValue
    })()

    if(hasTypeahead) typeaheadInput.current.value = value

    setify(queryInput.current, query)
    if (typeof onChange === 'function') onChange(query)
  }, [query, onChange, queryInput, typeaheadInput])
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

    if(typeaheadInput.current) typeaheadInput.current.value = typeAheadValue

    setify(queryInput.current, queryValue)
  }, [highlighted, hasFocus, queryInput, typeaheadInput])
}

export const useSelected = (selected, queryInput, typeaheadInput, onSelect) => {
  useEffect(() => {
    let value, displayField

    if (isUndefined(selected)) {
      value = undef
      displayField = undef
    }
    else {
      if(typeaheadInput.current) typeaheadInput.current.value = ''
      queryInput.current.blur()
      value = selected.value
      displayField = selected.displayField
    }

    //TODO: Check if it's necessary to call this when value is undef
    if (typeof onSelect === 'function') onSelect(value, displayField)
  }, [selected, onSelect, queryInput, typeaheadInput])
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