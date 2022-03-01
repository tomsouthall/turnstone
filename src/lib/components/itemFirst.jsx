import React, { useContext } from 'react'
import { StateContext } from '../context/state'
import Item from './item'

export default function ItemFirst(props) {
  const { groupName, index, item } = props
  const { state } = useContext(StateContext)
  const { customStyles } = state
  const GroupName = state.props.GroupName

  const groupHeading = !!groupName && (
    GroupName
      ? <GroupName id={item.groupId} index={item.groupIndex}>{groupName}</GroupName>
      : groupName
  )

  return (
    <React.Fragment>
       {!!groupHeading && <div className={customStyles.groupHeading}>{groupHeading}</div>}
      <Item index={index} key={`item${index}`} item={item} />
    </React.Fragment>
  )
}
