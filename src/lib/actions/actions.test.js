import { describe, expect, test } from 'vitest'
import * as actions from './actions'

describe('Actions', () => {
  test('setQuery returns expected action', () => {
    const action = actions.setQuery('foobar')
    expect(action).toEqual({
      type: 'SET_QUERY',
      query: 'foobar'
    })
  })

  test('setItems returns expected action', () => {
    const action = actions.setItems([1,2,3])
    expect(action).toEqual({
      type: 'SET_ITEMS',
      items: [1,2,3]
    })
  })

  test('setHighlighted returns expected action', () => {
    const action = actions.setHighlighted(0)
    expect(action).toEqual({
      type: 'SET_HIGHLIGHTED',
      index: 0
    })
  })

  test('clearHighlighted returns expected action', () => {
    const action = actions.clearHighlighted()
    expect(action).toEqual({
      type: 'CLEAR_HIGHLIGHTED'
    })
  })

  test('highlightPrev returns expected action', () => {
    const action = actions.highlightPrev()
    expect(action).toEqual({
      type: 'PREV_HIGHLIGHTED'
    })
  })

  test('highlightNext returns expected action', () => {
    const action = actions.highlightNext()
    expect(action).toEqual({
      type: 'NEXT_HIGHLIGHTED'
    })
  })

  test('setSelected returns expected action', () => {
    const action = actions.setSelected(0)
    expect(action).toEqual({
      type: 'SET_SELECTED',
      index: 0
    })
  })

  test('clearSelected returns expected action', () => {
    const action = actions.clearSelected()
    expect(action).toEqual({
      type: 'CLEAR_SELECTED'
    })
  })
})