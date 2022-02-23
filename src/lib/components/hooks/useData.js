import useSWR from 'swr'
import firstOfType from 'first-of-type'
import swrLaggyMiddleware from '../../utils/swrLaggyMiddleware'
import isUndefined from '../../utils/isUndefined'

const filterSuppliedData = (group, query) => {
  const { data, displayField, dataSearchType } = group
  const searchType = dataSearchType
    ? dataSearchType.toLowerCase()
    : dataSearchType

  switch (searchType) {
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

  while (unassignedSlots > 0) { // TODO: Use something better than a while loop
    groups = groups.map((group, i) => {
      if (!groupCounts[i]) {
        groupCounts[i] = Math.round(ratios[i] * ratioMultiplier)
        if (groupCounts[i] > group.length) groupCounts[i] = group.length
        unassignedSlots = unassignedSlots - groupCounts[i]
      } else if (groupCounts[i] < group.length) {
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

  const listboxProp = isDefaultListbox ? defaultListbox : listbox

  const promises = listboxProp.map((group) => {
    if (typeof group.data === 'function') {
      return group.data(query)
    } else {
      return Promise.resolve({ data: filterSuppliedData(group, query) })
    }
  })

  return Promise.all(promises).then((groups) => {
    groups = groups.reduce((prevGroups, group, groupIndex) => {
      return [
        ...prevGroups,
        group.data.map((item) => ({
          value: item,
          text: itemText(item, listboxProp[groupIndex].displayField),
          groupIndex,
          groupName: listboxProp[groupIndex].name,
          dataSearchType: listboxProp[groupIndex].dataSearchType,
          defaultListbox: isDefaultListbox
        }))
      ]
    }, [])

    if (groups.length) groups = limitResults(groups, listboxProp, maxItems)

    return groups.flat()
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