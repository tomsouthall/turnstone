import React from 'react'
import renderer from 'react-test-renderer'

import { describe, expect, test } from 'vitest'
import { TurnstoneContextProvider } from '../context/turnstone.jsx'
import MatchingText from './matchingText.jsx'

describe('MatchingText', () => {
  test('snapshot renders', () => {
    const component = renderer.create(
      <TurnstoneContextProvider
        styles={{match: 'match-class', nonMatch: 'non-match-class'}}
        text={'New'}>
        <MatchingText text={'New York City'} />
      </TurnstoneContextProvider>
    )
    
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})