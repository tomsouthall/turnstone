import { vi, describe, test, expect } from 'vitest'
import { renderHook } from '@testing-library/react-hooks'
import {
  useAutoFocus,
  useQueryChange
} from './containerEffects'

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

  test('Empty query causes both query and typeahead inputs to be emptied', () => {
    const queryRef = inputRef(queryValue)
    const typeaheadRef = inputRef(typeaheadValue)
    renderHook(() => useQueryChange('', queryRef, typeaheadRef))
    expect(queryRef.current.value).toBe('')
    expect(typeaheadRef.current.value).toBe('')
  })

  test('Empty query input value is set to query', () => {
    const queryRef = inputRef()
    const typeaheadRef = inputRef()
    renderHook(() => useQueryChange(queryValue, queryRef, typeaheadRef))
    expect(queryRef.current.value).toBe(queryValue)
  })

  test('If query matches typeahead, both values remain unchanged', () => {
    const queryRef = inputRef()
    const typeaheadRef = inputRef(typeaheadValue)
    renderHook(() => useQueryChange(queryValue, queryRef, typeaheadRef))
    expect(queryRef.current.value).toBe(queryValue)
    expect(typeaheadRef.current.value).toBe(typeaheadValue)
  })

  test('If query does not match typeahead, typeahead is emptied', () => {
    const query = 'Chil'
    const queryRef = inputRef(query)
    const typeaheadRef = inputRef(typeaheadValue)
    renderHook(() => useQueryChange(query, queryRef, typeaheadRef))
    expect(queryRef.current.value).toBe(query)
    expect(typeaheadRef.current.value).toBe('')
  })

  test('If onChange is present, it is called and passed the query', () => {
    const queryRef = inputRef()
    const typeaheadRef = inputRef()
    const onChange = vi.fn()
    renderHook(() => useQueryChange(queryValue, queryRef, typeaheadRef, onChange))
    expect(onChange).toHaveBeenCalledWith(queryValue)
  })
})