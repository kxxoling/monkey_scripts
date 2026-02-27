// ==UserScript==
// @name         Copy Clean URL
// @namespace    windrunner.me
// @version      0.2.0
// @description  Cmd+Shift+C to copy clean URL for Bilibili, Taobao, Tmall, JD
// @author       Kane Blueriver
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';
    // Toast logic
    function showToast(message) {
        let toast = document.createElement('div');
        toast.textContent = message;
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '10px 20px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            borderRadius: '5px',
            zIndex: '99999',
            fontFamily: 'sans-serif',
            fontSize: '14px',
            pointerEvents: 'none',
            transition: 'opacity 0.5s',
            opacity: '1'
        });
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 2000);
    }
    function copyToClipboard(text) {
        if (typeof GM_setClipboard !== 'undefined') {
            GM_setClipboard(text, 'text');
            showToast(`Copied: ${text}`);
        } else {
            navigator.clipboard.writeText(text).then(() => {
                showToast(`Copied: ${text}`);
            }).catch(err => {
                showToast('Failed to copy');
                console.error('Failed to copy: ', err);
            });
        }
    }
    function getCleanUrl() {
        const url = new URL(window.location.href);
        const hostname = url.hostname;
        // Bilibili
        if (hostname.includes('bilibili.com')) {
            // Case 1: Video page standard /video/BV...
            const bvMatch = url.pathname.match(/\/video\/(BV[a-zA-Z0-9]+)/);
            if (bvMatch) {
                return `https://www.bilibili.com/video/${bvMatch[1]}`;
            }
            // Case 2: Watch Later or Playlist with bvid param
            const bvid = url.searchParams.get('bvid');
            if (bvid) {
                return `https://www.bilibili.com/video/${bvid}`;
            }
        }
        // Taobao
        if (hostname.includes('taobao.com')) {
            const id = url.searchParams.get('id');
            if (id) {
                return `https://item.taobao.com/item.htm?id=${id}`;
            }
        }
        // Tmall
        if (hostname.includes('tmall.com')) {
            const id = url.searchParams.get('id');
            if (id) {
                return `https://detail.tmall.com/item.htm?id=${id}`;
            }
        }
        // JD
        if (hostname.includes('jd.com')) {
            // Usually item.jd.com/123456.html
            // Just strip all params
            if (url.pathname.match(/\.html$/)) {
                return `${url.origin}${url.pathname}`;
            }
        }
        // Default or Fallback: Cleaned URL without current params if we customized,
        // but for generic sites we probably just want the full href?
        // User request: "copy website url" generally implies the full URL,
        // but user specifically requested cleaning for the above sites.
        // For others, let's keep it simple and just do href.
        return window.location.href;
    }
    document.addEventListener('keydown', function(e) {
        // Cmd+Shift+C (Mac) or Ctrl+Shift+C (Windows/Linux)
        // e.metaKey is Cmd, e.ctrlKey is Ctrl
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.code === 'KeyC')) {
            e.preventDefault();
            const cleanUrl = getCleanUrl();
            copyToClipboard(cleanUrl);
        }
    });
})();
