//require('./mystyle.scss');
import { LangReader } from './lang_reader';
import { Routing } from './routing';
import { Ioc } from './ioc';
import { InitView } from './views/init_view';
import { LangChooserGui, PickLanguageView } from './views/pick_language_view';
import { PickWordsView, WordChooserGui } from './views/pick_words_view';
import { GameView, GuiGame } from './views/game_view';
import { SummaryView } from './views/summary_view';
import { Storage } from './storage';
import { TopBar } from './gui/top_bar';
import { BottomBar } from './gui/botton_bar';
import { DialogView } from './views/dialog_view';
/*
let reader = new LangReader();
let langs = reader.Load('dummy');

let gui = new GuiGame();
let game = new WordGame(langs.groups[0].words, gui);
gui.start();
*/

// BEGIN of JS-handler for dark theme check
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
toggleDarkTheme(prefersDark.matches);
// Listen for changes to the prefers-color-scheme media query
prefersDark.addEventListener('change', (mediaQuery) => toggleDarkTheme(mediaQuery.matches));
// Add or remove the "dark" class based on if the media query matches
function toggleDarkTheme(shouldAdd: boolean) {
  console.log('going to toggle dark on body', shouldAdd);
  //alert('going to toggle dark: ' + shouldAdd);
  document.body.classList.toggle('dark', shouldAdd);
}
// END OF js-handler for dark theme check

// Checkbox handler
document.body.addEventListener('click', (e) => {
  const checkbox = <HTMLElement>e.target;

  if (checkbox.classList.contains('checkbox')) {
    e.stopPropagation();
    
    if (checkbox.getAttribute('checked') == undefined)
      checkbox.setAttribute('checked', '');
    else
      checkbox.removeAttribute('checked');
  }
});

// Expander handler
document.body.addEventListener('click', (e) => {
  var el = <HTMLElement|null>e.target;

  while (el != null) {
    if (el.classList.contains('checkbox')) {
      el = null;
      break;
    }

    if (el.classList.contains('expander-content')) {
      el = null;
      break;
    }

    if (el.classList.contains('expander-inner')) break;
    el = el.parentElement;
  }

  if (el == null) {
    return;
  }

  if (el.classList.contains('expander-inner')) {
    e.stopPropagation();
    const p = el.parentElement;
    if (p != null) {
      if (p.classList.contains('expanded')) {
        p.classList.remove('expanded');
      }
      else {
        p.classList.add('expanded');
      }
    }
  }
});


const storage = new Storage();
const ioc = new Ioc();

ioc.bind_singleton(storage);

const routing = new Routing(ioc);

ioc.bind_singleton(new LangReader());
ioc.bind_singleton(new LangChooserGui(ioc));
ioc.bind_singleton(new WordChooserGui());
ioc.bind_singleton(new GuiGame());

ioc.bind_singleton(routing);
const top_bar = new TopBar(ioc);
ioc.bind_singleton(top_bar);
ioc.bind_singleton(new BottomBar());

const init = new InitView(ioc);
const language = new PickLanguageView(ioc);
const words = new PickWordsView(ioc);
const game_view = new GameView(ioc);
const summary = new SummaryView(ioc);
const dialog = new DialogView(ioc);

ioc.bind_singleton(init);
ioc.bind_singleton(language);
ioc.bind_singleton(words);
ioc.bind_singleton(game_view);
ioc.bind_singleton(summary);
ioc.bind_singleton(dialog);

top_bar.init();
routing.init().then(() => init.init_done());

// Get all "navbar-burger" elements
var $navbarBurgers = <Array<HTMLElement>>Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

// Check if there are any navbar burgers
if ($navbarBurgers.length > 0) {

  // Add a click event on each of them
  $navbarBurgers.forEach(($el) => {
    $el.addEventListener('click', function() {

      // Get the target from the "data-target" attribute
      var target = $el.dataset.target;
      if (target == undefined) return;
      var $target = document.getElementById(target);
      if ($target == null) return;
      
      // Toggle the class on both the "navbar-burger" and the "navbar-menu"
      $el.classList.toggle('is-active');
      $target.classList.toggle('is-active');

    });
  });
}
