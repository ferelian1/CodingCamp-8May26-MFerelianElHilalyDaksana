/* js/app.js — To-Do List Life Dashboard application logic */

/* ==========================================================================
   Storage Module
   ========================================================================== */

const Storage = {
  /**
   * Checks whether localStorage is available by attempting a test write/read/delete.
   * Returns true if available, false otherwise.
   */
  isAvailable() {
    const testKey = '__tld_storage_test__';
    try {
      localStorage.setItem(testKey, '1');
      const val = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      return val === '1';
    } catch (e) {
      return false;
    }
  },

  /**
   * Reads and JSON-parses a value from localStorage.
   * Returns fallback if the key is missing or parsing fails.
   * @param {string} key
   * @param {*} fallback
   */
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  },

  /**
   * JSON-stringifies value and writes it to localStorage.
   * Returns true on success, false on failure.
   * @param {string} key
   * @param {*} value
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * Removes a key from localStorage.
   * Silently swallows any errors.
   * @param {string} key
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // Silently ignore errors
    }
  }
};

/**
 * Checks localStorage availability and shows/hides the #storage-warning banner.
 * Also wires the dismiss button to hide the banner.
 * Call this during app init.
 */
function checkStorageAndWarn() {
  const banner = document.getElementById('storage-warning');
  const dismissBtn = document.getElementById('storage-warning-dismiss');

  if (!banner) return;

  if (!Storage.isAvailable()) {
    banner.removeAttribute('hidden');
  } else {
    banner.setAttribute('hidden', '');
  }

  if (dismissBtn) {
    dismissBtn.addEventListener('click', function () {
      banner.setAttribute('hidden', '');
    });
  }
}

/* ==========================================================================
   Theme Module
   ========================================================================== */

/**
 * Applies the given theme by setting the `data-theme` attribute on <html>.
 * Also updates the #theme-toggle button icon to reflect the active theme.
 * @param {"light"|"dark"} theme
 */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

/**
 * Reads the saved theme from Storage (key: `tld_theme`), defaulting to "light",
 * then calls applyTheme to apply it.
 */
function loadTheme() {
  const theme = Storage.get('tld_theme', 'light');
  applyTheme(theme);
}

/**
 * Reads the current theme from the <html> data-theme attribute, switches it,
 * calls applyTheme with the new value, and persists it to Storage.
 */
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  Storage.set('tld_theme', next);
}

// Wire #theme-toggle click event to toggleTheme
(function () {
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleTheme);
  }
})();

/* ==========================================================================
   Clock & Greeting Component
   ========================================================================== */

/**
 * Reads the current Date, formats time as HH:MM:SS (zero-padded),
 * formats date as "Weekday, Month DD, YYYY", and updates the
 * #clock-time and #clock-date DOM elements.
 */
function tickClock() {
  const now = new Date();

  // Format time as HH:MM:SS
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  const timeStr = `${hh}:${mm}:${ss}`;

  // Format date as "Weekday, Month DD, YYYY"
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const clockTimeEl = document.getElementById('clock-time');
  const clockDateEl = document.getElementById('clock-date');

  if (clockTimeEl) clockTimeEl.textContent = timeStr;
  if (clockDateEl) clockDateEl.textContent = dateStr;
}

/**
 * Calls tickClock() immediately, then starts a 1-second interval
 * to keep the clock updated.
 */
function initClock() {
  tickClock();
  setInterval(tickClock, 1000);
}

/**
 * Pure function mapping an hour value [0–23] to a greeting phrase.
 * 05–11 → "Good Morning"
 * 12–17 → "Good Afternoon"
 * 18–21 → "Good Evening"
 * 22–23, 0–4 → "Good Night"
 *
 * @param {number} hour - Integer hour in [0, 23]
 * @returns {string} Greeting phrase
 */
function getGreetingPhrase(hour) {
  if (hour >= 5 && hour <= 11) return 'Good Morning';
  if (hour >= 12 && hour <= 17) return 'Good Afternoon';
  if (hour >= 18 && hour <= 21) return 'Good Evening';
  return 'Good Night'; // 22–23 and 0–4
}

/**
 * Builds the greeting string and updates #greeting-text.
 * If name is a non-empty string, produces "Good Morning, Alex!"
 * Otherwise produces "Good Morning!"
 *
 * @param {string} name - The user's display name (may be empty)
 */
function renderGreeting(name) {
  const hour = new Date().getHours();
  const phrase = getGreetingPhrase(hour);
  const trimmedName = (name || '').trim();
  const greetingStr = trimmedName ? `${phrase}, ${trimmedName}!` : `${phrase}!`;

  const greetingEl = document.getElementById('greeting-text');
  if (greetingEl) greetingEl.textContent = greetingStr;
}

