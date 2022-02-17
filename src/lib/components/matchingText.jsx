import React, { useContext } from 'react'
import { StateContext } from '../context/state'
import escapeStringRegExp from 'escape-string-regexp'

export default function MatchingText(props) {
  const { text } = props
  const { state } = useContext(StateContext)
  const { customStyles } = state
  const regex = new RegExp('(' + escapeStringRegExp(state.query) + ')', 'i')
  const parts = (state.query) ? text.split(regex) : [text]
  const matchingText = parts.map((part, index) => {
    const style = (part.toLowerCase() === state.query.toLowerCase()) ? 'match' : 'nonMatch'
    if(part.length)
      return (<span className={customStyles[style]} key={`part${index}`}>{parts[index]}</span>)
  })

  return <React.Fragment>{matchingText}</React.Fragment>
}
