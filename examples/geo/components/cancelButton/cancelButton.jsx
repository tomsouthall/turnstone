import React from 'react'
import styles from './cancelButton.module.css'

const DefaultCancel = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={styles.svg} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
    </svg>
  )
}

export default DefaultCancel