/**
 * Loads the user's name from Storage (key: tld_name) and calls renderGreeting.
 */
function initGreeting() {
  const name = Storage.get('tld_name', '');
  renderGreeting(name);
}

/**
 * Reads the #name-input value, trims it, persists it to tld_name in Storage,
 * and calls renderGreeting with the new name.
 */
function saveName() {
  const nameInput = document.getElementById('name-input');
  if (!nameInput) return;

  const name = nameInput.value.trim();
  Storage.set('tld_name', name);
  renderGreeting(name);
}

// Wire #name-save-btn click and #name-input Enter keypress to saveName()
(function () {
  const saveBtn = document.getElementById('name-save-btn');
  const nameInput = document.getElementById('name-input');

  if (saveBtn) {
    saveBtn.addEventListener('click', saveName);
  }

  if (nameInput) {
    nameInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        saveName();
      }
    });
  }
})();

/* ==========================================================================
   Focus Timer Component
   ========================================================================== */

// Module-level state
let timerInterval = null;   // setInterval handle or null
let timerSeconds = 1500;    // remaining seconds (default 25 * 60)

/**
 * Pure function converting integer seconds to a zero-padded "MM:SS" string.
 * @param {number} seconds - Total seconds (integer >= 0)
 * @returns {string} Formatted time string, e.g. "25:00" or "04:37"
 */
function formatTime(seconds) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

/**
 * Updates the #timer-display element with the current formatted time.
 */
function updateTimerDisplay() {
  const display = document.getElementById('timer-display');
  if (display) {
    display.textContent = formatTime(timerSeconds);
  }
}

/**
 * Enables/disables #timer-start and #timer-stop based on whether
 * timerInterval is active (non-null).
 * While running: Start disabled, Stop enabled.
 * While paused/reset: Start enabled, Stop disabled.
 */
function updateTimerControls() {
  const startBtn = document.getElementById('timer-start');
  const stopBtn = document.getElementById('timer-stop');

  const isRunning = timerInterval !== null;

  if (startBtn) startBtn.disabled = isRunning;
  if (stopBtn) stopBtn.disabled = !isRunning;
}

/**
 * Notifies the user that the focus session has ended.
 * Shows a browser alert to signal session completion.
 */
function notifyTimerComplete() {
  alert('Focus session complete! Time to take a break.');
}

/**
 * Called every second by setInterval.
 * Decrements timerSeconds; if it reaches 0, clears the interval,
 * calls notifyTimerComplete, and updates display and controls.
 * Otherwise just updates the display.
 */
function tickTimer() {
  timerSeconds -= 1;

  if (timerSeconds <= 0) {
    timerSeconds = 0;
    clearInterval(timerInterval);
    timerInterval = null;
    updateTimerDisplay();
    updateTimerControls();
    notifyTimerComplete();
  } else {
    updateTimerDisplay();
  }
}

/**
 * Starts the countdown timer.
 * Guards against double-start (no-op if already running).
 * Sets timerInterval and updates controls.
 */
function startTimer() {
  if (timerInterval !== null) return; // already running
  timerInterval = setInterval(tickTimer, 1000);
  updateTimerControls();
}

/**
 * Stops (pauses) the countdown timer.
 * Clears timerInterval, sets it to null, and updates controls.
 */
function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  updateTimerControls();
}

/**
 * Resets the timer: stops any active countdown, resets timerSeconds to 1500
 * (25:00), and updates display and controls.
 */
function resetTimer() {
  stopTimer();
  timerSeconds = 1500;
  updateTimerDisplay();
  updateTimerControls();
}

/**
 * Initializes the Focus Timer: sets initial state, updates display and controls.
 * Called during app init.
 */
function initFocusTimer() {
  timerInterval = null;
  timerSeconds = 1500;
  updateTimerDisplay();
  updateTimerControls();
}

// Wire #timer-start, #timer-stop, #timer-reset click events
(function () {
  const startBtn = document.getElementById('timer-start');
  const stopBtn = document.getElementById('timer-stop');
  const resetBtn = document.getElementById('timer-reset');

  if (startBtn) startBtn.addEventListener('click', startTimer);
  if (stopBtn) stopBtn.addEventListener('click', stopTimer);
  if (resetBtn) resetBtn.addEventListener('click', resetTimer);
})();

/* ==========================================================================
   Task Manager Component — Core Data Operations
   ========================================================================== */

