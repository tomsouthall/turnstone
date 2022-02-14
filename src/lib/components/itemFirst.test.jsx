import React from 'react'
import renderer from 'react-test-renderer'

import { vi, describe, expect, test } from 'vitest'
import { TurnstoneContextProvider } from '../context/turnstone'
import ItemFirst from './itemFirst'

vi.mock('./item', () => ({ default: () => 'Item' }))

describe('ItemFirst', () => {
  test('Component renders correctly', () => {
    const customStyles = {
      groupName: 'group-name-class'
    }

    const component = renderer.create(
      <TurnstoneContextProvider styles={customStyles}>
       <ItemFirst
          groupName={'Cities'}
          index={0}
          key={'item0'}
        />
      </TurnstoneContextProvider>
    )

    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})