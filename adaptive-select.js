(() => {
    "use strict";

    const STYLE_ID = "adaptive-select-style";
    const PROCESSED = "adaptive-select-processed";

    /*
     * ============================================================
     * CSS LINK HELPER (FALLBACK FOR DIRECT USAGE)
     * ============================================================
     */

    function injectCSS() {
        if (document.getElementById(STYLE_ID) || document.querySelector('link[href*="adaptive-select.css"]')) {
            return;
        }

        const link = document.createElement("link");
        link.id = STYLE_ID;
        link.rel = "stylesheet";
        // If loaded in extension context
        if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.getURL) {
            link.href = chrome.runtime.getURL("adaptive-select.css");
        } else {
            link.href = "adaptive-select.css";
        }
        (document.head || document.documentElement).appendChild(link);
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