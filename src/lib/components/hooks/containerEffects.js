import { useEffect } from 'react'
import setify from 'setify' // Sets input value without changing cursor position
//import startsWithCaseInsensitive from '../../utils/startsWithCaseInsensitive'

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
      //if (!queryMatchesTypeahead(query, currentValue, true)) return ''
      if (!currentValue.startsWith(query)) return ''
      return currentValue
    })()

    typeaheadInput.current.value = value

    setify(queryInput.current, query)
    if (typeof onChange === 'function') onChange(query)
  }, [query, onChange])
}