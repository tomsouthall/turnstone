import * as types from '../actions/actionTypes'
import undef from '../utils/undef'

const highlightedItem = (i, state) => {
  return { index: i, text: state.items[i].text }
}

const reducer = (state, action) => {
  const newState = (() => {
    switch (action.type) {
      case types.SET_QUERY:
        return action.payload
      case types.SET_ITEMS:
        return action.payload
      case types.SET_HIGHLIGHTED:
        return { highlighted: highlightedItem(action.index, state) }
      case types.CLEAR_HIGHLIGHTED:
        return { highlighted: undef }
      case types.PREV_HIGHLIGHTED:
        return (state.highlighted.index > 0)
          ? { highlighted: highlightedItem(state.highlighted.index - 1, state) }
          : {}
      case types.NEXT_HIGHLIGHTED:
        return (state.highlighted.index < state.items.length - 1)
          ? { highlighted: highlightedItem(state.highlighted.index + 1, state) }
          : {}
      case types.SET_SELECTED:
        return {
          selected: state.items[action.index],
          query: state.items[action.index].text,
        }
      default:
        throw new Error('Invalid action type passed to reducer')
    }
  })()

  return {...state, ...newState}
}

export default reducer