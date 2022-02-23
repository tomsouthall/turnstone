import React from 'react'
import escapeStringRegExp from 'escape-string-regexp'

export default function MatchingText(props) {
  const { text, match, global } = props
  const patternPrefix = global ? '' : '^'
  const pattern = `${patternPrefix}(${escapeStringRegExp(match)})`
  const regex = new RegExp(pattern, 'i')
  const parts = match ? text.split(regex).filter(part => part.length) : [text]
  const matchingText = parts.map((part, index) => {
    const isMatch = part.toLowerCase() === match.toLowerCase()

    return (isMatch)
      ? <strong key={`part${index}`}>{parts[index]}</strong>
      : <React.Fragment key={`part${index}`}>{parts[index]}</React.Fragment>
  })

  return <>{matchingText}</>
}