// Module-level state
let tasks = [];             // Task[] loaded from localStorage
let sortAscending = true;   // sort direction toggle (used in Task 8)

/**
 * Pure function: returns true if text.trim() has at least one character.
 * @param {string} text
 * @returns {boolean}
 */
function validateTaskText(text) {
  return typeof text === 'string' && text.trim().length >= 1;
}

/**
 * Reads the tld_tasks key from Storage and returns the parsed array.
 * Returns an empty array if the key is missing or the value is not an array.
 * @returns {Array}
 */
function loadTasks() {
  const stored = Storage.get('tld_tasks', []);
  return Array.isArray(stored) ? stored : [];
}

/**
 * Writes the current tasks array to tld_tasks in Storage.
 */
function saveTasks() {
  Storage.set('tld_tasks', tasks);
}

/**
 * Clears #task-list and re-renders all tasks.
 * Each list item contains:
 *   - a checkbox (reflecting completed state)
 *   - a text span (with .task-text--completed class when completed)
 *   - an edit button
 *   - a delete button
 */
function renderTasks() {
  const taskList = document.getElementById('task-list');
  if (!taskList) return;

  taskList.innerHTML = '';

  tasks.forEach(function (task) {
    const li = document.createElement('li');
    li.dataset.id = task.id;

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', 'Mark task complete');
    checkbox.addEventListener('change', function () {
      toggleComplete(task.id);
    });

    // Text span
    const textSpan = document.createElement('span');
    textSpan.className = 'task-text' + (task.completed ? ' task-text--completed' : '');
    textSpan.textContent = task.text;

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'task-edit-btn';
    editBtn.textContent = 'Edit';
    editBtn.setAttribute('aria-label', 'Edit task');
    editBtn.addEventListener('click', function () {
      editTask(task.id);
    });

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'task-delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.addEventListener('click', function () {
      deleteTask(task.id);
    });

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });
}

/**
 * Reads #task-input, validates with validateTaskText, creates a Task object,
 * pushes it to tasks, saves, and re-renders. Clears the input on success.
 * Shows #task-error on invalid (empty/whitespace) input.
 */
function addTask() {
  const taskInput = document.getElementById('task-input');
  const taskError = document.getElementById('task-error');

  if (!taskInput) return;

  const rawText = taskInput.value;

  if (!validateTaskText(rawText)) {
    // Show inline error
    if (taskError) {
      taskError.textContent = 'Task description cannot be empty.';
      taskError.removeAttribute('hidden');
    }
    return;
  }

  // Hide any existing error
  if (taskError) {
    taskError.textContent = '';
    taskError.setAttribute('hidden', '');
  }

  const id = (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : Date.now().toString();

  const newTask = {
    id: id,
    text: rawText.trim(),
    completed: false,
    createdAt: Date.now()
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  taskInput.value = '';
}

/**
 * Finds the task with the given id and flips its completed state.
 * Saves and re-renders.
 * @param {string} id
 */
function toggleComplete(id) {
  const task = tasks.find(function (t) { return t.id === id; });
  if (!task) return;

  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

/**
 * Removes the task with the given id from the tasks array.
 * Saves and re-renders.
 * @param {string} id
 */
function deleteTask(id) {
  tasks = tasks.filter(function (t) { return t.id !== id; });
  saveTasks();
  renderTasks();
}

// Wire #task-input to clear #task-error when the user starts typing
(function () {
  const taskInput = document.getElementById('task-input');
  const taskError = document.getElementById('task-error');

  if (taskInput && taskError) {
    taskInput.addEventListener('input', function () {
      taskError.textContent = '';
      taskError.setAttribute('hidden', '');
    });
  }
})();

/**
 * Enters edit mode for the task with the given id.
 * Replaces the task's text span with a pre-populated <input> and a confirm button.
 * @param {string} id
 */
function editTask(id) {
  const taskList = document.getElementById('task-list');
  if (!taskList) return;

  const li = taskList.querySelector('li[data-id="' + id + '"]');
  if (!li) return;

  const task = tasks.find(function (t) { return t.id === id; });
  if (!task) return;

  // Find and replace the text span
  const textSpan = li.querySelector('.task-text');
  if (!textSpan) return;

  // Create inline edit input
  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.className = 'task-edit-input';
  editInput.value = task.text;
  editInput.setAttribute('aria-label', 'Edit task text');

  // Create confirm button
  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'task-edit-btn';
  confirmBtn.textContent = 'Confirm';
  confirmBtn.setAttribute('aria-label', 'Confirm edit');

  confirmBtn.addEventListener('click', function () {
    confirmEdit(id, editInput.value);
  });

  editInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      confirmEdit(id, editInput.value);
    }
  });

  // Replace text span with edit input
  li.replaceChild(editInput, textSpan);

  // Replace edit button with confirm button
  const editBtn = li.querySelector('.task-edit-btn');
  if (editBtn) {
    li.replaceChild(confirmBtn, editBtn);
  }

  editInput.focus();
}

