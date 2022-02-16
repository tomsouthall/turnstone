const startsWithCaseInsensitive = (str, startsWith) => {
  if(typeof str !== 'string') return false
  if(typeof startsWith !== 'string') return false

  return str.toLowerCase().startsWith(startsWith.toLowerCase())
}

export default startsWithCaseInsensitive