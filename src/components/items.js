import React, { useContext, useMemo } from 'react'
import { AutocompleteContext } from '../context/autocomplete'
import classNameHelper from '../utils/classNameHelper'
import defaultStyles from './styles/items.module.css'
import ItemFirst from './itemFirst'
import Item from './item'
import isUndefined from '../utils/isUndefined'

export default function Items(props) {
  const { isLoading, items, loadingMessage, noItemsMessage } = props
  const { customStyles } = useContext(AutocompleteContext)
  const className = classNameHelper(defaultStyles, customStyles)

  const itemElements = () => {
    return (
      <div className={className('dropdown')}>
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
    const msg = showLoadingMessage ? loadingMessage : noItemsMessage
    const c = showLoadingMessage ? className('loading') : className('noItems')

    return (
      <div className={className('dropdown')}>
        <div className={c}>{msg}</div>
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
