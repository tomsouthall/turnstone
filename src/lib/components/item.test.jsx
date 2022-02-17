import React from 'react'
import renderer from 'react-test-renderer'

import { describe, expect, test } from 'vitest'
import { StateContextProvider } from '../context/state.jsx'
import Item from './item.jsx'

// TODO: Create test helper files?
const customStyles = {
  item: 'item-class',
  highlightedItem: 'highlighted-item-class',
  topItem: 'top-item-class',
  split: 'split-class',
  splitChar: 'split-char-class'
}
const item = {
  text: 'Chicago, Illinois, United States',
  value: {
    name: 'Chicago, Illinois, United States',
    coords: '41.882304590139135, -87.62327214400634'
  }
}

const index = 0

const component = renderer.create(
  <StateContextProvider styles={customStyles} text={'Chi'} items={[item]}>
   <Item
      index={index}
      key={`item${index}`}
      item={item}
    />
  </StateContextProvider>
)
let tree = component.toJSON()

describe('Item', () => {
  test('Component renders correctly', () => {
    expect(tree).toMatchSnapshot()
  })

  test('Link changes the class when hovered', () => {
    // Manually trigger onMouseEnter and rerender
    tree.props.onMouseEnter()
    tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})