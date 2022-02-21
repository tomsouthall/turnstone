import React from 'react'
import Turnstone from './lib'
import { fruits } from './data'

const styles = {
  highlightedItem: 'highlightedItem'
}

const listbox = {
  data: fruits,
  dataSearchType: 'startswith'
}

const App = () => {
  return (
    <>
      <label htmlFor="autocomplete">Search:</label>&nbsp;
      <Turnstone
        autoFocus={true}
        clearButton={true}
        debounceWait={0}
        listbox={listbox}
        listboxIsImmutable={true}
        maxItems={10}
        name={'search'}
        noItemsMessage={'No matching fruit found'}
        placeholder={'Type something fruity'}
        styles={styles}
      />
    </>
  )
}

export default App
