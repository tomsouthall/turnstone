import { describe, expect, test, beforeAll, afterAll, afterEach } from 'vitest'
import fetch from 'node-fetch'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { fetcher } from './useData'
import undef from '../../utils/undef'
import { fruits, vegetables, books } from '../../../data'

// TODO: This would be better tested in an integration test

///////////////////////////////////////////
// Test Fetched data                     //
///////////////////////////////////////////

const server = setupServer(
  rest.get('http://mock-api-site.com/api/books', (req, res, ctx) => {
    return res(
      ctx.json(books)
    )
  }),
  rest.get('http://mock-api-site.com/api/fruits', (req, res, ctx) => {
    const q = req.url.searchParams.get('q')

    return res(
      ctx.json(fruits.filter(fruit => fruit.toLowerCase().startsWith(q.toLowerCase())))
    )
  }),
  rest.get('http://mock-api-site.com/api/fruits-veg', (req, res, ctx) => {
    const q = req.url.searchParams.get('q')

    return res(
      ctx.json({
        fruits: fruits.filter(fruit => fruit.toLowerCase().startsWith(q.toLowerCase())),
        veg: vegetables.filter(vegetable => vegetable.toLowerCase().startsWith(q.toLowerCase()))
      })
    )
  })
)

const item = (props) => {
  return {
    ...{
      value: undef,
      text: undef,
      groupIndex: undef,
      groupName: undef,
      defaultListbox: undef,
      displayField: undef,
      groupId: undef,
      searchType: undef
    },
    ...props
  }
}

const apiListboxObject = {
  data: (query) =>
    fetch(`http://mock-api-site.com/api/fruits?q=${encodeURIComponent(query)}`)
      .then(response => response.json())
}

