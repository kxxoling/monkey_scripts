// ==UserScript==
// @name         Twitter Image Downloader
// @namespace    https://windrunner.me/
// @version      0.1.1
// @description  Twitter Image Downloader
// @author       Kane Blueriver
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @match        https://*twitter.com/*
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
/* jshint ignore:end */
    /* jshint esnext: false */
    /* jshint esversion: 6 */

    // Your code here...
    function downloadImages(ev) {
        ev.preventDefault();
        const tweet = document.querySelector('.permalink .permalink-tweet-container .tweet');
        const tweetText = tweet.querySelector('.js-tweet-text-container').innerText;
        const tweetImages = tweet.querySelectorAll('.AdaptiveMedia-photoContainer img');
        tweetImages.forEach((img) => {
            const pk = location.href.split('/').pop();
            const username = location.href.split('/')[3];
            const orig_src = img.src + ':orig';
            fetch(orig_src).then((rsp) => rsp.blob()).then((blob)=> {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.setAttribute('download', `[${username}]_${pk}_${tweetText.substring(0, 20)}_${img.src.split('/media/')[1].split(':large')[0]}`);
                document.body.appendChild(link);
                link.click();
                console.log(`Downloading ${orig_src} as ${link.download}`);
            });
        });
    }
    const downloadBtn = document.createElement('a');
    downloadBtn.innerText = 'Download';
    downloadBtn.className = 'EdgeButton EdgeButton--primary EdgeButton--medium';
    downloadBtn.style = 'z-index: 100000; postion: fixed; right: 3rem; bottom: 1rem; position: fixed; cursor: pointer';
    downloadBtn.onclick = downloadImages;
    document.body.appendChild(downloadBtn);
/* jshint ignore:start */
]]></>).toString();
var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
eval(c.code);
/* jshint ignore:end */