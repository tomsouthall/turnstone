import React, { useContext } from 'react'
import MatchingText from './matchingText'
import { StateContext } from '../context/state'
import { setHighlighted, setSelected } from '../actions/actions'

export default function Item(props) {
  const { index, item, styles } = props

  const {
    state,
    dispatch
  } = useContext(StateContext)

  const { highlighted, query } = state
  const ItemContents = state.props.Item
  const globalMatch = item.searchType === 'contains'
  const isHighlighted = highlighted && index === highlighted.index

  const divClassName = styles[isHighlighted ? 'highlightedItem' : 'item']

  const handleMouseEnter = () => {
    dispatch(setHighlighted(index))
  }

  const handleClick = () => {
    dispatch(setSelected(index))
  }

  const setCustomSelected = (value, displayField) => {
    dispatch(setSelected({
      value,
      displayField,
      text: value[displayField]
    }))
  }

  const itemContents = (ItemContents)
    ? <ItemContents
        appearsInDefaultListbox={item.defaultListbox}
        groupId={item.groupId}
        groupIndex={item.groupIndex}
        groupName={item.groupName}
        index={index}
        isHighlighted={isHighlighted}
        item={item.value}
        query={query}
        searchType={item.searchType}
        setSelected={setCustomSelected}
        totalItems={state.items.length}
      />
    : (state.props.matchText && !item.defaultListbox
      ? <MatchingText text={item.text} match={query} global={globalMatch} styles={styles} />
      : <>{item.text}</>)

  return (
    <div
      className={divClassName}
      onMouseEnter={handleMouseEnter}
      onMouseDown={handleClick}
      role='option'
      aria-selected={isHighlighted}
      aria-label={item.text}>
      {itemContents}
    </div>
  )
}
