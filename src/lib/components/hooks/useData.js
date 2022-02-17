import useSWR from 'swr'
import firstOfType from 'first-of-type'
import swrLaggyMiddleware from '../../utils/swrLaggyMiddleware'
import isUndefined from '../../utils/isUndefined'

const filterSuppliedData = (group, query) => {
  const { data, displayField, dataSearchType } = group
  const searchType = dataSearchType
    ? dataSearchType.toLowerCase()
    : dataSearchType

  if(!query.length) return []

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

const limitResults = (groups, groupsProp, maxItems) => {
  const ratios = groupsProp.map((group) => group.ratio || 1)
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

const useData = (query, isImmutable, itemGroups, defaultItemGroups, minQueryLength, maxItems) => {
  // See: https://github.com/vercel/swr/discussions/1810
  const dummyArgToEnsureCachingOfZeroLengthStrings = 'X'

  const fetcher = (q) => {
    if (defaultItemGroups && q.length > 0 && q.length < minQueryLength)
      return []
    else if (!defaultItemGroups && q.length < minQueryLength) return []

    const groupsProp =
      defaultItemGroups && !q.length ? defaultItemGroups : itemGroups

    const promises = groupsProp.map((g) => {
      if (typeof g.data === 'function') {
        return g.data(q)
      } else {
        return Promise.resolve({ data: filterSuppliedData(g, q) })
      }
    })

    return Promise.all(promises).then((groups) => {
      groups = groups.reduce((prevGroups, group, groupIndex) => {
        return [
          ...prevGroups,
          group.data.map((item) => ({
            value: item,
            text: itemText(item, groupsProp[groupIndex].displayField),
            groupIndex,
            groupName: groupsProp[groupIndex].name
          }))
        ]
      }, [])

      if (groups.length) groups = limitResults(groups, groupsProp, maxItems)

      return groups.flat()
    })
  }

  const swrObj = useSWR(
    [
      query.toLowerCase(),
      dummyArgToEnsureCachingOfZeroLengthStrings
    ],
    fetcher,
    swrOptions(isImmutable)
  )

  return swrObj
}

export default useData