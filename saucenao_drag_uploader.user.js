// ==UserScript==
// @name         SauceNAO Drag and Drop Uploader
// @namespace    https://windrunner.me/
// @version      0.1
// @description  Description
// @author       Kane Blueriver
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @match        http://saucenao.com/*
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
/* jshint ignore:end */
    /* jshint esnext: false */
    /* jshint esversion: 6 */

    const style = document.createElement('style');
    style.innerHTML = `
.drag-uploader {
  width: 400px;
  height: 300px;
  background-color: #e0f0fe;
  outline: 2px dashed #000;
  outline-offset: -4px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  right: 0;
  top: 20vh;
}

.drag-uploader.dragon {
  background-color: #fff;
}

.drag-uploader .text {
  color: #555;
}
.drag-uploader input {
    display: none;
}
    `;
    document.head.append(style);
    document.ondragover = function preventDefault(e) {
        e.preventDefault();
    };

    const dragUploader = document.createElement('form');
    dragUploader.className = 'drag-uploader';
    dragUploader.action = 'search.php';
    dragUploader.method = 'post';
    dragUploader.enctype = 'multipart/form-data';
    dragUploader.innerHTML = `<div class="text">Drag image here.</div>`;

    const input = document.createElement('input');
    input.name = 'file';
    input.type = 'file';

    dragUploader.append(input);
    dragUploader.ondragover = () => {
        dragUploader.classList.add('dragon');
    };
    dragUploader.ondrop = (ev) => {
        ev.preventDefault();
        const files = ev.dataTransfer.files;
        if (files.length < 1) { return; }
        input.files = files;
        dragUploader.submit();
    };
    dragUploader.onDragend = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
    };
    dragUploader.onDragstart = (ev) => {
        ev.preventDefault();
    };
    document.body.append(dragUploader);

/* jshint ignore:start */
]]></>).toString();
var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
eval(c.code);
/* jshint ignore:end */