import React from 'react'
import renderer from 'react-test-renderer'

import { vi, describe, expect, test } from 'vitest'
import { StateContextProvider } from '../context/state'
import ItemFirst from './itemFirst'

vi.mock('./item', () => ({ default: () => 'Item' }))

describe('ItemFirst', () => {
  test('Component renders correctly', () => {
    const customStyles = {
      groupName: 'group-name-class'
    }

    const component = renderer.create(
      <StateContextProvider styles={customStyles}>
       <ItemFirst
          groupName={'Cities'}
          index={0}
          key={'item0'}
        />
      </StateContextProvider>
    )

    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})