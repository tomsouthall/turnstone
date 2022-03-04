import React, { useCallback, useState } from 'react'
import Turnstone from '../../src/lib'
import styles from './styles/App.module.css'
import autocompleteStyles from './styles/autocomplete.module.css'
import { defaultListboxNoRecentSearches } from '../_shared/defaultListbox'
import ItemContents from './components/itemContents/itemContents'
import GroupName from './components/groupName/groupName'
import CancelButton from './components/cancelButton/cancelButton'
import ClearButton from './components/clearButton/clearButton'
import recentSearchesPlugin from '../../plugins/turnstone-recent-searches'
import undef from '../../src/lib/utils/undef'

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
      fetch(`http://localhost:3001/api/search/cities?q=${encodeURIComponent(query)}&limit=${maxItems}`)
        .then(response => response.json()),
    searchType: 'startswith'
  },
  {
    id: 'airports',
    name: 'Airports',
    ratio: 2,
    displayField: 'name',
    data: (query) =>
      fetch(`http://localhost:3001/api/search/airports?q=${encodeURIComponent(query)}&limit=${maxItems}`)
        .then(response => response.json()),
    searchType: 'contains'
  }
]

const App = () => {
  const [selected, setSelected] = useState({item: undef, displayField: undef})

  const onSelect = useCallback(
    (item, displayField) => {
      setSelected({item, displayField})
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
            autoFocus={false}
            cancelButton={true}
            clearButton={true}
            debounceWait={250}
            defaultListbox={defaultListboxNoRecentSearches}
            defaultListboxIsImmutable={false}
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
            plugins={[[recentSearchesPlugin, {ratio: 2, name: 'Recent'}]]}
            styles={autocompleteStyles}
            Cancel={CancelButton}
            Clear={ClearButton}
            GroupName={GroupName}
            Item={ItemContents}
          />
        </div>
      </main>
      {!!selected.item && (
        <div className={styles.selected}>
          <strong>Selected Result</strong><br />
          {selected.item[selected.displayField]}<br />
          Coords: {selected.item.coords}
        </div>
      )}
    </div>
  )
}

export default App