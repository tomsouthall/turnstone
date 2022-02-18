import React from 'react'
import Turnstone from './lib'
import { fruits } from './data'

const styles = {
  highlightedItem: 'highlightedItem'
}

const App = () => {
  return (
    <Turnstone
      autoFocus={true}
      data={fruits}
      dataSearchType={'startswith'}
      debounceWait={0}
      itemGroupsAreImmutable={true}
      maxItems={10}
      noItemsMessage={'No matching fruit found'}
      placeholder={'Type something fruity'}
      styles={styles}
      minQueryLength={1}
    />
  )
}

export default App
