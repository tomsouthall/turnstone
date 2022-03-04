import React from 'react'
import Turnstone from './lib'
import { fruits, vegetables } from './data'

const styles = {
  highlightedItem: 'highlightedItem',
  input: 'input',
  inputFocus: 'inputFocus'
}

const listbox1 = {
  data: fruits,
  searchType: 'startswith'
}

const listbox2 = [
  {
    data: fruits,
    searchType: 'startswith',
    name: 'Fruits'
  },
  {
    data: vegetables,
    searchType: 'contains',
    name: 'Vegetables'
  }
]

const App = () => {
  return (
    <>
     <div style={{display:'inline-block'}}>
        <label htmlFor="autocomplete">Search Fruits:</label>&nbsp;
        <Turnstone
          autoFocus={true}
          clearButton={true}
          debounceWait={0}
          errorMessage={'Houston we have a problem'}
          listbox={listbox1}
          listboxIsImmutable={true}
          maxItems={10}
          name={'search'}
          noItemsMessage={'No matching fruit found'}
          placeholder={'Type something fruity'}
          styles={styles}
        />
      </div>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <div style={{display:'inline-block'}}>
        <label htmlFor="autocomplete">Search Fruits &amp; Veg:</label>&nbsp;
        <Turnstone
          autoFocus={true}
          clearButton={true}
          debounceWait={0}
          errorMessage={'Something is broken'}
          listbox={listbox2}
          listboxIsImmutable={true}
          matchText={true}
          maxItems={10}
          name={'search'}
          noItemsMessage={'No matches found'}
          placeholder={'Type something'}
          styles={styles}
        />
      </div>
    </>
  )
}

export default App
