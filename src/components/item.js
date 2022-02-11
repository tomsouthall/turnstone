import React, { useContext, useMemo } from 'react'
import classNameHelper from '../utils/classNameHelper'
import defaultStyles from './styles/item.module.css'
import MatchingText from './matchingText'
import { AutocompleteContext } from '../context/autocomplete'
import isUndefined from '../utils/isUndefined'
import escapeStringRegExp from 'escape-string-regexp'

export default function Item(props) {
  const { index, item } = props

  const {
    customStyles,
    highlightedState,
    setHighlightedState,
    setSelectedState,
    splitCharState
  } = useContext(AutocompleteContext)

  const className = classNameHelper(defaultStyles, customStyles)

  const splitText = useMemo(() => {
    if (isUndefined(splitCharState)) return [item.text]
    const regex = new RegExp(escapeStringRegExp(splitCharState) + '(.+)')
    return item.text.split(regex)
  }, [splitCharState, item])

  const divClassName = useMemo(() => {
    let c =
      highlightedState && index === highlightedState.index
        ? className('highlightedItem')
        : className('item')

    if (index === 0) c = `${c} ${className('topItem')}`
    return c
  }, [className, highlightedState, index])

  const handleMouseEnter = () => {
    setHighlightedState({ index, text: item.text })
  }

  const handleClick = () => {
    setSelectedState(item)
  }

  const itemElement = () => {
    return isUndefined(splitCharState) ||
      !item.text.includes(splitCharState) ? (
      <MatchingText text={splitText[0]} />
    ) : (
      splitItemElement()
    )
  }

  function splitItemElement() {
    return (
      <React.Fragment>
        <MatchingText text={splitText[0]} />
        <span className='splitChar'>{splitCharState}</span>
        <span className={className('split')}>{splitText[1]}</span>
      </React.Fragment>
    )
  }

  return (
    <div
      className={divClassName}
      onMouseEnter={handleMouseEnter}
      onMouseDown={handleClick}>
      {itemElement()}
    </div>
  )
}
