import React from 'react'
import renderer from 'react-test-renderer'

import { describe, expect, test } from 'vitest'
import { TurnstoneContextProvider, TurnstoneContext } from './turnstone.jsx'

describe('TurnstoneContextProvider', () => {
  test('TurnstoneContextProvider component renders', () => {
    const component = renderer.create(
      <TurnstoneContextProvider>Test</TurnstoneContextProvider>
    )
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})

describe('TurnstoneContext', () => {
  test('TurnstoneContext is present', () => {
    expect(TurnstoneContext && typeof TurnstoneContext === 'object').toBe(true)
  })
})