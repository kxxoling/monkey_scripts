// ==UserScript==
// @name         Jandan Slideshow
// @namespace    https://windrunner.me/
// @version      0.1.2
// @description  Slideshow for Jandan images.
// @author       Kane Blueriver
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @match        https://jandan.net/*
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
/* jshint ignore:end */
    /* jshint esnext: false */
    /* jshint esversion: 6 */

    const style = document.createElement('style');
    style.innerHTML = `
.slide-container {
  display: none;
  width: 100%;
  height: 100%;
  position: fixed;
  box-sizing: border-box;
  margin: 0;
  top: 0;
  padding 5rem;
  background: rgba(0 ,0, 0, 0.6);
  z-index: 320;
}

.slide-display-container {
  width: 100%;
  height: 88%;
  justify-content: center;
  align-items: center;
  display: flex;
}
.slide-image {
  display: flex;
}

.slide-indicators {
  width: auto;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  padding: 0 1rem;
  overflow-x: scroll;
  white-space: nowrap;
}

.indicator-col {
  height: 10vh;
  width: auto;
  display: inline-block;
  padding: 0 0.6rem;
  cursor: pointer;
}

.indicator-image {
  width: auto;
  height: 100%;
}

.toggle-slide {
  z-index: 400;
  position: fixed;
  right: 1rem;
  top: 1rem;
  background-color: #9BD6DB;
  border-color: transparent;
  border-radius: 100px;
  color: #fff;
  font-size: 14px;
  line-height: 20px;
  padding: 6px 16px;
  text-align: center;
  white-space: nowrap;
  font-weight: bold;
  cursor: pointer;
}

.to {
  cursor: pointer;
  width: 40vw;
  height: 100%;
  position: absolute;
}
.to-left {
  left: 0;
}
.to-right {
  right: 0;
}
    `;
    document.head.append(style);

    const images = [...document.querySelectorAll('.commentlist > li .text img')].map(image => image.src);
    const slideContainer = document.createElement('div');
    slideContainer.className = 'slide-container';
    const slideIndicatorContainer = document.createElement('div');
    slideIndicatorContainer.className = 'slide-indicators';
    images.map((image, index) => {
        const el = document.createElement('div');
        el.className = 'indicator-col';
        el.innerHTML = `<img class="indicator-image" src="${image}">`;
        el.onclick = () => { showIndex(index); };
        slideIndicatorContainer.append(el);
    });

    slideContainer.innerHTML = '<div class="slide-display-container">' +
        images.map((image) => `<img class="slide-image" src="${image}" style="display: none">`).join('') +
        '</div>';
    slideContainer.append(slideIndicatorContainer);

    let currentScrollIndex;
    function showIndex(scrollIndex) {
        const slideImages = slideContainer.querySelectorAll('.slide-image');
        slideImages.forEach((image, index) => {
            if (index === scrollIndex) { image.style.display = 'flex'; }
            else { image.style.display = 'none'; }
        });
        currentScrollIndex = scrollIndex;
    }

    const toggleSlideBtn = document.createElement('button');
    toggleSlideBtn.className = 'toggle-slide';
    toggleSlideBtn.innerText = 'Toggle Slide';
    toggleSlideBtn.onclick = () => {
        if (slideContainer.style.display === 'none') {
            slideContainer.style.display = 'block';
        } else {
            slideContainer.style.display = 'none';
        }
    };

    const toLeft = document.createElement('div');
    const toRight = document.createElement('div');
    toLeft.className = 'to-left to';
    toRight.className = 'to-right to';
    toLeft.onclick = () => {
        if (currentScrollIndex) {
            showIndex(currentScrollIndex - 1);
        } else {
        }
    };
    toRight.onclick = () => {
        if (currentScrollIndex < images.length - 1) {
            showIndex(currentScrollIndex + 1);
        } else {
        }
    };
    const slideDisplayContainer = slideContainer.querySelector('.slide-display-container');
    slideDisplayContainer.append(toLeft);
    slideDisplayContainer.append(toRight);
    document.body.append(slideContainer);
    document.body.append(toggleSlideBtn);
    showIndex(0);

/* jshint ignore:start */
]]></>).toString();
var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
eval(c.code);
/* jshint ignore:end */