/* eslint react/prop-types: 1 */

import React from 'react'
import PropTypes from 'prop-types'
import { StateContextProvider } from './context/state'
import Container from './components/container'

const randomId = () => `turnstone-${(0|Math.random()*6.04e7).toString(36)}`

// Set prop defaults before passing them on to components
const propDefaults = {
  autoFocus: false,
  clearButton: false,
  clearButtonAriaLabel: 'Clear contents',
  clearButtonText: '\u00d7',
  debounceWait: 250,
  defaultListboxIsImmutable: true,
  disabled: false,
  id: randomId(),
  listboxIsImmutable: true,
  maxItems: 10,
  minQueryLength: 1,
  placeholder: ''
}

export default function Turnstone(props) {
  const newProps = {...propDefaults, ...props}

  return (
    <React.StrictMode>
      <StateContextProvider {...newProps}>
        <Container {...newProps} />
      </StateContextProvider>
    </React.StrictMode>
  )
}

//////////////////////////////////////////////////////
// Prop validation                                  //
//////////////////////////////////////////////////////

const dataSearchTypes = ['startswith', 'contains']

const listboxRules = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.exact({
    data: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.array
    ]).isRequired,
    dataSearchType: PropTypes.oneOf(dataSearchTypes),
    displayField: PropTypes.string,
    name: PropTypes.string.isRequired,
    ratio: PropTypes.number
  })),
  PropTypes.exact({
    data: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.array
    ]).isRequired,
    dataSearchType: PropTypes.oneOf(dataSearchTypes),
    displayField: PropTypes.string
  })
])

Turnstone.propTypes = {
  autoFocus: PropTypes.bool,
  clearButton: PropTypes.bool,
  clearButtonAriaLabel: PropTypes.string,
  clearButtonText: PropTypes.string,
  debounceWait: PropTypes.number,
  defaultListbox: listboxRules,
  defaultListboxIsImmutable: PropTypes.bool,
  disabled: PropTypes.bool,
  displayField: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  id: PropTypes.string,
  listbox: listboxRules.isRequired,
  listboxIsImmutable: PropTypes.bool,
  matchText: PropTypes.bool,
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
  styles: PropTypes.object,
  tabIndex: PropTypes.number,
  text: PropTypes.string,
  ItemContents: PropTypes.elementType,
  GroupName: PropTypes.elementType
}

//////////////////////////////////////////////////////