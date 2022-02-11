// Updates an input field and maintains the current cursor position to
// prevent it from being set to the end
export default function setInputValueMaintainingCursorPosition(input, val) {
  const selectionStart = input.selectionStart
  if (input.value !== val) {
    input.value = val
    input.selectionStart = selectionStart
    input.selectionEnd = selectionStart
  }
}
