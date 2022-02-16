import React, { useState, useEffect, useRef, useContext, useMemo } from 'react'
import useSWR from 'swr'
import setify from 'setify' // Sets input value without changing cursor position
import swrLaggyMiddleware from '../utils/swrLaggyMiddleware'
import { TurnstoneContext } from '../context/turnstone'
import Items from './items'
import { useDebounce } from 'use-debounce'
import { useAutoFocus, useQueryChange } from './effects/containerEffects'
import firstOfType from 'first-of-type'
import undef from '../utils/undef'
import isUndefined from '../utils/isUndefined'
import startsWithCaseInsensitive from '../utils/startsWithCaseInsensitive'
import defaultStyles from './styles/input.styles.js'
// import fetch from 'unfetch' // TODO: may need this if not using Next.js

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
    customStyles,
    queryState,
    setQueryState,
    highlightedState,
    setHighlightedState,
    selectedState,
    setSelectedState
  } = useContext(TurnstoneContext)

  // Component state
  const [debouncedQueryState] = useDebounce(queryState, debounceWait)
  const [hasFocus, setHasFocus] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // DOM references
  const queryInput = useRef(null)
  const typeaheadInput = useRef(null)

  const itemText = (item, displayField) => {
    const itemType = typeof item
    const text =
      itemType === 'string' && isUndefined(displayField)
        ? item
        : item[displayField]
    return isUndefined(text) ? firstOfType(item, 'string') || '' : text
  }

  const filterSuppliedData = (group, query) => {
    const { data, displayField, dataSearchType } = group
    const searchType = dataSearchType
      ? dataSearchType.toLowerCase()
      : dataSearchType

    switch (searchType) {
      case 'startswith':
        return data.filter((item) =>
          itemText(item, displayField)
            .toLowerCase()
            .startsWith(query.toLowerCase())
        )
      case 'contains':
        return data.filter((item) =>
          itemText(item, displayField)
            .toLowerCase()
            .includes(query.toLowerCase())
        )
      default:
        return data
    }
  }

  const limitResults = (groups, groupsProp) => {
    // TODO: Place into a util/callback function
    const ratios = groupsProp.map((group) => group.ratio || 1)
    const ratioTotal = ratios.reduce((total, ratio) => total + ratio, 0)
    const ratioMultiplier = maxItems / ratioTotal
    const resultTotal = groups.flat().length
    const groupCounts = []
    let unassignedSlots = resultTotal < maxItems ? resultTotal : maxItems

    while (unassignedSlots > 0) {
      groups = groups.map((group, i) => {
        if (!groupCounts[i]) {
          groupCounts[i] = Math.round(ratios[i] * ratioMultiplier)
          if (groupCounts[i] > group.length) groupCounts[i] = group.length
          unassignedSlots = unassignedSlots - groupCounts[i]
        } else if (groupCounts[i] < group.length) {
          unassignedSlots -= ++groupCounts[i]
        }
        return group
      })
    }

    return groups.map((group, index) => group.slice(0, groupCounts[index]))
  }

  const fetcher = (q) => {
    if (defaultItemGroups && q.length > 0 && q.length < minQueryLength)
      return []
    else if (!defaultItemGroups && q.length < minQueryLength) return []

    const groupsProp =
      defaultItemGroups && !q.length ? defaultItemGroups : itemGroups

    const promises = groupsProp.map((g) => {
      if (typeof g.data === 'function') {
        return g.data(q)
      } else {
        return Promise.resolve({ data: filterSuppliedData(g, q) })
      }
    })

    return Promise.all(promises).then((groups) => {
      groups = groups.reduce((prevGroups, group, groupIndex) => {
        return [
          ...prevGroups,
          group.data.map((item) => ({
            value: item,
            text: itemText(item, groupsProp[groupIndex].displayField),
            groupIndex,
            groupName: groupsProp[groupIndex].name
          }))
        ]
      }, [])

      if (groups.length) groups = limitResults(groups, groupsProp)

      return groups.flat()
    })
  }

  const swrBaseOptions = {
    use: [swrLaggyMiddleware]
  }
  const swrOptions =
    itemGroupsAreImmutable &&
    !(
      defaultItemGroups &&
      !defaultItemGroupsAreImmutable &&
      debouncedQueryState.length === 0
    )
      ? {
          ...swrBaseOptions,
          revalidateIfStale: false,
          revalidateOnFocus: false,
          revalidateOnReconnect: false
        }
      : swrBaseOptions

  // See: https://github.com/vercel/swr/discussions/1810
  const dummyArgToEnsureCachingOfZeroLengthStrings = 'X'

  const swrData = useSWR(
    [
      debouncedQueryState.toLowerCase(),
      dummyArgToEnsureCachingOfZeroLengthStrings
    ],
    fetcher,
    swrOptions
  ).data

  const items = useMemo(() => {
    // console.log('swrData', swrData)
    return swrData || []
  }, [swrData])

  // Autofocus on render if prop is true
  useAutoFocus(queryInput, autoFocus)

  // As soon as the queryState changes (ignoring debounce) update the
  // typeahead value and the query value
  useQueryChange(queryInput, typeaheadInput, queryState, onChange)

  // Whenever the dropdown items change, set the highlighted item
  // to either the first or nothing if there are no items
  useEffect(() => {
    setHighlightedState(
      items && items.length ? { index: 0, text: items[0].text } : undef
    )
  }, [items, setHighlightedState])

  // Figure out whether we are able to display a loading state //TODO: useReducer instead of useeffect?
  useEffect(() => {
    if (items && items.length) setIsLoaded(true)
    else if (queryState.length <= minQueryLength) setIsLoaded(false)
  }, [items, queryState, isLoaded, minQueryLength, setIsLoaded])

  // When the highlighted item changes, make sure the typeahead matches and format
  // the query text to match the case of the typeahead text
  useEffect(() => {
    const typeAheadValue =
      highlightedState &&
      hasFocus &&
      queryInput.current.value.length > 0 &&
      startsWithCaseInsensitive(highlightedState.text, queryInput.current.value)
        ? highlightedState.text
        : ''
    const queryValue = formatQuery(queryInput.current.value, typeAheadValue)

    typeaheadInput.current.value = typeAheadValue

    setify(queryInput.current, queryValue)
  }, [highlightedState, hasFocus, setQueryState])

  // When an item is selected alter the query to match and fire applicable events
  useEffect(() => {
    if (!isUndefined(selectedState)) {
      typeaheadInput.current.value = ''
      setQueryState(selectedState.text) //TODO: Put in a reducer?
      queryInput.current.blur()
      if (typeof onSelect === 'function') onSelect(selectedState.value)
    }
  }, [selectedState, setQueryState, onSelect])

  const formatQuery = (query, typeahead) => {
    const formattedQuery = typeahead.substring(0, query.length)
    return formattedQuery.length > 0 &&
      query.toLowerCase() === formattedQuery.toLowerCase() &&
      query !== formattedQuery
      ? formattedQuery
      : query
  }

  const setHighlightedIndex = (i) => {
    setHighlightedState({ index: i, text: items[i].text })
  }

  const onTabOrEnter = (keyPressed) => {
    // keyPressed must be 'enter' or 'tab'
    const highlightedIndex = highlightedState && highlightedState.index
    const highlightedItem = !isUndefined(highlightedIndex)
      ? items[highlightedIndex]
      : undef
    const f = keyPressed.toLowerCase() === 'enter' ? onEnter : onTab
    setSelectedState(items[highlightedIndex])
    if (typeof f === 'function') f(queryInput.current.value, highlightedItem)
  }

  const isX = () => {
    return !!queryState
  }

  const isDropdown = () => {
    if (hasFocus && !queryState && defaultItemGroups) return true
    if (queryState.length < minQueryLength) return false
    return hasFocus && queryState
  }

  // Handle different keypresses and call the appropriate action creators
  const checkKey = (evt) => {
    switch (evt.keyCode) {
      case 40: // Down arrow
        evt.preventDefault()
        if (highlightedState.index < items.length - 1)
          setHighlightedIndex(highlightedState.index + 1)
        break
      case 38: // Up arrow
        evt.preventDefault()
        if (highlightedState.index > 0)
          setHighlightedIndex(highlightedState.index - 1)
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
    setSelectedState()
    setQueryState(queryInput.current.value)
  }

  const handleX = (evt) => {
    evt.preventDefault()
    clearState()
  }

  const clearState = () => {
    setSelectedState()
    setQueryState('')
    setTimeout(() => queryInput.current.focus(), debounceWait)
  }

  const handleFocus = () => {
    setHasFocus(true)

    if (items && items.length > 0) {
      setHighlightedIndex(0)
    } else {
      setHighlightedState()
    }
  }

  const handleBlur = () => {
    setHasFocus(false)
    setHighlightedState()
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
            items={items}
            loadingMessage={loadingMessage}
            noItemsMessage={noItemsMessage}
          />
        )}
      </div>
    </React.Fragment>
  )
}
