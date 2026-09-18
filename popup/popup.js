document.addEventListener("DOMContentLoaded", async () => {
    const themeToggle = document.getElementById("theme-toggle");
    const themeDesc = document.getElementById("theme-desc");
    const siteHost = document.getElementById("site-host");
    const selectCount = document.getElementById("select-count");
    const btnRetransform = document.getElementById("btn-retransform");

    // Get active tab
    async function getActiveTab() {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        return tab;
    }

    const tab = await getActiveTab();
    if (!tab || !tab.id) {
        siteHost.textContent = "Nenhuma aba ativa";
        return;
    }

    try {
        const url = new URL(tab.url || "about:blank");
        siteHost.textContent = url.hostname || "Página Local";
    } catch {
        siteHost.textContent = "Página Interna";
    }

    // Update UI labels based on dark mode state
    function updateThemeUI(isDark) {
        themeToggle.checked = isDark;
        themeDesc.textContent = isDark ? "Modo Escuro Ativado" : "Modo Claro Ativado";
    }

    // Query status from content script
    try {
        chrome.tabs.sendMessage(tab.id, { action: "GET_STATUS" }, (response) => {
            if (chrome.runtime.lastError || !response) {
                // Content script might not be injected or running on restricted URL
                // Check storage as fallback
                try {
                    const host = new URL(tab.url).hostname || "default";
                    chrome.storage.local.get([`theme_${host}`, "global_theme"], (result) => {
                        const isDark = result[`theme_${host}`] !== undefined
                            ? result[`theme_${host}`]
                            : (result.global_theme || false);
                        updateThemeUI(isDark);
                    });
                } catch {
                    updateThemeUI(false);
                }
                return;
            }

            updateThemeUI(response.isDark);
            if (response.selectCount !== undefined) {
                selectCount.textContent = response.selectCount;
            }
            if (response.hostname) {
                siteHost.textContent = response.hostname;
            }
        });
    } catch (err) {
        console.error("Error communicating with tab:", err);
    }

    // Toggle theme handler
    themeToggle.addEventListener("change", () => {
        const isDark = themeToggle.checked;
        updateThemeUI(isDark);

        // Store preference
        try {
            const host = new URL(tab.url).hostname || "default";
            chrome.storage.local.set({ [`theme_${host}`]: isDark });
        } catch {}

        // Send message to active tab
        chrome.tabs.sendMessage(tab.id, { action: "TOGGLE_DARK_MODE", value: isDark }, (response) => {
            if (chrome.runtime.lastError) {
                // Tab might need reload or lacks script
            }
        });
    });

    // Retransform button handler
    btnRetransform.addEventListener("click", () => {
        btnRetransform.style.transform = "rotate(360deg)";
        setTimeout(() => { btnRetransform.style.transform = ""; }, 400);

        chrome.tabs.sendMessage(tab.id, { action: "TRANSFORM_SELECTS" }, (response) => {
            if (!chrome.runtime.lastError && response && response.count !== undefined) {
                selectCount.textContent = response.count;
            }
        });
    });
});
