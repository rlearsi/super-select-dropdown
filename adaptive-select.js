(() => {
    "use strict";

    const STYLE_ID = "adaptive-select-style";
    const PROCESSED = "adaptive-select-processed";

    /*
     * ============================================================
     * CSS
     * ============================================================
     */

    const css = `
        :root {
            --as-btn-bg: #ffffff;
            --as-btn-fg: #222222;
            --as-btn-border: #d8d8d8;
            --as-btn-hover-bg: #f5f5f5;
            --as-btn-hover-border: #bbbbbb;
            --as-btn-active-bg: #222222;
            --as-btn-active-fg: #ffffff;
            --as-btn-active-border: #222222;

            --as-dd-bg: #18181b;
            --as-dd-fg: #f4f4f5;
            --as-dd-border: #27272a;
            --as-dd-hover-bg: #202024;
            --as-dd-hover-border: #3f3f46;
            --as-dd-item-fg: #d4d4d8;
            --as-dd-item-hover: #27272a;
            --as-dd-item-selected: #2f2f36;
            --as-dd-shadow: 0 16px 36px -4px rgba(0, 0, 0, 0.35);
        }

        /* Suporte a tema escuro global */
        [data-super-theme="dark"],
        .super-select-dark {
            --as-btn-bg: #1e1e24;
            --as-btn-fg: #f3f3f6;
            --as-btn-border: #32323a;
            --as-btn-hover-bg: #282830;
            --as-btn-hover-border: #4a4a56;
            --as-btn-active-bg: #3b82f6;
            --as-btn-active-fg: #ffffff;
            --as-btn-active-border: #3b82f6;

            --as-dd-bg: #141417;
            --as-dd-fg: #f4f4f5;
            --as-dd-border: #27272a;
            --as-dd-hover-bg: #1f1f23;
            --as-dd-hover-border: #3b82f6;
            --as-dd-item-fg: #d4d4d8;
            --as-dd-item-hover: #232328;
            --as-dd-item-selected: #2a2a32;
        }

        .adaptive-select-ui {
            width: 100%;
            box-sizing: border-box;
            font: inherit;
        }

        .adaptive-select-options {
            display: flex;
            gap: 6px;
            width: 100%;
            box-sizing: border-box;
        }

        .adaptive-select-options.vertical {
            flex-direction: column;
        }

        .adaptive-select-option {
            flex: 1 1 0;
            min-width: 0;

            padding: 9px 12px;

            border: 1px solid var(--as-btn-border);
            border-radius: 8px;

            background: var(--as-btn-bg);
            color: var(--as-btn-fg);

            font: inherit;
            cursor: pointer;

            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            transition:
                background-color 0.15s,
                border-color 0.15s,
                color 0.15s;
        }

        .adaptive-select-option:hover {
            background: var(--as-btn-hover-bg);
            border-color: var(--as-btn-hover-border);
        }

        .adaptive-select-option.selected {
            background: var(--as-btn-active-bg);
            border-color: var(--as-btn-active-border);
            color: var(--as-btn-active-fg);
        }

        .adaptive-select-options.vertical
        .adaptive-select-option {
            flex: none;
            width: 100%;
            text-align: left;
        }

        /*
         * Toggle
         */
        .adaptive-select-toggle {
            display: flex;
            align-items: center;
            justify-content: space-between;

            width: 100%;
            padding: 9px 12px;

            border: 1px solid var(--as-btn-border);
            border-radius: 8px;

            background: var(--as-btn-bg);
            color: var(--as-btn-fg);

            font: inherit;
            cursor: pointer;
            text-align: left;

            box-sizing: border-box;
            transition: background-color 0.15s, border-color 0.15s, color 0.15s;
        }

        .adaptive-select-toggle:hover {
            background: var(--as-btn-hover-bg);
            border-color: var(--as-btn-hover-border);
        }

        .adaptive-select-switch {
            position: relative;

            width: 38px;
            height: 22px;

            flex-shrink: 0;

            border-radius: 999px;
            background: #ccc;

            transition: background-color 0.15s;
        }

        .adaptive-select-switch::after {
            content: "";

            position: absolute;

            top: 2px;
            left: 2px;

            width: 18px;
            height: 18px;

            border-radius: 50%;
            background: white;

            transition: transform 0.15s;
        }

        .adaptive-select-toggle.active
        .adaptive-select-switch {
            background: #222;
        }

        .adaptive-select-toggle.active
        .adaptive-select-switch::after {
            transform: translateX(16px);
        }

        /*
         * Select original.
         */

        select.adaptive-select-hidden {
            position: absolute !important;

            width: 1px !important;
            height: 1px !important;

            opacity: 0 !important;

            pointer-events: none !important;
        }

        /*
         * Dropdown (Modern & Adaptativo)
         */

        .adaptive-select-dropdown-wrap {
            position: relative;
            user-select: none;
        }

        .adaptive-select-dropdown-trigger {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            min-height: 48px;
            padding: 12px 18px;
            background: var(--as-dd-bg);
            color: var(--as-dd-fg);
            border: 1px solid var(--as-dd-border);
            border-radius: 12px;
            font: inherit;
            font-size: 0.95rem;
            font-weight: 500;
            letter-spacing: -0.01em;
            cursor: pointer;
            box-sizing: border-box;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.08);
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .adaptive-select-dropdown-trigger:hover {
            background: var(--as-dd-hover-bg);
            border-color: var(--as-dd-hover-border);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .adaptive-select-dropdown-wrap.open .adaptive-select-dropdown-trigger {
            background: var(--as-dd-hover-bg);
            border-color: #52525b;
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.08), 0 6px 16px rgba(0, 0, 0, 0.25);
        }

        .adaptive-select-dropdown-label {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: left;
            flex: 1;
        }

        .adaptive-select-dropdown-arrow {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 12px;
            color: #a1a1aa;
            transition: transform 0.2s ease, color 0.2s ease;
            flex-shrink: 0;
        }

        .adaptive-select-dropdown-wrap.open .adaptive-select-dropdown-arrow {
            transform: rotate(180deg);
            color: var(--as-dd-fg);
        }

        .adaptive-select-dropdown-menu {
            position: absolute;
            top: calc(100% + 8px);
            left: 0;
            right: 0;
            z-index: 999999;
            background: var(--as-dd-bg);
            border: 1px solid var(--as-dd-border);
            border-radius: 12px;
            padding: 6px;
            box-shadow: var(--as-dd-shadow), 0 0 0 1px rgba(255, 255, 255, 0.05);
            max-height: 240px;
            overflow-y: auto;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-6px) scale(0.98);
            transform-origin: top center;
            transition: opacity 0.18s ease, transform 0.18s ease, visibility 0.18s;
            scrollbar-width: thin;
            scrollbar-color: #3f3f46 transparent;
        }

        .adaptive-select-dropdown-menu::-webkit-scrollbar {
            width: 6px;
        }

        .adaptive-select-dropdown-menu::-webkit-scrollbar-thumb {
            background: #3f3f46;
            border-radius: 999px;
        }

        .adaptive-select-dropdown-wrap.open .adaptive-select-dropdown-menu {
            opacity: 1;
            visibility: visible;
            transform: translateY(0) scale(1);
        }

        .adaptive-select-dropdown-item {
            display: flex;
            align-items: center;
            width: 100%;
            padding: 10px 14px;
            border: none;
            background: transparent;
            color: var(--as-dd-item-fg);
            border-radius: 8px;
            font: inherit;
            font-size: 0.92rem;
            text-align: left;
            cursor: pointer;
            box-sizing: border-box;
            transition: background 0.12s ease, color 0.12s ease;
        }

        .adaptive-select-dropdown-item:hover {
            background: var(--as-dd-item-hover);
            color: #ffffff;
        }

        .adaptive-select-dropdown-item.selected {
            background: var(--as-dd-item-selected);
            color: #ffffff;
            font-weight: 600;
        }
    `;


    /*
     * ============================================================
     * INJECT CSS
     * ============================================================
     */

    function injectCSS() {

        if (document.getElementById(STYLE_ID)) {
            return;
        }

        const style = document.createElement("style");

        style.id = STYLE_ID;
        style.textContent = css;

        document.head.appendChild(style);
    }


    /*
     * ============================================================
     * ADAPTIVE SELECT
     * ============================================================
     */

    class AdaptiveSelect {
        /** @type {HTMLSelectElement} */
        select;
        /** @type {HTMLElement|null} */
        ui = null;
        /** @type {HTMLElement|null} */
        container = null;
        /** @type {HTMLButtonElement|null} */
        toggle = null;
        /** @type {HTMLButtonElement|null} */
        dropdownTrigger = null;
        /** @type {HTMLElement|null} */
        dropdownLabel = null;
        /** @type {HTMLElement|null} */
        dropdownMenu = null;
        /** @type {MutationObserver} */
        observer;
        /** @type {ResizeObserver} */
        resizeObserver;
        /** @type {((e: MouseEvent) => void)|null} */
        onDocumentClick = null;
        /** @type {((e: KeyboardEvent) => void)|null} */
        onKeyDown = null;

        /**
         * @param {HTMLSelectElement} select
         */
        constructor(select) {

            this.select = select;
            this.ui = null;

            this.render();

            /*
             * Se o site mudar o valor do select,
             * atualizamos nossa interface.
             */

            this.select.addEventListener(
                "change",
                () => this.update()
            );

            /*
             * Detecta opções adicionadas/removidas.
             */

            this.observer = new MutationObserver(() => {
                this.render();
            });

            this.observer.observe(this.select, {
                childList: true,
                subtree: true
            });

            /*
             * Detecta redimensionamento.
             */

            this.resizeObserver = new ResizeObserver(() => {
                this.updateLayout();
            });

            if (this.select.parentElement) {
                this.resizeObserver.observe(
                    this.select.parentElement
                );
            }
        }


        /*
         * ========================================================
         * OPTIONS
         * ========================================================
         */

        getOptions() {

            return Array.from(this.select.options)
                .filter(option => {
                    return !option.disabled &&
                        !option.hidden;
                });
        }


        /*
         * ========================================================
         * RENDER
         * ========================================================
         */

        render() {

            this.destroyUI();

            const options = this.getOptions();

            /*
             * 0 opções
             */

            if (options.length === 0) {
                return;
            }

            /*
             * 1 opção
             */

            if (options.length === 1) {
                this.renderToggle(options[0]);
                return;
            }

            /*
             * 2 até 5
             */

            if (options.length <= 5) {
                this.renderButtons(options);
                return;
            }

            /*
             * 6 ou mais:
             * dropdown estilizado moderno e escuro.
             */

            this.renderDropdown(options);
        }


        /*
         * ========================================================
         * DROPDOWN (Muitas opções - Moderno e Escuro)
         * ========================================================
         */

        renderDropdown(options) {

            this.select.classList.add(
                "adaptive-select-hidden"
            );

            this.ui =
                document.createElement("div");

            this.ui.className =
                "adaptive-select-ui adaptive-select-dropdown-wrap";


            const trigger =
                document.createElement("button");

            trigger.type = "button";
            trigger.className = "adaptive-select-dropdown-trigger";

            const labelSpan =
                document.createElement("span");
            labelSpan.className = "adaptive-select-dropdown-label";

            const arrowIcon =
                document.createElement("span");
            arrowIcon.className = "adaptive-select-dropdown-arrow";
            arrowIcon.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;

            trigger.appendChild(labelSpan);
            trigger.appendChild(arrowIcon);


            const menu =
                document.createElement("div");
            menu.className = "adaptive-select-dropdown-menu";

            options.forEach(option => {

                const item =
                    document.createElement("button");
                item.type = "button";
                item.className = "adaptive-select-dropdown-item";
                item.dataset.value = option.value;
                item.textContent = option.textContent;

                item.addEventListener("click", (e) => {
                    e.stopPropagation();

                    this.select.value = option.value;
                    this.select.dispatchEvent(
                        new Event("change", { bubbles: true })
                    );

                    this.closeDropdown();
                    this.update();
                });

                menu.appendChild(item);
            });

            this.onDocumentClick = (e) => {
                if (!this.ui || !this.ui.contains(e.target)) {
                    this.closeDropdown();
                }
            };

            this.onKeyDown = (e) => {
                if (e.key === "Escape") {
                    this.closeDropdown();
                }
            };

            trigger.addEventListener("click", (e) => {
                e.stopPropagation();
                const isOpen = this.ui.classList.contains("open");
                if (isOpen) {
                    this.closeDropdown();
                } else {
                    this.openDropdown();
                }
            });

            this.ui.appendChild(trigger);
            this.ui.appendChild(menu);

            this.select.parentNode.insertBefore(
                this.ui,
                this.select
            );

            this.dropdownTrigger = trigger;
            this.dropdownLabel = labelSpan;
            this.dropdownMenu = menu;

            this.update();
        }

        openDropdown() {
            if (!this.ui) return;
            // Close other open dropdowns
            document.querySelectorAll(".adaptive-select-dropdown-wrap.open").forEach(el => {
                if (el !== this.ui) el.classList.remove("open");
            });

            this.ui.classList.add("open");
            document.addEventListener("click", this.onDocumentClick);
            document.addEventListener("keydown", this.onKeyDown);
        }

        closeDropdown() {
            if (!this.ui) return;
            this.ui.classList.remove("open");
            document.removeEventListener("click", this.onDocumentClick);
            document.removeEventListener("keydown", this.onKeyDown);
        }


        /*
         * ========================================================
         * BUTTONS
         * ========================================================
         */

        renderButtons(options) {

            this.select.classList.add(
                "adaptive-select-hidden"
            );

            this.ui =
                document.createElement("div");

            this.ui.className =
                "adaptive-select-ui";


            const container =
                document.createElement("div");

            container.className =
                "adaptive-select-options";


            options.forEach(option => {

                const button =
                    document.createElement("button");

                button.type = "button";

                button.className =
                    "adaptive-select-option";

                button.dataset.value =
                    option.value;

                button.textContent =
                    option.textContent;

                button.title =
                    option.textContent;


                button.addEventListener(
                    "click",
                    () => {

                        this.select.value =
                            option.value;

                        this.select.dispatchEvent(
                            new Event("change", {
                                bubbles: true
                            })
                        );

                        this.update();
                    }
                );


                container.appendChild(button);
            });


            this.ui.appendChild(container);


            this.select.parentNode.insertBefore(
                this.ui,
                this.select
            );


            this.container = container;

            this.update();


            requestAnimationFrame(() => {
                this.updateLayout();
            });
        }


        /*
         * ========================================================
         * TOGGLE
         * ========================================================
         */

        renderToggle(option) {

            this.select.classList.add(
                "adaptive-select-hidden"
            );

            this.ui =
                document.createElement("div");

            this.ui.className =
                "adaptive-select-ui";


            const toggle =
                document.createElement("button");

            toggle.type = "button";

            toggle.className =
                "adaptive-select-toggle";


            const label =
                document.createElement("span");

            label.textContent =
                option.textContent;


            const switchElement =
                document.createElement("span");

            switchElement.className =
                "adaptive-select-switch";


            toggle.appendChild(label);
            toggle.appendChild(switchElement);


            toggle.addEventListener(
                "click",
                () => {

                    const enabled =
                        this.select.value ===
                        option.value;

                    /*
                     * Toggle ON
                     */

                    if (!enabled) {

                        this.select.value =
                            option.value;

                    }

                    /*
                     * Toggle OFF
                     */

                    else {

                        this.select.selectedIndex = -1;
                    }


                    this.select.dispatchEvent(
                        new Event("change", {
                            bubbles: true
                        })
                    );


                    this.update();
                }
            );


            this.ui.appendChild(toggle);


            this.select.parentNode.insertBefore(
                this.ui,
                this.select
            );


            this.toggle = toggle;

            this.update();
        }


        /*
         * ========================================================
         * UPDATE
         * ========================================================
         */

        update() {

            /*
             * Botões
             */

            if (this.container) {

                const buttons =
                    this.container.querySelectorAll(
                        ".adaptive-select-option"
                    );

                buttons.forEach(button => {

                    button.classList.toggle(
                        "selected",
                        button.dataset.value ===
                        this.select.value
                    );
                });
            }


            /*
             * Toggle
             */

            if (this.toggle) {

                const option =
                    this.getOptions()[0];

                const active =
                    option &&
                    this.select.value ===
                    option.value;


                this.toggle.classList.toggle(
                    "active",
                    active
                );

                this.toggle.setAttribute(
                    "aria-pressed",
                    String(active)
                );
            }

            /*
             * Dropdown
             */

            if (this.dropdownTrigger && this.dropdownMenu) {

                const selectedOption =
                    this.select.selectedOptions[0] ||
                    this.getOptions()[0];

                if (selectedOption) {
                    this.dropdownLabel.textContent =
                        selectedOption.textContent;
                }

                const items =
                    this.dropdownMenu.querySelectorAll(
                        ".adaptive-select-dropdown-item"
                    );

                items.forEach(item => {
                    item.classList.toggle(
                        "selected",
                        item.dataset.value === this.select.value
                    );
                });
            }
        }


        /*
         * ========================================================
         * LAYOUT
         * ========================================================
         */

        updateLayout() {

            if (!this.container) {
                return;
            }

            /*
             * Começa tentando horizontal.
             */

            this.container.classList.remove(
                "vertical"
            );


            const buttons =
                Array.from(
                    this.container.children
                );


            /*
             * Mede quanto os textos realmente
             * precisam de espaço.
             */

            let requiredWidth = 0;

            buttons.forEach(button => {

                const textWidth =
                    measureText(
                        button.textContent,
                        getComputedStyle(button).font
                    );

                const horizontalPadding = 24;

                requiredWidth +=
                    textWidth +
                    horizontalPadding;
            });


            const gap =
                (buttons.length - 1) * 6;


            const availableWidth =
                this.container.clientWidth;


            /*
             * Não coube?
             * Transforma em lista vertical.
             */

            if (
                requiredWidth + gap >
                availableWidth
            ) {

                this.container.classList.add(
                    "vertical"
                );
            }
        }


        /*
         * ========================================================
         * DESTROY
         * ========================================================
         */

        destroyUI() {

            if (this.onDocumentClick) {
                document.removeEventListener("click", this.onDocumentClick);
                document.removeEventListener("keydown", this.onKeyDown);
            }

            if (this.ui) {
                this.ui.remove();
                this.ui = null;
            }

            this.container = null;
            this.toggle = null;
            this.dropdownTrigger = null;
            this.dropdownLabel = null;
            this.dropdownMenu = null;

            this.select.classList.remove(
                "adaptive-select-hidden"
            );
        }


        destroy() {

            this.destroyUI();

            this.observer.disconnect();
            this.resizeObserver.disconnect();
        }
    }


    /*
     * ============================================================
     * MEASURE TEXT
     * ============================================================
     */

    function measureText(text, font) {

        const canvas =
            measureText.canvas ||
            (measureText.canvas =
                document.createElement("canvas"));

        const context =
            canvas.getContext("2d");

        context.font = font;

        return context.measureText(text).width;
    }


    /*
     * ============================================================
     * INITIALIZATION & API
     * ============================================================
     */

    const instances = new WeakMap();

    function transformSelect(select) {
        if (!select || !(select instanceof HTMLSelectElement)) return null;
        if (select.hasAttribute(PROCESSED)) return instances.get(select) || null;

        select.setAttribute(PROCESSED, "");
        const instance = new AdaptiveSelect(select);
        instances.set(select, instance);
        return instance;
    }

    function initialize() {
        injectCSS();
        document.querySelectorAll("select").forEach(transformSelect);
    }

    // Observe dynamic elements added to the DOM
    let dynamicObserver = null;
    function observeDynamicSelects() {
        if (dynamicObserver) return;
        dynamicObserver = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType !== Node.ELEMENT_NODE) return;
                    if (node.tagName === "SELECT") {
                        transformSelect(node);
                    } else if (node.querySelectorAll) {
                        node.querySelectorAll("select").forEach(transformSelect);
                    }
                });
            }
        });

        if (document.body) {
            dynamicObserver.observe(document.body, { childList: true, subtree: true });
        } else {
            document.addEventListener("DOMContentLoaded", () => {
                if (document.body) {
                    dynamicObserver.observe(document.body, { childList: true, subtree: true });
                }
            }, { once: true });
        }
    }

    // Expose on window for extension and external scripts
    window.AdaptiveSelect = AdaptiveSelect;
    window.adaptiveSelect = {
        init: initialize,
        transform: transformSelect,
        instances: instances
    };

    /*
     * ============================================================
     * START
     * ============================================================
     */

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            () => {
                initialize();
                observeDynamicSelects();
            },
            { once: true }
        );
    } else {
        initialize();
        observeDynamicSelects();
    }

})();