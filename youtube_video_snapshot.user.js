// ==UserScript==
// @name         YouTube Video Snapshot
// @namespace    https://windrunner.me/
// @version      0.1.0
// @description  YouTube Video Snapshot
// @author       Kane Blueriver
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @match        https://*.youtube.com/*
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
/* jshint ignore:end */
    /* jshint esnext: false */
    /* jshint esversion: 6 */

    const captureVideo = function(video) {
        const scale = 1;
        var canvas = document.createElement("canvas");
        canvas.width = video.videoWidth * scale;
        canvas.height = video.videoHeight * scale;
        canvas.getContext('2d')
            .drawImage(video, 0, 0, canvas.width, canvas.height);
        var img = document.createElement("img");
        canvas.toBlob(downloadBlob);

    };
    const downloadBlob = (blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'screenshot.png');
        document.body.appendChild(link);
        link.click();
    };

    const captureBtn = document.createElement('button');
    captureBtn.innerText = 'Capture';
    captureBtn.style.position = 'fixed';
    captureBtn.style.right = '1rem';
    captureBtn.style.bottom = '1rem';
    captureBtn.style['z-index'] = 10;
    captureBtn.onclick = () => {
        const videoEl = document.querySelector('#movie_player > div.html5-video-container > video');
        captureVideo(videoEl);
    };
    document.body.append(captureBtn);

/* jshint ignore:start */
]]></>).toString();
var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
eval(c.code);
/* jshint ignore:end */