# turnstone

## Install

```bash
npm install --save turnstone
```

## Usage

```jsx
import React from 'react'
import Turnstone from 'turnstone'
import fruits from './data'

const App = () => {
  return (
    <Turnstone
      autoFocus={true}
      data={fruits}
      searchType={'startswith'}
      debounceWait={0}
      maxItems={10}
      noItemsMessage={'No matching fruit found'}
      placeholder={'Type something fruity'}
    />
  )
}

export default App

```

## License

MIT © [tomsouthall](https://github.com/tomsouthall)
