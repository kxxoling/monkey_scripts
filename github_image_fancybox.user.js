// ==UserScript==
// @name         GitHub Image FancyBox
// @namespace    https://windrunner.me/
// @version      0.3.1
// @description  GitHub Image FancyBox
// @author       Kane Blueriver
// @match        https://github.com/*
// @match        https://gist.github.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.js
// @resource     fancyBoxCSS https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// ==/UserScript==

(function($) {
    'use strict';

    GM_addStyle(GM_getResourceText('fancyBoxCSS'));

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
        if (parent.href === $el.src
            || $el.src.replace('raw', 'blob') === parent.href
            || parent.href===$el.dataset.canonicalSrc) {
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