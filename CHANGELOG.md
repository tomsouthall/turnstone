# Changelog

### 1.2.2 (25 Mar 2022)
- Fix issue affecting various keypresses with empty search box

### 1.2.1 (24 Mar 2022)
- Fix minimist dependency vulnerability

### 1.2.0 (24 Mar 2022)
- Add enterKeyHint prop

### 1.1.4 (16 Mar 2022)
- Add live demo links to README

### 1.1.3 (15 Mar 2022)
- Prevent no items message from displaying whilst items are being fetched

### 1.1.2 (15 Mar 2022)

- Add note to README regarding onSelect being called when an item is no longer selected
- Use autofocus HTML attribute instead of a useEffect hook
- Add MIT License
- Add precommit hooks for test and lint
- Ensure a no-items message is displayed if a query is entered but no items have ever been loaded
- Do not do any text matching in default listbox
- Pass the highlighted state to custom Item component
- Only show a transparent background on input box if there is no typeahead
- Add screengrab GIF to README
- Add Turnstone logo to README

### 1.1.1 (12 Mar 2022)

- Remove plugins argument from plugin render function

### 1.1.0 (12 Mar 2022)

- Revamp plugins so that each acts as a wrapper component around Container
- Do not show typeahead unless there is more than one item in the dropdown

### 1.0.1 (10 Mar 2022)

- Update to package.json description
- Add CHANGELOG

### 1.0.0 (10 Mar 2022)

- Initial release