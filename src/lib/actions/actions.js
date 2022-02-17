import * as types from './actionTypes'
import undef from '../utils/undef'

export const setQuery = (query) => {
  const payload = {
    query,
    selected: undef
  }

  return {
    type: types.SET_QUERY,
    payload
  }
}

export const setItems = (items) => {
  const highlighted = items && items.length
    ? { index: 0, text: items[0].text }
    : undef

  const payload = {
    items,
    highlighted
  }

  return {
    type: types.SET_ITEMS,
    payload
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