import React from 'react'
import renderer from 'react-test-renderer'

import { vi, describe, expect, test } from 'vitest'
import { StateContextProvider } from '../context/state'
import Listbox from './listbox'

vi.mock('./item', () => ({ default: () => 'Item' }))
vi.mock('./item', () => ({ default: () => 'ItemFirst' }))

describe('Listbox', () => {
  test('Component renders correctly', () => {
    const customStyles = {
      listbox: 'listbox-class',
      noItems: 'no-items-class',
    }

    const items = [
      { "value": "Peach", "text": "Peach", "groupIndex": 0, "groupName": "Fruit" },
      { "value": "Pear", "text": "Pear", "groupIndex": 0, "groupName": "Fruit" },
      { "value": "Parsnip", "text": "Parsnip", "groupIndex": 1, "groupName": "Vegetables" },
      { "value": "Peanuts", "text": "Peanuts", "groupIndex": 1, "groupName": "Vegetables" }]

    const component = renderer.create(
      <StateContextProvider styles={customStyles}>
        <Listbox
          id='test'
          items={items} />
      </StateContextProvider>
    )

    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})