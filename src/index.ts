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

let lang_chooser = new LangChooser(new LangChooserGui(), new LangReader());
let word_chooser = new WordChooser(new WordChooserGui());
let game = new WordGame(new GuiGame());
let orchestra = new GameOrchestra(lang_chooser, word_chooser, game);

orchestra.start_game();