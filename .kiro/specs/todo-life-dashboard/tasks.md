# Implementation Plan

## Tasks

- [x] 1. Project scaffold and base HTML structure
  - [x] 1.1 Create `index.html` with semantic HTML5 structure: `<head>` with meta tags, viewport, charset, and links to `css/style.css` and `js/app.js`
  - [x] 1.2 Add theme-flash-prevention inline `<script>` in `<head>` that reads `tld_theme` from localStorage and sets `data-theme` on `<html>` before body renders
  - [x] 1.3 Create the four card sections in `<body>`: Clock/Greeting card, Focus Timer card, Task Manager card, Quick Links card
  - [x] 1.4 Add the theme toggle button (`#theme-toggle`) in a fixed/always-visible position
  - [x] 1.5 Create `css/style.css` as an empty file and `js/app.js` as an empty file

- [x] 2. CSS foundation — layout, theming, and responsive design
  - [x] 2.1 Define CSS custom properties (variables) for light and dark themes on `:root` and `[data-theme="dark"]` — colors for background gradient, card background, text, borders, button styles
  - [x] 2.2 Implement the purple/blue gradient background on `body` and white card styles with rounded corners and subtle shadow
  - [x] 2.3 Implement responsive card grid layout using CSS Grid or Flexbox that works from 320px to 1920px (single column on mobile, multi-column on wider screens)
  - [x] 2.4 Style the Clock/Greeting card: large time display, date display, greeting text, name input and save button
  - [x] 2.5 Style the Focus Timer card: large MM:SS display, Start/Stop/Reset buttons with enabled/disabled states
  - [x] 2.6 Style the Task Manager card: task input row, task list items with checkbox, edit, delete controls, sort button, inline error message
  - [x] 2.7 Style the Quick Links card: name/URL input row, link buttons with remove (×) icon, inline error message
  - [x] 2.8 Style the theme toggle button (always visible, top-right or header area)
  - [x] 2.9 Add typography styles — readable font stack, sufficient contrast ratios in both themes
  - [x] 2.10 Add the localStorage unavailability warning banner style (non-blocking, dismissible)

- [x] 3. Storage module
  - [x] 3.1 Implement `Storage.isAvailable()` — attempts a test write/read/delete to detect localStorage availability
  - [x] 3.2 Implement `Storage.get(key, fallback)` — JSON.parse with try/catch, returns fallback on error
  - [x] 3.3 Implement `Storage.set(key, value)` — JSON.stringify with try/catch, returns boolean success
  - [x] 3.4 Implement `Storage.remove(key)` — removes key with try/catch
  - [x] 3.5 Implement storage unavailability detection on app init and show the non-blocking warning banner when unavailable

- [x] 4. Theme module
  - [x] 4.1 Implement `applyTheme(theme)` — sets `data-theme` attribute on `<html>` element
  - [x] 4.2 Implement `loadTheme()` — reads `tld_theme` from Storage, defaults to `"light"`, calls `applyTheme`
  - [x] 4.3 Implement `toggleTheme()` — reads current theme, switches it, calls `applyTheme`, persists to Storage
  - [x] 4.4 Wire `#theme-toggle` click event to `toggleTheme()`

- [x] 5. Clock and Greeting component
  - [x] 5.1 Implement `tickClock()` — reads current `Date`, formats time as HH:MM:SS (zero-padded), formats date as "Weekday, Month DD, YYYY", updates `#clock-time` and `#clock-date` DOM elements
  - [x] 5.2 Implement `initClock()` — calls `tickClock()` immediately, then starts `setInterval(tickClock, 1000)`
  - [x] 5.3 Implement `getGreetingPhrase(hour)` — pure function mapping hour [0–23] to one of "Good Morning" / "Good Afternoon" / "Good Evening" / "Good Night" per the defined ranges
  - [x] 5.4 Implement `renderGreeting(name)` — builds greeting string (with or without name), updates `#greeting-text`
  - [x] 5.5 Implement `initGreeting()` — loads name from `tld_name` in Storage, calls `renderGreeting`
  - [x] 5.6 Implement `saveName()` — reads `#name-input` value, trims it, persists to `tld_name` in Storage, calls `renderGreeting`
  - [x] 5.7 Wire `#name-save-btn` click and `#name-input` Enter keypress to `saveName()`

- [x] 6. Focus Timer component
  - [x] 6.1 Implement `formatTime(seconds)` — pure function converting integer seconds to zero-padded "MM:SS" string
  - [x] 6.2 Implement `updateTimerDisplay()` — updates `#timer-display` with `formatTime(timerSeconds)`
  - [x] 6.3 Implement `updateTimerControls()` — enables/disables `#timer-start` and `#timer-stop` based on whether `timerInterval` is active
  - [x] 6.4 Implement `notifyTimerComplete()` — shows a browser alert or updates a visible status element to signal session end
  - [x] 6.5 Implement `tickTimer()` — decrements `timerSeconds`; if it reaches 0, clears interval, calls `notifyTimerComplete`, updates display and controls; otherwise updates display
  - [x] 6.6 Implement `startTimer()` — guard against double-start, sets `timerInterval = setInterval(tickTimer, 1000)`, updates controls
  - [x] 6.7 Implement `stopTimer()` — clears `timerInterval`, sets it to null, updates controls
  - [x] 6.8 Implement `resetTimer()` — calls `stopTimer()`, resets `timerSeconds` to 1500, updates display and controls
  - [x] 6.9 Implement `initFocusTimer()` — sets initial state, calls `updateTimerDisplay()` and `updateTimerControls()`
  - [x] 6.10 Wire `#timer-start`, `#timer-stop`, `#timer-reset` click events to their respective functions

