# To-Do List Life Dashboard

A clean, all-in-one personal dashboard that lives in a single HTML file. It combines a live clock, a Pomodoro focus timer, a persistent to-do list, and a quick-links launcher — all running entirely in the browser with no server, no build tools, and no external dependencies.

## Features

### 🕐 Live Clock & Personalized Greeting

The dashboard opens with a large, always-updating clock that displays the current time in HH:MM:SS format alongside a human-readable date. Below the clock, a greeting adapts to the time of day — "Good Morning", "Good Afternoon", "Good Evening", or "Good Night" — and optionally includes your name. You can type your name into the input field and save it; the dashboard remembers it across sessions using localStorage.

### ⏱ Focus Timer

A built-in 25-minute Pomodoro countdown timer helps you stay focused during work sessions. Hit Start to begin the countdown, Stop to pause it at any point, and Reset to return to 25:00. While the timer is running, the Start button is disabled to prevent accidental double-starts. When the countdown reaches zero, the dashboard notifies you that the session is complete so you know it's time for a break.

### ✅ Task Manager

The task manager is a full-featured to-do list that persists everything to localStorage automatically. You can add tasks by typing in the input field and pressing Enter or clicking Add. Each task in the list has a checkbox to mark it complete (completed tasks get a strikethrough style), an Edit button to update the description inline, and a Delete button to remove it. A Sort button toggles the list between A–Z and Z–A alphabetical order. Empty or whitespace-only task descriptions are rejected with an inline error message that clears as soon as you start typing.

### 🔗 Quick Links

The quick links panel lets you save shortcut buttons to your most-visited websites. Enter a display name and a URL, then click Add Link. Each saved link appears as a pill-shaped button — clicking the button opens the URL in a new tab, while the small × icon on the button removes it from the list. URLs without a protocol prefix are automatically normalized to `https://` before saving.

### 🌙 Light & Dark Theme

A theme toggle button is always visible in the top-right corner. Clicking it switches between a light theme (white cards on a purple/blue gradient) and a dark theme (deep navy cards on a dark gradient). Your preference is saved to localStorage and applied on the next page load before any content renders, so there is never a flash of the wrong theme.

## Getting Started

No installation or setup is required. Just open `index.html` in any modern browser — directly from your file system via the `file://` protocol — and the dashboard is ready to use.

```
# Clone the repository
git clone https://github.com/your-username/todo-life-dashboard.git

# Open the dashboard
open index.html   # macOS
start index.html  # Windows
xdg-open index.html  # Linux
```

You can also set `index.html` as your browser's homepage so the dashboard loads every time you open a new window.

## Project Structure

The entire application is three files:

```
todo-life-dashboard/
├── index.html        # Markup, structure, and inline theme-flash-prevention script
├── css/
│   └── style.css     # All styles — CSS custom properties, layout, theming, responsive design
└── js/
    └── app.js        # All application logic — organized into feature modules
```

There are no dependencies, no `package.json`, no build step, and no network requests. Everything runs locally in the browser.

## Browser Support

The dashboard works in the current stable releases of Chrome, Firefox, Edge, and Safari. It uses only standard HTML5, CSS custom properties, and vanilla JavaScript — no polyfills needed for any modern browser.

## Data & Privacy

All data — your tasks, quick links, name, and theme preference — is stored exclusively in your browser's `localStorage` under the keys `tld_tasks`, `tld_links`, `tld_name`, and `tld_theme`. Nothing is ever sent to a server. If localStorage is unavailable (for example, in a private browsing session with storage blocked), the dashboard displays a non-blocking warning banner and continues to work in-memory for the current session.

## License

MIT
