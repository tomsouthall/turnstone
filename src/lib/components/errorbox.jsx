import React from 'react'
import defaultStyles from './styles/listbox.styles.js'

export default function Errorbox(props) {
  const { id, errorMessage, styles } = props

  return (
    <div id={id} className={styles.errorbox} style={defaultStyles.listbox}>
      <div className={styles.errorMessage}>{errorMessage}</div>
    </div>
  )
}
