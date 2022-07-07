import { GameCrossroad, WordGame } from "./logic/game";
import { IWordPair } from "./lang_config";
import { ILanguagePick, LangChooser } from "./logic/lang_chooser";
import { WordChooser } from "./logic/word_chooser";

export class GameOrchestra {
    private _langChooser: LangChooser;
    private _wordChooser: WordChooser;
    private _game: WordGame;
    private _have_init = false;
    private _langauge: ILanguagePick = null;
    private _words: IWordPair[] = [];

    constructor(langChooser: LangChooser, wordChooser: WordChooser, game: WordGame) {
        this._langChooser = langChooser;
        this._wordChooser = wordChooser;
        this._game = game;

        this._wordChooser.bind_event_go_back(async () => {
            await this._show_pick_language();
        });
    }


    public async start_game(): Promise<void> {
        this._init();
        await this._show_pick_language();
    }

    private async _show_pick_language(): Promise<void> {
        this._wordChooser.hide();
        this._game.hide();
        await this._langChooser.show_and_pick_language((language: ILanguagePick) => {
            this._langauge = language;
            this._show_pick_words();
        });
    }

    private _show_pick_words() {
        this._langChooser.hide();
        this._game.hide();
        this._wordChooser.show_and_pick_words(this._langauge, (words: IWordPair[]) => {
            this._words = words;
            this._show_game();
        });
    }

    private _show_game() {
        this._langChooser.hide();
        this._wordChooser.hide();
        const self = this;
        this._game.start_game(this._words, (crossroad) => setTimeout(() => self._handle_game_done(crossroad)));
    }

    private _handle_game_done(cross_road: GameCrossroad) {
        switch(cross_road) {
            case GameCrossroad.GoGame:
                return this._show_game();
            case GameCrossroad.GoPickLanguage:
                return this._show_pick_language();
            case GameCrossroad.GoPickWords:
                return this._show_pick_words();
        }
    }

    private _init() {
        if (this._have_init) return;

        this._have_init = true;
    }
}