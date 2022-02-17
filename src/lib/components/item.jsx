import React, { useContext, useMemo } from 'react'
import defaultStyles from './styles/item.styles.js'
import MatchingText from './matchingText'
import { StateContext } from '../context/state'
import isUndefined from '../utils/isUndefined'
import escapeStringRegExp from 'escape-string-regexp'
import { setHighlighted, setSelected } from '../actions/actions'

export default function Item(props) {
  const { index, item } = props

  const {
    state,
    dispatch,
    customStyles,
    splitCharState
  } = useContext(StateContext)

  const splitText = useMemo(() => {
    if (isUndefined(splitCharState)) return [item.text]
    const regex = new RegExp(escapeStringRegExp(splitCharState) + '(.+)')
    return item.text.split(regex)
  }, [splitCharState, item])

  const divClassName = useMemo(() => {
    let itemStyle = customStyles[
      (state.highlighted && index === state.highlighted.index)
        ? 'highlightedItem'
        : 'item'
    ]

    return (index === 0 && customStyles.topItem)
      ? `${itemStyle} ${customStyles.topItem}`
      : itemStyle
  }, [customStyles, state.highlighted, index])

  const handleMouseEnter = () => {
    dispatch(setHighlighted(index))
  }

  const handleClick = () => {
    dispatch(setSelected(index))
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
