import React, { useContext } from 'react'
import { StateContext } from '../context/state'
import defaultStyles from './styles/listbox.styles.js'

export default function Errorbox(props) {
  const { id, errorMessage } = props
  const { state } = useContext(StateContext)
  const { customStyles } = state

  return (
    <div id={id} className={customStyles.errorbox} style={defaultStyles.listbox}>
      <div className={customStyles.errorMessage}>{errorMessage}</div>
    </div>
  )
}
