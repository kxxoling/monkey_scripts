// ==UserScript==
// @name         Dota2 Heroes Select2 ES5
// @namespace    https://windrunner.me/
// @version      0.1.1
// @description  A jQuery Select2 extended Dota2 heroes select menu
// @author       Kane Blueriver
// @match        https://steamcommunity.com/market/search*appid=570*
// @require      https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/js/select2.min.js
// @resource     select2Css https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/css/select2.min.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(GM_getResourceText('select2Css'));

    (function($) {
        var advancedOptions = document.querySelector('.market_search_advanced_button');
        advancedOptions.addEventListener('click', function() {
            setTimeout(function() {
                var heroSelect = document.querySelector('select[name="category_570_Hero[]"]');
                console.log(advancedOptions, heroSelect);
                $(heroSelect).select2();
            }, 300);
        });
    })(jQuery);
})();