import * as React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, afterEach } from 'vitest'
import Turnstone from '../index'
import { fruits } from '../../data'

describe('Integration tests', () => {
  afterEach(cleanup)

  test('Minimal render includes expected elements', () => {
    const placeholder = 'Test placeholder'

    render(<Turnstone
      data={fruits}
      dataSearchType={'startswith'}
      placeholder={placeholder}
    />)

    expect(screen.getByRole('combobox'))
    expect(screen.getByPlaceholderText(placeholder)).toBeDefined()
    expect(screen.queryByText('listbox')).toBeNull().toBeDefined()
    expect(screen.queryByRole('button', { name: /clear contents/i })).toBeNull()
  })

  test('Supplying a text prop populates the query input and opens the dropdown', async () => {
    const text = 'pe'

    render(<Turnstone
      autoFocus={true}
      data={fruits}
      dataSearchType={'startswith'}
      text={text}
    />)

    expect(screen.getByDisplayValue(text)).toBeDefined()
    expect(screen.queryByRole('button', { name: /clear contents/i })).toBeDefined()
    expect(await screen.findByRole('listbox')).toBeDefined()
    expect(screen.getByDisplayValue('Peach')).toBeDefined()
  })

  test('Supplying a clearButton prop displays the clear button', () => {
    const text = 'pe'

    render(<Turnstone
      data={fruits}
      dataSearchType={'startswith'}
      text={text}
    />)

    expect(screen.queryByRole('button', { name: /clear contents/i })).toBeDefined()
  })

  test('Changing the typed text produces the expected dropdown results', async () => {
    const placeholder = 'test'

    render(<Turnstone
      data={fruits}
      dataSearchType={'startswith'}
      placeholder={placeholder}
    />)

    const container = screen.getByRole('combobox')
    const input = screen.getByPlaceholderText(placeholder)
    const typeahead = container.children[1]

    expect(input).toBeDefined()
    expect(typeahead).toBeDefined()
    expect(screen.queryByRole('listbox')).toBeNull()
    userEvent.type(screen.getByRole('textbox'), 'p')
    expect(await screen.findByRole('listbox')).toBeDefined()
    expect(typeahead.value).toBe('Peach')
    expect(input.value).toBe('P')
    expect(screen.getByRole('option', { name: /peach/i }).getAttribute('aria-selected')).toBe('true')
    userEvent.type(screen.getByRole('textbox'), 'i', { skipClick: true })
    expect(screen.getByRole('listbox')).toBeDefined()
    expect(await screen.findByDisplayValue('Pineapple')).toBeDefined()
    expect(input.value).toBe('Pi')
    expect(screen.getByRole('option', { name: /pineapple/i }).getAttribute('aria-selected')).toBe('true')
    userEvent.type(screen.getByRole('textbox'), '{arrowdown}', { skipClick: true })
    expect(screen.getByRole('listbox')).toBeDefined()
    expect(await screen.findByDisplayValue('Pitaya')).toBeDefined()
    expect(input.value).toBe('Pi')
    expect(screen.getByRole('option', { name: /pineapple/i }).getAttribute('aria-selected')).toBe('false')
    expect(screen.getByRole('option', { name: /pitaya/i }).getAttribute('aria-selected')).toBe('true')
    userEvent.type(screen.getByRole('textbox'), '{arrowup}', { skipClick: true })
    expect(screen.getByRole('listbox')).toBeDefined()
    expect(await screen.findByDisplayValue('Pineapple')).toBeDefined()
    expect(input.value).toBe('Pi')
    expect(screen.getByRole('option', { name: /pineapple/i }).getAttribute('aria-selected')).toBe('true')
    expect(screen.getByRole('option', { name: /pitaya/i }).getAttribute('aria-selected')).toBe('false')
    userEvent.type(screen.getByRole('textbox'), '{backspace}', { skipClick: true })
    expect(await screen.findByDisplayValue('Peach')).toBeDefined()
    userEvent.type(screen.getByRole('textbox'), '{backspace}', { skipClick: true })
    expect(screen.queryByRole('listbox')).toBeNull()
    expect(input.value).toBe('')
    expect(typeahead.value).toBe('')
  })
})