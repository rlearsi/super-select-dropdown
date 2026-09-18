(() => {
    "use strict";

    const DARK_THEME_CLASS = "super-select-dark-mode";
    const DARK_THEME_STYLE_ID = "super-select-dark-style";

    // CSS injected for website Dark Mode
    const darkModeCSS = `
        html.${DARK_THEME_CLASS} {
            filter: invert(90%) hue-rotate(180deg) !important;
            background-color: #121212 !important;
        }

        /* Prevent double inversion of media and images */
        html.${DARK_THEME_CLASS} img,
        html.${DARK_THEME_CLASS} video,
        html.${DARK_THEME_CLASS} iframe,
        html.${DARK_THEME_CLASS} canvas,
        html.${DARK_THEME_CLASS} svg:not(.adaptive-select-dropdown-arrow svg),
        html.${DARK_THEME_CLASS} [style*="background-image"] {
            filter: invert(100%) hue-rotate(180deg) !important;
        }

        /* Keep adaptive-select UI visually native and calibrated in dark mode */
        html.${DARK_THEME_CLASS} .adaptive-select-ui {
            filter: invert(100%) hue-rotate(180deg) !important;
        }
    `;

    function injectDarkStyles() {
        if (document.getElementById(DARK_THEME_STYLE_ID)) return;
        const style = document.createElement("style");
        style.id = DARK_THEME_STYLE_ID;
        style.textContent = darkModeCSS;
        (document.head || document.documentElement).appendChild(style);
    }

    function setDarkMode(enabled) {
        injectDarkStyles();
        if (enabled) {
            document.documentElement.classList.add(DARK_THEME_CLASS);
            document.documentElement.setAttribute("data-super-theme", "dark");
        } else {
            document.documentElement.classList.remove(DARK_THEME_CLASS);
            document.documentElement.removeAttribute("data-super-theme");
        }
    }

    function isDarkMode() {
        return document.documentElement.classList.contains(DARK_THEME_CLASS);
    }

    // Get current host storage key
    function getHostKey() {
        try {
            return location.hostname || "local";
        } catch {
            return "default";
        }
    }

    // Apply stored preference on initial load
    function initThemeFromStorage() {
        if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
            const host = getHostKey();
            chrome.storage.local.get([`theme_${host}`, "global_theme"], (result) => {
                const isDark = result[`theme_${host}`] !== undefined 
                    ? result[`theme_${host}`] 
                    : (result.global_theme || false);
                setDarkMode(isDark);
            });
        }
    }

    // Listen to messages from popup
    if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.onMessage) {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === "TOGGLE_DARK_MODE") {
                const newState = request.value !== undefined ? request.value : !isDarkMode();
                setDarkMode(newState);

                const host = getHostKey();
                if (chrome.storage && chrome.storage.local) {
                    chrome.storage.local.set({ [`theme_${host}`]: newState });
                }

                sendResponse({ success: true, isDark: newState });
            } else if (request.action === "GET_STATUS") {
                const selectCount = document.querySelectorAll("select").length;
                sendResponse({
                    isDark: isDarkMode(),
                    selectCount: selectCount,
                    hostname: location.hostname || "Página Local"
                });
            } else if (request.action === "TRANSFORM_SELECTS") {
                if (window.adaptiveSelect && window.adaptiveSelect.init) {
                    window.adaptiveSelect.init();
                }
                const selectCount = document.querySelectorAll("select").length;
                sendResponse({ success: true, count: selectCount });
            }
            return true;
        });
    }

    // Run theme initialization
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initThemeFromStorage, { once: true });
    } else {
        initThemeFromStorage();
    }
})();
