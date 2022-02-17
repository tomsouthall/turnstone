import firstOfType from 'first-of-type'
import isUndefined from './isUndefined'

const itemText = (item, displayField) => {
  const itemType = typeof item
  const text =
    itemType === 'string' && isUndefined(displayField)
      ? item
      : item[displayField]
  return isUndefined(text) ? firstOfType(item, 'string') || '' : text
}

export default itemText