// ==UserScript==
// @name         Bilibili Snapshot
// @namespace    windrunner.me
// @version      0.7.0
// @description  Bilibili Snapshot
// @author       Kane Blueriver
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://www.bilibili.com/list/watchlater*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    // Material Design Camera Icon Path
    const ICON_CAMERA = "M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h4.05l1.83-2h4.25l1.83 2H20v12zM12 9c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3z";
    // 创建 SVG
    function createIcon(pathData) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('fill', 'currentColor');
        svg.appendChild(path);
        return svg;
    }
    // 获取文件名
    function getFilename() {
        const title = document.querySelector('h1.video-title')?.title
            || document.querySelector('h1.video-title')?.innerText
            || document.title
            || 'bilibili_screenshot';
        return title.replace(/[^a-z0-9\u4e00-\u9fa5]/gi, '_').trim() + '.png';
    }
    // 截图功能
    function captureScreenshot(withDanmaku = false) {
        const video = document.querySelector('video') || document.querySelector('bwp-video');
        if (!video) {
            console.warn('Bilibili Enhancer: Video element not found.');
            return;
        }
        try {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            // 1. 绘制视频底图
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            // 2. 如果需要弹幕，尝试寻找并绘制弹幕层
            if (withDanmaku) {
                // Bilibili 弹幕通常在 canvas 里
                const playerContainer = video.closest('.bpx-player-video-area') || video.parentNode;
                if (playerContainer) {
                    // 查找所有 canvas，排除我们自己可能创建的
                    const canvases = playerContainer.querySelectorAll('canvas');
                    canvases.forEach(dmCanvas => {
                        // 过滤规则: 分辨率匹配或者合理的弹幕层
                        // Bilibili 弹幕 canvas 可能是 2x 分辨率
                        if (dmCanvas.width > 0 && dmCanvas.height > 0) {
                            ctx.drawImage(dmCanvas, 0, 0, canvas.width, canvas.height);
                        }
                    });
                }
            }
            canvas.toBlob((blob) => {
                if (!blob) return;
                const link = document.createElement('a');
                // 文件名区分
                const filename = getFilename();
                const suffix = withDanmaku ? '_with_dm' : '';
                link.download = filename.replace('.png', `${suffix}.png`);
                link.href = URL.createObjectURL(blob);
                link.click();
                setTimeout(() => URL.revokeObjectURL(link.href), 100);
            }, 'image/png');
        } catch (e) {
            console.error('Bilibili Enhancer: Screenshot failed', e);
            alert('截图失败，可能是跨域限制。');
        }
    }
    // 添加截图按钮
    function addScreenshotButton() {
        const rightControls = document.querySelector('.bpx-player-control-bottom-right')
            || document.querySelector('.squirtle-controller .squirtle-controller-wrap-right'); // 稍后再看
        if (!rightControls || document.getElementById('b_enhance_shot')) return;
        // 查找插入点
        const refBtn = rightControls.querySelector('.bpx-player-ctrl-full')
            || rightControls.querySelector('[aria-label="全屏"]')
            || rightControls.querySelector('.squirtle-fullscreen-btn')
            || rightControls.querySelector('.bpx-player-ctrl-wide');
        // 创建按钮
        const btnContainer = document.createElement('div');
        btnContainer.id = 'b_enhance_shot';
        // 样式适配
        if (rightControls.className.includes('bpx')) {
            btnContainer.className = 'bpx-player-ctrl-btn bpx-player-ctrl-camera';
            btnContainer.style.marginRight = '10px';
        } else {
            // squirtle
            btnContainer.className = 'squirtle-video-quality squirtle-controller-btn';
            btnContainer.style.marginRight = '0px';
        }
        btnContainer.setAttribute('role', 'button');
        btnContainer.setAttribute('aria-label', '截图 (Shift+S: 无弹幕, Ctrl+Shift+S: 有弹幕)');
        btnContainer.title = '截图 (Shift+S: 无弹幕, Ctrl+Shift+S: 有弹幕)';
        btnContainer.style.display = 'flex';
        btnContainer.style.alignItems = 'center';
        btnContainer.style.justifyContent = 'center';
        btnContainer.style.cursor = 'pointer';
        const iconSvg = createIcon(ICON_CAMERA);
        iconSvg.style.width = '22px';
        iconSvg.style.height = '22px';
        iconSvg.style.fill = '#fff';
        btnContainer.appendChild(iconSvg);
        // 按钮点击默认无弹幕
        btnContainer.onclick = (e) => {
            // 如果按住ctrl点击，则带弹幕 (彩蛋功能)
            captureScreenshot(e.ctrlKey);
        };
        if (refBtn && (refBtn.parentNode === rightControls || refBtn.parentNode.parentNode === rightControls)) {
            refBtn.parentNode.insertBefore(btnContainer, refBtn);
        } else {
            rightControls.appendChild(btnContainer);
        }
    }
    // 初始化
    function init() {
        setInterval(() => {
            if (!document.getElementById('b_enhance_shot')) {
                addScreenshotButton();
            }
        }, 1000);
        // 快捷键监听
        window.addEventListener('keydown', (e) => {
            // 忽略输入框
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) || document.activeElement.isContentEditable) {
                return;
            }
            if (e.code === 'KeyS') {
                if (e.shiftKey && e.ctrlKey) {
                    // Ctrl + Shift + S: 带弹幕
                    e.stopPropagation();
                    e.preventDefault();
                    captureScreenshot(true);
                } else if (e.shiftKey) {
                    // Shift + S: 无弹幕
                    e.stopPropagation();
                    e.preventDefault();
                    captureScreenshot(false);
                }
            }
            // 移除了 Shift+C
        }, true);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
