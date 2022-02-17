import React from 'react'
import renderer from 'react-test-renderer'

import { describe, expect, test } from 'vitest'
import { StateContextProvider, StateContext } from './state.jsx'

describe('StateContextProvider', () => {
  test('StateContextProvider component renders', () => {
    const component = renderer.create(
      <StateContextProvider>Test</StateContextProvider>
    )
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})

describe('StateContext', () => {
  test('StateContext is present', () => {
    expect(StateContext && typeof StateContext === 'object').toBe(true)
  })
})