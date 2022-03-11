import React from 'react'
import SplitMatch from 'split-match'
import imgNewYork from '../../images/newyork.jpg'
import styles from './itemContents.module.css'

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

export default function ItemContents(props) {
  const {
    appearsInDefaultListbox,
    index,
    item,
    query,
    searchType = 'startswith',
    setSelected,
    totalItems
  } = props

  const globalMatch = searchType === 'contains'

  const isNYC = item.name === 'New York City, New York, United States'

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
    return isNYC
      ? <div className={styles.imgContainer}><img src={imgNewYork} alt={item.name} /></div>
      : void 0
  }

  const SubLocations = () => {
    if(totalItems <= 5 && (item.neighbourhoods || item.attractions)) {
      const neighbourhoods = (totalItems > 1) ? item.neighbourhoods.slice(0,5) : item.neighbourhoods
      const attractions = (totalItems > 1) ? item.attractions.slice(0,5) : item.attractions

      return (
        <div className={styles.sublocations}>
          <SubLocationList title="Neighbourhoods" data={neighbourhoods} />
          <SubLocationList title="Attractions" data={attractions} />
        </div>
      )
    }
    return null
  }

  const SubLocationList = (props) => {
    const { title, data } = props

    if(!data || !data.length) return null

    return (
      <div className={styles.sublocationList}>
        <div className={styles.subLocationTitle}>{title}</div>
        <>
          {
            data.map(
              (value, index) =>
                <SubLocation
                  key={`neighbourhood${index}`}
                  value={value}>
                    {value.name.split(',')[0]}
                </SubLocation>
              )
          }
        </>
      </div>
    )
  }

  const SubLocation = (props) => {
    const { children, value } = props

    const handleClick = (evt, value) => {
      evt.stopPropagation()
      setSelected(value, 'name')
    }

    return (
      <div>
        <div className={styles.sublocation} onMouseDown={(evt) => handleClick(evt, value)}>
          {children}
        </div>
      </div>
    )
  }

  const firstItem = () => {
    return (
      <div className={`${styles.container} ${styles.first}`}>
        {img()}
        <div className={styles.nameContainer}>{matchedText(false)}</div>
        {SubLocations()}
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
