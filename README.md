<p align="center" width="100%">
<img src="https://github.com/tomsouthall/turnstone/raw/main/images/turnstone.svg" alt="Turnstone - A React Search Component" width="80%" align="center">
<br/><br/>
</p>

Turnstone is a highly customisable, easy-to-use autocomplete search component for React.

- [Turnstone In Action](#turnstone-in-action)
- [Features](#features)
- [Installation &amp; Usage](#installation-amp-usage)
- [API](#api)
  - [Props](#props)
  - [Component Props](#component-props)
  - [Methods](#methods)
- [Contributing](#contributing)
- [Release Checklist](#release-checklist)
- [License](#license)

## Turnstone In Action

**[View Demos](https://turnstone.tomsouthall.com/)** | [Demo #1](https://turnstone.tomsouthall.com/fancy) | [Demo #2](https://turnstone.tomsouthall.com/superfancy) | [Demo #3 (Basic)](https://turnstone.tomsouthall.com/basic)

[Play with Turnstone at CodeSandbox](https://codesandbox.io/s/musing-heyrovsky-xifmot)

![Turnstone in action](https://github.com/tomsouthall/turnstone/raw/main/images/example.gif)

## Features

- Lightweight React search box component
- Group search results from multiple APIs or other data sources with customisable headings
- Specify the maximum number of listbox options as well as weighted display ratios for each group
- Completely customise listbox options with your own React component. Add images, icons, additional sub-options, differing visual treatments by group or index and much more...
- Display typeahead autosuggest text beneath entered text
- Easily styled with various CSS methods including [CSS Modules](https://github.com/css-modules/css-modules) and [Tailwind CSS](https://tailwindcss.com/)
- Search input can be easily styled to attach to top of screen at mobile screen sizes with customisable cancel/back button to exit
- Multiple callbacks including: `onSelect`, `onChange`, `onTab`, `onEnter` and more...
- Built in WAI-ARIA accessibility
- Keyboard highlighting and selection using arrow, Tab and Enter keys
- Automated caching to reduce data fetches
- Debounce text entry to reduce data fetches
- Optional Clear button (customisable)
- Customisable placeholder text
- Add more functionality with plugins
- and much more...

## Installation &amp; Usage

```bash
$ npm install --save turnstone
```

### Usage

#### Barebones unstyled example

```jsx
import React from 'react'
import Turnstone from 'turnstone'

const App = () => {
  const listbox = {
    data: ['Peach', 'Pear', 'Pineapple', 'Plum', 'Pomegranate', 'Prune']
  }

  return (
    <Turnstone listbox={listbox} />
  )
}
```

#### Styled example with grouped results from two API sources

```jsx
import React, { useState } from 'react'
import Turnstone from 'turnstone'

const styles = {
  input,
  inputFocus,
  query,
  typeahead,
  cancelButton,
  clearButton,
  listbox,
  groupHeading,
  item,
  highlightedItem
}

const maxItems = 10

const listbox = [
  {
    id: 'cities',
    name: 'Cities',
    ratio: 8,
    displayField: 'name',
    data: (query) =>
      fetch(`/api/cities?q=${encodeURIComponent(query)}&limit=${maxItems}`)
        .then(response => response.json()),
    searchType: 'startswith'
  },
  {
    id: 'airports',
    name: 'Airports',
    ratio: 2,
    displayField: 'name',
    data: (query) =>
      fetch(`/api/airports?q=${encodeURIComponent(query)}&limit=${maxItems}`)
        .then(response => response.json()),
    searchType: 'contains'
  }
]

export default function Example() {
  return (
    <Turnstone
      cancelButton={true}
      debounceWait={250}
      id="search"
      listbox={listbox}
      listboxIsImmutable={true}
      matchText={true}
      maxItems={maxItems}
      name="search"
      noItemsMessage="We found no places that match your search"
      placeholder="Enter a city or airport"
      styles={styles}
      typeahead={true}
    />
  )
}

```

## Example Markup

This is an example of markup produced by the component, in this case with the
text `New` entered into the search box.

```html
<div class="container" role="combobox" aria-expanded="true" aria-owns="search-listbox" aria-haspopup="listbox">
  <input type="text" id="search" name="search" class="input query" style="position:relative;z-index:1;background-color:transparent" placeholder="Enter a city or airport" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-autocomplete="both" aria-controls="search-listbox">
  <input type="text" class="input typeahead" style="position:absolute;z-index:0;top:0;left:0" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" tabindex="-1" readonly="" aria-hidden="true">
  <button class="clearButton" tabindex="-1" aria-label="Clear contents" style="z-index: 2;">×</button>
  <button class="cancelButton" tabindex="-1" aria-label="Cancel" style="z-index: 3;">Cancel</button>
  <div id="search-listbox" class="listbox" role="listbox" style="position: absolute; z-index: 4;">
    <div class="groupHeading">Cities</div>
    <div class="highlightedItem" role="option" aria-selected="true" aria-label="New York City, New York, United States"><strong>New</strong> York City, New York, United States</div>
    <div class="item" role="option" aria-selected="false" aria-label="New South Memphis, Tennessee, United States"><strong>New</strong> South Memphis, Tennessee, United States</div>
    <div class="item" role="option" aria-selected="false" aria-label="New Kingston, Jamaica"><strong>New</strong> Kingston, Jamaica</div>
    <div class="item" role="option" aria-selected="false" aria-label="Newcastle, South Africa"><strong>New</strong>castle, South Africa</div>
    <div class="item" role="option" aria-selected="false" aria-label="New Orleans, Louisiana, United States"><strong>New</strong> Orleans, Louisiana, United States</div>
    <div class="item" role="option" aria-selected="false" aria-label="New Delhi, India"><strong>New</strong> Delhi, India</div>
    <div class="item" role="option" aria-selected="false" aria-label="Newcastle, Australia"><strong>New</strong>castle, Australia</div>
    <div class="item" role="option" aria-selected="false" aria-label="Newport, Wales"><strong>New</strong>port, Wales</div>
    <div class="groupHeading">Airports</div>
    <div class="item" role="option" aria-selected="false" aria-label="John F Kennedy Intl (JFK), New York, United States"item>John F Kennedy Intl (JFK), <strong>New</strong> York, United States</div>
    <div class="item" role="option" aria-selected="false" aria-label="Newark Liberty Intl (EWR), Newark, United States"><strong>New</strong>ark Liberty Intl (EWR), <strong>New</strong>ark, United States</div>
  </div>
</div>
```

## API

### Props

The following props can be supplied to the `<Turnstone>` component:

#### `autoFocus`
- Type: `boolean`
- Default: `false`
- If `true` the search input automatically receives focus
- Note: If `defaultListbox` prop is supplied, setting `autoFocus` to true causes the default listbox to be automatically opened.

#### `cancelButton`
- Type: `boolean`
- Default: `false`
- If `true` a cancel button is rendered. The cancel button is displayed only when the search box receives focus. It is particularly useful for mobile screen sizes where a "back" button is required
in order to exit the focused state of the search box.

#### `cancelButtonAriaLabel`
- Type: `string`
- Default: `"Cancel"`
- The value of the `aria-label` attribute on the cancel button element.

#### `clearButton`
- Type: `boolean`
- Default: `false`
- If `true` a clear button is rendered whenever the user has entered at least one character into the search box.
- Clicking the clear button has the same effect as pressing the Esc key while entering text into the search box. The contents of the searchbox are cleared and focus is retained.
- Suggested styling for the clear button is to position it absolutely overlaying the right of the search box, for example:
  ```css
  .clearButton {
    display: block;
    width: 2rem;
    right: 0px;
    top: 0px;
    bottom: 0px;
    position: absolute;
    color: #a8a8a8;
    cursor: pointer;
    border: none;
    background: transparent;
    padding:0;
  }
  ```
#### `clearButtonAriaLabel`
- Type: `string`
- Default: `"Clear contents"`
- The value of the `aria-label` attribute on the clear button element.

#### `debounceWait`
- Type: `number`
- Default: `250`
- The wait time in milliseconds after the user finishes typing before the search query is sent to the fetch function.
- This reduces the number of API calls made by the fetch function
- Set to `0` if you want no wait at all (e.g. if your listbox data is not fetched asynchronously)

#### `defaultListbox`
- Type: `array` or `object` or `function`
- Default: `undefined`
- The default listbox is displayed when the search box has focus and is empty.
- Supply an array if you wish multiple groups of items to appear in the default listbox. Groups can
  be drawn from multiple sources. For example:
  ```jsx
  [
    {
      name: 'Recent Searches',
      displayField: 'name',
      data: () => Promise.resolve(JSON.parse(localStorage.getItem('recent')) || []),
      id: 'recent',
      ratio: 1
    },
    {
      name: 'Popular Cities',
      displayField: 'name',
      data: [
        { name: 'Paris, France', coords: '48.86425, 2.29416' },
        { name: 'Rome, Italy', coords: '41.89205, 12.49209' },
        { name: 'Orlando, Florida, United States', coords: '28.53781, -81.38592' },
        { name: 'London, England', coords: '51.50420, -0.12426' },
        { name: 'Barcelona, Spain', coords: '41.40629, 2.17555' },
        { name: 'New Orleans, Louisiana, United States', coords: '29.95465,-90.07507' },
        { name: 'Chicago, Illinois, United States', coords: '41.85003,-87.65005' },
        { name: 'Manchester, England', coords: '53.48095,-2.23743' }
      ],
      id: 'popular',
      ratio: 1
    }
  ]
  ```
- Supply an object if you wish an ungrouped set of items to appear in the default listbox. For example:
  ```jsx
  {
    displayField: 'name',
    data: () => fetch(`/api/cities/popular`).then(res => res.json()),
  }
  ```
- Supply a function if you wish to dynamically build your listbox contents. One example might be
  where you have a data source that already groups results such as a GraphQL query. The function must return a promise which resolves to an array structured exactly as detailed above (see "supply an array..."). For example:
  ```jsx
  (query) => fetch(`/api/default-locations`)
    .then(res => res.json())
    .then(locations => {
      const {recentSearches, popularCities} = locations
      return [
        {
          name: 'Recent Searches',
          displayField: 'name',
          data: recentSearches,
          id: 'recent',
          ratio: 1
        },
        {
          name: 'Popular Cities',
          displayField: 'name',
          data: popularCities,
          id: 'popular',
          ratio: 1
        }
      ]
    })
  ```
- See the [listbox](#listbox) prop for details on the data structure of groups as these are the same for both `defaultListbox` and `listbox`

#### `defaultListboxIsImmutable`
- Type: `boolean`
- Default: `true`
- If `true` the contents of the default listbox are considered to be immutable, i.e. they never change between queries.
- If the same query can return different results, this must be set to `false`.

#### `disabled`
- Type: `boolean`
- Default: `false`
- If `true` the search box has an HTML `disabled` attribute set and cannot be interacted with by the user.

#### `enterKeyHint`
- Type: `string`
- Default: `undefined`
- If provided, sets the `enterkeyhint` HTML attribute of the search box `<input>` element.
- Accepted values: `"enter"`, `"done"`, `"go"`, `"next"`, `"previous"`, `"search"`, `"send"`

#### `errorMessage`
- Type: `string`
- Default: `undefined`
- If provided, this is a generic message displayed in the listbox if any error is thrown when fetching results.
- If not provided then no listbox is displayed if an error occurs

#### `id`
- **Recommended**
- Type: `string`
- Default: A randomly generated string e.g. `"turnstone-7iq5g"`
- This is the HTML `id` attribute applied to the container `<div>` element.
- It is also used to set the `id` attribute of the listbox element e.g. `"<id>-listbox"` and the corresponding `aria-owns` attribute of the container element.
- It is recommended to always provide an id.
- Note: If you use Next.js, you must provide an explicit `id` as randomly generated ids cause discrepancies between server side and client side rendering.

#### `listbox`
- **Required**
- Type: `array` or `object` or `function`
- Specifies how listbox results are populated in response to a user's query entered into the search box.
- **Supplying an array**
  Supply an array if you wish multiple groups of items to appear in the default listbox. Groups can
  be drawn from multiple sources. For example:
  ```jsx
  [
    {
      id: 'cities',
      name: 'Cities',
      ratio: 8,
      displayField: 'name',
      data: (query) =>
        fetch(`/api/cities?q=${encodeURIComponent(query)}&limit=10`)
          .then(res => res.json()),
      searchType: 'startswith'
    },
    {
      id: 'airports',
      name: 'Airports',
      ratio: 2,
      displayField: 'name',
      data: (query) =>
        fetch(`/api/airports?q=${encodeURIComponent(query)}&limit=10`)
          .then(res => res.json()),
      searchType: 'contains'
    }
  ]
  ```
  Each object representing a group can include the following properties:
  - **`data`** (function or array) **required**
    **If a function**
    - If supplied as a function, the return value must be a `Promise` that resolves to an array of items.
    - The array returned by the function is made up of items each representing an item that can potentially appear in the listbox. Items can be objects, arrays or strings.
    - The function receives a `query` argument which is a string containing the text entered into the search box. The function would then typically perform a fetch to an API endpoint for matching items and finally formats the data received as required.
    - If possible, the function should return enough items to satisfy the `maxItems` prop, in case all of the other groups return zero matches.
    - See the example above for `data` props supplied as functions.
    - The array returned will not be filtered according to the `searchType`. The presumption is that
    the function will return an array that is already correctly filtered.

    **If an array**
    - Instead of a function, an array of items, matching and non-matching can be supplied and Turnstone filters this down to items that match the query.
    - Items can be objects, arrays or strings.
    - The contents of the array will be filtered down to items matching the user's query based on the `searchType` (see below).
  - **`displayField`** (string or number or undefined)
    - This indicates the field within each item in the data array that contains the text to be displayed in the listbox and the text that will be matched to the user's query.
    - If the item is an object or array, `displayField` must be a string or number.
    - If the item is a string, `displayField` can be omitted.
  - **`searchType`** (string)
    - Must be either `"startswith"` or `"contains"`.
    - If the `data` prop is an array of items, Turnstone reduces the array down to items whose `displayField` either starts with or contains the current query.
    - No matter whether data is a function or an array, `searchType` is also used to match item text and wrap it in a `<strong>` element, but only if the `matchText` prop is set to `true`. For `startswith`, only text at the start of the `displayField` is wrapped. For `contains`, any matching text in the `displayField` is wrapped.
  - **`ratio`** (number)
    - The `maxItems` prop governs the number of items that are displayed in total across all groups in the listbox. However, `ratio` determines how many items are displayed within each group versus the other groups.
    - For example, let's say there are 3 groups and `maxItems` is set to `10`. For Group A we set `ratio: 6`, for Group B `ratio: 3` and for Group C `ratio: 1`. Note that these three numbers add up to our total of `10` (note that they don't have to and Turnstone will still calculate everything correctly, but it is much simpler if they do). This does not of course guarantee that we will see 6 items in Group A, 3 in Group B and 1 in Group C. There may not be enough matching items for this to be possible. So Turnstone will do its best to match the supplied ratio, but if it cannot it will make up the shortfall by including more items from other groups to match the total of 10 wherever possible. Only if across all the groups there are fewer items to display than 10 do we see fewer in the listbox.
    - So it is good to see the ratios as an ideal to be filled wherever the number of results make it possible. This provides a better user experience by showing as many results as possible across all groups. An alternative approach of setting a limit for each group individually would not allow this, nor would it allow us to control the total number of items in the listbox and therefore its size.
  - **`name`** (string) **required**
    - The name of the group
  - **`id`** (string)
    - A unique identifier for the group.
    - This is passed to the `Item` and `GroupName` props and is useful for styling groups differently based on `id`.
- **Supplying an object**
  Supply an object if you wish an ungrouped set of items to appear in the default listbox. For example:
  ```jsx
  {
    displayField: 'name',
    data: (query) =>
      fetch(`/api/cities?q=${encodeURIComponent(query)}&limit=10`)
        .then(res => res.json()),
    searchType: 'startswith'
  }
  ```
  An object can only include the following fields
    - **`data`**
    - **`displayField`**
    - **`searchType`**
  See above for explanations of each field.
- **Supplying a function**
  Supplying a function is useful if you wish to dynamically build your listbox contents based
  on the user's query. One example might be where you have a data source that already groups results such as a GraphQL query.
  The function receives a single string argument representing the user's query entered into the search box
  The function must return a promise which resolves to an array structured exactly as detailed above in "Supplying an array". For example:
  ```jsx
  (query) => fetch(`/api/locations?q=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(locations => {
      const {cities, airports} = locations

      return [
        {
          id: 'cities',
          name: 'Cities',
          ratio: 8,
          displayField: 'name',
          data: cities,
          searchType: 'startswith'
        },
        {
          id: 'airports',
          name: 'Airports',
          ratio: 2,
          displayField: 'name',
          data: airports,
          searchType: 'contains'
        }
      ]
    })
  ```


#### `listboxIsImmutable`
- Type: `boolean`
- Default: `true`
- If `true` the contents of the listbox are considered to be immutable, i.e. they never change between queries.
- If the same query can return different results, this must be set to `false`.

#### `matchText`
- Type: `boolean`
- Default: `false`
- If `true` any text in listbox items that matches the user's current search query is wrapped in a `<strong>` element.
- Note that if the `searchType` for the item in question is `startswith` only matching text at the start of the item text is wrapped. If the `searchType` is `contains`, any matching text in the item is wrapped.

#### `maxItems`
- Type: `number`
- Default: `10`
- The maximum number of items permitted to be displayed in the listbox and default listbox.
- Note: If there are several groups of items in the listbox, this determines how many items are displayed in total, *not* the number to be displayed within each group. To control the number of items displayed per groupo, use the `ratio` setting in the `listbox` and `defaultListbox` props.

#### `minQueryLength`
- Type: `number` (must be greater than `0`)
- Default: `1`
- Indicates the minimum number of characters that the user must enter into the search box before results are fetched and a populated listbox is displayed.
- Until `minQueryLength` is equalled or exceeded, no listbox is displayed.

#### `name`
- Type: `string`
- Default: `undefined`
- The HTML `name` attribute applied to the search box.

#### `noItemsMessage`
- Type: `string`
- Default: `undefined`
- If provided, this is a generic message displayed in the listbox if in the event that no items match the user's search query.
- If not provided then no listbox is displayed in the case of no matching items.

#### `onBlur`
- Type: `function`
- Default: `undefined`
- If provided, this callback function is executed whenever the `blur` event triggers on the search box.
- There are no arguments passed to the `onBlur` callback

#### `onChange`
- Type: `function`
- Default: `undefined`
- If provided, this callback function is executed whenever the `change` event triggers on the search box.
- The following arguments are passed to the `onChange` function:
  1. `query` (string) The current text value of the search box

#### `onEnter`
- Type: `function`
- Default: `undefined`
- If provided, this callback function is executed whenever the Enter button is pressed while the search box has focus.
- The following arguments are passed to the `onEnter` function:
  1. `query` (string) The current text value of the search box
  1. `selectedItem` The item selected by the user. This is in the same format as received from `listbox.data`.

#### `onFocus`
- Type: `function`
- Default: `undefined`
- If provided, this callback function is executed whenever the `focus` event triggers on the search box.
- There are no arguments passed to the `onFocus` callback

#### `onSelect`
- Type: `function`
- Default: `undefined`
- If provided, this callback function is executed whenever a listbox item is selected.
- The following arguments are passed to the `onSelect` function:
  1. `selectedItem` The item selected by the user. This is in the same format as received from `listbox.data`.
  1. `displayField` (string / number / undefined) The field in `selectedItem` that contains the text displayed in the listbox. If `selectedItem` is not an array or an object, `displayField` is `undefined`.
- This function is also called with `undefined` arguments to indicate when an item is no longer selected

#### `onTab`
- Type: `function`
- Default: `undefined`
- If provided, this callback function is executed whenever the Tab button is pressed while the search box has focus.
- The following arguments are passed to the `onTab` function:
  1. `query` (string) The current text value of the search box
  1. `selectedItem` The item selected by the user. This is in the same format as received from `listbox.data`.

#### `placeholder`
- Type: `string`
- Default: `""` (empty string)
- The HTML `placeholder` attribute applied to the search box.

#### `plugins`
- Type: `array`
- Default: `undefined`
- A series of Turnstone plugins to add extra functionality such as the [Recent Searches](https://github.com/tomsouthall/turnstone-recent-searches) plugin.
- Include each plugin as an array entry.
  ```jsx
  ['plugin1', 'plugin2']
  ```
- If there are options to specify alongside a plugin, then make the array entry an array with the first item being the plugin name and the second an options object.
  ```jsx
  [
    ['plugin1', { option1: true, option2: 'foo' }],
    'plugin2'
  ]
  ```
#### `styles`
- Type: `object`
- Default: `undefined`
- An object whose keys represent elements rendered by Turnstone. Each corresponding value is a string representing the `class` attribute for the element.
- Just as in the HTML class attribute, the string for each element can contain one or multiple classnames. For example, if you use Tailwind, this could look like the following example:
  ```jsx
  {
    input: 'w-full h-12 border border-slate-300 py-2 pl-10 pr-7 text-xl outline-none rounded',
    inputFocus: 'w-full h-12 border-x-0 border-t-0 border-b border-blue-300 py-2 pl-10 pr-7 text-xl outline-none sm:rounded sm:border',
    query: 'text-slate-800 placeholder-slate-400',
    typeahead: 'text-blue-300 border-white',
    cancelButton: `absolute w-10 h-12 inset-y-0 left-0 items-center justify-center z-10 text-blue-400 inline-flex sm:hidden`,
    clearButton: 'absolute inset-y-0 right-0 w-8 inline-flex items-center justify-center text-slate-400 hover:text-rose-400',
    listbox: 'w-full bg-white sm:border sm:border-blue-300 sm:rounded text-left sm:mt-2 p-2 sm:drop-shadow-xl',
    groupHeading: 'cursor-default mt-2 mb-0.5 px-1.5 uppercase text-sm text-rose-300',
    item: 'cursor-pointer p-1.5 text-lg overflow-ellipsis overflow-hidden text-slate-700',
    highlightedItem: 'cursor-pointer p-1.5 text-lg overflow-ellipsis overflow-hidden text-slate-700 rounded bg-blue-50'
  }
  ```
- The available elements are as follows:
  - **`container`** The outer container `<div>` that wraps all other elements. If not present, the style of the container is set to `position: relative; text-align: left;`. If you specify your own styles, ensure that the value of `position` allows for absolute positioning within this element.
  - `containerFocus`** Note that `container` and `containerFocus` are mutually exclusive. Only one or the other applies depending on whether the search box `<input>` has focus. If the styling of the outer container is to change when the search box receives focus, specify styles for `containerFocus`. If nothing is specified for `containerFocus` the styles for `container` are applied whether or not the search box has focus.
  - **`input`** Applies to the search box `<input>` element as well as the typeahead `<input>`. As the typeahead is positioned directly beneath the search box, these must be styled almost identically.
  - **`inputFocus`** Applies to the search box `<input>` element as well as the typeahead `<input>`, only when the search box has focus. Note that `input` and `inputFocus` are mutually exclusive. Only one or the other applies depending on whether the search box `<input>` has focus. If nothing is specified for `inputFocus` the styles for `input` are applied whether or not the search box has focus.
  - **`query`** For styles applying *only* to the search box `<input>` element and *not* the typeahead element beneath. A valid example is example text colour. Note that this element already has the following styles applied which cannot be overridden:
    - When typeahead is visible `position: relative; z-index: 1; background-color: transparent;`
    - When typeahead is not visible `position: relative;`
  - **`typeahead`** For styles applying *only* to the typeahead `<input>` element and *not* the search box element above. A valid example is example text colour. Note that this element already has the following styles applied which cannot be overridden: `position: absolute; z-index: 0; top: 0; left: 0;`.
  - **`cancelButton`** A `<button>` element. This is only rendered when the search box has focus. Note that this element already has the following styles applied which cannot be overridden: `z-index: 3`. You may wish only to display this at mobile screen widths.
  - **`clearButton`** A `<button>` element. This is only rendered when the search box contains text. Note that this element already has the following styles applied which cannot be overridden: `z-index: 2`.
  - **`listbox`** A `<div>` element that contains group headings and selectable items/options. This is rendered only when the search box contains text that produces matching listbox items. This also contains the `noItems` element when no items match the user's search query.
  - **`noItems`** A `<div>` element that contains a message when there are no items matching the user's search query. This is rendered inside the listbox element.
  - **`errorbox`** A `<div>` element that contains an error message `<div>`. This is rendered in place of the listbox only when the search produces an error.
  - **`errorMessage`** A `<div>` element that contains the error notification text.
  - **`groupHeading`** A `<div>` containing the heading for a group in the listbox. The contents are text by default but can also be customised using the `GroupName` prop.
  - **`item`** A `<div>` containing a listbox item. The contents are text by default but can also be customised using the `Item` prop.
  - **`highlightedItem`** Note that `item` and `highlightedItem` are mutually exclusive. An item `<div>` has the `highlightedItem` styling applied when it is highlighted either via a `mouseover` event or via use of the up and down arrow keys.
  - **`match`** The `<strong>` element that wraps any item text that matches the text entered into the search box. A common approach is to invert the styling so that the matched text is at a normal font weight and the remaining text is displayed in bold.

#### `tabIndex`
- Type: `number`
- Default: `undefined`
- The HTML `tabindex` attribute applied to the search box.

#### `text`
- Type: `string`
- Default: `undefined`
- Text appearing in the search box when first rendered
- Will cause `onSelect` to fire automatically if there is a matching result

#### `typeahead`
- Type: `string`
- Default: `true`
- If `true` shows typeahead text as the user enters text into the search box. This matches the currently highlighted item in the listbox, so long as the item starts with the search box text.

### Component Props

The following custom components can also be supplied as props:

#### `Cancel`
- Type: React component
- Default: `() => 'Cancel'`
- This component is rendered within the cancel `<button>` element. It receives no props.

#### `Clear`
- Type: React component
- Default: `() => '\u00d7'`
- This component is rendered within the clear `<button>` element. It receives no props.

#### `Item`
- Type: React component
- Default: `undefined`
- If supplied, this component is rendered within the listbox item `<div>` element.
- The `Item` component gives you huge flexibility to format and style listbox items however you like. They can be as rich as required, containing images, icons, multiple fields, etc.
- The `Item` component receives the following props when rendered:
  - **`appearsInDefaultListbox`** (boolean) If `true` indicates that the item appears in the default listbox rather than the listbox. This allows default listbox items to be styled completely differently to listbox items if required.
  - **`groupId`** (string) The `id` of the group supplied in the `listbox` or `defaultListbox` prop.
  - **`groupIndex`** (number) The index of the group. Matches the order supplied in the `listbox` or `defaultListbox` prop. Zero-indexed.
  - **`groupName`** (string) The `name` of the group supplied in the `listbox` or `defaultListbox` prop.
  - **`index`** (number) The index of the item within the listbox. Zero-indexed. This allows you to style, say, the first item differently to all the rest in the listbox.
  - **`isHighlighted`** (boolean) If `true` indicates that the item is currently in a highlighted state
  - **`item`** The item in the same format as supplied by the `listbox` or `defaultListbox` prop.
  - **`query`** The text currently entered in the search box. This can be used to show matched text in the item.
  - **`searchType`** (string) Either `"startswith"` or `"contains"`. Indicates how the item was matched to the query.
  - **`setSelected`** (function) If executed, sets the selected item to whatever is passed to the function. This allows sub-items to be displayed within an item. For example, you may wish to provide selectable neighbourhoods or attractions within a city item. The function receives two arguments:
    1. `value` (object / array / string) The value of the item to select
    1. `displayField` (string / number / undefined) The key or index of the field inside `value` that represents the text to display in the search box once selected. If the `value` argument is a string, this must be set to `undefined`.
  - **`totalItems`** The total number of items currently displayed inside the listbox.

#### `GroupName`
- Type: React component
- Default: `undefined`
- If supplied, this component is rendered within the group heading `<div>` element.
- By default the group name is simply a text string. This component allows you to supply custom styling, for example adding an icon.
- The `GroupName` component receives the following props when rendered:
  - **`children`** (string) The `name` of the group supplied in the `listbox` or `defaultListbox` prop.
  - **`id`** (string) The `id` of the group supplied in the `listbox` or `defaultListbox` prop.
  - **`index`** (number) The index of the group. Matches the order supplied in the `listbox` or `defaultListbox` prop. Zero-indexed.

### Methods

There are a number of methods accessible via a ref supplied to the Turnstone component.

For example:

```jsx
import React, { useRef } from 'react'
import Turnstone from 'turnstone'
import data from './data'

const App = () => {
  const listbox = { data }

  const turnstoneRef = useRef()

  const handleQuery = () => {
    turnstoneRef.current?.query('new')
  }

  const handleClear = () => {
    turnstoneRef.current?.clear()
  }

  return (
    <>
      <Turnstone ref={turnstoneRef} listbox={listbox} />
      <button onClick={handleQuery}>Perform Query</button>
      <button onClick={handleClear}>Clear Contents</button>
    </>
  )
}
```

The methods are as follows:

#### `blur()`

Removes keyboard focus from the search box.

#### `clear()`

Clears the contents of the search box

#### `focus()`

Sets keyboard focus on the search box.

#### `query(<string>)`

Sets the search box contents to the string argument supplied to the function.

#### `select()`

Selects the contents of the search box

## Contributing
- Fork the project
- Run the project in development mode: `$ npm run dev`
- Make changes.
- Add appropriate tests
- `$ npm test` (or `$ npm run watch`)
- Ensure all tests pass and any snapshot changes are fully reviewed
- Update README with appropriate docs.
- Commit and PR

## Release checklist
- Update CHANGELOG
- Update version number in package.json
- `$ git tag vN.N.N`
- Push tag `$ git push --tags`
- `$ npm run build`
- `$ npm publish`

## License

MIT © [tomsouthall](https://github.com/tomsouthall)
