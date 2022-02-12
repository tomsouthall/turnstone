import React from 'react'
import renderer from 'react-test-renderer'

import { describe, expect, test } from 'vitest'
import { TurnstoneContextProvider } from '../context/turnstone.jsx'
import MatchingText from './matchingText.jsx'

describe('MatchingText', () => {
  test('snapshot renders', () => {
    const component = renderer.create(
      <TurnstoneContextProvider
        text={'New York City, New York, United States'}
        queryState={'New York City, New York, United States'}>
        <MatchingText text={'New York City'} />
      </TurnstoneContextProvider>
    )
    
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})