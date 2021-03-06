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
  styles: {},
  typeahead: true,
  Cancel: () => 'Cancel',
  Clear: () => '\u00d7'
}

const render = (Component, componentProps, pluginIndex, ref) => {
  const p = Array.isArray(componentProps.plugins) && componentProps.plugins[pluginIndex]
  if(p) {
    const [Plugin, pluginProps] = Array.isArray(p) ? p : [p]

    return <Plugin ref={ref} {...{
      ...pluginProps,
      Component,
      componentProps,
      pluginIndex,
      render
    }} />
  }
  return <Component ref={ref} {...componentProps} />
}

const Turnstone = React.forwardRef((props, ref) => {
  const componentProps = {...propDefaults, ...props}

  return (
    <React.StrictMode>
      <StateContextProvider {...componentProps}>
        { render(Container, componentProps, 0, ref) }
      </StateContextProvider>
    </React.StrictMode>
  )
})

Turnstone.displayName = 'Turnstone'

export default Turnstone

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
  }),
  PropTypes.func
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
  enterKeyHint: PropTypes.oneOf(['enter', 'done', 'go', 'next', 'previous', 'search', 'send']),
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