- [x] 7. Task Manager component — core data operations
  - [x] 7.1 Implement `validateTaskText(text)` — pure function returning `true` if `text.trim().length >= 1`
  - [x] 7.2 Implement `loadTasks()` — reads `tld_tasks` from Storage, returns array (default `[]`)
  - [x] 7.3 Implement `saveTasks()` — writes current `tasks` array to `tld_tasks` in Storage
  - [x] 7.4 Implement `addTask()` — reads `#task-input`, validates with `validateTaskText`, creates Task object (`{id, text, completed: false, createdAt}`), pushes to `tasks`, calls `saveTasks()` and `renderTasks()`, clears input; shows `#task-error` on invalid input
  - [x] 7.5 Implement `toggleComplete(id)` — finds task by id, flips `completed`, calls `saveTasks()` and `renderTasks()`
  - [x] 7.6 Implement `deleteTask(id)` — filters task out of `tasks`, calls `saveTasks()` and `renderTasks()`

- [x] 8. Task Manager component — edit and sort
  - [x] 8.1 Implement `editTask(id)` — finds task, replaces its list item's text span with a pre-populated `<input>` and a confirm button
  - [x] 8.2 Implement `confirmEdit(id, newText)` — validates new text with `validateTaskText`; if valid, updates task text, calls `saveTasks()` and `renderTasks()`; if invalid, restores original text display
  - [x] 8.3 Implement `sortTasks()` — toggles `sortAscending`, sorts `tasks` array alphabetically by `text` in the appropriate direction, calls `saveTasks()` and `renderTasks()`
  - [x] 8.4 Implement `renderTasks()` — clears `#task-list`, iterates `tasks`, creates list items with checkbox (reflecting `completed`), description text, edit button, and delete button; applies completed visual style (strikethrough/opacity) when `completed` is true
  - [x] 8.5 Implement `initTaskManager()` — calls `loadTasks()`, calls `renderTasks()`, wires `#task-add-btn` click and `#task-input` Enter keypress to `addTask()`, wires `#task-sort-btn` click to `sortTasks()`

- [x] 9. Quick Links component
  - [x] 9.1 Implement `validateLink(name, url)` — pure function returning `true` only if both `name.trim()` and `url.trim()` are non-empty
  - [x] 9.2 Implement `normalizeUrl(url)` — pure function: if url already starts with `http://` or `https://`, return unchanged; otherwise prepend `https://`
  - [x] 9.3 Implement `loadLinks()` — reads `tld_links` from Storage, returns array (default `[]`)
  - [x] 9.4 Implement `saveLinks()` — writes current `links` array to `tld_links` in Storage
  - [x] 9.5 Implement `addLink()` — reads `#link-name-input` and `#link-url-input`, validates with `validateLink`, normalizes URL with `normalizeUrl`, creates Link object (`{id, name, url}`), pushes to `links`, calls `saveLinks()` and `renderLinks()`, clears inputs; shows `#link-error` on invalid input
  - [x] 9.6 Implement `removeLink(id)` — filters link out of `links`, calls `saveLinks()` and `renderLinks()`
  - [x] 9.7 Implement `renderLinks()` — clears `#links-container`, iterates `links`, creates a button for each with the link name and a `×` remove icon; clicking the button body opens the URL in a new tab (`window.open(url, "_blank")`); clicking the `×` calls `removeLink(id)`
  - [x] 9.8 Implement `initQuickLinks()` — calls `loadLinks()`, calls `renderLinks()`, wires `#link-add-btn` click to `addLink()`

- [x] 10. App initialization and wiring
  - [x] 10.1 Implement the main `init()` function that calls modules in order: `loadTheme()`, `Storage.isAvailable()` check + warning banner, `initClock()`, `initGreeting()`, `initFocusTimer()`, `initTaskManager()`, `initQuickLinks()`
  - [x] 10.2 Attach `init()` to `DOMContentLoaded` event
  - [x] 10.3 Verify the inline theme script in `<head>` runs before `init()` to prevent theme flash

- [x] 11. Cross-cutting polish and validation
  - [x] 11.1 Verify all inline error messages (`#task-error`, `#link-error`) clear when the user starts typing in the associated input
  - [x] 11.2 Verify Enter key works as expected in all input fields (task add, name save, link add)
  - [x] 11.3 Verify the dashboard opens and functions correctly via `file://` protocol (no CORS or server dependency)
  - [x] 11.4 Verify responsive layout at 320px, 768px, 1280px, and 1920px viewport widths
  - [x] 11.5 Verify light and dark themes apply correct colors to all four cards, buttons, inputs, and text
  - [x] 11.6 Verify no flash of wrong theme on page load (theme script in `<head>` fires before body render)
  - [x] 11.7 Verify the localStorage warning banner appears when storage is blocked (test in private browsing or with storage disabled)
