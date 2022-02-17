import React, { useContext, useMemo } from 'react'
import { StateContext } from '../context/state'
import defaultStyles from './styles/items.styles.js'
import ItemFirst from './itemFirst'
import Item from './item'

export default function Items(props) {
  const { items, noItemsMessage } = props
  const { state } = useContext(StateContext)
  const { customStyles } = state

  const itemElements = () => {
    return (
      <div className={customStyles.dropdown} style={defaultStyles.dropdown}>
        {items.map((item, index) =>
          index === 0 || item.groupIndex !== items[index - 1].groupIndex ? (
            <ItemFirst
              groupName={item.groupName}
              index={index}
              key={`item${index}`}
              item={item}
            />
          ) : (
            <Item index={index} key={`item${index}`} item={item} />
          )
        )}
      </div>
    )
  }

  const noItemsMsg = () => {
    return (
      <div className={customStyles.dropdown} style={defaultStyles.dropdown}>
        <div className={customStyles.noItems}>{noItemsMessage}</div>
      </div>
    )
  }

  const dropdown = () => {
    if (items && items.length) {
      return itemElements()
    }
    else if (noItemsMessage && state.query) {
      return noItemsMsg()
    }
    else {
      return <React.Fragment />
    }
  }

  return dropdown()
}
