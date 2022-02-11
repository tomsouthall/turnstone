export default function classNameHelper(defaultStyles, customStyles) {
  return (className) =>
    `${defaultStyles[className] || ''} ${customStyles[className] || ''}`.trim()
}
