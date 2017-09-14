// ==UserScript==
// @name         Hacker News Shaper
// @namespace    https://windrunner.me/
// @version      0.1
// @description  Multi Hacker News Enhancement
// @author       Kane Blueriver
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @match        https://news.ycombinator.com/*
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
/* jshint ignore:end */
    /* jshint esnext: false */
    /* jshint esversion: 6 */

    // Your code here...
    const menuItems = [
		['/classic','Classic','classic'],
		['/best','Highest voted recent links','best'],
		['/active','Most active current discussions','active'],
		['/bestcomments','Highest voted recent comments','best comments'],
		['/ask','Questions, polls, and self posts','ask HN'],
		// ['/offers','HN members offering their help and services','offers'],
		['/noobstories','Submissions from new accounts','noob stories'],
		['/noobcomments','Comments from new accounts','noob comments']
	];

    const style = document.createElement('style');
    style.innerHTML = `
    .pagetop {
      display: inline-block;
      position: relative;
    }
    .pagetop:hover .extended-menu {
       display: inline-block;
    }
    .extended-menu {
      display: none;
      position: absolute;
      background: #ff6600;
      margin: 0;
      line-height: 1.6rem;
      padding: 0.6rem 1.2rem;
      list-style-type: none;
      right: 0;
    }
    font {
      padding-right: 1rem;
    }
    font::after {
      position: absolute;
      top: 0.2rem;
      content: '';
      width: 0;
      height: 0;
      border-width: 10px 5px 0;
      border-style: solid;
      border-color: black transparent transparent;
    }
    `;
    document.head.append(style);

    const container = document.querySelector('.pagetop');
    const menuEl = document.createElement('ul');
    menuEl.className = 'extended-menu';
    menuEl.innerHTML = menuItems.map((item) => {
        const [path, deco, text] = item;
        return `<li><a href=${path} title=${deco}>${text}</a></li>`;
    }).join('');
    container.append(menuEl);

/* jshint ignore:start */
]]></>).toString();
var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
eval(c.code);
/* jshint ignore:end */