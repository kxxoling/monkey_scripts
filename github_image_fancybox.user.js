// ==UserScript==
// @name         GitHub Image FancyBox
// @namespace    https://windrunner.me/
// @version      0.3.0
// @description  GitHub Image FancyBox
// @author       Kane Blueriver
// @match        https://github.com/*
// @match        https://gist.github.com/*
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.2.5/jquery.fancybox.min.js
// @resource     customCSS https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.2.5/jquery.fancybox.min.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// ==/UserScript==

(function($) {
    'use strict';

    var newCSS = GM_getResourceText('customCSS');
    GM_addStyle(newCSS);

    var config = {
        arrows: false,
        buttons: [
            'slideShow',
            'fullScreen',
            'thumbs',
            'download',
            'zoom',
            'close'
        ],
    };

    var fancify = function(index, $el) {
        var parent = $el.parentNode;
        if (parent.href === $el.src || $el.src.replace('raw', 'blob') === parent.href) {
            parent.setAttribute('href', $el.src);
            $(parent).fancybox(config);
        }
        if (parent.tagName.toLowerCase() === 'p') {
            parent.innerHTML = '<a href="'+ $el.src +'"><img src="'+ $el.src + '"></a>'
            $(parent.querySelector('a')).fancybox(config);
        }
    }

    $.each($('#readme article a img'), fancify); // README pages
    $.each($('tbody a > img'), fancify); // issue pages
    $.each($('#wiki-body img'), fancify); // wiki pages
})($);