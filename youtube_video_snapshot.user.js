// ==UserScript==
// @name         YouTube Video Snapshot
// @namespace    windrunner.me
// @version      0.3.1
// @description  YouTube Video Snapshot
// @author       Kane Blueriver
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// ==/UserScript==


window.insertSnapButton = function() {
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
        const title = document.title;
        link.setAttribute('download', `${title}.png`);
        document.body.appendChild(link);
        link.click();
    };

    const captureBtn = document.createElement('button');
    captureBtn.setAttribute('title', 'Click or press F12 to a snapshot of the video');
    captureBtn.innerText = 'Capture';
    captureBtn.style.position = 'fixed';
    captureBtn.style.right = '1rem';
    captureBtn.style.bottom = '1rem';
    captureBtn.style.cursor = 'pointer';
    captureBtn.style['z-index'] = 10;
    function capture() {
        const videoEl = document.querySelector('#movie_player > div.html5-video-container > video');
        captureVideo(videoEl);
    }
    captureBtn.onclick = capture;
    document.body.append(captureBtn);

    const keyF12 = 123;
    document.addEventListener('keydown', (event) => {
        if(event.keyCode === keyF12) {
            capture();
        }
    });
};

window.insertSnapButton();

