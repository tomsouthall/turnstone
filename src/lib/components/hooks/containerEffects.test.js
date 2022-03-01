import { vi, describe, test, expect } from 'vitest'
import { renderHook } from '@testing-library/react-hooks'
import undef from '../../utils/undef'
import {
  useAutoFocus,
  useQueryChange,
  useHighlight,
  useSelected,
  formatQuery
} from './containerEffects'

let inputRef = (value = '') => ( //TODO: Put in a beforeEach when blogging
  {
    current: {
      focus: vi.fn(),
      blur: vi.fn(),
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

describe('useHighlight', () => {
  const queryValue = 'chi'
  const highlighted = { index: 0, text: 'Chicago, Illinois, United States' }

  test('Typeahead is set to highlighted text and query text changes to match case', () => {
    const queryRef = inputRef(queryValue)
    const typeaheadRef = inputRef()
    renderHook(() => useHighlight(highlighted, true, queryRef, typeaheadRef))
    expect(queryRef.current.value).toBe('Chi')
    expect(typeaheadRef.current.value).toBe(highlighted.text)
  })

  test('If there is no highlighted item, no change occurs', () => {
    const queryRef = inputRef(queryValue)
    const typeaheadRef = inputRef()
    renderHook(() => useHighlight(undef, true, queryRef, typeaheadRef))
    expect(queryRef.current.value).toBe(queryValue)
    expect(typeaheadRef.current.value).toBe('')
  })

  test('If focus is not set, no change occurs', () => {
    const queryRef = inputRef(queryValue)
    const typeaheadRef = inputRef()
    renderHook(() => useHighlight(highlighted, false, queryRef, typeaheadRef))
    expect(queryRef.current.value).toBe(queryValue)
    expect(typeaheadRef.current.value).toBe('')
  })

  test('If there is no query, no change occurs', () => {
    const queryRef = inputRef()
    const typeaheadRef = inputRef()
    renderHook(() => useHighlight(highlighted, true, queryRef, typeaheadRef))
    expect(queryRef.current.value).toBe('')
    expect(typeaheadRef.current.value).toBe('')
  })

  test('If selected text does not match typed text, no change occurs', () => {
    const queryRef = inputRef('Foo')
    const typeaheadRef = inputRef()
    renderHook(() => useHighlight(highlighted, true, queryRef, typeaheadRef))
    expect(queryRef.current.value).toBe('Foo')
    expect(typeaheadRef.current.value).toBe('')
  })
})

describe('useSelected', () => {
  const queryValue = 'Chicago, Illinois, United States'
  const selected = {
    text: queryValue,
    value: {
      name: queryValue,
      coords: '41.882304590139135, -87.62327214400634'
    },
    displayField: 'name'
  }

  test('Side effects of item selection occur correctly', () => {
    const queryRef = inputRef(queryValue)
    const typeaheadRef = inputRef(queryValue)
    const onSelect = vi.fn()
    renderHook(() => useSelected(selected, queryRef, typeaheadRef, onSelect))
    expect(queryRef.current.value).toBe(queryValue)
    expect(queryRef.current.blur).toHaveBeenCalledTimes(1)
    expect(typeaheadRef.current.value).toBe('')
    expect(onSelect).toHaveBeenCalledWith(selected.value, selected.displayField)
  })

  test('Side effects do not occur if selected item is undefined', () => {
    const queryRef = inputRef(queryValue)
    const typeaheadRef = inputRef(queryValue)
    const onSelect = vi.fn()
    renderHook(() => useSelected(undef, queryRef, typeaheadRef, onSelect))
    expect(queryRef.current.blur).toHaveBeenCalledTimes(0)
    expect(typeaheadRef.current.value).toBe(queryValue)
    expect(onSelect).toHaveBeenCalledWith(undef, undef)
  })
})

//////////////////////////////
// Helper functions         //
//////////////////////////////

describe('formatQuery', () => {
  test('If query does not match typeahead, change the case', () => {
    const formattedQuery = formatQuery('chi', 'Chicago')
    expect(formattedQuery).toBe('Chi')
  })

  test('If there is no typeahead, return original query', () => {
    const formattedQuery = formatQuery('chi', '')
    expect(formattedQuery).toBe('chi')
  })

  test('If query and typeahead do not match, return original query', () => {
    const formattedQuery = formatQuery('chi', 'New York')
    expect(formattedQuery).toBe('chi')
  })

  test('If query is blank, return original query', () => {
    const formattedQuery = formatQuery('', 'Chicago')
    expect(formattedQuery).toBe('')
  })

  test('If query matches typeahead, make no change', () => {
    const formattedQuery = formatQuery('Chi', 'Chicago')
    expect(formattedQuery).toBe('Chi')
  })
})