import useSWR from 'swr'
import firstOfType from 'first-of-type'
import swrLaggyMiddleware from '../../utils/swrLaggyMiddleware'
import isUndefined from '../../utils/isUndefined'

const convertListboxToFunction = (listbox, maxItems) => {
  if(typeof listbox === 'function') return listbox

  return () => Promise.resolve(
    Array.isArray(listbox)
      ? listbox
      : [{ ...listbox, ...{ name: '', ratio: maxItems } }]
  )
}

const filterSuppliedData = (group, query) => {
  const { data, displayField, searchType } = group
  const caseInsensitiveSearchType = searchType
    ? searchType.toLowerCase()
    : searchType

  switch (caseInsensitiveSearchType) {
    case 'startswith':
      return data.filter((item) =>
        itemText(item, displayField)
          .toLowerCase()
          .startsWith(query.toLowerCase())
      )
    case 'contains':
      return data.filter((item) =>
        itemText(item, displayField)
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    default:
      return data
  }
}

const limitResults = (groups, listboxProp, maxItems) => {
  const ratios = listboxProp.map((group) => group.ratio || 1)
  const ratioTotal = ratios.reduce((total, ratio) => total + ratio, 0)
  const ratioMultiplier = maxItems / ratioTotal
  const resultTotal = groups.flat().length
  const groupCounts = []
  let unassignedSlots = resultTotal < maxItems ? resultTotal : maxItems

  while (unassignedSlots > 0) {
    groups = groups.map((group, i) => {
      if (!groupCounts[i]) {
        groupCounts[i] = Math.round(ratios[i] * ratioMultiplier)
        if (groupCounts[i] > group.length) groupCounts[i] = group.length
        unassignedSlots = unassignedSlots - groupCounts[i]
      }
      else if (groupCounts[i] < group.length) {
        unassignedSlots -= ++groupCounts[i]
      }
      return group
    })
  }

  return groups.map((group, index) => group.slice(0, groupCounts[index]))
}

const itemText = (item, displayField) => {
  const itemType = typeof item
  const text =
    itemType === 'string' && isUndefined(displayField)
      ? item
      : item[displayField]
  return isUndefined(text) ? firstOfType(item, 'string') || '' : text
}

const swrOptions = (isImmutable) => {
  const swrBaseOptions = {
    use: [swrLaggyMiddleware]
  }

  return isImmutable
    ? {
        ...swrBaseOptions,
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
      }
    : swrBaseOptions
}

export const fetcher = (query, listbox, defaultListbox, minQueryLength, maxItems) => {
  if (defaultListbox && query.length > 0 && query.length < minQueryLength)
    return []
  else if (!defaultListbox && query.length < minQueryLength) return []

  const isDefaultListbox = (defaultListbox && !query.length)

  const listboxPromise = (convertListboxToFunction(
    isDefaultListbox ? defaultListbox : listbox,
    maxItems
  ))(query)

  return listboxPromise.then(listboxProp => {
    const promises = listboxProp.map(
      group => (typeof group.data === 'function')
        ? group.data(query)
        : Promise.resolve(filterSuppliedData(group, query))
    )

    return Promise.all(promises).then(groups => {
      groups = groups.reduce((prevGroups, group, groupIndex) => {
        const {id: groupId, name: groupName, displayField, searchType} = listboxProp[groupIndex]

        return [
          ...prevGroups,
          group.map((item) => ({
            value: item,
            text: itemText(item, displayField),
            groupIndex,
            groupId,
            groupName,
            searchType,
            displayField,
            defaultListbox: isDefaultListbox
          }))
        ]
      }, [])

      if (groups.length) groups = limitResults(groups, listboxProp, maxItems)

      return groups.flat()
    })
  })
}

const useData = (query, isImmutable, listbox, defaultListbox, minQueryLength, maxItems) => {

  // See: https://github.com/vercel/swr/discussions/1810
  const dummyArgToEnsureCachingOfZeroLengthStrings = 'X'

  const swrObj = useSWR(
    [
      query.toLowerCase(),
      dummyArgToEnsureCachingOfZeroLengthStrings
    ],
    (query) => fetcher(query, listbox, defaultListbox, minQueryLength, maxItems),
    swrOptions(isImmutable)
  )

  return swrObj
}

export default useData