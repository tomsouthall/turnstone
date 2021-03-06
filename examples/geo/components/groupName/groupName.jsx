import React from 'react'
import styles from './groupName.module.css'

export default function GroupName(props) {
  const {
    id,
    children: name
  } = props

  const icons = {
    cities: '\u{1F3D9}',
    airports: '\u{2708}'
  }

  const icon = icons[id] || ''

  return (
    <>
      {icon && (
        <span className={styles.icon}>
          {icon}
        </span>
      )}
      {name}
    </>
  )

}
