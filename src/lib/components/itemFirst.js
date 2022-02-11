import React, { useContext } from 'react'
import { TurnstoneContext } from '../context/turnstone'
import Item from './item'

export default function ItemFirst(props) {
  const { groupName, index, item } = props
  const { customStyles } = useContext(TurnstoneContext)

  return (
    <React.Fragment>
      {!!groupName && <div className={customStyles.groupName}>{groupName}</div>}
      <Item index={index} key={`item${index}`} item={item} />
    </React.Fragment>
  )
}
