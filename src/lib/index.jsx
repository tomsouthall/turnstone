/* eslint react/prop-types: 1 */

import React from 'react'
import PropTypes from 'prop-types'
import { nanoid } from 'nanoid'
import { StateContextProvider } from './context/state'
import isUndefined from './utils/isUndefined'
import Container from './components/container'

// Set prop defaults before passing them on to components
const propDefaults = {
  autoFocus: false,
  clearButton: false,
  clearButtonAriaLabel: 'Clear contents',
  clearButtonText: '×',
  debounceWait: 250,
  defaultItemGroupsAreImmutable: true,
  id: nanoid(),
  isDisabled: false,
  itemGroupsAreImmutable: true,
  maxItems: 10,
  minQueryLength: 1,
  placeholder: ''
}

export default function Turnstone(props) {
  const newProps = {...propDefaults, ...props}

  return (
    <StateContextProvider {...newProps}>
      <Container {...newProps} />
    </StateContextProvider>
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
  clearButton: PropTypes.bool,
  clearButtonAriaLabel: PropTypes.string,
  clearButtonText: PropTypes.string,
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
  id: PropTypes.string,
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
  minQueryLength: (props) => {
    PropTypes.checkPropTypes(
      {minQueryLength: PropTypes.number},
      {minQueryLength: props.minQueryLength},
      'prop', 'Turnstone'
    )
    if(props.minQueryLength < propDefaults.minQueryLength)
      return new Error(
        `Prop "minQueryLength" must be a number greater than ${propDefaults.minQueryLength - 1}`
      )
  },
  name: PropTypes.string,
  noItemsMessage: PropTypes.string,
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  onEnter: PropTypes.func,
  onTab: PropTypes.func,
  placeholder: PropTypes.string,
  maxItems: PropTypes.number,
  splitChar: PropTypes.string,
  styles: PropTypes.object,
  tabIndex: PropTypes.number,
  text: PropTypes.string
}

//////////////////////////////////////////////////////