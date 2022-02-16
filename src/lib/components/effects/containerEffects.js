import { useEffect } from 'react'
import setify from 'setify' // Sets input value without changing cursor position
//import startsWithCaseInsensitive from '../../utils/startsWithCaseInsensitive'

export const useAutoFocus = (queryInput, autoFocus) => { // TODO: might be able to use autofus property of input for this - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-autofocus
  useEffect(() => {
    if (autoFocus) queryInput.current.focus()
  }, [autoFocus])
}

export const useQueryChange = (queryInput, typeaheadInput, queryState, onChange) => {
  useEffect(() => {
    // console.log('queryState changed', { queryState })
    const value = (() => {
      const currentValue = typeaheadInput.current.value
      if (!queryState) return ''
      //if (!queryMatchesTypeahead(queryState, currentValue, true)) return ''
      if (!currentValue.startsWith(queryState)) return ''
      return currentValue
    })()

    typeaheadInput.current.value = value

    setify(queryInput.current, queryState)
    if (typeof onChange === 'function') onChange(queryState)
  }, [queryState, onChange])
}