// ==UserScript==
// @name         Jandan Fancy Viewer
// @namespace    https://windrunner.me/
// @version      0.2.0
// @description  Fancy Image Viewer for Jandan
// @author       Kane Blueriver
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.2.5/jquery.fancybox.min.js
// @resource     fancyboxCSS https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.2.5/jquery.fancybox.min.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @match        http*://*.jandan.net/*
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
/* jshint ignore:end */
    /* jshint esnext: false */
    /* jshint esversion: 6 */

    GM_addStyle(GM_getResourceText('fancyboxCSS'));

    const viewOrigImgLinks = document.querySelectorAll('.view_img_link');
    viewOrigImgLinks.forEach((link) => {
        const href = link.href;
        link.setAttribute('data-fancybox', href);
    });
    const config = {
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
    $('.commentlist .row .text a').fancybox(config);
/* jshint ignore:start */
]]></>).toString();
var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
eval(c.code);
/* jshint ignore:end */