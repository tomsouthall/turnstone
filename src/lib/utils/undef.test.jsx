import { describe, expect, test } from 'vitest'
import undef from './undef'

describe('undef', () => {
  test('undef returns a value of undefined', () => {
    expect(undef).toBe(void(0))
  })
})