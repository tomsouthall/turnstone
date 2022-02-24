import React from 'react'
import PropTypes from 'prop-types'
import escapeStringRegExp from 'escape-string-regexp'

const getMatches = (str, searchString, global, caseSensitive) => {
  const flags = (caseSensitive) ? 'g' : 'gi'
  const regex = new RegExp(escapeStringRegExp(searchString), flags)
  const matches = [...str.matchAll(regex)].map(a => [a.index, a.index + searchString.length])

  return global
    ? matches
    : (matches.length ? [matches[0]] : [])
}

const getDividers = (str, separator, global, caseSensitive) => {
  const flags = (caseSensitive) ? 'g' : 'gi'
  const regex = new RegExp(escapeStringRegExp(separator), flags)
  const dividers = [...str.matchAll(regex)].map(a => a.index + separator.length)

  return [...((global)
    ? dividers
    : (dividers.length ? [dividers[0]] : [])
  ), str.length]
}

const isMatchingChar = (index, matches) => {
  return matches.reduce((prev, match) => {
    return prev || index >= match[0] && index < match[1]
  }, false)
}

export default function SplitMatch(props) {
  const {
    caseSensitiveMatch = false,
    caseSensitiveSplit = false,
    globalMatch = true,
    globalSplit = true,
    includeSeparator = true,
    searchText,
    separator = ',',
    children: text,
    MatchComponent,
    SplitComponent
  } = props

  if(!text) return null

  const wrapMatch = (match, key) => {
    if(MatchComponent) return <MatchComponent key={key}>{match}</MatchComponent>
    return <strong key={key}>{match}</strong>
  }

  const wrapSplit = (children, key, index) => {
    if(SplitComponent) return <SplitComponent key={key} index={index}>{children}</SplitComponent>
    return <span key={key}>{children}</span>
  }

  let separatorRemoved = false
  const dividers = getDividers(text, separator, globalSplit, caseSensitiveSplit)
  const matches = getMatches(text, searchText, globalMatch, caseSensitiveMatch)
  const parts = dividers.map((dividerIndex, i) => {
    let tag = ''
    let tagIsMatch = false
    const parts = []
    const prevIndex = dividers[i - 1] || 0
    const chars = Array.from(text.substring(prevIndex, dividerIndex))
    const addTag = (isMatch, finalTagInDivider) => {
      const key = `part-${i}-${parts.length}`
      if(tag.length && tagIsMatch !== isMatch) {
        if(!includeSeparator && finalTagInDivider && (globalSplit || !separatorRemoved)) {
          tag = tag.replace(separator, '')
          separatorRemoved = true
        }

        parts.push(
          tagIsMatch
            ? wrapMatch(tag, key)
            : <React.Fragment key={key}>{tag}</React.Fragment>
        )
        tag = ''
      }
    }

    chars.forEach((char, index) => {
      const isMatch = isMatchingChar(prevIndex + index, matches)
      addTag(isMatch)
      tagIsMatch = isMatch
      tag = `${tag}${char}`
    })
    addTag(!tagIsMatch, true)

    return wrapSplit(parts, `part-${i}`, i)
  })

  return parts
}

//////////////////////////////////////////////////////
// Prop validation                                  //
//////////////////////////////////////////////////////

SplitMatch.propTypes = {
  caseSensitiveMatch: PropTypes.bool,
  caseSensitiveSplit: PropTypes.bool,
  globalMatch: PropTypes.bool,
  globalSplit: PropTypes.bool,
  includeSeparator: PropTypes.bool,
  searchText: PropTypes.string,
  separator: PropTypes.string, // Recommend single-character
  MatchComponent: PropTypes.elementType,
  SplitComponent: PropTypes.elementType
}

//////////////////////////////////////////////////////