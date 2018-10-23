/**
 * reveal.js symbol per slide progress plugin
 *
 * A plugin which shows every slide as single symbol and the symbol of the current active slide in a different color.
 *
 * Demo https://naamor.github.io/reveal.js-symbol-per-slide-progress/
 *
 * MIT License
 * Copyright (c) 2018 Roman Stocker
 */

var RevealSymbolPerSlideProgress = window.SymbolPerSlideProgress || (function () {
    const VALID_POSITIONS = ["left", "right"];
    const VALID_ALIGNS = ["vertical", "horizontal"];

    // Set all option defaults
    var options = Reveal.getConfig().symbolperslideprogress || {};
    var path = options.path || scriptPath() || "plugin/symbol-per-slide-progress/";
    if (!path.endsWith('/')) {
        path += '/';
    }

    var position = getStringOption(options.position, VALID_POSITIONS) || "left";
    var align = getStringOption(options.align, VALID_ALIGNS) || "vertical";
    var symbolColor = options.symbolColor || getColor(".reveal");
    var listItemActiveColor = options.symbolActiveColor || getColor(".controls");

    loadResource(path + "symbol-per-slide-progress.css", "stylesheet");

    initialize();

    function initialize() {
        var reveal = document.querySelector(".reveal");

        var div = document.createElement("div");
        div.className = "navigation " + position;

        var ul = document.createElement("ul");
        ul.className = "navigation-list";

        updateNavigation(ul);

        Reveal.addEventListener("slidechanged", function () {
            updateNavigation(ul);
        });

        div.appendChild(ul);
        reveal.appendChild(div);
    }

    // Check input if it is valid and return it
    function getStringOption(option, VALID_ELEMENTS) {
        if (typeof option === "string" && VALID_ELEMENTS.includes(option.toLowerCase())) {
            return option.toLowerCase();
        }
    }

    // Get a color of the theme
    function getColor(selectorValue) {
        var selector = document.querySelector(selectorValue),
            style = window.getComputedStyle(selector),
            color = style.getPropertyValue("color");

        return color;
    }

    function updateNavigation(ul) {
        var totalSlides = Reveal.getTotalSlides();

        // Reset all child element
        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }

        for (counter = 1; counter <= totalSlides; counter++) {
            var li = document.createElement("li");
            li.className = getClassName();

            if (Reveal.getSlidePastCount() + 1 === counter) {
                li.classList.add("active");
                li.style.color = listItemActiveColor;
            } else {
                li.style.color = symbolColor;
            }

            ul.appendChild(li);
        }
    };

    function getClassName() {
        if (align === "horizontal") {
            switch (position) {
                case "right":
                    return "navigation-list-element horizontal-right";
                case "left":
                default:
                    return "navigation-list-element horizontal-left";
            }
        }

        return "navigation-list-element";
    }

    // Modified from math plugin
    function loadResource(url, type, callback) {
        var head = document.querySelector("head");
        var resource;

        if (type === "script") {
            resource = document.createElement("script");
            resource.type = "text/javascript";
            resource.src = url;
        } else if (type === "stylesheet") {
            resource = document.createElement("link");
            resource.rel = "stylesheet";
            resource.href = url;
        }

        // Wrapper for callback to make sure it only fires once
        var finish = function () {
            if (typeof callback === "function") {
                callback.call();
                callback = null;
            }
        };

        resource.onload = finish;

        // IE
        resource.onreadystatechange = function () {
            if (this.readyState === "loaded") {
                finish();
            }
        };

        // Normal browsers
        head.appendChild(resource);
    }

    function scriptPath() {
        // obtain plugin path from the script element
        var path;
        if (document.currentScript) {
            path = document.currentScript.src.slice(0, -28);
        } else {
            var sel = document.querySelector('script[src$="symbol-per-slide-progress.js"]');
            if (sel) {
                path = sel.src.slice(0, -28);
            }
        }

        return path;
    }
})();
