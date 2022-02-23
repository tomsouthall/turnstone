import React from 'react'
import SplitMatch from '../splitMatch/splitMatch'
import imgNewYork from'../../images/newyork.jpg'
import styles from './item.module.css'

const SplitComponent = (props) => {
  const {
    children,
    index
  } = props

  const className = `split${index}`

  return <span className={styles[className]}>{children}</span>
}

const MatchComponent = (props) => {
  const { children } = props

  return <span className={styles.match}>{children}</span>
}

export default function Item(props) {
  const {
    appearsInDefaultListbox,
    index,
    item,
    query,
    searchType = 'startswith'
  } = props

  const globalMatch = searchType === 'contains'

  const matchedText = (includeSeparator) => {
    return (
     <SplitMatch
        searchText={query}
        globalMatch={globalMatch}
        globalSplit={false}
        caseSensitiveMatch={false}
        caseSensitiveSplit={false}
        separator=","
        includeSeparator={includeSeparator}
        MatchComponent={MatchComponent}
        SplitComponent={SplitComponent}>{item.name}</SplitMatch>
    )
  }

  const img = () => {
    return item.name === 'New York City, New York, United States'
      ? <div><img src={imgNewYork} alt={item.name} /></div>
      : void 0
  }

  const firstItem = () => {
    return (
      <div className={`${styles.container} ${styles.first}`}>
        {img()}
        <div>{matchedText(false)}</div>
      </div>
    )
  }

  const standardItem = () => {
    return (
      <div className={styles.container}>
        {matchedText(true)}
      </div>
    )
  }

  return index === 0 && !appearsInDefaultListbox ? firstItem() : standardItem()

}
