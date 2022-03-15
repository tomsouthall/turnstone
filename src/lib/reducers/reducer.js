import * as types from '../actions/actionTypes'
import undef from '../utils/undef'
import isUndefined from '../utils/isUndefined'

const highlightedItem = (index, items) => {
  if(!items[index]) return undef
  return { index, text: items[index].text }
}

const reducer = (state, action) => {
  const newState = (() => {
    let newState, item

    switch (action.type) {
      case types.SET_QUERY:
        newState = {
          itemsError: false,
          query: action.query,
          selected: undef
        }

        // Disallow listbox until user has entered a long enough query
        if(action.query.length < state.props.minQueryLength)
          newState.canShowListbox = false

        // Allow listbox if there is no query and we have default items to show
        if(action.query.length === 0 && state.props.defaultListbox)
          newState.canShowListbox = true

        return newState
      case types.SET_ITEMS:
        newState = {
          items: action.items,
          itemsError: false,
          highlighted: (action.items.length && state.query.length)
            ? highlightedItem(0, action.items)
            : undef
        }

        if(state.query.length || action.items.length) newState.canShowListbox = true

        return newState
      case types.CLEAR:
        return {
          query: '',
          items: [],
          itemsError: false,
          canShowListbox: false,
          highlighted: undef,
          selected: undef
        }
      case types.SET_ITEMS_ERROR:
        return {
          items: [],
          itemsError: true,
          canShowListbox: false
        }
      case types.SET_HIGHLIGHTED:
        return { highlighted: highlightedItem(action.index, state.items) }
      case types.CLEAR_HIGHLIGHTED:
        return { highlighted: undef }
      case types.PREV_HIGHLIGHTED:
        return (state.highlighted.index > 0)
          ? { highlighted: highlightedItem(state.highlighted.index - 1, state.items) }
          : {}
      case types.NEXT_HIGHLIGHTED:
        return (state.highlighted.index < state.items.length - 1)
          ? { highlighted: highlightedItem(state.highlighted.index + 1, state.items) }
          : {}
      case types.SET_SELECTED:
        item = isUndefined(action.index) ? action.item : state.items[action.index]
        return { selected: item, query: item.text }
      default:
        throw new Error('Invalid action type passed to reducer')
    }
  })()

  return {...state, ...newState}
}

export default reducer