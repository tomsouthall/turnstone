import { describe, expect, test } from 'vitest'
import isUndefined from './isUndefined'

describe('isUndefined', () => {
  test('isUndefined returns expected values', () => {
    expect(isUndefined(void(0))).toBe(true)
    expect(isUndefined(null)).toBe(false)
    expect(isUndefined('')).toBe(false)
    expect(isUndefined([])).toBe(false)
    expect(isUndefined({})).toBe(false)
    expect(isUndefined('foo')).toBe(false)
  })
})