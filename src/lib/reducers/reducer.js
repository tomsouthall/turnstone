import * as types from '../actions/actionTypes'
import undef from '../utils/undef'

const highlightedItem = (i, state) => {
  return { index: i, text: state.items[i].text }
}

const reducer = (state, action) => {
  const newState = (() => {
    switch (action.type) {
      case types.SET_QUERY:
        // Disallow listbox until user has entered a long enough query
        if(action.payload.query.length < state.props.minQueryLength)
          action.payload.itemsLoaded = false

        // Allow listbox if there is no query and we have default items to show
        if(action.payload.query.length === 0 && state.props.defaultItemGroups)
          action.payload.itemsLoaded = true
        return action.payload
      case types.SET_ITEMS:
        if(action.payload.items.length)
          action.payload.itemsLoaded = true
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