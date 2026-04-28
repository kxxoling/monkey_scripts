// ==UserScript==
// @name         X FixupX Replacement
// @namespace    https:/windrunner.me
// @version      1.0.0
// @description  Replace x.com with fixupx.com in post time link when post has multiple images or video
// @match        https://x.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const LOG = (...args) => console.log('[FixupX]', ...args);

  function getMediaCount(article) {
    return article.querySelectorAll('[data-testid="tweetPhoto"]').length;
  }

  function hasVideo(article) {
    return !!article.querySelector('[data-testid="videoPlayer"]');
  }

  function processArticle(article) {
    const timeLink = article.querySelector('time')?.closest('a');
    if (!timeLink) return;
    if (timeLink.dataset.fixupxDone) return;


    const mediaCount = getMediaCount(article);
    const isVideo = hasVideo(article);

    LOG('mediaCount:', mediaCount, 'isVideo:', isVideo, 'href:', timeLink.getAttribute('href'));

    if (mediaCount > 1 || isVideo) {
      const href = timeLink.getAttribute('href');
      if (href) {
        const newHref = 'https://fixupx.com' + href;
        timeLink.dataset.fixupxDone = '1';
        timeLink.setAttribute('href', newHref);
        timeLink.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          window.open(newHref, '_self');
        }, true);
        LOG('Replaced →', newHref);
      }
    }
  }

  function scan() {
    const articles = document.querySelectorAll('article[data-testid="tweet"]');
    LOG('Scan found', articles.length, 'articles');
    articles.forEach(processArticle);
  }

  const observer = new MutationObserver(() => {
    observer.disconnect();
    scan();
    observe();
  });

  function observe() {
    observer.observe(document.body, { childList: true, subtree: true });
  }

  LOG('Script loaded');
  scan();
  observe();
  setInterval(scan, 2500);
})();
