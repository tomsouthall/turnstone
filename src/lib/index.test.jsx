import React from 'react'
import renderer from 'react-test-renderer'

import { vi, describe, expect, test } from 'vitest'
import Turnstone from './index'

vi.mock('./components/container', () => ({ default: () => 'Container' }))

const listbox = {
  data: ['foo', 'bar', 'foobar'],
  searchType: 'startswith'
}

const component = renderer.create(
  <Turnstone listbox={listbox} />
)

const tree = component.toJSON()

describe('Turnstone', () => {
  test('Turnstone component renders correctly', () => {
    expect(tree).toMatchSnapshot()
  })

  test('Turnstone component passes all props to Container component along with default props', () => {
    const props = {...component.root.children[0].children[0].props}

    // The id prop is randomly generated so must be excluded
    delete props.id

    expect(props).toEqual({
      autoFocus: false,
      clearButton: false,
      clearButtonAriaLabel: 'Clear contents',
      clearButtonText: '×',
      debounceWait: 250,
      defaultListboxIsImmutable: true,
      disabled: false,
      listbox,
      listboxIsImmutable: true,
      maxItems: 10,
      minQueryLength: 1,
      placeholder: ''
    })
  })
})