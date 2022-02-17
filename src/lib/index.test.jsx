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
    itemGroupsAreImmutable={true}
  />
)

const tree = component.toJSON()

describe('Turnstone', () => {
  test('Turnstone component renders correctly', () => {
    expect(tree).toMatchSnapshot()
  })

  test('Turnstone component passes all props to Container component', () => {
    expect(component.root.children[0].children[0].props).toEqual({
      data,
      dataSearchType
    })
  })
})