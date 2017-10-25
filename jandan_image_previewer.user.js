// ==UserScript==
// @name         Jandan Image Previewer
// @namespace    https://windrunner.me/
// @version      0.1.3
// @description  Full screen previewer
// @author       Kane Blueriver
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @match        http*://*.jandan.net/*
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
/* jshint ignore:end */
    /* jshint esnext: false */
    /* jshint esversion: 6 */

    // Your code here...
    const style = document.createElement('style');
    style.innerHTML = `
      .full-screen-previewer {
        height: 100vh;
        width: 100vw;
        position: fixed;
        left: 0;
        top: 0;
        background: rgba(0, 0, 0, 0.6);
        display: none;
        z-index: 310;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
      .full-screen-previewer.active {
        display: flex;
      }
      .full-screen-previewer img {
        max-height: 90%;
        max-width: 90%;
      }
      .full-screen-previewer .downloader {
        position: fixed;
        right: 1rem;
        bottom: 1rem;
        color: white;
      }
    `;
    document.querySelector('head').append(style);
    document.querySelector('body').insertAdjacentHTML('beforeend', '<div class="full-screen-previewer"><img class="" src=""><a class="downloader" href="" download>Download!</></div>');
    const fullScreenContainer = document.querySelector('.full-screen-previewer');
    const fullScreenImage = fullScreenContainer.querySelector('img');
    const downloader = fullScreenContainer.querySelector('a');
    fullScreenContainer.onclick = () => {fullScreenContainer.classList.remove('active');};

    const viewOrigImgLinks = document.querySelectorAll('.view_img_link');
    viewOrigImgLinks.forEach((link) => {
        const href = link.href;
        link.onclick = (ev) => {
            ev.preventDefault();
            fullScreenImage.setAttribute('src', href);
            downloader.setAttribute('href', href);
            fullScreenContainer.classList.add('active');
        };
    });
/* jshint ignore:start */
]]></>).toString();
var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
eval(c.code);
/* jshint ignore:end */