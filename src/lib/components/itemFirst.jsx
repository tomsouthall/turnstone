import React, { useContext } from 'react'
import { StateContext } from '../context/state'
import Item from './item'

export default function ItemFirst(props) {
  const { groupName, index, item, styles } = props
  const { state } = useContext(StateContext)
  const GroupName = state.props.GroupName

  const groupHeading = !!groupName && (
    GroupName
      ? <GroupName id={item.groupId} index={item.groupIndex}>{groupName}</GroupName>
      : groupName
  )

  return (
    <React.Fragment>
       {!!groupHeading && <div className={styles.groupHeading}>{groupHeading}</div>}
      <Item index={index} key={`item${index}`} item={item} styles={styles} />
    </React.Fragment>
  )
}
