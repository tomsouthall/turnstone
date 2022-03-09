/* eslint react/prop-types: 1 */

import React from 'react'
import PropTypes from 'prop-types'
import { StateContextProvider } from './context/state'
import Container from './components/container'

const randomId = () => `turnstone-${(0|Math.random()*6.04e7).toString(36)}`

// Set prop defaults before passing them on to components
const propDefaults = {
  autoFocus: false,
  cancelButton: false,
  cancelButtonAriaLabel: 'Cancel',
  clearButton: false,
  clearButtonAriaLabel: 'Clear contents',
  debounceWait: 250,
  defaultListboxIsImmutable: true,
  disabled: false,
  id: randomId(),
  listboxIsImmutable: true,
  matchText: false,
  maxItems: 10,
  minQueryLength: 1,
  placeholder: '',
  typeahead: true,
  Cancel: () => 'Cancel',
  Clear: () => '\u00d7'
}

export default function Turnstone(props) {
  const { plugins } = props
  const defaultComponentAndProps = [Container, {...propDefaults, ...props}]
  const componentAndProps = plugins
    ? plugins.reduce((prev, curr) => {
          const plugin = Array.isArray(curr) ? curr : [curr]
          return plugin[0](prev[0], prev[1], plugin[1])
        }, defaultComponentAndProps)
    : defaultComponentAndProps
  const Component = componentAndProps[0]
  const componentProps = componentAndProps[1]

  return (
    <React.StrictMode>
      <StateContextProvider {...componentProps}>
        <Component {...componentProps} />
      </StateContextProvider>
    </React.StrictMode>
  )
}

//////////////////////////////////////////////////////
// Prop validation                                  //
//////////////////////////////////////////////////////

const searchTypes = ['startswith', 'contains']

const listboxRules = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.exact({
    data: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.array
    ]).isRequired,
    searchType: PropTypes.oneOf(searchTypes),
    displayField: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    ratio: PropTypes.number
  })),
  PropTypes.exact({
    data: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.array
    ]).isRequired,
    searchType: PropTypes.oneOf(searchTypes),
    displayField: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  })
])

Turnstone.propTypes = {
  autoFocus: PropTypes.bool,
  cancelButton: PropTypes.bool,
  cancelButtonAriaLabel: PropTypes.string,
  cancelButtonText: PropTypes.string,
  clearButton: PropTypes.bool,
  clearButtonAriaLabel: PropTypes.string,
  clearButtonText: PropTypes.string,
  debounceWait: PropTypes.number,
  defaultListbox: listboxRules,
  defaultListboxIsImmutable: PropTypes.bool,
  disabled: PropTypes.bool,
  errorMessage: PropTypes.string,
  id: PropTypes.string,
  listbox: listboxRules.isRequired,
  listboxIsImmutable: PropTypes.bool,
  matchText: PropTypes.bool,
  maxItems: PropTypes.number,
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
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onEnter: PropTypes.func,
  onFocus: PropTypes.func,
  onSelect: PropTypes.func,
  onTab: PropTypes.func,
  placeholder: PropTypes.string,
  plugins: PropTypes.array,
  styles: PropTypes.object,
  tabIndex: PropTypes.number,
  text: PropTypes.string,
  typeahead: PropTypes.bool,
  Cancel: PropTypes.elementType,
  Clear: PropTypes.elementType,
  Item: PropTypes.elementType,
  GroupName: PropTypes.elementType
}

//////////////////////////////////////////////////////