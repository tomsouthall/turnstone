import React from 'react'
import Turnstone from './lib'
import fruits from './data'

const App = () => {
  return (
    <Turnstone
      autoFocus={true}
      data={fruits}
      dataSearchType={'startswith'}
      debounceWait={0}
      maxItems={10}
      noItemsMessage={'No matching fruit found'}
      placeholder={'Type something fruity'}
    />
  )
}

export default App
