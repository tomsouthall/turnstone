// import React from 'react'
// import renderer from 'react-test-renderer'

// import { vi, describe, expect, test } from 'vitest'
// import { StateContextProvider } from '../context/turnstone'
// import Container from './container'
// import fruits from '../../data'

// vi.mock('./items', () => ({ default: () => 'Items' }))

// describe('Container', () => {
//   test('Component renders correctly', () => {
//     const customStyles = {
//       queryContainer: 'query-container-class',
//       query: 'query-class',
//       typeahead: 'typeahead-class',
//       x: 'x-class'
//     }

//     const component = renderer.create(
//       <StateContextProvider styles={customStyles}>
//        <Container
//          autoFocus={true}
//          data={fruits}
//          dataSearchType={'startswith'}
//          debounceWait={0}
//          maxItems={10}
//          noItemsMessage={'No matching fruit found'}
//          placeholder={'Type something fruity'}
//         />
//       </StateContextProvider>
//     )

//     const tree = component.toJSON()

//     expect(tree).toMatchSnapshot()
//   })
// })