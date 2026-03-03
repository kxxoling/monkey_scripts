// ==UserScript==
// @name         Jellyfin Video Snapshot
// @namespace    https://windrunner.me/
// @version      0.3.0
// @description  Jellyfin Video Snapshot
// @author       Kane Blueriver
// @match        https://*/*
// @match        http://*/*
// @icon         https://www.google.com/s2/favicons?domain=jellyfin.org
// ==/UserScript==

(function() {
    'use strict';

    function createCameraIcon() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('height', '24px');
        svg.setAttribute('version', '1.1');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('width', '24px');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M14.12,4l1.83,2H20v12H4V6h4.05l1.83-2H14.12 M15,2H9L7.17,4H4C2.9,4,2,4.9,2,6v12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V6c0-1.1-0.9-2-2-2h-3.17L15,2L15,2z M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7L12,7z');
        path.setAttribute('fill', 'currentColor');
        svg.appendChild(path);
        return svg;
    }

    const captureVideo = function(video) {
        if (!video) return;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            // Allow Chinese characters, word characters, spaces, and hyphens
            const title = document.title.replace(/[^\u4e00-\u9fa5\w\s-]/gi, '_').trim() || 'jellyfin_screenshot';
            link.setAttribute('download', `${title}.png`);
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
            }, 100);
        }, 'image/png');
    };

    function addControl() {
        if (document.querySelector('.jf-screenshot-btn')) return;

        // Try to find the active OSD page (the one without 'hide' class)
        const activeOsd = Array.from(document.querySelectorAll('#videoOsdPage')).find(osd => !osd.classList.contains('hide'));
        if (!activeOsd) return;

        const fullscreenBtn = activeOsd.querySelector('.btnFullscreen, button[data-action="toggleFullscreen"], button[title*="ullscreen"]');
        if (!fullscreenBtn || !fullscreenBtn.parentNode) return;

        const container = fullscreenBtn.parentNode;

        const captureBtn = document.createElement('button');
        captureBtn.setAttribute('is', 'paper-icon-button-light');

        let baseClass = fullscreenBtn.className.replace('btnFullscreen', '').replace('hide', '').trim();
        if (!baseClass.includes('paper-icon-button-light')) {
            baseClass += ' paper-icon-button-light autoSize';
        }
        captureBtn.className = 'jf-screenshot-btn ' + baseClass;
        captureBtn.setAttribute('title', 'Screenshot (F8/Shift+S)');

        const iconSpan = document.createElement('span');
        iconSpan.className = 'xlargePaperIconButton material-icons';
        iconSpan.setAttribute('aria-hidden', 'true');

        const svg = createCameraIcon();
        svg.style.width = '100%';
        svg.style.height = '100%';
        iconSpan.appendChild(svg);

        captureBtn.appendChild(iconSpan);
        captureBtn.onclick = capture;

        container.insertBefore(captureBtn, fullscreenBtn);
    }

    function capture() {
        const videoEl = document.querySelector('.htmlvideoplayer') || document.querySelector('video');
        if (videoEl) {
            captureVideo(videoEl);
        } else {
            console.log('No video element found to capture');
        }
    }

    function init() {
        // Observe body for video element additions/removals to dynamically show/hide button
        const observer = new MutationObserver(() => {
            if (document.querySelector('video')) {
                addControl();
            } else {
                document.querySelectorAll('.jf-screenshot-btn, .jf-screenshot-btn-fixed').forEach(el => el.remove());
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // Initial check
        if (document.querySelector('video')) {
            addControl();
        }

        const keyF8 = 119;
        document.addEventListener('keydown', (event) => {
            if(event.keyCode === keyF8 || (event.shiftKey && (event.code === 'KeyS' || event.keyCode === 83))) {
                capture();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
