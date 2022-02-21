import React, { useContext } from 'react'
import { StateContext } from '../context/state'
import defaultStyles from './styles/listbox.styles.js'
import ItemFirst from './itemFirst'
import Item from './item'

export default function Listbox(props) {
  const { id, items, noItemsMessage } = props
  const { state } = useContext(StateContext)
  const { customStyles } = state

  const itemElements = () => {
    return (
      <div
        id={id}
        className={customStyles.listbox}
        style={defaultStyles.listbox}
        role='listbox'>
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
      <div id={id} className={customStyles.listbox} style={defaultStyles.listbox}>
        <div className={customStyles.noItems}>{noItemsMessage}</div>
      </div>
    )
  }

  const listbox = () => {
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

  return listbox()
}
