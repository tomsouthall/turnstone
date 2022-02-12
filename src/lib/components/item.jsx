import React, { useContext, useMemo } from 'react'
import defaultStyles from './styles/item.styles.js'
import MatchingText from './matchingText'
import { TurnstoneContext } from '../context/turnstone'
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
  } = useContext(TurnstoneContext)

  const splitText = useMemo(() => {
    if (isUndefined(splitCharState)) return [item.text]
    const regex = new RegExp(escapeStringRegExp(splitCharState) + '(.+)')
    return item.text.split(regex)
  }, [splitCharState, item])

  const divClassName = useMemo(() => {
    let itemStyle = customStyles[
      highlightedState && index === highlightedState.index
        ? 'highlightedItem'
        : 'item'
    ]

    return (index === 0)
      ? `${itemStyle} ${customStyles.topItem}`
      : itemStyle
  }, [customStyles, highlightedState, index])

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
        <span className={customStyles.splitChar}>{splitCharState}</span>
        <span className={customStyles.split}>{splitText[1]}</span>
      </React.Fragment>
    )
  }

  return (
    <div
      className={divClassName}
      style={defaultStyles.item}
      onMouseEnter={handleMouseEnter}
      onMouseDown={handleClick}>
      {itemElement()}
    </div>
  )
}
