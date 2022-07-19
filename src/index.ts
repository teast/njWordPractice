require('./mystyle.scss');
import { WordGame } from './logic/game';
import { GameOrchestra } from './game_orchestra';
import { GuiGame } from './gui/game';
import { LangChooser } from './logic/lang_chooser';
import { LangChooserGui } from './gui/lang_chooser';
import { WordChooser } from './logic/word_chooser';
import { LangReader } from './lang_reader';
import { WordChooserGui } from './gui/word_chooser';
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
  var el = <HTMLElement>e.target;

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
    if (p.classList.contains('expanded')) {
      p.classList.remove('expanded');
    }
    else {
      p.classList.add('expanded');
    }
  }
});

let lang_chooser = new LangChooser(new LangChooserGui(), new LangReader());
let word_chooser = new WordChooser(new WordChooserGui());
let game = new WordGame(new GuiGame());
let orchestra = new GameOrchestra(lang_chooser, word_chooser, game);

orchestra.start_game();

// Get all "navbar-burger" elements
var $navbarBurgers = <Array<HTMLElement>>Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

// Check if there are any navbar burgers
if ($navbarBurgers.length > 0) {

  // Add a click event on each of them
  $navbarBurgers.forEach(($el) => {
    $el.addEventListener('click', function() {

      // Get the target from the "data-target" attribute
      var target = $el.dataset.target;
      var $target = document.getElementById(target);

      // Toggle the class on both the "navbar-burger" and the "navbar-menu"
      $el.classList.toggle('is-active');
      $target.classList.toggle('is-active');

    });
  });
}
