const recentSearchesPlugin = (Component, componentProps = {}, pluginProps = {}) => {
  const {
    ratio = 1,
    id,
    name = 'Recent Searches',
    storageKey = 'recentSearches',
    limit = 10
  } = pluginProps

  const {
    defaultListbox = []
  } = componentProps

  const recentSearches = () => {
    return JSON.parse(localStorage.getItem(storageKey)) || []
  }

  const addToRecentSearches = itemToAdd => {
    const searches = [
      itemToAdd,
      ...recentSearches().filter(
        item => item._displayField !== itemToAdd._displayField
      )
    ]
    localStorage.setItem(storageKey, JSON.stringify(searches.slice(0, limit)))
  }

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

  const onSelect = (selectedResult, displayField) => {
    if(selectedResult) {
      if(typeof selectedResult === 'string') {
        selectedResult = {_displayField: selectedResult}
      }
      else {
        selectedResult._displayField = selectedResult[displayField]
      }
      addToRecentSearches(selectedResult)
    }

    if(typeof componentProps.onSelect === 'function')
      componentProps.onSelect(selectedResult, displayField)
  }

  const newComponentProps = {
    ...componentProps,
    ...{
      defaultListbox: buildDefaultListBox(),
      defaultListboxIsImmutable: false,
      onSelect
    }
  }

  return [Component, newComponentProps]
}

export default recentSearchesPlugin