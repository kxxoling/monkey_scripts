// ==UserScript==
// @name         Jandan Mucking Terminator
// @namespace    https://windrunner.me/
// @version      0.1.3
// @description  划水终结者
// @author       Kane Blueriver
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @match        http*://jandan.net/*
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
/* jshint ignore:end */
    /* jshint esnext: false */
    /* jshint esversion: 6 */

    function string62to10(number_code) {
        number_code = String(number_code);
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
            radix = chars.length,
            len = number_code.length,
            i = 0,
            origin_number = 0;
        while (i < len) {
            origin_number += Math.pow(radix, i++) * chars.indexOf(number_code.charAt(len - i) || 0);
        }
        return origin_number;
    }
    function decode(url) {
        var lastIndexOfSlash = url.lastIndexOf('/');
        var number = url.substr(lastIndexOfSlash + 1, 8);
        if (number.startsWith('00')) {
            return string62to10(number);
        } else {
            return parseInt(number, 16);
        }
    }

    const style = document.createElement('style');
    style.innerHTML = `
      .weibo-frame {
        width: 600px;
        height: 400px;
        position: absolute;
        top: 0;
        left: 0;
      }
      .weibo-frame html {
        overflow: hidden !important;
      }
      .view-uploader {
        position: relative;
      }
    `;
    document.head.append(style);

    const viewOrigImgLinks = document.querySelectorAll('.view_img_link');
    viewOrigImgLinks.forEach((link) => {
        const id = decode(link.href);
        const weiboLink = `//weibo.com/${id}`;
        const viewUploader = document.createElement('a');

        viewUploader.innerHTML = ' [View Uploader]';
        viewUploader.setAttribute('href', weiboLink);
        viewUploader.setAttribute('target', '_blank');
        viewUploader.className = 'view-uploader';
        viewUploader.title = 'Click to view the uploader.';
        link.after(viewUploader);
        let hasIframe = false;
        const weiboIframe = document.createElement('iframe');
        weiboIframe.setAttribute('src', `//weibo.com/${id}`); // m.weibo.com is blocked since cross-origin iframe
        weiboIframe.className = 'weibo-frame';
        viewUploader.onclick = (ev) => {
            ev.preventDefault();
            if (!hasIframe) {
                viewUploader.append(weiboIframe);
            }
            hasIframe = true;
        };
        viewUploader.onmouseleave = () => {
            if (hasIframe) {
                weiboIframe.remove();
            }
            hasIframe = 0;
        };
    });

/* jshint ignore:start */
]]></>).toString();
var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
eval(c.code);
/* jshint ignore:end */