const apiListboxArray = [
  {
    id: 'books',
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

const apiListboxFunction = query => {
  return fetch(`http://mock-api-site.com/api/fruits-veg?q=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(fruitsAndVeg => {
      const {fruits, veg} = fruitsAndVeg

      return [
        {
          name: 'Fruits',
          ratio: 8,
          data: fruits
        },
        {
          name: 'Vegetables',
          ratio: 2,
          data: veg
        }
      ]
    })
}

describe('Fetching API data using a listbox array', () => {
  beforeAll(() => {
    server.listen()
  })

  afterAll(() => {
    server.close()
  })

  test('Returns expected results', () => {
    return fetcher('L', apiListboxObject, undef, 1, 6).then(items => {
      expect(items).toEqual([
        item({
          value: 'Legume',
          text: 'Legume',
          groupIndex: 0,
          groupName: '',
        }),
        item({
          value: 'Lemon',
          text: 'Lemon',
          groupIndex: 0,
          groupName: ''
        }),
        item({
          value: 'Lime',
          text: 'Lime',
          groupIndex: 0,
          groupName: ''
        }),
        item({
          value: 'Lychee',
          text: 'Lychee',
          groupIndex: 0,
          groupName: ''
        }),
      ])
    })
  })
})

describe('Fetching API data using a listbox array', () => {
  beforeAll(() => {
    server.listen()
  })

  afterAll(() => {
    server.close()
  })

  test('Returns expected results', () => {
    return fetcher('L', apiListboxArray, undef, 1, 6).then(items => {
      expect(items).toEqual([
        item({
          value: { title: 'Last Argument of Kings', author: 'Joe Abercrombie' },
          text: 'Last Argument of Kings',
          groupIndex: 0,
          groupName: 'Books',
          displayField: 'title',
          groupId: 'books',
        }),
        item({
          value: { title: 'Legend', author: 'Marie Lu' },
          text: 'Legend',
          groupIndex: 0,
          groupName: 'Books',
          displayField: 'title',
          groupId: 'books',
        }),
        item({
          value: { title: 'Life After Life', author: 'Kate Atkinson' },
          text: 'Life After Life',
          groupIndex: 0,
          groupName: 'Books',
          displayField: 'title',
          groupId: 'books',
        }),
        item({
          value: { title: 'Like Water for Chocolate', author: 'Laura Esquivel' },
          text: 'Like Water for Chocolate',
          groupIndex: 0,
          groupName: 'Books',
          displayField: 'title',
          groupId: 'books',
        }),
        item({
          value: 'Legume',
          text: 'Legume',
          groupIndex: 1,
          groupName: 'Fruits',
        }),
        item({
          value: 'Lemon',
          text: 'Lemon',
          groupIndex: 1,
          groupName: 'Fruits'
        })
      ])
    })
  })
})

describe('Fetching API data using a listbox function', () => {
  beforeAll(() => {
    server.listen()
  })

  afterAll(() => {
    server.close()
  })

  test('Returns expected results', () => {
    return fetcher('L', apiListboxFunction, undef, 1, 6).then(items => {
      expect(items).toEqual([
        item({
          value: 'Legume',
          text: 'Legume',
          groupIndex: 0,
          groupName: 'Fruits',
        }),
        item({
          value: 'Lemon',
          text: 'Lemon',
          groupIndex: 0,
          groupName: 'Fruits'
        }),
        item({
          value: 'Lime',
          text: 'Lime',
          groupIndex: 0,
          groupName: 'Fruits'
        }),
        item({
          value: 'Lychee',
          text: 'Lychee',
          groupIndex: 0,
          groupName: 'Fruits'
        }),
        item({
          value: 'Leek',
          text: 'Leek',
          groupIndex: 1,
          groupName: 'Vegetables'
        }),
        item({
          value: 'Legumes',
          text: 'Legumes',
          groupIndex: 1,
          groupName: 'Vegetables'
        })
      ])
    })
  })
})

// ///////////////////////////////////////////
// // Test Static data                      //
// ///////////////////////////////////////////

const singleGroupListbox = [{
  name: '',
  data: fruits,
  searchType: 'startswith'
}]

const multiGroupListbox = [
  {
    name: 'Fruits',
    data: fruits,
    searchType: 'startswith'
  },
  {
    name: 'Vegetables',
    data: vegetables,
    searchType: 'startswith'
  }
]

describe('Fetching static data', () => {
  afterEach(() => {
    delete multiGroupListbox[0].ratio
    delete multiGroupListbox[1].ratio
    multiGroupListbox[0].searchType = 'startswith'
    multiGroupListbox[1].searchType = 'startswith'
  })

  test('Returns expected results for a single group', () => {
    return fetcher('Pe', singleGroupListbox, undef, 1, 10).then(items => {
      expect(items).toEqual([
        { value: 'Peach', text: 'Peach', groupIndex: 0, groupName: '', searchType: 'startswith'},
        { value: 'Pear', text: 'Pear', groupIndex: 0, groupName: '', searchType: 'startswith' }
      ])
    })
  })

  test('Returns expected results for multiple groups with equal ratios', () => {
    return fetcher('P', multiGroupListbox, undef, undef, 10).then(items => {
      expect(items).toEqual([
        { value: 'Peach', text: 'Peach', groupIndex: 0, groupName: 'Fruits', searchType: 'startswith' },
        { value: 'Pear', text: 'Pear', groupIndex: 0, groupName: 'Fruits', searchType: 'startswith' },
        { value: 'Physalis', text: 'Physalis', groupIndex: 0, groupName: 'Fruits', searchType: 'startswith' },
        { value: 'Pineapple', text: 'Pineapple', groupIndex: 0, groupName: 'Fruits', searchType: 'startswith' },
        { value: 'Pitaya', text: 'Pitaya', groupIndex: 0, groupName: 'Fruits', searchType: 'startswith' },
        { value: 'Parsnip', text: 'Parsnip', groupIndex: 1, groupName: 'Vegetables', searchType: 'startswith' },
        { value: 'Peanuts', text: 'Peanuts', groupIndex: 1, groupName: 'Vegetables', searchType: 'startswith' },
        { value: 'Peas', text: 'Peas', groupIndex: 1, groupName: 'Vegetables', searchType: 'startswith' },
        { value: 'Peppers', text: 'Peppers', groupIndex: 1, groupName: 'Vegetables', searchType: 'startswith' },
        { value: 'Pinto Beans', text: 'Pinto Beans', groupIndex: 1, groupName: 'Vegetables', searchType: 'startswith' }
      ])
    })
  })

  test('Returns expected results for multiple groups limited to 6 results', () => {
    return fetcher('P', multiGroupListbox, undef, 1, 6).then(items => {
      expect(items).toEqual([
        { value: 'Peach', text: 'Peach', groupIndex: 0, groupName: 'Fruits', searchType: 'startswith' },
        { value: 'Pear', text: 'Pear', groupIndex: 0, groupName: 'Fruits', searchType: 'startswith' },
        { value: 'Physalis', text: 'Physalis', groupIndex: 0, groupName: 'Fruits', searchType: 'startswith' },
        { value: 'Parsnip', text: 'Parsnip', groupIndex: 1, groupName: 'Vegetables', searchType: 'startswith' },
        { value: 'Peanuts', text: 'Peanuts', groupIndex: 1, groupName: 'Vegetables', searchType: 'startswith' },
        { value: 'Peas', text: 'Peas', groupIndex: 1, groupName: 'Vegetables', searchType: 'startswith' }
      ])
    })
  })

  test('Returns expected ratios for multiple groups', () => {
    multiGroupListbox[0].ratio = 4
    multiGroupListbox[0].ratio = 2

    return fetcher('P', multiGroupListbox, undef, 1, 6).then(items => {
      expect(items).toEqual([
        { value: 'Peach', text: 'Peach', groupIndex: 0, groupName: 'Fruits', searchType: 'startswith' },
        { value: 'Pear', text: 'Pear', groupIndex: 0, groupName: 'Fruits', searchType: 'startswith' },
        { value: 'Physalis', text: 'Physalis', groupIndex: 0, groupName: 'Fruits', searchType: 'startswith' },
        { value: 'Pineapple', text: 'Pineapple', groupIndex: 0, groupName: 'Fruits', searchType: 'startswith' },
        { value: 'Parsnip', text: 'Parsnip', groupIndex: 1, groupName: 'Vegetables', searchType: 'startswith' },
        { value: 'Peanuts', text: 'Peanuts', groupIndex: 1, groupName: 'Vegetables', searchType: 'startswith' }
      ])
    })
  })

  test('Returns results containing query', () => {
    multiGroupListbox[0].searchType = 'contains'
    multiGroupListbox[1].searchType = 'contains'

    return fetcher('Pe', multiGroupListbox, undef, 1, 6).then(items => {
      expect(items).toEqual([
        { value: 'Bartlett pear', text: 'Bartlett pear', groupIndex: 0, groupName: 'Fruits', searchType: 'contains' },
        { value: 'Cantaloupe', text: 'Cantaloupe', groupIndex: 0, groupName: 'Fruits', searchType: 'contains' },
        { value: 'Grape', text: 'Grape', groupIndex: 0, groupName: 'Fruits', searchType: 'contains' },
        { value: 'Bell Pepper', text: 'Bell Pepper', groupIndex: 1, groupName: 'Vegetables', searchType: 'contains' },
        { value: 'Black-Eyed Peas', text: 'Black-Eyed Peas', groupIndex: 1, groupName: 'Vegetables', searchType: 'contains' },
        { value: 'Chickpeas', text: 'Chickpeas', groupIndex: 1, groupName: 'Vegetables', searchType: 'contains' }
      ])
    })
  })
})