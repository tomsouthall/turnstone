import { describe, test, expect } from 'vitest'
import startsWithCaseInsensitive from './startsWithCaseInsensitive'

describe('startsWithCaseInsensitive', () => {
  test('Returns true if they match exactly', () => {
    expect(startsWithCaseInsensitive('Foobar', 'foo')).toBe(true)
  })

  test('Returns true if they match inexactly', () => {
    expect(startsWithCaseInsensitive('Foobar', 'foo')).toBe(true)
  })

  test('Returns false if they do not match', () => {
    expect(startsWithCaseInsensitive('Foobar', 'bar')).toBe(false)
  })

  test('Returns false if either argument is not a string', () => {
    expect(startsWithCaseInsensitive(void(0), 'foo')).toBe(false)
    expect(startsWithCaseInsensitive('Foobar', void(0))).toBe(false)
  })

  test('An empty string always matches', () => {
    expect(startsWithCaseInsensitive('Foobar', '')).toBe(true)
  })
})