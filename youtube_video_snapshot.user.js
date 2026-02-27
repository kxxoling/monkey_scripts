// ==UserScript==
// @name         YouTube Video Snapshot
// @namespace    windrunner.me
// @version      1.0.0
// @description  YouTube Video Snapshot
// @author       Kane Blueriver
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// ==/UserScript==

(function () {
    'use strict';
    function createCameraIcon() {
        // 这里使用 createElementNS 是为了避免使用 innerHTML 报错 TrustedHTML
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('height', '24px');
        svg.setAttribute('version', '1.1');
        svg.setAttribute('viewBox', '0 0 24 24'); // Standard Material Design viewBox
        svg.setAttribute('width', '24px');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z');
        path.setAttribute('d', 'M14.12,4l1.83,2H20v12H4V6h4.05l1.83-2H14.12 M15,2H9L7.17,4H4C2.9,4,2,4.9,2,6v12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V6c0-1.1-0.9-2-2-2h-3.17L15,2L15,2z M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7L12,7z');
        path.setAttribute('fill', '#fff');
        svg.appendChild(path);
        return svg;
    }
    // 获取文件名
    function getFilename() {
        const title = document.querySelector('h1.ytd-video-primary-info-renderer')?.innerText || 'youtube_screenshot';
        // 文件名清理
        return title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.png';
    }
    // 执行截图
    function captureScreenshot() {
        const video = document.querySelector('video.video-stream');
        if (!video) return;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        // 绘制视频帧
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // 只有在字幕开启时才捕获字幕 (检查 DOM 中是否存在字幕片段)
        const subtitleSegments = document.querySelectorAll('.ytp-caption-segment');
        if (subtitleSegments.length > 0) {
            let fullText = '';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            // 根据视频高度缩放字体大小 (约 4%)
            const fontSize = Math.round(canvas.height * 0.04);
            ctx.font = `bold ${fontSize}px Arial, sans-serif`;
            ctx.fillStyle = 'white';
            ctx.shadowColor = 'black';
            ctx.shadowBlur = 4;
            ctx.lineWidth = 4;
            ctx.strokeStyle = 'black';
            // 收集字幕文本
            const lines = [];
            subtitleSegments.forEach(seg => {
                // 检查片段是否可见
                if (seg.innerText) {
                    lines.push(seg.innerText);
                }
            });
            fullText = lines.join(' ');
            if (fullText) {
                // 字幕位置：底部居中，留出 10% 边距
                let y = canvas.height - (canvas.height * 0.1);
                ctx.strokeText(fullText, canvas.width / 2, y);
                ctx.fillText(fullText, canvas.width / 2, y);
                console.log('Captured Subtitle:', fullText);
            }
        }
        // 触发下载
        canvas.toBlob((blob) => {
            const link = document.createElement('a');
            link.download = getFilename();
            link.href = URL.createObjectURL(blob);
            link.click();
            // 清理
            setTimeout(() => URL.revokeObjectURL(link.href), 100);
        }, 'image/png');
    }
    // 初始化
    function init() {
        // 使用 MutationObserver 处理 SPA 导航
        const observer = new MutationObserver((mutations) => {
            if (!document.querySelector('#yt-screenshot-btn')) {
                addControl();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        addControl();
        // 快捷键: Shift+S
        document.addEventListener('keydown', (e) => {
            if (e.shiftKey && e.code === 'KeyS') {
                captureScreenshot();
            }
        });
    }
    // 添加控制按钮
    function addControl() {
        const controls = document.querySelector('.ytp-right-controls');
        if (!controls || document.getElementById('yt-screenshot-btn')) return;
        const btn = document.createElement('button');
        btn.id = 'yt-screenshot-btn';
        btn.className = 'ytp-button';
        btn.appendChild(createCameraIcon()); // 使用 appendChild 代替 innerHTML
        btn.title = 'Screenshot (Shift+S)';
        btn.onclick = captureScreenshot;
        // 插入到全屏按钮之前
        const fullscreenBtn = controls.querySelector('.ytp-fullscreen-button');
        if (fullscreenBtn && fullscreenBtn.parentNode) {
            fullscreenBtn.parentNode.insertBefore(btn, fullscreenBtn);
        } else {
            controls.prepend(btn);
        }
    }
    // 运行脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
