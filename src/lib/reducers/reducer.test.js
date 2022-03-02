import { describe, expect, test } from 'vitest'
import reducer from './reducer'
import * as actions from '../actions/actions'
import undef from '../utils/undef'
import { defaultListbox } from '../../../examples/_shared/defaultListbox'

describe('SET_QUERY action', () => {
  test('produces expected new state', () => {
    const state = {
      itemsError: true,
      query: 'foo',
      selected: {index: 0, text: 'Foobar'},
      props: {
        minQueryLength: 1
      }
    }

    const action = actions.setQuery('bar')

    expect(reducer(state, action)).toEqual({
      itemsError: false,
      query: 'bar',
      selected: undef,
      props: {
        minQueryLength: 1
      }
    })
  })

  test('produces expected new state when there is no query', () => {
    const state = {
      query: 'bar',
      selected: {index: 0, text: 'Foobar'},
      props: {
        minQueryLength: 1
      }
    }

    const action = actions.setQuery('')

    expect(reducer(state, action)).toEqual({
      itemsError: false,
      query: '',
      selected: undef,
      itemsLoaded: false,
      props: {
        minQueryLength: 1
      }
    })
  })

  test('disallows listbox if query is less than minQueryLength', () => {
    const state = {
      props: {
        minQueryLength: 3
      }
    }

    const action = actions.setQuery('f')

    expect(reducer(state, action)).toEqual({
      itemsError: false,
      query: 'f',
      selected: undef,
      itemsLoaded: false,
      props: {
        minQueryLength: 3
      }
    })
  })

  test('allows listbox if there is no query and we have default items to show', () => {
    const state = {
      props: {
        minQueryLength: 1,
        defaultListbox
      }
    }

    const action = actions.setQuery('')

    expect(reducer(state, action)).toEqual({
      query: '',
      selected: undef,
      itemsError: false,
      itemsLoaded: true,
      props: {
        minQueryLength: 1,
        defaultListbox
      }
    })
  })
})

describe('SET_ITEMS action', () => {
  test('produces expected new state', () => {
    const state = {
      query: 'foo',
      itemsError: true,
      itemsLoaded: false
    }

    const items = [
      {text: 'foo'},
      {text: 'foobar'},
      {text: 'foofoo'}
    ]

    const action = actions.setItems(items)

    expect(reducer(state, action)).toEqual({
      query: 'foo',
      items,
      itemsError: false,
      itemsLoaded: true,
      highlighted: { index: 0, text: 'foo' }
    })
  })

  test('produces expected new state when there are no items', () => {
    const state = {
      query: 'foo'
    }

    const items = []

    const action = actions.setItems(items)

    expect(reducer(state, action)).toEqual({
      query: 'foo',
      items,
      itemsError: false,
      highlighted: undef
    })
  })

  test('produces expected new state when there is no query and no items', () => {
    const state = {
      query: ''
    }

    const items = []

    const action = actions.setItems(items)

    expect(reducer(state, action)).toEqual({
      query: '',
      items,
      itemsError: false,
      highlighted: undef
    })
  })

  test('produces expected new state when there is no query but there are items', () => {
    const state = {
      query: ''
    }

    const items = [
      {text: 'foo'},
      {text: 'foobar'},
      {text: 'foofoo'}
    ]

    const action = actions.setItems(items)

    expect(reducer(state, action)).toEqual({
      query: '',
      items,
      itemsError: false,
      itemsLoaded: true,
      highlighted: undef
    })
  })
})

describe('SET_ITEMS_ERROR action', () => {
  test('produces expected new state', () => {
    let action
    const state = {
      items: [
        {text: 'foo'},
        {text: 'foobar'},
        {text: 'foofoo'}
      ],
      itemsError: false,
      itemsLoaded: true
    }

    action = actions.setItemsError()

    expect(reducer(state, action)).toEqual({
      items: [],
      itemsError: true,
      itemsLoaded: false
    })
  })
})

