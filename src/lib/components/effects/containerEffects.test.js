import { vi, describe, test, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react-hooks'
import { useAutoFocus, useQueryChange } from './containerEffects'

let inputRef = (value = '') => ( //TODO: Put in a beforeEach when blogging
  {
    current: {
      focus: vi.fn(),
      value
    }
  }
)

describe('useAutoFocus', () => {
  test('Focus is set when autofocus is true', () => {
    const ref = inputRef()
    const autoFocus = true
    renderHook(() => useAutoFocus(ref, autoFocus))
    expect(ref.current.focus).toHaveBeenCalledTimes(1)
  })

  test('Focus is not set when autofocus is false', () => {
    const ref = inputRef()
    const autoFocus = false
    renderHook(() => useAutoFocus(ref, autoFocus))
    expect(ref.current.focus).toHaveBeenCalledTimes(0)
  })
})

describe('useQueryChange', () => {
  const typeaheadValue = 'Chicago, Illinois, United States'
  const queryValue = 'Chi'

  test('Empty queryState causes both query and typeahead inputs to be emptied', () => {
    const queryRef = inputRef(queryValue)
    const typeaheadRef = inputRef(typeaheadValue)
    renderHook(() => useQueryChange(queryRef, typeaheadRef, ''))
    expect(queryRef.current.value).toBe('')
    expect(typeaheadRef.current.value).toBe('')
  })

  test('Empty query input value is set to queryState', () => {
    const queryRef = inputRef()
    const typeaheadRef = inputRef()
    renderHook(() => useQueryChange(queryRef, typeaheadRef, queryValue))
    expect(queryRef.current.value).toBe(queryValue)
  })

  test('If queryState matches typeahead, both values remain unchanged', () => {
    const queryRef = inputRef()
    const typeaheadRef = inputRef(typeaheadValue)
    renderHook(() => useQueryChange(queryRef, typeaheadRef, queryValue))
    expect(queryRef.current.value).toBe(queryValue)
    expect(typeaheadRef.current.value).toBe(typeaheadValue)
  })

  test('If queryState does not match typeahead, typeahead is emptied', () => {
    const queryState = 'Chil'
    const queryRef = inputRef(queryState)
    const typeaheadRef = inputRef(typeaheadValue)
    renderHook(() => useQueryChange(queryRef, typeaheadRef, queryState))
    expect(queryRef.current.value).toBe(queryState)
    expect(typeaheadRef.current.value).toBe('')
  })

  test('If onChange is present, it is called and passed the queryState', () => {
    const queryRef = inputRef()
    const typeaheadRef = inputRef()
    const onChange = vi.fn()
    renderHook(() => useQueryChange(queryRef, typeaheadRef, queryValue, onChange))
    expect(onChange).toHaveBeenCalledWith(queryValue)
  })
})