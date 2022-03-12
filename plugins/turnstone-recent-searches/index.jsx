import React, {useCallback} from 'react'

const RecentSearchesPlugin = (props) => {
  const {
    Component,
    componentProps,
    pluginIndex,
    render,
    ratio = 1,
    id,
    name = 'Recent Searches',
    storageKey = 'recentSearches',
    limit = 10
  } = props

  const {
    plugins,
    defaultListbox = [],
    onSelect
  } = componentProps

  const recentSearches = useCallback(() => {
    return JSON.parse(localStorage.getItem(storageKey)) || []
  }, [storageKey])

  const addToRecentSearches = useCallback(itemToAdd => {
    const searches = [
      itemToAdd,
      ...recentSearches().filter(
        item => item._displayField !== itemToAdd._displayField
      )
    ]
    localStorage.setItem(storageKey, JSON.stringify(searches.slice(0, limit)))
  }, [storageKey, limit, recentSearches, ])

  const buildDefaultListBox = () => {
    return  [
      {
        id,
        name,
        displayField: '_displayField',
        data: () => Promise.resolve(recentSearches()),
        ratio
      },
      ...defaultListbox
    ]
  }

  const handleSelect = useCallback((selectedResult, displayField) => {
    if(selectedResult) {
      if(typeof selectedResult === 'string') {
        selectedResult = {_displayField: selectedResult}
      }
      else {
        selectedResult._displayField = selectedResult[displayField]
      }
      addToRecentSearches(selectedResult)
    }

    if(typeof onSelect === 'function') onSelect(selectedResult, displayField)
  }, [addToRecentSearches, onSelect])

  const newComponentProps = {
    ...componentProps,
    defaultListbox: buildDefaultListBox(),
    defaultListboxIsImmutable: false,
    onSelect: handleSelect
  }

  return render(Component, newComponentProps, plugins, pluginIndex)
}

export default RecentSearchesPlugin