import React, { useState, useEffect, useRef, useContext } from 'react'
import setify from 'setify' // Sets input value without changing cursor position
import { StateContext } from '../context/state'
import Items from './items'
import { useDebounce } from 'use-debounce'
import useData from './hooks/useData'
import undef from '../utils/undef'
import isUndefined from '../utils/isUndefined'
import startsWithCaseInsensitive from '../utils/startsWithCaseInsensitive'
import defaultStyles from './styles/input.styles.js'
import {
  useItemsState,
  useAutoFocus,
  useQueryChange,
  useHighlight
} from './hooks/containerEffects'
import {
  setQuery,
  setHighlighted,
  clearHighlighted,
  highlightPrev,
  highlightNext,
  setSelected
} from '../actions/actions'

export default function Container(props) {
  // Destructure props
  const {
    autoFocus,
    debounceWait,
    defaultItemGroups,
    defaultItemGroupsAreImmutable,
    displayField,
    data,
    dataSearchType,
    isDisabled,
    itemGroupsAreImmutable,
    maxItems,
    minQueryLength,
    noItemsMessage,
    onChange,
    onSelect,
    onEnter,
    onTab,
    placeholder
  } = props

  // Destructure itemGroups prop
  const {
    itemGroups = [
      {
        name: '',
        data,
        dataSearchType,
        displayField,
        ratio: maxItems
      }
    ]
  } = props

  // Global state from context
  const { state, dispatch } = useContext(StateContext)
  const { customStyles } = state

  // Component state
  const [debouncedQuery] = useDebounce(state.query, debounceWait)
  const [hasFocus, setHasFocus] = useState(false)

  // DOM references
  const queryInput = useRef(null)
  const typeaheadInput = useRef(null)

  const isImmutable = () => {
    return itemGroupsAreImmutable &&
      !(
        defaultItemGroups &&
        !defaultItemGroupsAreImmutable &&
        debouncedQuery.length === 0
      )
  }

  const swrData = useData(
    debouncedQuery.toLowerCase(),
    isImmutable(),
    itemGroups,
    defaultItemGroups,
    minQueryLength,
    maxItems,
    dispatch
  ).data

  // Store retrieved data in global state as state.items
  useItemsState(swrData)

  // Autofocus on render if prop is true
  useAutoFocus(queryInput, autoFocus)

  // As soon as the query state changes (ignoring debounce) update the
  // typeahead value and the query value and fire onChange
  useQueryChange(state.query, queryInput, typeaheadInput, onChange)

  // When the highlighted item changes, make sure the typeahead matches and format
  // the query text to match the case of the typeahead text
  useHighlight(state.highlighted, hasFocus, queryInput, typeaheadInput)

  // When an item is selected alter the query to match and fire applicable events
  useEffect(() => {
    if (!isUndefined(state.selected)) {
      typeaheadInput.current.value = ''
      dispatch(setQuery(state.selected.text))
      queryInput.current.blur()
      if (typeof onSelect === 'function') onSelect(state.selected.value)
    }
  }, [state.selected, onSelect])

  const onTabOrEnter = (keyPressed) => {
    // keyPressed must be 'enter' or 'tab'
    const highlightedIndex = state.highlighted && state.highlighted.index
    const highlightedItem = !isUndefined(highlightedIndex)
      ? state.items[highlightedIndex]
      : undef
    const f = keyPressed.toLowerCase() === 'enter' ? onEnter : onTab
    dispatch(setSelected(highlightedIndex))
    if (typeof f === 'function') f(queryInput.current.value, highlightedItem)
  }

  const isX = () => {
    return !!state.query
  }

  const isDropdown = () => {
    if (hasFocus && !state.query && defaultItemGroups) return true
    if (state.query.length < minQueryLength) return false
    return hasFocus && state.query
  }

  // Handle different keypresses and call the appropriate action creators
  const checkKey = (evt) => {
    switch (evt.keyCode) {
      case 40: // Down arrow
        evt.preventDefault()
        dispatch(highlightNext())
        break
      case 38: // Up arrow
        evt.preventDefault()
        dispatch(highlightPrev())
        break
      case 13: // Enter
        evt.preventDefault()
        onTabOrEnter('enter')
        break
      case 9: // Tab
        evt.preventDefault()
        onTabOrEnter('tab')
        break
      case 27: // Esc
        evt.preventDefault()
        clearState()
        break
    }
  }

  const handleInput = () => {
    dispatch(setQuery(queryInput.current.value))
  }

  const handleX = (evt) => {
    evt.preventDefault()
    clearState()
  }

  const clearState = () => {
    dispatch(setQuery(queryInput.current.value))
    setTimeout(() => queryInput.current.focus(), debounceWait) // TODO: Put in useEffect
  }

  const handleFocus = () => {
    setHasFocus(true) //TODO: make hasFocus part of global state?

    if (state.items && state.items.length > 0) {
      dispatch(setHighlighted({ index: 0, text: state.items[0].text }))
    }
    else {
      dispatch(clearHighlighted())
    }
  }

  const handleBlur = () => {
    setHasFocus(false)
    dispatch(clearHighlighted())
  }

  return (
    <React.Fragment>
      <div className={customStyles.queryContainer} style={defaultStyles.queryContainer}>
        <input
          className={customStyles.query}
          style={defaultStyles.query}
          disabled={isDisabled}
          placeholder={placeholder}
          type='text'
          autoComplete='off'
          autoCorrect='off'
          autoCapitalize='off'
          spellCheck='false'
          tabIndex='1'
          ref={queryInput}
          onKeyDown={checkKey}
          onInput={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        <input
          className={customStyles.typeahead}
          style={defaultStyles.typeahead}
          disabled={isDisabled}
          type='text'
          autoComplete='off'
          autoCorrect='off'
          autoCapitalize='off'
          spellCheck='false'
          tabIndex='-1'
          readOnly='readonly'
          ref={typeaheadInput}
        />

        {isX() && (
          <div className={customStyles.x} style={defaultStyles.x} onMouseDown={handleX} />
        )}

        {isDropdown() && (
          <Items
            items={state.items}
            noItemsMessage={noItemsMessage}
          />
        )}
      </div>
    </React.Fragment>
  )
}
