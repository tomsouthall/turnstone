import React, { useContext } from 'react'
import defaultStyles from './styles/item.styles.js'
import MatchingText from './matchingText'
import { StateContext } from '../context/state'
import escapeStringRegExp from 'escape-string-regexp'
import { setHighlighted, setSelected } from '../actions/actions'

export default function Item(props) {
  const { index, item } = props

  const {
    state,
    dispatch
  } = useContext(StateContext)

  const { customStyles, highlighted, splitChar, query } = state

  const startsWith = item.dataSearchType !== 'contains'

  const split = (str, separator) => {
    if(!separator) return [str]
    const regex =  new RegExp(`(${escapeStringRegExp(separator)})`, 'g')
    return str.split(regex).filter(part => part.length)
  }

  const splitText = split(item.text, splitChar)
  const splitQuery = split(query, splitChar)

  const isHighlighted = highlighted && index === highlighted.index

  const divClassName = () => {
    let itemStyle = customStyles[
      isHighlighted
        ? 'highlightedItem'
        : 'item'
    ]

    return (index === 0 && customStyles.topItem)
      ? `${itemStyle} ${customStyles.topItem}`
      : itemStyle
  }

  const handleMouseEnter = () => {
    dispatch(setHighlighted(index))
  }

  const handleClick = () => {
    dispatch(setSelected(index))
  }

  const contents = splitText.map((part, index) => {
    const match = startsWith ? (splitQuery[index] || '') : query
    return <MatchingText key={`split${index}`} text={part} match={match} startsWith={startsWith} />
  })

  return (
    <div
      className={divClassName()}
      style={defaultStyles.item}
      onMouseEnter={handleMouseEnter}
      onMouseDown={handleClick}
      role='option'
      aria-selected={isHighlighted}
      aria-label={item.text}>
      {contents}
    </div>
  )
}