/**
 * Confirms an in-progress edit for the task with the given id.
 * If newText is valid, updates the task and re-renders.
 * If invalid, restores the original text display.
 * @param {string} id
 * @param {string} newText
 */
function confirmEdit(id, newText) {
  const task = tasks.find(function (t) { return t.id === id; });
  if (!task) return;

  if (!validateTaskText(newText)) {
    // Invalid — restore original display by re-rendering
    renderTasks();
    return;
  }

  task.text = newText.trim();
  saveTasks();
  renderTasks();
}

/**
 * Toggles sortAscending, sorts the tasks array alphabetically by text,
 * saves, and re-renders. Also updates the sort button label.
 * First click → A–Z (ascending), second click → Z–A (descending), and so on.
 */
function sortTasks() {
  // Sort first using the current direction, then toggle for next click
  tasks.sort(function (a, b) {
    const textA = a.text.toLowerCase();
    const textB = b.text.toLowerCase();
    if (textA < textB) return sortAscending ? -1 : 1;
    if (textA > textB) return sortAscending ? 1 : -1;
    return 0;
  });

  // Toggle direction for the next invocation
  sortAscending = !sortAscending;

  // Update sort button label to reflect what the NEXT click will do
  const sortBtn = document.getElementById('task-sort-btn');
  if (sortBtn) {
    sortBtn.textContent = sortAscending ? 'Sort A–Z' : 'Sort Z–A';
    sortBtn.setAttribute('aria-label', sortAscending ? 'Sort tasks A to Z' : 'Sort tasks Z to A');
  }

  saveTasks();
  renderTasks();
}

/**
 * Initializes the Task Manager:
 * loads tasks from storage, renders them, and wires up UI controls.
 */
function initTaskManager() {
  tasks = loadTasks();
  renderTasks();

  const addBtn = document.getElementById('task-add-btn');
  const taskInput = document.getElementById('task-input');
  const sortBtn = document.getElementById('task-sort-btn');

  if (addBtn) {
    addBtn.addEventListener('click', addTask);
  }

  if (taskInput) {
    taskInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        addTask();
      }
    });
  }

  if (sortBtn) {
    sortBtn.addEventListener('click', sortTasks);
  }
}

/* ==========================================================================
   Quick Links Component
   ========================================================================== */

// Module-level state
let links = [];   // Link[] loaded from localStorage

/**
 * Pure function: returns true only if both name.trim() and url.trim() are non-empty.
 * @param {string} name - Link display name
 * @param {string} url  - Link URL
 * @returns {boolean}
 */
function validateLink(name, url) {
  return typeof name === 'string' && typeof url === 'string' &&
    name.trim().length >= 1 && url.trim().length >= 1;
}

/**
 * Pure function: if url already starts with "http://" or "https://", returns it
 * unchanged; otherwise prepends "https://".
 * @param {string} url
 * @returns {string}
 */
function normalizeUrl(url) {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return 'https://' + url;
}

/**
 * Reads the tld_links key from Storage and returns the parsed array.
 * Returns an empty array if the key is missing or the value is not an array.
 * @returns {Array}
 */
function loadLinks() {
  const stored = Storage.get('tld_links', []);
  return Array.isArray(stored) ? stored : [];
}

/**
 * Writes the current links array to tld_links in Storage.
 */
function saveLinks() {
  Storage.set('tld_links', links);
}

/**
 * Reads #link-name-input and #link-url-input, validates with validateLink,
 * normalizes the URL with normalizeUrl, creates a Link object ({id, name, url}),
 * pushes it to links, calls saveLinks() and renderLinks(), and clears the inputs.
 * Shows #link-error on invalid (empty name or empty URL) input.
 * Error clears when the user starts typing in either input.
 */
