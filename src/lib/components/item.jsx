import React, { useContext } from 'react'
import defaultStyles from './styles/item.styles.js'
import MatchingText from './matchingText'
import { StateContext } from '../context/state'
import { setHighlighted, setSelected } from '../actions/actions'

export default function Item(props) {
  const { index, item } = props

  const {
    state,
    dispatch
  } = useContext(StateContext)

  const { customStyles, highlighted, query } = state
  const CustomItem = state.props.itemComponent
  const globalMatch = item.dataSearchType === 'contains'
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

  const itemContents = (CustomItem)
    ? <CustomItem
        appearsInDefaultListbox={item.defaultListbox}
        groupName={item.groupName}
        index={index}
        item={item.value}
        query={query}
        searchType={item.dataSearchType}
        totalItems={state.items.length}
      />
    : (state.props.matchText
      ? <MatchingText text={item.text} match={query} global={globalMatch} />
      : <>{item.text}</>)

  return (
    <div
      className={divClassName()}
      style={defaultStyles.item}
      onMouseEnter={handleMouseEnter}
      onMouseDown={handleClick}
      role='option'
      aria-selected={isHighlighted}
      aria-label={item.text}>
      {itemContents}
    </div>
  )
}
