# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-09-18

### Added
- **Browser Extension (Manifest V3)**:
  - Transformed project into a full-fledged browser extension with `manifest.json`.
  - Added `content.js` script to auto-transform `<select>` elements on any loaded web page.
  - Implemented automatic DOM `MutationObserver` to transform selects loaded asynchronously via AJAX/SPA.
- **Extension Popup with Light/Dark Mode Toggle**:
  - Created modern popup UI (`popup/popup.html`, `popup/popup.css`, `popup/popup.js`) with glassmorphism/dark aesthetics.
  - Added tactile switch toggle for switching between Light and Dark themes on the active website.
  - Implemented persistent theme storage via `chrome.storage.local` with per-hostname memory.
  - Added real-time transformed select counter and re-scan trigger button.
- **Adaptive Select Theming Support**:
  - Refactored `adaptive-select.js` to utilize CSS custom properties (`--as-btn-*`, `--as-dd-*`) for seamless adaptation to light and dark page modes.
  - Added SVG extension branding icon (`icons/icon.svg`).
- **Decoupled CSS & Performance Optimization**:
  - Extracted embedded stylesheet into dedicated `adaptive-select.css`.
  - Registered `adaptive-select.css` directly in `manifest.json` `content_scripts` to eliminate Flash of Unstyled Content (FOUC).
  - Kept lightweight dynamic link injection fallback in `adaptive-select.js` for standalone portability.
- **Dedicated Demo Directory**:
  - Moved standalone sample to `demo/standalone.html`.
  - Added `demo/pure-selects.html` with plain native selects and no scripts/styles to test real extension auto-injection.

---

## [1.1.0] - 2026-09-18

### Added
- **Modern Dark Dropdown Component (`>= 6 options`)**:
  - Replaced native `<select>` fallback with an elegant custom dropdown styled in dark theme (`#18181b` / `#27272a`).
  - Added thick, modern dimensions (`min-height: 48px`, `border-radius: 12px`, custom shadows and inner borders).
  - Integrated animated SVG chevron indicator indicating open/close state.
  - Added smooth dropdown overlay menu with custom scrollbars and keyboard/click-outside dismissal.
- **Repository Rules (`AGENTS.md`)**:
  - Added workspace rules requiring all Git commit messages to be written in English following Conventional Commits format.

### Fixed
- **Button Selection Bug**:
  - Fixed an issue where clicking on option buttons (2–5 options) did nothing. Buttons now correctly store `button.dataset.value = option.value`, enabling selection synchronization and active highlight.
- **TypeScript / IDE Diagnostic Warnings**:
  - Declared all class fields (`select`, `ui`, `container`, `toggle`, `dropdownTrigger`, `observer`, etc.) and added JSDoc type annotations to `AdaptiveSelect` to eliminate implicit `any` and missing property errors.
- **Browser Cache Invalidation**:
  - Appended version query string to script inclusion in `index.html` to avoid serving stale cached scripts.

---

## [1.0.0] - 2026-09-18

### Added
- **Initial Adaptive Select Implementation**:
  - Dynamic UI generation based on option count:
    - 1 option: toggle switch button.
    - 2–5 options: horizontal pill button group.
    - Automatic vertical stacking fallback using `ResizeObserver` and text measurement canvas when container space is constrained.
  - Automatic synchronization with original `<select>` element state and DOM mutation observing.