describe('CLEAR action', () => {
  test('produces expected new state', () => {
    let action
    const state = {
      query: 'foobar',
      items: [
        {text: 'foo'},
        {text: 'foobar'},
        {text: 'foofoo'}
      ],
      itemsError: true,
      itemsLoaded: true,
      highlighted: { index: 0, text: 'foo' },
      selected: {text: 'foo'}
    }

    action = actions.clear()

    expect(reducer(state, action)).toEqual({
      query: '',
      items: [],
      itemsError: false,
      itemsLoaded: false,
      highlighted: undef,
      selected: undef
    })
  })
})

describe('SET_HIGHLIGHTED action', () => {
  test('produces expected new state', () => {
    let action
    const state = {
      items: [
        {text: 'foo'},
        {text: 'foobar'},
        {text: 'foofoo'}
      ]
    }

    action = actions.setHighlighted(0)

    expect(reducer(state, action)).toEqual({
      items: state.items,
      highlighted: { index: 0, text: 'foo' }
    })

    action = actions.setHighlighted(1)

    expect(reducer(state, action)).toEqual({
      items: state.items,
      highlighted: { index: 1, text: 'foobar' }
    })

    action = actions.setHighlighted(2)

    expect(reducer(state, action)).toEqual({
      items: state.items,
      highlighted: { index: 2, text: 'foofoo' }
    })
  })
})

describe('CLEAR_HIGHLIGHTED action', () => {
  test('produces expected new state', () => {
    const state = {
      highlighted: { index: 0, text: 'foo' }
    }

    const action = actions.clearHighlighted()

    expect(reducer(state, action)).toEqual({
      highlighted: undef
    })
  })
})

describe('PREV_HIGHLIGHTED action', () => {
  test('produces expected new state', () => {
    const state = {
      items: [
        {text: 'foo'},
        {text: 'foobar'},
        {text: 'foofoo'}
      ],
      highlighted: { index: 2, text: 'foofoo' }
    }

    const action = actions.highlightPrev()

    expect(reducer(state, action)).toEqual({
      items: state.items,
      highlighted: { index: 1, text: 'foobar' }
    })
  })

  test('produces no change in state if there are no previous items', () => {
    const state = {
      items: [
        {text: 'foo'},
        {text: 'foobar'},
        {text: 'foofoo'}
      ],
      highlighted: { index: 0, text: 'foo' }
    }

    const action = actions.highlightPrev()

    expect(reducer(state, action)).toEqual({
      items: state.items,
      highlighted: { index: 0, text: 'foo' }
    })
  })
})

describe('NEXT_HIGHLIGHTED action', () => {
  test('produces expected new state', () => {
    const state = {
      items: [
        {text: 'foo'},
        {text: 'foobar'},
        {text: 'foofoo'}
      ],
      highlighted: { index: 0, text: 'foo' }
    }

    const action = actions.highlightNext()

    expect(reducer(state, action)).toEqual({
      items: state.items,
      highlighted: { index: 1, text: 'foobar' }
    })
  })

  test('produces no change in state if there are no further items', () => {
    const state = {
      items: [
        {text: 'foo'},
        {text: 'foobar'},
        {text: 'foofoo'}
      ],
      highlighted: { index: 2, text: 'foofoo' }
    }

    const action = actions.highlightNext()

    expect(reducer(state, action)).toEqual({
      items: state.items,
      highlighted: { index: 2, text: 'foofoo' }
    })
  })
})

describe('SET_SELECTED action', () => {
  test('produces expected new state', () => {
    let action
    const state = {
      items: [
        {text: 'foo'},
        {text: 'foobar'},
        {text: 'foofoo'}
      ]
    }

    action = actions.setSelected(0)

    expect(reducer(state, action)).toEqual({
      items: state.items,
      selected: {text: 'foo'},
      query: 'foo'
    })

    action = actions.setSelected(1)

    expect(reducer(state, action)).toEqual({
      items: state.items,
      selected: {text: 'foobar'},
      query: 'foobar'
    })

    action = actions.setSelected(2)

    expect(reducer(state, action)).toEqual({
      items: state.items,
      selected: {text: 'foofoo'},
      query: 'foofoo'
    })
  })
})

describe('Unrecognised action', () => {
  test('throws an error', () => {
    expect(() => reducer({}, {type: 'FOO'})).toThrowError()
  })
})