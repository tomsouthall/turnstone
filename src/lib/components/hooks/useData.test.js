import { describe, expect, test, beforeAll, afterAll, afterEach } from 'vitest'
import fetch from 'node-fetch'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { fetcher } from './useData'
import undef from '../../utils/undef'
import { fruits, vegetables, books } from '../../../data'

// TODO: This might be better tested in an integration test

///////////////////////////////////////////
// Test Fetched data                     //
///////////////////////////////////////////

const server = setupServer(
  rest.get('http://mock-api-site.com/api/books', (req, res, ctx) => {
    return res(
      ctx.json({data: books})
    )
  }),
  rest.get('http://mock-api-site.com/api/fruits', (req, res, ctx) => {
    const q = req.url.searchParams.get('q')

    return res(
      ctx.json({data: fruits.filter(fruit => fruit.toLowerCase().startsWith(q.toLowerCase()))})
    )
  })
)

const apiItemGroups = [
  {
    name: 'Books',
    ratio: 4,
    displayField: 'title',
    data: (query) =>
      fetch(`http://mock-api-site.com/api/books?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
  },
  {
    name: 'Fruits',
    ratio: 2,
    data: (query) =>
      fetch(`http://mock-api-site.com/api/fruits?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
  }
]

describe('Fetching API data', () => {
  beforeAll(() => {
    server.listen()
  })

  afterAll(() => {
    server.close()
  })

  test('Returns expected results', () => {
    return fetcher('L', apiItemGroups, undef, 1, 6).then(items => {
      expect(items).toEqual([
        {
          value: { title: 'Last Argument of Kings', author: 'Joe Abercrombie' },
          text: 'Last Argument of Kings',
          groupIndex: 0,
          groupName: 'Books'
        },
        {
          value: { title: 'Legend', author: 'Marie Lu' },
          text: 'Legend',
          groupIndex: 0,
          groupName: 'Books'
        },
        {
          value: { title: 'Life After Life', author: 'Kate Atkinson' },
          text: 'Life After Life',
          groupIndex: 0,
          groupName: 'Books'
        },
        {
          value: { title: 'Like Water for Chocolate', author: 'Laura Esquivel' },
          text: 'Like Water for Chocolate',
          groupIndex: 0,
          groupName: 'Books'
        },
        {
          value: 'Legume',
          text: 'Legume',
          groupIndex: 1,
          groupName: 'Fruits'
        },
        { value: 'Lemon', text: 'Lemon', groupIndex: 1, groupName: 'Fruits' }
      ])
    })
  })
})

// ///////////////////////////////////////////
// // Test Static data                      //
// ///////////////////////////////////////////

const singleItemGroup = [{
  name: '',
  data: fruits,
  dataSearchType: 'startswith'
}]

const multiItemGroup = [
  {
    name: 'Fruits',
    data: fruits,
    dataSearchType: 'startswith'
  },
  {
    name: 'Vegetables',
    data: vegetables,
    dataSearchType: 'startswith'
  }
]

describe('Fetching static data', () => {
  afterEach(() => {
    delete multiItemGroup[0].ratio
    delete multiItemGroup[1].ratio
    multiItemGroup[0].dataSearchType = 'startswith'
    multiItemGroup[1].dataSearchType = 'startswith'
  })

  test('Returns expected results for a single group', () => {
    return fetcher('Pe', singleItemGroup, undef, 1, 10).then(items => {
      expect(items).toEqual([
        { value: 'Peach', text: 'Peach', groupIndex: 0, groupName: '' },
        { value: 'Pear', text: 'Pear', groupIndex: 0, groupName: '' }
      ])
    })
  })

  test('Returns expected results for multiple groups with equal ratios', () => {
    return fetcher('P', multiItemGroup, undef, undef, 10).then(items => {
      expect(items).toEqual([
        { value: 'Peach', text: 'Peach', groupIndex: 0, groupName: 'Fruits' },
        { value: 'Pear', text: 'Pear', groupIndex: 0, groupName: 'Fruits' },
        { value: 'Physalis', text: 'Physalis', groupIndex: 0, groupName: 'Fruits' },
        { value: 'Pineapple', text: 'Pineapple', groupIndex: 0, groupName: 'Fruits' },
        { value: 'Pitaya', text: 'Pitaya', groupIndex: 0, groupName: 'Fruits' },
        { value: 'Parsnip', text: 'Parsnip', groupIndex: 1, groupName: 'Vegetables' },
        { value: 'Peanuts', text: 'Peanuts', groupIndex: 1, groupName: 'Vegetables' },
        { value: 'Peas', text: 'Peas', groupIndex: 1, groupName: 'Vegetables' },
        { value: 'Peppers', text: 'Peppers', groupIndex: 1, groupName: 'Vegetables' },
        { value: 'Pinto Beans', text: 'Pinto Beans', groupIndex: 1, groupName: 'Vegetables' }
      ])
    })
  })

  test('Returns expected results for multiple groups limited to 6 results', () => {
    return fetcher('P', multiItemGroup, undef, 1, 6).then(items => {
      expect(items).toEqual([
        { value: 'Peach', text: 'Peach', groupIndex: 0, groupName: 'Fruits' },
        { value: 'Pear', text: 'Pear', groupIndex: 0, groupName: 'Fruits' },
        { value: 'Physalis', text: 'Physalis', groupIndex: 0, groupName: 'Fruits' },
        { value: 'Parsnip', text: 'Parsnip', groupIndex: 1, groupName: 'Vegetables' },
        { value: 'Peanuts', text: 'Peanuts', groupIndex: 1, groupName: 'Vegetables' },
        { value: 'Peas', text: 'Peas', groupIndex: 1, groupName: 'Vegetables' }
      ])
    })
  })

  test('Returns expected ratios for multiple groups', () => {
    multiItemGroup[0].ratio = 4
    multiItemGroup[0].ratio = 2

    return fetcher('P', multiItemGroup, undef, 1, 6).then(items => {
      expect(items).toEqual([
        { value: 'Peach', text: 'Peach', groupIndex: 0, groupName: 'Fruits' },
        { value: 'Pear', text: 'Pear', groupIndex: 0, groupName: 'Fruits' },
        { value: 'Physalis', text: 'Physalis', groupIndex: 0, groupName: 'Fruits' },
        { value: 'Pineapple', text: 'Pineapple', groupIndex: 0, groupName: 'Fruits' },
        { value: 'Parsnip', text: 'Parsnip', groupIndex: 1, groupName: 'Vegetables' },
        { value: 'Peanuts', text: 'Peanuts', groupIndex: 1, groupName: 'Vegetables' }
      ])
    })
  })

  test('Returns results containing query', () => {
    multiItemGroup[0].dataSearchType = 'contains'
    multiItemGroup[1].dataSearchType = 'contains'

    return fetcher('Pe', multiItemGroup, undef, 1, 6).then(items => {
      expect(items).toEqual([
        { value: 'Bartlett pear', text: 'Bartlett pear', groupIndex: 0, groupName: 'Fruits' },
        { value: 'Cantaloupe', text: 'Cantaloupe', groupIndex: 0, groupName: 'Fruits' },
        { value: 'Grape', text: 'Grape', groupIndex: 0, groupName: 'Fruits' },
        { value: 'Bell Pepper', text: 'Bell Pepper', groupIndex: 1, groupName: 'Vegetables' },
        { value: 'Black-Eyed Peas', text: 'Black-Eyed Peas', groupIndex: 1, groupName: 'Vegetables' },
        { value: 'Chickpeas', text: 'Chickpeas', groupIndex: 1, groupName: 'Vegetables' }
      ])
    })
  })
})