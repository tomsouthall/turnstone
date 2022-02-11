import React, { useContext } from 'react'
import { AutocompleteContext } from '../context/autocomplete'
import classNameHelper from '../utils/classNameHelper'
import Item from './item'

export default function ItemFirst(props) {
  const { groupName, index, item } = props
  const { customStyles } = useContext(AutocompleteContext)
  const className = classNameHelper({}, customStyles)

  return (
    <React.Fragment>
      {!!groupName && <div className={className('groupName')}>{groupName}</div>}
      <Item index={index} key={`item${index}`} item={item} />
    </React.Fragment>
  )
}
