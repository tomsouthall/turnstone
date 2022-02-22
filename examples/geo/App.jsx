import React, { useCallback, useState } from 'react'
import Turnstone from '../../src/lib'
import styles from './styles/App.module.css'
import autocompleteStyles from './styles/autocomplete.module.css'
import defaultListbox from '../_shared/defaultListbox'

const maxItems = 10
const placeholder = 'Enter a city or airport'
const separator = ','
const noItemsMessage = 'We found no places that match your search'

const listbox = [
  {
    name: 'Cities',
    ratio: 8,
    displayField: 'name',
    data: (query) =>
      fetch(`http://localhost:3001/api/search/cities?q=${encodeURIComponent(query)}&limit=${maxItems}`)
        .then(response => response.json()),
    dataSearchType: 'startswith'
  },
  {
    name: 'Airports',
    ratio: 2,
    displayField: 'name',
    data: (query) =>
      fetch(`http://localhost:3001/api/search/airports?q=${encodeURIComponent(query)}&limit=${maxItems}`)
        .then(response => response.json()),
    dataSearchType: 'contains'
  }
]

const App = () => {
  const [selected, setSelected] = useState()

  const onChange = useCallback(
    (text) => {
      //console.log('Changed to:', text)
    }, []
  )

  const onSelect = sel => setSelected(sel)

  // const onSelect = useCallback(
  //   (selectedResult) => {
  //     console.log('Selected Result:', selectedResult)
  //   }, []
  // )

  const onEnter = useCallback(
    (query, selectedResult) => {
      //console.log('Enter Pressed. Selected Result:', selectedResult, query)
    }, []
  )

  const onTab = useCallback(
    (query, selectedResult) => {
      //console.log('Tab Pressed. Selected Result:', selectedResult, query)
    }, []
  )

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div>
          <label htmlFor="autocomplete">Search:</label>&nbsp;
          <Turnstone
            autoFocus={false}
            clearButton={true}
            debounceWait={250}
            defaultListbox={defaultListbox}
            defaultListboxIsImmutable={false}
            id='autocomplete'
            listbox={listbox}
            listboxIsImmutable={true}
            maxItems={maxItems}
            minQueryLength={1}
            noItemsMessage={noItemsMessage}
            onChange={onChange}
            onSelect={onSelect}
            onEnter={onEnter}
            onTab={onTab}
            placeholder={placeholder}
            separator={separator}
            styles={autocompleteStyles}
          />
        </div>
      </main>
      {selected && (
        <div className={styles.selected}>
          <strong>Selected Result</strong><br />
          {selected.name}<br />
          Coords: {selected.coords}
        </div>
      )}
    </div>
  )
}

export default App