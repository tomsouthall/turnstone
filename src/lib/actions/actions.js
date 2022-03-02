import * as types from './actionTypes'

export const setQuery = (query) => {
  return {
    type: types.SET_QUERY,
    query
  }
}

export const setItems = (items) => {
  return {
    type: types.SET_ITEMS,
    items
  }
}

export const setItemsError = () => {
  return {
    type: types.SET_ITEMS_ERROR
  }
}

export const clear = () => {
  return {
    type: types.CLEAR
  }
}

export const setHighlighted = (index) => {
  return {
    type: types.SET_HIGHLIGHTED,
    index
  }
}

export const clearHighlighted = () => {
  return {
    type: types.CLEAR_HIGHLIGHTED
  }
}

export const highlightPrev = () => {
  return {
    type: types.PREV_HIGHLIGHTED
  }
}

export const highlightNext = () => {
  return {
    type: types.NEXT_HIGHLIGHTED
  }
}

export const setSelected = (i) => {
  const type = types.SET_SELECTED
  return (typeof i === 'object')
    ? { type, item: i }
    : { type, index: i }
}

export const clearSelected = () => {
  return {
    type: types.CLEAR_SELECTED
  }
}