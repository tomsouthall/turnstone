import React, { useState, useMemo, useRef, useContext } from 'react'
import { StateContext } from '../context/state'
import Items from './items'
import { useDebounce } from 'use-debounce'
import useData from './hooks/useData'
import undef from '../utils/undef'
import isUndefined from '../utils/isUndefined'
import defaultStyles from './styles/input.styles.js'
import {
  useItemsState,
  useAutoFocus,
  useQueryChange,
  useHighlight,
  useSelected
} from './hooks/containerEffects'
import {
  setQuery,
  setHighlighted,
  highlightPrev,
  highlightNext,
  setSelected
} from '../actions/actions'

export default function Container(props) {
  // Destructure props
  const {
    autoFocus,
    clearButton,
    clearButtonAriaLabel,
    clearButtonText,
    debounceWait,
    defaultItemGroups,
    defaultItemGroupsAreImmutable,
    displayField,
    data,
    dataSearchType,
    id,
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

  const dropdownId = `${id}-dropdown`

  // Global state from context
  const { state, dispatch } = useContext(StateContext)
  const { customStyles } = state

  // Component state
  const [debouncedQuery] = useDebounce(state.query, debounceWait)
  const [hasFocus, setHasFocus] = useState(false)

  // DOM references
  const queryInput = useRef(null)
  const typeaheadInput = useRef(null)

  // Checks whether or not SWR data is to be treated as immutable
  const isImmutable = (() => {
    return itemGroupsAreImmutable &&
      !(
        defaultItemGroups &&
        !defaultItemGroupsAreImmutable &&
        debouncedQuery.length === 0
      )
  })()

  // Hook to retrieve data using SWR
  const swrData = useData(
    debouncedQuery.toLowerCase(),
    isImmutable,
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
  useSelected(state.selected, queryInput, typeaheadInput, onSelect)

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

  const hasClearButton = () => {
    return clearButton && !!state.query
  }

  const isExpanded = useMemo(() => {
    if (hasFocus && !state.query && defaultItemGroups) return true
    if (state.query.length < minQueryLength) return false
    return hasFocus && !!state.query
  }, [hasFocus, state.query, defaultItemGroups, minQueryLength])

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

  const handleClearButton = (evt) => {
    console.log('handleClearButton')
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
      dispatch(setHighlighted(0))
    }
  }

  const handleBlur = () => {
    setHasFocus(false)
  }

  return (
    <React.Fragment>
      <div
        className={customStyles.queryContainer}
        style={defaultStyles.queryContainer}
        role='combobox'
        aria-expanded={isExpanded}
        aria-owns={dropdownId}
        aria-haspopup='listbox'>
        <input
          id={id}
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
          aria-autocomplete='both'
          aria-controls={dropdownId}
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
          aria-hidden='true'
          ref={typeaheadInput}
        />

        {hasClearButton() && (
          <div
            className={customStyles.clearButton}
            style={defaultStyles.clearButton}
            onMouseDown={handleClearButton}
            tabIndex={-1}
            role='button'
            aria-label={clearButtonAriaLabel}>{clearButtonText}</div>
        )}

        {isExpanded && (
          <Items
            id={dropdownId}
            items={state.items}
            noItemsMessage={noItemsMessage}
          />
        )}
      </div>
    </React.Fragment>
  )
}
