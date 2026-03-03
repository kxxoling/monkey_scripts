// ==UserScript==
// @name         GitHub Image FancyBox
// @namespace    https://windrunner.me/
// @version      1.0.0
// @description  GitHub Image FancyBox
// @author       Kane Blueriver
// @match        https://github.com/*
// @match        https://gist.github.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js
// @resource     fancyBoxCSS https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function($) {
    'use strict';

    GM_addStyle(GM_getResourceText('fancyBoxCSS'));

    var config = {
        Carousel: {
            Navigation: false
        },
        Toolbar: {
            display: {
                left: ["infobar"],
                middle: [],
                right: ["slideshow", "fullscreen", "thumbs", "download", "zoom", "close"]
            }
        }
    };

    var handleClick = function(e) {
        e.preventDefault();
        e.stopPropagation();

        var target = e.currentTarget;
        var items = [];
        var startIndex = 0;

        $('[data-fancybox="gallery"]').each(function(i, a) {
            items.push({ src: a.href, type: 'image' });
            if (a === target) {
                startIndex = i;
            }
        });

        var instanceConfig = Object.assign({}, config, { startIndex: startIndex });
        Fancybox.show(items, instanceConfig);
    };

    var fancify = function(index, el) {
        if (!el || el.dataset.fancyboxProcessed) return;

        var parent = el.parentNode;
        var tagName = parent.tagName ? parent.tagName.toLowerCase() : '';

        if (tagName === 'a') {
            if (parent.href === el.src
                || el.src.replace('raw', 'blob') === parent.href
                || parent.href === el.dataset.canonicalSrc) {
                parent.setAttribute('href', el.src);
                parent.setAttribute('data-fancybox', 'gallery');
                el.dataset.fancyboxProcessed = "true";
                parent.addEventListener('click', handleClick);
            }
        }
        else if (tagName === 'p' || tagName === 'div') {
            var $a = $('<a href="'+ el.src +'" data-fancybox="gallery"></a>');
            $a.on('click', handleClick);
            $(el).wrap($a);
            el.dataset.fancyboxProcessed = "true";
        }
    };

    var processImages = function() {
        var selectors = [
            '#readme article img',
            'tbody a > img',
            '#wiki-body img',
            '.markdown-body img'
        ].join(', ');

        $(selectors).not('[data-fancybox-processed]').each(fancify);
    };

    var init = function() {
        processImages();
    };

    // Ensure the script triggers only after the page has loaded
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }

    // Fix unstable loading issues (SPA navigation)
    document.addEventListener('turbo:load', init);
    document.addEventListener('pjax:end', init);

    // Performance optimization: debounce MutationObserver
    var debounceTimer;
    var observer = new MutationObserver(function(mutations) {
        var shouldProcess = false;
        for (var i = 0; i < mutations.length; i++) {
            if (mutations[i].addedNodes.length > 0) {
                shouldProcess = true;
                break;
            }
        }
        if (shouldProcess) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(processImages, 300);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})(jQuery);