function addLink() {
  const nameInput = document.getElementById('link-name-input');
  const urlInput = document.getElementById('link-url-input');
  const linkError = document.getElementById('link-error');

  if (!nameInput || !urlInput) return;

  const rawName = nameInput.value;
  const rawUrl = urlInput.value;

  if (!validateLink(rawName, rawUrl)) {
    // Show inline error
    if (linkError) {
      linkError.textContent = 'Both a link name and a URL are required.';
      linkError.removeAttribute('hidden');
    }
    return;
  }

  // Hide any existing error
  if (linkError) {
    linkError.textContent = '';
    linkError.setAttribute('hidden', '');
  }

  const id = (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : Date.now().toString();

  const newLink = {
    id: id,
    name: rawName.trim(),
    url: normalizeUrl(rawUrl.trim())
  };

  links.push(newLink);
  saveLinks();
  renderLinks();

  nameInput.value = '';
  urlInput.value = '';
}

/**
 * Removes the link with the given id from the links array.
 * Saves and re-renders.
 * @param {string} id
 */
function removeLink(id) {
  links = links.filter(function (link) { return link.id !== id; });
  saveLinks();
  renderLinks();
}

/**
 * Clears #links-container and re-renders all links.
 * Each link is rendered as a pill-shaped button (.link-btn) containing:
 *   - a name span (.link-btn__name) — clicking the button body opens the URL in a new tab
 *   - a × remove button (.link-btn__remove) — clicking it calls removeLink(id)
 */
function renderLinks() {
  const container = document.getElementById('links-container');
  if (!container) return;

  container.innerHTML = '';

  links.forEach(function (link) {
    // Outer pill button — clicking the body (not the × icon) opens the URL
    const btn = document.createElement('button');
    btn.className = 'link-btn';
    btn.setAttribute('aria-label', 'Open ' + link.name);
    btn.addEventListener('click', function (e) {
      // Only open URL if the × remove button was NOT clicked
      if (!e.target.classList.contains('link-btn__remove')) {
        window.open(link.url, '_blank');
      }
    });

    // Name span
    const nameSpan = document.createElement('span');
    nameSpan.className = 'link-btn__name';
    nameSpan.textContent = link.name;

    // Remove (×) button
    const removeBtn = document.createElement('button');
    removeBtn.className = 'link-btn__remove';
    removeBtn.textContent = '×';
    removeBtn.setAttribute('aria-label', 'Remove ' + link.name);
    removeBtn.addEventListener('click', function (e) {
      e.stopPropagation(); // prevent the outer button's click from firing
      removeLink(link.id);
    });

    btn.appendChild(nameSpan);
    btn.appendChild(removeBtn);
    container.appendChild(btn);
  });
}

/**
 * Initializes the Quick Links component:
 * loads links from storage, renders them, and wires up the Add Link button.
 * Also wires both inputs to clear #link-error when the user starts typing.
 */
function initQuickLinks() {
  links = loadLinks();
  renderLinks();

  const addBtn = document.getElementById('link-add-btn');
  if (addBtn) {
    addBtn.addEventListener('click', addLink);
  }

  // Clear error when user starts typing in either input
  // Also wire Enter key on both inputs to addLink()
  const nameInput = document.getElementById('link-name-input');
  const urlInput = document.getElementById('link-url-input');
  const linkError = document.getElementById('link-error');

  if (nameInput && linkError) {
    nameInput.addEventListener('input', function () {
      linkError.textContent = '';
      linkError.setAttribute('hidden', '');
    });
  }

  if (nameInput) {
    nameInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        addLink();
      }
    });
  }

  if (urlInput && linkError) {
    urlInput.addEventListener('input', function () {
      linkError.textContent = '';
      linkError.setAttribute('hidden', '');
    });
  }

  if (urlInput) {
    urlInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        addLink();
      }
    });
  }
}

/* ==========================================================================
   App Initialization
   ========================================================================== */

/**
 * Main initialization function.
 * Called on DOMContentLoaded. Runs all module init functions in order:
 * 1. loadTheme()           — apply saved theme (prevents flash of wrong theme)
 * 2. checkStorageAndWarn() — show banner if localStorage is unavailable
 * 3. initClock()           — start the live clock
 * 4. initGreeting()        — load and render the greeting
 * 5. initFocusTimer()      — set up the focus timer
 * 6. initTaskManager()     — load tasks and wire task UI
 * 7. initQuickLinks()      — load links and wire quick links UI
 *
 * Note: The inline <script> in <head> already applies the saved theme before
 * the body renders to prevent a theme flash. loadTheme() here is the JS-side
 * counterpart that also updates the toggle button icon.
 */
function init() {
  loadTheme();
  checkStorageAndWarn();
  initClock();
  initGreeting();
  initFocusTimer();
  initTaskManager();
  initQuickLinks();
}

// Attach init to DOMContentLoaded so it runs after the DOM is fully parsed
document.addEventListener('DOMContentLoaded', init);
