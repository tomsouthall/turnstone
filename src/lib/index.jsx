/* eslint react/prop-types: 1 */

import React from 'react'
import PropTypes from 'prop-types'
import { TurnstoneContextProvider } from './context/turnstone'
import isUndefined from './utils/isUndefined'
import Container from './components/container'

export default function Turnstone(props) {
  const { splitChar, styles, text } = props
  return (
    <TurnstoneContextProvider
      splitChar={splitChar}
      styles={styles}
      text={text}>
      <Container {...props} />
    </TurnstoneContextProvider>
  )
}

//////////////////////////////////////////////////////
// Prop validation                                  //
//////////////////////////////////////////////////////

const msgBothRequired = `Either a "data" prop or an "itemGroups" prop must be provided. Both are missing.`
const msgOneOnly = `Both a "data" prop and an "itemGroups" prop were provided. Provide one only.`
const requiredPropsAreMissing = (props) => isUndefined(props.data) && isUndefined(props.itemGroups)
Turnstone.propTypes = {
  autoFocus: PropTypes.bool,
  data: (props) => {
    if(requiredPropsAreMissing(props)) return new Error(msgBothRequired)
    if(!isUndefined(props.data) && !isUndefined(props.itemGroups)) return new Error(msgOneOnly)
    PropTypes.checkPropTypes(
      {data: PropTypes.oneOfType([PropTypes.array, PropTypes.func])},
      {data: props.data},
      'prop', 'Turnstone'
    )
  },
  dataSearchType: PropTypes.oneOf(['startswith', 'contains']),
  debounceWait: PropTypes.number,
  defaultItemGroups: PropTypes.array,
  defaultItemGroupsAreImmutable: PropTypes.bool,
  displayField: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  itemGroups: (props) => {
    if(requiredPropsAreMissing(props)) return new Error(msgBothRequired)
    if(!isUndefined(props.data) && !isUndefined(props.itemGroups)) return new Error(msgOneOnly)
    PropTypes.checkPropTypes(
      {
        itemGroups: PropTypes.arrayOf(PropTypes.exact({
          name: PropTypes.string.isRequired,
          data: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.array
          ]).isRequired,
          dataSearchType: PropTypes.oneOf(['startswith', 'contains']),
          displayField: PropTypes.string,
          ratio: PropTypes.number
        }))
      },
      {itemGroups: props.itemGroups},
      'prop', 'Turnstone'
    )
  },
  itemGroupsAreImmutable: PropTypes.bool,
  loadingMessage: PropTypes.string,
  minQueryLength: PropTypes.number,
  noItemsMessage: PropTypes.string,
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  onEnter: PropTypes.func,
  onTab: PropTypes.func,
  placeholder: PropTypes.string,
  maxItems: PropTypes.number,
  splitChar: PropTypes.string,
  styles: PropTypes.object,
  text: PropTypes.string
}

//////////////////////////////////////////////////////