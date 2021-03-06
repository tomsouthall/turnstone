import React from 'react'
import renderer from 'react-test-renderer'

import { vi, describe, expect, test } from 'vitest'
import { StateContextProvider } from '../context/state'
import Container from './container'
import { fruits } from '../../data'

vi.mock('./listbox', () => ({ default: () => 'Listbox' }))
vi.mock('./hooks/containerEffects', () => ({
  useItemsState: vi.fn(),
  useItemsError: vi.fn(),
  useAutoFocus: vi.fn(),
  useQueryChange: vi.fn(),
  useHighlight: vi.fn(),
  useSelected: vi.fn()
}))
vi.mock('./hooks/useData', () => ({ default: vi.fn().mockImplementation(() => [1,2,3,4,5]) }))
vi.mock('use-debounce', vi.fn().mockImplementation(() => ({
  useDebounce: (query) => [query]
})))

describe('Container', () => {
  test('Component renders correctly', () => {
    const styles = {
      container: 'query-container-class',
      query: 'query-class',
      typeahead: 'typeahead-class',
      x: 'x-class'
    }
    const props = {
      autoFocus: true,
      data: fruits,
      searchType: 'startswith',
      debounceWait: 0,
      enterKeyHint: 'search',
      id: 'autocomplete',
      maxItems: 10,
      noItemsMessage: 'No matching fruit found',
      placeholder: 'Type something fruity',
      styles: styles,
      typeahead: true
    }

    const component = renderer.create(
      <StateContextProvider {...props}>
       <Container {...props} />
      </StateContextProvider>
    )

    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})