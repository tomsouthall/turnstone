import React from 'react'
import styles from './clearButton.module.css'

const DefaultClear = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={styles.svg} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

export default DefaultClear