// ==UserScript==
// @name         GitHub nbviewer
// @namespace    https://windrunner.me/
// @version      0.1
// @description  Jump to nbviewer
// @author       Kane Blueriver
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @match        https://*.github.com/*.ipynb
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
/* jshint ignore:end */
    /* jshint esnext: false */
    /* jshint esversion: 6 */
    // Your code here...
    const path = location.pathname;
    const jupyter_href = `http://nbviewer.jupyter.org/github${path}`;

    const nbviewer_btn = document.createElement('a');
    nbviewer_btn.setAttribute('href', jupyter_href);
    nbviewer_btn.setAttribute('class', 'btn btn-sm BtnGroup-item');
    nbviewer_btn.innerText = 'Open in nbviewer';
    nbviewer_btn.style.cssText = `
      color: yellow;
      background: red;
    `;

    const fileBtnGroup = document.getElementsByClassName('file-actions')[0].getElementsByClassName('BtnGroup')[0];
    fileBtnGroup.prepend(nbviewer_btn);

/* jshint ignore:start */
]]></>).toString();
var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
eval(c.code);
/* jshint ignore:end */