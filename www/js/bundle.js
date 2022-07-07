(()=>{"use strict";var e={468:(e,t,n)=>{n.r(t)}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var i=t[r]={exports:{}};return e[r](i,i.exports,n),i.exports}n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e,t=function(e){this.word=e.get_word(),this.success=e.is_success(),this.guesses=e.get_guesses(),this.correct_guess=e.correct_guess},r=function(e){this.correct_words=[],this.wrong_words=[];for(var n=0;n<e.length;n++)e[n].is_success()?this.correct_words.push(new t(e[n])):this.wrong_words.push(new t(e[n]))};!function(e){e[e.GoPickLanguage=0]="GoPickLanguage",e[e.GoPickWords=1]="GoPickWords",e[e.GoGame=2]="GoGame"}(e||(e={}));var o=function(){function e(e,t){this.correct_guess=null,this.word=e,this.guesses=[],this.correct=!1,this.max_guesses=t,this.picked=!1}return e.prototype.guess=function(e){var t,n;this.guesses.push(e);var r=e.trim().toLowerCase();if(r==this.word.target.trim().toLowerCase())return this.correct=!0,this.correct_guess=e,!0;for(var o=0;null!==(n=o<(null===(t=this.word.target_alternatives)||void 0===t?void 0:t.length))&&void 0!==n&&n;o++)if(this.word.target_alternatives[o].trim().toLowerCase()==r)return this.correct=!0,this.correct_guess=e,!0;return this.guesses.length>=this.max_guesses},e.prototype.get_word=function(){return this.word},e.prototype.get_guesses=function(){return this.guesses},e.prototype.is_success=function(){return this.correct},e}(),i=function(){function t(e){this._current=null,this._gui=e}return t.prototype.hide=function(){this._gui.hide()},t.prototype.start_game=function(t,n){var r=this;this._words=[],t.forEach((function(e){return r._words.push(new o(e,3))})),this._game_done_callback=n,this._gui.newgame((function(){return n(e.GoGame)}),(function(){return n(e.GoPickLanguage)})),this.show_next_word()},t.prototype.summary=function(){return new r(this._words)},t.prototype.show_next_word=function(){var e=this,t=this.next();null==t?this._gui.show_summary(this.summary()):this._gui.show_next_word(t,(function(t){return e.handel_guess(t)}))},t.prototype.handel_guess=function(e){var t=this;if(null==this._current)return this.show_next_word();this._current.guess(e)&&(this._current.is_success()?this._gui.show_word_correct((function(){return t.show_next_word()})):this._gui.show_word_wrong((function(){return t.show_next_word()})))},t.prototype.next=function(){for(var e=0;e<this._words.length;e++)if(!this._words[e].picked)return this._words[e].picked=!0,this._current=this._words[e],this._current.get_word();return null},t}(),a=function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function a(e){try{c(r.next(e))}catch(e){i(e)}}function s(e){try{c(r.throw(e))}catch(e){i(e)}}function c(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,s)}c((r=r.apply(e,t||[])).next())}))},s=function(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function s(i){return function(s){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=t.call(e,a)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,s])}}},c=function(){function t(e,t,n){var r=this;this._have_init=!1,this._langauge=null,this._words=[],this._langChooser=e,this._wordChooser=t,this._game=n,this._wordChooser.bind_event_go_back((function(){return a(r,void 0,void 0,(function(){return s(this,(function(e){switch(e.label){case 0:return[4,this._show_pick_language()];case 1:return e.sent(),[2]}}))}))}))}return t.prototype.start_game=function(){return a(this,void 0,void 0,(function(){return s(this,(function(e){switch(e.label){case 0:return this._init(),[4,this._show_pick_language()];case 1:return e.sent(),[2]}}))}))},t.prototype._show_pick_language=function(){return a(this,void 0,void 0,(function(){var e=this;return s(this,(function(t){switch(t.label){case 0:return this._wordChooser.hide(),this._game.hide(),[4,this._langChooser.show_and_pick_language((function(t){e._langauge=t,e._show_pick_words()}))];case 1:return t.sent(),[2]}}))}))},t.prototype._show_pick_words=function(){var e=this;this._langChooser.hide(),this._game.hide(),this._wordChooser.show_and_pick_words(this._langauge,(function(t){e._words=t,e._show_game()}))},t.prototype._show_game=function(){this._langChooser.hide(),this._wordChooser.hide();var e=this;this._game.start_game(this._words,(function(t){return setTimeout((function(){return e._handle_game_done(t)}))}))},t.prototype._handle_game_done=function(t){switch(t){case e.GoGame:return this._show_game();case e.GoPickLanguage:return this._show_pick_language();case e.GoPickWords:return this._show_pick_words()}},t.prototype._init=function(){this._have_init||(this._have_init=!0)},t}(),u=function(){function e(){var e=this;this._callback_retry=null,this._callback_choose_new_words=null,this.is_started=!1,this.element_source_hint=document.getElementById("source-hint1"),this.element_source_lang=document.getElementById("source-lang"),this.element_guess_input=document.getElementById("guess-input"),this.element_guess_input.addEventListener("keypress",(function(t){return e.handle_key_press(t)})),document.getElementById("game-summary-btn-retry").onclick=function(t){return e.handle_btn_retry(t)},document.getElementById("game-summary-btn-start").onclick=function(t){return e.handle_btn_goto_start(t)}}return e.prototype.hide=function(){document.getElementById("game-summary").style.display="none",document.getElementById("game-board").style.display="none"},e.prototype.handle_btn_goto_start=function(e){null!=this._callback_choose_new_words&&this._callback_retry()},e.prototype.handle_btn_retry=function(e){null!=this._callback_retry&&this._callback_retry()},e.prototype.handle_key_press=function(e){if(1==this.is_started&&"Enter"==e.key){var t=this.element_guess_input.value;null!=t&&""!=t&&(this.element_guess_input.value="",this.callback_guess(t))}},e.prototype.newgame=function(e,t){this._callback_retry=e,this._callback_choose_new_words=t,document.getElementById("game-summary").style.display="none",this.is_started=!0,document.getElementById("game-board").style.display="block"},e.prototype.show_summary=function(e){this.is_started=!1,document.getElementById("game-board").style.display="none",document.getElementById("game-summary-success").innerText=e.correct_words.length.toString(),document.getElementById("game-summary-wrong").innerText=e.wrong_words.length.toString();for(var t=document.getElementById("game-summary-word-list");t.firstChild;)t.removeChild(t.lastChild);for(var n=0;n<e.wrong_words.length;n++)t.appendChild(this.create_word_summary_element(e.wrong_words[n]));for(n=0;n<e.correct_words.length;n++)t.appendChild(this.create_word_summary_element(e.correct_words[n]));document.getElementById("game-summary").style.display="block"},e.prototype.create_word_summary_element=function(e){var t=document.createElement("div");t.className="level summary-"+(e.success?"correct":"wrong");var n=document.createElement("div");n.className="level-item has-text-centered";var r=this._build_word_card(e.word.source,e.word.source_hint1);n.appendChild(r);var o=this._build_word_card(e.word.target,"Expected");n.appendChild(r),t.appendChild(n),(n=document.createElement("div")).className="level-item has-text-centered",n.appendChild(o),t.appendChild(n),(n=document.createElement("div")).className="level-item has-text-centered";for(var i=document.createElement("div"),a=0;a<e.guesses.length;a++){var s=document.createElement("span");s.innerText=e.guesses[a],e.guesses[a]==e.correct_guess?s.className="summary-word-guess success-guess":s.className="summary-word-guess",i.appendChild(s)}return n.appendChild(i),t.appendChild(n),t},e.prototype._build_word_card=function(e,t){var n=document.createElement("div");if(n.className="word-card",(null==t?void 0:t.length)>0){var r=document.createElement("p");r.className="heading",r.innerText=t,n.appendChild(r)}var o=document.createElement("p");return o.className="title",o.innerText=e,n.appendChild(o),n},e.prototype.show_word_correct=function(e){e()},e.prototype.show_word_wrong=function(e){e()},e.prototype.show_next_word=function(e,t){this.callback_guess=t,this.element_source_hint.textContent=e.source_hint1,this.element_source_lang.textContent=e.source,this.element_guess_input.value="",this.element_guess_input.focus()},e.prototype.escape_html_chars=function(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")},e}(),l=function(){function e(e){this._lang=e,this.source=this._lang.source,this.target=this._lang.target}return e.prototype.get_config=function(){return this._lang},e}(),d=function(){function e(e,t){this._languages=[],this._gui=e,this._reader=t}return e.prototype.hide=function(){this._gui.hide()},e.prototype.show_and_pick_language=function(e){return t=this,n=void 0,o=function(){var t,n,r=this;return function(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function s(i){return function(s){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=t.call(e,a)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,s])}}}(this,(function(o){switch(o.label){case 0:return this._callback_language_picked=e,[4,this._reader.Load("dummy")];case 1:return t=o.sent(),n=new l(t),this._languages=[n],this._gui.bind_language_picked((function(e){return r._handle_language_picked(e)})),this._gui.display_languages(this._languages),[2]}}))},new((r=void 0)||(r=Promise))((function(e,i){function a(e){try{c(o.next(e))}catch(e){i(e)}}function s(e){try{c(o.throw(e))}catch(e){i(e)}}function c(t){var n;t.done?e(t.value):(n=t.value,n instanceof r?n:new r((function(e){e(n)}))).then(a,s)}c((o=o.apply(t,n||[])).next())}));var t,n,r,o},e.prototype._handle_language_picked=function(e){e<0||e>this._languages.length||this._callback_language_picked(this._languages[e])},e}(),_=function(){function e(){var e=document.getElementById("game-choose-language-tbody"),t=this;e.addEventListener("click",(function(e){return t._handle_click(e)}))}return e.prototype.hide=function(){document.getElementById("game-choose-language").style.display="none"},e.prototype.bind_language_picked=function(e){this._callback_language_picked=e},e.prototype.display_languages=function(e){for(var t=document.getElementById("game-choose-language-tbody");t.firstChild;)t.removeChild(t.lastChild);for(var n=0;n<e.length;n++){var r=this.build_language_row(e[n],n);t.appendChild(r)}document.getElementById("game-choose-language").style.display="block"},e.prototype._handle_click=function(e){for(var t=e.target;t&&"TR"!=t.tagName;)t=t.parentElement;if(null!=t){var n=parseInt(t.getAttribute("data-id"));isNaN(n)||null==n||this._callback_language_picked(n)}},e.prototype.build_language_row=function(e,t){var n=document.createElement("tr");n.setAttribute("data-id",t.toString());var r=document.createElement("td");return r.innerText=e.source,n.appendChild(r),(r=document.createElement("td")).innerText=e.target,n.appendChild(r),n},e}(),h=function(){function e(e){var t=this;this._callback_go_back=null,this._gui=e,this._gui.bind_event_go_back((function(){null!=t._callback_go_back&&t._callback_go_back()}))}return e.prototype.bind_event_go_back=function(e){this._callback_go_back=e},e.prototype.hide=function(){this._gui.hide()},e.prototype.show_and_pick_words=function(e,t){var n=this;this._callback_words_picked=t,this._language=e.get_config(),this._gui.bind_words_picked((function(e){return n._handle_words_picked(e)})),this._gui.display_words(this._language)},e.prototype._handle_words_picked=function(e){var t=[];for(var n in e)for(var r=0;r<e[n].length;r++){var o=e[n][r];t.push(this._language.groups[n].words[o])}this._callback_words_picked(t)},e}(),p=function(){function e(){}return e.prototype.Load=function(e){return t=this,n=void 0,o=function(){var e;return function(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function s(i){return function(s){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=t.call(e,a)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,s])}}}(this,(function(t){switch(t.label){case 0:return[4,fetch("japanese.json")];case 1:return[4,t.sent().text()];case 2:return e=t.sent(),[2,JSON.parse(e)]}}))},new((r=void 0)||(r=Promise))((function(e,i){function a(e){try{c(o.next(e))}catch(e){i(e)}}function s(e){try{c(o.throw(e))}catch(e){i(e)}}function c(t){var n;t.done?e(t.value):(n=t.value,n instanceof r?n:new r((function(e){e(n)}))).then(a,s)}c((o=o.apply(t,n||[])).next())}));var t,n,r,o},e}(),g=function(){function e(){var e=this;this._callback_words_picked=null,document.getElementById("game-choose-words-tbody").addEventListener("click",(function(t){return e._handle_click(t)}))}return e.prototype._handle_click=function(e){var t=e.target;if("INPUT"==t.tagName)return this._input_clicked(t);for(var n=t.parentElement;n;){if("TR"==n.tagName){var r=n.querySelector("input");if(null!=r)return r.checked=!r.checked,this._input_clicked(r)}n=n.parentElement}},e.prototype._input_clicked=function(e){for(var t=e.parentElement;t&&"TR"!=t.tagName;)t=t.parentElement;if("TR"==t.tagName)return t.classList.contains("word-group")?this._handle_group_checkbox_clicked(e,t):this._update_group_checkbox_from_row_clicked(e,t);console.error("Could not find parent tr of checkbox for word selection")},e.prototype._handle_group_checkbox_clicked=function(e,t){for(var n=t.getAttribute("data-id"),r=document.getElementById("game-choose-words-tbody"),o=e.checked,i=r.querySelectorAll('tr[data-group-id="'+n+'"] input[type="checkbox"]'),a=0;a<i.length;a++)i[a].checked=o},e.prototype._update_group_checkbox_from_row_clicked=function(e,t){var n=t.getAttribute("data-group-id"),r=document.getElementById("game-choose-words-tbody"),o=r.querySelector('tr[data-id="'+n+'"].word-group');if(null!=o){for(var i=!0,a=r.querySelectorAll('tr[data-group-id="'+n+'"] input[type="checkbox"]'),s=0;s<a.length&&(i=i&&a[s].checked);s++);o.querySelector('input[type="checkbox"]').checked=i}else console.error("could not find word group")},e.prototype.hide=function(){var e=this;document.getElementById("game-choose-words").style.display="none",document.getElementById("game-choose-words-btn-back").onclick=function(t){return e._handle_go_back(t)},document.getElementById("game-choose-words-btn-start").onclick=function(t){return e._handle_start(t)}},e.prototype.bind_event_go_back=function(e){this._callback_go_back=e},e.prototype.bind_words_picked=function(e){this._callback_words_picked=e},e.prototype.display_words=function(e){for(var t=document.getElementById("game-choose-words-tbody");t.firstChild;)t.removeChild(t.lastChild);for(var n=0;n<e.groups.length;n++)this._build_word_group(e.groups[n],n).forEach((function(e){return t.appendChild(e)}));document.getElementById("game-choose-words").style.display="block"},e.prototype._build_word_group=function(e,t){var n=[],r=document.createElement("tr");r.setAttribute("data-id",t.toString()),r.className="word-group";var o=this._build_td_with_checkbox(e.name,"",!0);o.colSpan=3,r.appendChild(o),n.push(r);for(var i=0;i<e.words.length;i++){var a=document.createElement("tr");a.className="word-row",a.setAttribute("data-id",i.toString()),a.setAttribute("data-group-id",t.toString()),a.appendChild(this._build_empty_td(5)),a.appendChild(this._build_td_with_checkbox(e.words[i].source,e.words[i].source_hint1,!0)),a.appendChild(this._build_td_with_checkbox(e.words[i].target,"",!1)),n.push(a)}return n},e.prototype._build_empty_td=function(e){var t=document.createElement("td");return t.style.width=e.toString()+"px",t},e.prototype._build_td_with_checkbox=function(e,t,n){var r=document.createElement("td");if(n){var o=document.createElement("input");o.type="checkbox",r.appendChild(o)}var i=document.createElement("span");return i.innerText=e,(null==t?void 0:t.length)>0&&(i.innerText+=" ("+t+")"),r.appendChild(i),r},e.prototype._handle_start=function(e){if(null!=this._callback_words_picked){for(var t=[],n=document.getElementById("game-choose-words-tbody").querySelectorAll('tr.word-row input[type="checkbox"]:checked'),r=0;r<n.length;r++){var o=this._get_parent_element(n[r],"tr");if(null!=o){var i=parseInt(o.getAttribute("data-group-id")),a=parseInt(o.getAttribute("data-id"));null==i||isNaN(i)||null==a||isNaN(a)||(null==t[i]&&(t[i]=[]),t[i].push(a))}}this._callback_words_picked(t)}},e.prototype._get_parent_element=function(e,t){for(var n=e.parentElement,r=t.toUpperCase();n;){if(n.tagName==r)return n;n=n.parentElement}return null},e.prototype._handle_go_back=function(e){null!=this._callback_go_back&&this._callback_go_back()},e}();n(468),new c(new d(new _,new p),new h(new g),new i(new u)).start_game()})()})();
//# sourceMappingURL=bundle.js.map