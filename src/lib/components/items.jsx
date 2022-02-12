import React, { useContext, useMemo } from 'react'
import { TurnstoneContext } from '../context/turnstone'
import defaultStyles from './styles/items.styles.js'
import ItemFirst from './itemFirst'
import Item from './item'
import isUndefined from '../utils/isUndefined'

export default function Items(props) {
  const { isLoading, items, loadingMessage, noItemsMessage } = props
  const { customStyles } = useContext(TurnstoneContext)

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

  const showLoadingMessage = useMemo(() => {
    return isLoading && !isUndefined(loadingMessage)
  }, [isLoading, loadingMessage])

  const noItemsMsg = () => {
    const msg = showLoadingMessage
      ? loadingMessage
      : noItemsMessage

    const msgClassName = showLoadingMessage
      ? customStyles.loading
      : customStyles.noItems

    return (
      <div className={customStyles.dropdown} style={defaultStyles.dropdown}>
        <div className={msgClassName}>{msg}</div>
      </div>
    )
  }

  const dropdown = () => {
    if (items && items.length) {
      return itemElements()
    } else if ((noItemsMessage && !isLoading) || showLoadingMessage) {
      return noItemsMsg()
    } else {
      return <React.Fragment />
    }
  }

  return dropdown()
}
