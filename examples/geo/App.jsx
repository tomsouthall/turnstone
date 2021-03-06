/* eslint no-console: 0 */

import React, { useCallback, useState, useRef } from 'react'
import Turnstone from '../../src/lib'
import styles from './styles/App.module.css'
import autocompleteStyles from './styles/autocomplete.module.css'
import { defaultListboxNoRecentSearches } from '../_shared/defaultListbox'
import ItemContents from './components/itemContents/itemContents'
import GroupName from './components/groupName/groupName'
import CancelButton from './components/cancelButton/cancelButton'
import ClearButton from './components/clearButton/clearButton'
import recentSearchesPlugin from 'turnstone-recent-searches'
import undef from '../../src/lib/utils/undef'

const apiHost = import.meta.env.VITE_API_HOST
const maxItems = 10
const placeholder = 'Enter a city or airport'
const noItemsMessage = 'We found no places that match your search'

const listbox = [
  {
    id: 'cities',
    name: 'Cities',
    ratio: 8,
    displayField: 'name',
    data: (query) =>
      fetch(`${apiHost}/api/search/cities?q=${encodeURIComponent(query)}&limit=${maxItems}`)
        .then(response => response.json()),
    searchType: 'startswith'
  },
  {
    id: 'airports',
    name: 'Airports',
    ratio: 2,
    displayField: 'name',
    data: (query) =>
      fetch(`${apiHost}/api/search/airports?q=${encodeURIComponent(query)}&limit=${maxItems}`)
        .then(response => response.json()),
    searchType: 'contains'
  }
]

// // UNCOMMENT FOR TESTING LISTBOX PROP SUPPLIED AS A FUNCTION
// const listbox = query => {
//   return fetch(
//     `${apiHost}/api/search/locations?q=${encodeURIComponent(query)}&limit=${maxItems}`
//   )
//   .then(response => response.json())
//   .then(locations => {
//     const {cities, airports} = locations

//     return [
//       {
//         id: 'cities',
//         name: 'Cities',
//         ratio: 8,
//         displayField: 'name',
//         data: cities,
//         searchType: 'startswith'
//       },
//       {
//         id: 'airports',
//         name: 'Airports',
//         ratio: 2,
//         displayField: 'name',
//         data: airports,
//         searchType: 'contains'
//       }
//     ]
//   })
// }

const App = () => {
  const ref = useRef()
  const [selectedItem, setSelectedItem] = useState(undef)

  const onSelect = useCallback(
    (item, displayField) => {
      console.log('onselect', item)
      setSelectedItem((item && displayField) ? item[displayField] : undef)
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
        <div>
          <label htmlFor="autocomplete">Search:</label>&nbsp;
          <Turnstone
            ref={ref}
            autoFocus={false}
            cancelButton={true}
            clearButton={true}
            debounceWait={250}
            defaultListbox={defaultListboxNoRecentSearches}
            defaultListboxIsImmutable={false}
            enterKeyHint="search"
            errorMessage={'Sorry, something has broken!'}
            id='autocomplete'
            listbox={listbox}
            listboxIsImmutable={true}
            maxItems={maxItems}
            minQueryLength={1}
            noItemsMessage={noItemsMessage}
            onSelect={onSelect}
            onEnter={onEnter}
            onTab={onTab}
            placeholder={placeholder}
            plugins={[[recentSearchesPlugin, {ratio: 2, name: 'Recent', limit: maxItems}]]}
            styles={autocompleteStyles}
            typeahead={true}
            Cancel={CancelButton}
            Clear={ClearButton}
            GroupName={GroupName}
            Item={ItemContents}
          />
        </div>
      </main>
      {!!selectedItem && (
        <div className={styles.selected}>
          <strong>Selected Result</strong><br />
          {selectedItem}
        </div>
      )}
    </div>
  )
}

export default App