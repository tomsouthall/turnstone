import React, { useCallback } from 'react'
import Turnstone from '../../src/lib'
import styles from './styles/App.module.css'
import autocompleteStyles from './styles/autocomplete.module.css'

const maxItems = 10
const placeholder = 'Enter a city or airport'
const splitChar = ','
const noItemsMessage = 'We found no places that match your search'

const itemGroups = [
  {
    name: 'Cities',
    ratio: 8,
    displayField: 'name',
    data: (query) =>
      fetch(`http://localhost:3001/api/search/cities?q=${encodeURIComponent(query)}&limit=${maxItems}`)
        .then(response => response.json())
  },
  {
    name: 'Airports',
    ratio: 2,
    displayField: 'name',
    data: (query) =>
      fetch(`http://localhost:3001/api/search/airports?q=${encodeURIComponent(query)}&limit=${maxItems}`)
        .then(response => response.json())
  }
]

const defaultItemGroups = [
  {name: 'Recent Searches', displayField: 'name', data: [
    {name: 'New Orleans, Louisiana, United States', coords: '29.95465,-90.07507'},
    {name: 'Chicago, Illinois, United States', coords: '41.85003,-87.65005'},
    {name: 'Manchester, England', coords: '53.48095,-2.23743'},
    {name: 'Charlottesville, Virginia, United States', coords: '38.02931,-78.47668'},
    {name: 'Appleby-in-Westmorland, Cumbria, England', coords: '54.57704,-2.48978'}
  ]},
  {name: 'Popular Cities', displayField: 'name', data: [
    {name: 'Paris, France', coords: '48.86425, 2.29416'},
    {name: 'Rome, Italy', coords: '41.89205, 12.49209'},
    {name: 'Orlando, Florida, United States', coords: '28.53781, -81.38592'},
    {name: 'London, England', coords: '51.50420, -0.12426'},
    {name: 'Barcelona, Spain', coords: '41.40629, 2.17555'}
  ]}
]

const App = () => {
  const onChange = useCallback(
    (text) => {
      console.log('Changed to:', text)
    }, []
  )

  const onSelect = useCallback(
    (selectedResult) => {
      console.log('Selected Result:', selectedResult)
    }, []
  )

  const onEnter = useCallback(
    (query, selectedResult) => {
      console.log('Enter Pressed. Selected Result:', selectedResult, query)
    }, []
  )

  const onTab = useCallback(
    (query, selectedResult) => {
      console.log('Tab Pressed. Selected Result:', selectedResult, query)
    }, []
  )

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <label htmlFor="autocomplete">Search:</label>&nbsp;
        <Turnstone
          autoFocus={true}
          clearButton={true}
          debounceWait={250}
          defaultItemGroups={defaultItemGroups}
          defaultItemGroupsAreImmutable={false}
          id='autocomplete'
          itemGroups={itemGroups}
          itemGroupsAreImmutable={true}
          maxItems={maxItems}
          minQueryLength={1}
          noItemsMessage={noItemsMessage}
          onChange={onChange}
          onSelect={onSelect}
          onEnter={onEnter}
          onTab={onTab}
          placeholder={placeholder}
          splitChar={splitChar}
          styles={autocompleteStyles}
          />
      </main>
    </div>
  )
}

export default App