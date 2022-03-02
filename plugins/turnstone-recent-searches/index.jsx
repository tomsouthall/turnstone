import { useCallback } from 'react'
import { useLocalStorage } from 'react-use'

const recentSearchesPlugin = (Container, containerProps = {}, pluginProps = {}) => {
  const {
    ratio = 1,
    id,
    name = 'Recent Searches'
  } = pluginProps
  const [recentSearches, setRecentSearches] = useLocalStorage('recentSearches', [])

  const buildDefaultListBox = (recentSearches) => {
    return [
      {id, name, displayField: '_displayField', data: recentSearches, ratio},
      ...containerProps.defaultListbox
    ]
  }

  const onSelect = useCallback(
    (selectedResult, displayField) => {
      if(selectedResult) {
        selectedResult._displayField = selectedResult[displayField]
        const searches = [
          selectedResult,
          ...recentSearches.filter(
            item => item._displayField !== selectedResult._displayField
          )
        ]
        setRecentSearches(searches)
      }

      if (typeof containerProps.onSelect === 'function')
        containerProps.onSelect(selectedResult, displayField)
    }, []
  )

  const newContainerProps = {
    ...containerProps,
    ...{defaultListbox: buildDefaultListBox(recentSearches), onSelect}
  }

  return [Container, newContainerProps]
}

export default recentSearchesPlugin