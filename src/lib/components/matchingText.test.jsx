import React from 'react'
import renderer from 'react-test-renderer'

import { describe, expect, test } from 'vitest'
import { StateContextProvider } from '../context/state'
import MatchingText from './matchingText.jsx'

describe('MatchingText', () => {
  test('Component renders', () => {
    const component = renderer.create(
      <StateContextProvider
        styles={{match: 'match-class', split: 'split-class'}}>
        <MatchingText text='New York City' match='New' startsWith={true} />
      </StateContextProvider>
    )

    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })

  test('Text is highlighted for a "contains" item', () => {
    const component = renderer.create(
      <StateContextProvider
        styles={{match: 'match-class', split: 'split-class'}}>
        <MatchingText text='Foo New Foo' match='New' startsWith={false} />
      </StateContextProvider>
    )

    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})