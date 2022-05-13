import React from 'react'
import renderer from 'react-test-renderer'

import { describe, expect, test } from 'vitest'
import { StateContextProvider } from '../context/state'
import MatchingText from './matchingText.jsx'

describe('MatchingText', () => {
  test('Component renders', () => {
    const component = renderer.create(
      <StateContextProvider>
        <MatchingText text='New York City' match='New' startsWith={true} styles={{match: 'match-class'}} />
      </StateContextProvider>
    )

    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })

  test('Text is highlighted for a "contains" item', () => {
    const component = renderer.create(
      <StateContextProvider>
        <MatchingText text='Foo New Foo' match='New' startsWith={false} styles={{match: 'match-class'}} />
      </StateContextProvider>
    )

    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})