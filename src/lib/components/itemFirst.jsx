import React, { useContext } from 'react'
import { StateContext } from '../context/state'
import Item from './item'

export default function ItemFirst(props) {
  const { groupName, index, item } = props
  const { customStyles } = useContext(StateContext)

  return (
    <React.Fragment>
      {!!groupName && <div className={customStyles.groupName}>{groupName}</div>}
      <Item index={index} key={`item${index}`} item={item} />
    </React.Fragment>
  )
}
