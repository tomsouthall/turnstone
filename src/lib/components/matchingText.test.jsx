import React from 'react'
import renderer from 'react-test-renderer'

import { describe, expect, test } from 'vitest'
import { StateContextProvider } from '../context/state'
import MatchingText from './matchingText.jsx'

describe('MatchingText', () => {
  test('snapshot renders', () => {
    const component = renderer.create(
      <StateContextProvider
        styles={{match: 'match-class', nonMatch: 'non-match-class'}}
        text={'New'}>
        <MatchingText text={'New York City'} />
      </StateContextProvider>
    )

    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})