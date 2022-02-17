import React from 'react'
import renderer from 'react-test-renderer'

import { vi, describe, expect, test } from 'vitest'
import Turnstone from './index'

vi.mock('./components/container', () => ({ default: () => 'Container' }))

const data = ['foo', 'bar', 'foobar']
const dataSearchType = 'startswith'

const component = renderer.create(
  <Turnstone
    data={data}
    dataSearchType={dataSearchType}
  />
)

const tree = component.toJSON()

describe('Turnstone', () => {
  test('Turnstone component renders correctly', () => {
    expect(tree).toMatchSnapshot()
  })

  test('Turnstone component passes all props to Container component along with default props', () => {
    expect(component.root.children[0].children[0].props).toEqual({
      autoFocus: false,
      debounceWait: 250,
      defaultItemGroupsAreImmutable: true,
      isDisabled: false,
      itemGroupsAreImmutable: true,
      maxItems: 10,
      minQueryLength: 1,
      placeholder: '',
      data,
      dataSearchType
    })
  })
})