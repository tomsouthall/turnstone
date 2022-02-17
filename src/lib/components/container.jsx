import React, { useState, useEffect, useRef, useContext, useMemo } from 'react'
import setify from 'setify' // Sets input value without changing cursor position
import { TurnstoneContext } from '../context/turnstone'
import Items from './items'
import { useDebounce } from 'use-debounce'
import { useAutoFocus, useQueryChange } from './hooks/containerEffects'
import useData from './hooks/useData'
import undef from '../utils/undef'
import isUndefined from '../utils/isUndefined'
import startsWithCaseInsensitive from '../utils/startsWithCaseInsensitive'
import defaultStyles from './styles/input.styles.js'
import {
  setQuery,
  setItems,
  setHighlighted,
  clearHighlighted,
  highlightPrev,
  highlightNext
} from '../actions/actions'

export default function Container(props) {
  // Destructure props
  const {
    autoFocus = false,
    debounceWait = 250,
    defaultItemGroups,
    defaultItemGroupsAreImmutable = true,
    displayField,
    data,
    dataSearchType,
    isDisabled = false,
    itemGroupsAreImmutable = true,
    maxItems = 10,
    minQueryLength = 0,
    loadingMessage,
    noItemsMessage,
    onChange,
    onSelect,
    onEnter,
    onTab,
    placeholder = ''
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
  const {
    state,
    dispatch,
    customStyles,
    selectedState,
    setSelectedState
  } = useContext(TurnstoneContext)

  // Component state
  const [debouncedQuery] = useDebounce(state.query, debounceWait)
  const [hasFocus, setHasFocus] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

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

  // Store retrieved data in global state
  useEffect(() => {
    dispatch(setItems(swrData || []))
  }, [swrData])

  // Autofocus on render if prop is true
  useAutoFocus(queryInput, autoFocus)

  // As soon as the query state changes (ignoring debounce) update the
  // typeahead value and the query value and fire onChnage
  useQueryChange(state.query, queryInput, typeaheadInput, onChange)

  // // Whenever the dropdown items change, set the highlighted item
  // // to either the first or nothing if there are no items
  // useEffect(() => {
  //   setHighlightedState(
  //     state.items && state.items.length ? { index: 0, text: state.items[0].text } : undef
  //   )
  // }, [state.items, setHighlightedState])

  // Figure out whether we are able to display a loading state //TODO: useReducer instead of useeffect?
  useEffect(() => {
    if (state.items && state.items.length) setIsLoaded(true)
    else if (state.query.length <= minQueryLength) setIsLoaded(false)
  }, [state.items, state.query, isLoaded, minQueryLength, setIsLoaded])

  // When the highlighted item changes, make sure the typeahead matches and format
  // the query text to match the case of the typeahead text
  useEffect(() => {
    const typeAheadValue =
      state.highlighted &&
      hasFocus &&
      queryInput.current.value.length > 0 &&
      startsWithCaseInsensitive(state.highlighted.text, queryInput.current.value)
        ? state.highlighted.text
        : ''
    const queryValue = formatQuery(queryInput.current.value, typeAheadValue)

    typeaheadInput.current.value = typeAheadValue

    setify(queryInput.current, queryValue)
  }, [state.highlighted, hasFocus])

  // When an item is selected alter the query to match and fire applicable events
  useEffect(() => {
    if (!isUndefined(selectedState)) {
      typeaheadInput.current.value = ''
      dispatch(setQuery(selectedState.text))
      queryInput.current.blur()
      if (typeof onSelect === 'function') onSelect(selectedState.value)
    }
  }, [selectedState, onSelect])

  const formatQuery = (query, typeahead) => {
    const formattedQuery = typeahead.substring(0, query.length)
    return formattedQuery.length > 0 &&
      query.toLowerCase() === formattedQuery.toLowerCase() &&
      query !== formattedQuery
      ? formattedQuery
      : query
  }

  const onTabOrEnter = (keyPressed) => {
    // keyPressed must be 'enter' or 'tab'
    const highlightedIndex = state.highlighted && state.highlighted.index
    const highlightedItem = !isUndefined(highlightedIndex)
      ? state.items[highlightedIndex]
      : undef
    const f = keyPressed.toLowerCase() === 'enter' ? onEnter : onTab
    setSelectedState(state.items[highlightedIndex])
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
            isLoading={!isLoaded}
            items={state.items}
            loadingMessage={loadingMessage}
            noItemsMessage={noItemsMessage}
          />
        )}
      </div>
    </React.Fragment>
  )
}
