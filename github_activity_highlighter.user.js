// ==UserScript==
// @name         GitHub Activity Highlighter
// @namespace    https://windrunner.me/
// @version      0.1.1
// @description  Highlight GitHub activities.
// @author       You
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @match        https://github.com/$
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
/* jshint ignore:end */
    /* jshint esnext: false */
    /* jshint esversion: 6 */

    const styleEle = document.createElement('style');

    // Colored by https://material.io/guidelines/style/color.html#color-color-palette
    const currentAccount = document.querySelector('.news .select-menu .js-select-button').innerText;

    styleEle.innerHTML = `
      .container { width: 1200px; }
      .news .watch_started, .news .member_add, .news .fork, .news .create, .news .issues_comment {
        padding: 0 1rem;
      }
      .news .d-flex {
        border: none !important;
      }
      .news .flex-dl {
        border: none !important;
      }
      .news .watch_started {
        color: black;
        background: #FFF59D;
      }
      .news .member_add {
        color: black;
        background: #9FA8DA;
      }
      .news .create {
        color: black;
        background: #66BB6A;
      }
      .news .fork {
        color: white;
        background: #81D4FA;
      }
      .news .issues_comment {
        background: #EF9A9A;
      }

      .news .octicon.octicon-star {
        color: white;
      }
      .news .octicon.octicon-git-branch {
        color: white;
      }
      .news .octicon.octicon-person {
        color: white;
      }
      .news .octicon.octicon-repo {
        color: white;
      }
      .news .octicon.octicon-comment-discussion {
        color: white;
      }

      .news a[href^="/${currentAccount}/"] {
        background: #616161;
        color: white !important;
        padding: 4px 8px;
        line-height: 23px;
      }
    `;
    document.querySelector('html > head').append(styleEle);
/* jshint ignore:start */
]]></>).toString();
var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
eval(c.code);
/* jshint ignore:end */