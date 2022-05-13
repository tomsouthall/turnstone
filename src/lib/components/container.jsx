import React, { useState, useRef, useContext, useImperativeHandle } from 'react'
import { StateContext } from '../context/state'
import Listbox from './listbox'
import Errorbox from './errorbox'
import { useDebounce } from 'use-debounce'
import useData from './hooks/useData'
import undef from '../utils/undef'
import isUndefined from '../utils/isUndefined'
import defaultStyles from './styles/container.styles.js'
import {
  useItemsState,
  useItemsError,
  useQueryChange,
  useHighlight,
  useSelected
} from './hooks/containerEffects'
import {
  setQuery,
  setHighlighted,
  highlightPrev,
  highlightNext,
  setSelected,
  clear
} from '../actions/actions'

const Container = React.forwardRef((props, ref) => {
  // Destructure props
  const {
    autoFocus,
    cancelButton,
    cancelButtonAriaLabel,
    clearButton,
    clearButtonAriaLabel,
    debounceWait,
    defaultListbox,
    defaultListboxIsImmutable,
    disabled,
    enterKeyHint,
    errorMessage,
    id,
    listbox,
    listboxIsImmutable,
    maxItems,
    minQueryLength,
    name,
    noItemsMessage,
    onBlur,
    onChange,
    onEnter,
    onFocus,
    onSelect,
    onTab,
    placeholder,
    styles,
    tabIndex,
    typeahead,
    Cancel,
    Clear
  } = props

  const listboxId = `${id}-listbox`
  const errorboxId = `${id}-errorbox`

  // Global state from context
  const { state, dispatch } = useContext(StateContext)

  // Component state
  const [debouncedQuery] = useDebounce(state.query, debounceWait)
  const [hasFocus, setHasFocus] = useState(false)
  const [blockBlurHandler, setBlockBlurHandler] = useState(false)

  // DOM references
  const queryInput = useRef(null)
  const typeaheadInput = useRef(null)

  // Calculated states
  const hasTypeahead = typeahead && state.items.length > 1
  const hasClearButton = clearButton && !!state.query
  const hasCancelButton = cancelButton && hasFocus
  const isExpanded = hasFocus && state.canShowListbox
  const isErrorExpanded = !!props.errorMessage && state.itemsError
  const containerClassname = hasFocus ? 'containerFocus' : 'container'
  const containerStyles = styles[containerClassname] || styles.container
  const defaultContainerStyles = styles[containerClassname]
    ? undef
    : defaultStyles[containerClassname]
  const inputClassName = hasFocus ? 'inputFocus' : 'input'
  const inputStyles = styles[inputClassName] || styles.input
  const queryDefaultStyle = hasTypeahead ? defaultStyles.query : defaultStyles.queryNoTypeahead

  // Checks whether or not SWR data is to be treated as immutable
  const isImmutable = (() => {
    return listboxIsImmutable &&
      !(
        defaultListbox &&
        !defaultListboxIsImmutable &&
        debouncedQuery.length === 0
      )
  })()

  // Hook to retrieve data using SWR
  const swrResult = useData(
    debouncedQuery ? debouncedQuery.toLowerCase() : '',
    isImmutable,
    listbox,
    defaultListbox,
    minQueryLength,
    maxItems,
    dispatch
  )

  // Store retrieved data in global state as state.items
  useItemsState(swrResult.data)

  // Store retrieved error if there is one
  useItemsError(swrResult.error)

  // As soon as the query state changes (ignoring debounce) update the
  // typeahead value and the query value and fire onChange
  useQueryChange(state.query, queryInput, typeaheadInput, onChange)

  // When the highlighted item changes, make sure the typeahead matches and format
  // the query text to match the case of the typeahead text
  useHighlight(state.highlighted, hasFocus, queryInput, typeaheadInput)

  // When an item is selected alter the query to match and fire applicable events
  useSelected(state.selected, queryInput, typeaheadInput, onSelect)

  const onTabOrEnter = (keyPressed) => {
    const highlightedIndex = state.highlighted && state.highlighted.index
    const highlightedItem = !isUndefined(highlightedIndex)
      ? state.items[highlightedIndex]
      : undef
    const f = keyPressed.toLowerCase() === 'enter' ? onEnter : onTab

    if(highlightedItem) dispatch(setSelected(highlightedIndex))
    if (typeof f === 'function') f(queryInput.current.value, highlightedItem)
  }

  // Handle different keypresses and call the appropriate action creators
  const checkKey = (evt) => {
    switch (evt.keyCode) {
      case 40: // Down arrow
        dispatch(highlightNext())
        break
      case 38: // Up arrow
        dispatch(highlightPrev())
        break
      case 13: // Enter
        onTabOrEnter('enter')
        break
      case 9: // Tab
        onTabOrEnter('tab')
        break
      case 27: // Esc
        clearState()
        break
    }
  }

  const handleInput = () => {
    dispatch(setQuery(queryInput.current.value))
  }

  const handleClearButton = () => {
    setBlockBlurHandler(true)
    clearState()
  }

  const handleCancelButton = () => {
    clearState()
  }

  const clearState = () => {
    // Immediately clearing both inputs prevents any slight
    // visual timing delays with async dispatch
    queryInput.current.value = ''
    if(typeahead && typeaheadInput.current)
      typeaheadInput.current.value = ''
    dispatch(clear())
    queryInput.current.focus()
  }

  const handleFocus = () => {
    if(!hasFocus) {
      setHasFocus(true)
      if (state.items && state.items.length > 0) {
        dispatch(setHighlighted(0))
      }
      if(typeof onFocus === 'function') onFocus()
    }
  }

  const handleBlur = () => {
    if(blockBlurHandler) {
      queryInput.current.focus()
    }
    else {
      setHasFocus(false)
      if(typeof onBlur === 'function') onBlur()
    }
    setBlockBlurHandler(false)
  }

  // Expose methods to parent components
  useImperativeHandle(ref, () => ({
    focus: () => {
      queryInput.current.focus()
    },
    blur: () => {
      queryInput.current.blur()
    },
    select: () => {
      queryInput.current.select()
    },
    clear: () => {
      clearState()
    },
    query: (query) => {
      if(typeof query === 'string') {
        queryInput.current.value = query
        queryInput.current.focus()
        handleInput()
      }
    }
  }))

  return (
    <React.Fragment>
      <div
        className={containerStyles}
        style={defaultContainerStyles}
        role='combobox'
        aria-expanded={isExpanded}
        aria-owns={listboxId}
        aria-haspopup='listbox'>
        <input
          id={id}
          name={name}
          className={`${inputStyles || ''} ${styles.query || ''}`.trim()}
          style={queryDefaultStyle}
          disabled={disabled}
          placeholder={placeholder}
          type='text'
          autoFocus={autoFocus}
          autoComplete='off'
          autoCorrect='off'
          autoCapitalize='off'
          spellCheck='false'
          tabIndex={tabIndex}
          enterKeyHint={enterKeyHint}
          ref={queryInput}
          onKeyDown={checkKey}
          onInput={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-autocomplete='both'
          aria-controls={listboxId}
        />

        {hasTypeahead && (
          <input
            className={`${inputStyles || ''} ${styles.typeahead || ''}`.trim()}
            style={defaultStyles.typeahead}
            disabled={disabled}
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
        )}

        {hasClearButton && (
          <button
            className={styles.clearButton}
            style={defaultStyles.clearButton}
            onMouseDown={handleClearButton}
            tabIndex={-1}
            aria-label={clearButtonAriaLabel}>
            <Clear />
          </button>
        )}

        {hasCancelButton && (
          <button
            className={styles.cancelButton}
            style={defaultStyles.cancelButton}
            onMouseDown={handleCancelButton}
            tabIndex={-1}
            aria-label={cancelButtonAriaLabel}>
            <Cancel />
          </button>
        )}

        {isExpanded && (
          <Listbox
            id={listboxId}
            items={state.items}
            noItemsMessage={noItemsMessage}
            styles={styles}
          />
        )}

        {isErrorExpanded && (
          <Errorbox id={errorboxId} errorMessage={errorMessage} styles={styles} />
        )}
      </div>
    </React.Fragment>
  )
})

Container.displayName = 'Container'

export default Container
