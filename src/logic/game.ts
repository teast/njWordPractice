import { IWordPair } from '../lang_config'
import { IGuiGame } from '../gui/game'
import { IUIComponent } from '../ui_component';

export interface IGameWordSummary {
    word: IWordPair;
    guesses: string[];
    success: boolean;
    correct_guess: string;
}

export interface IGameSummary {
    correct_words: IGameWordSummary[];
    wrong_words: IGameWordSummary[];
}

class GameWordSummary implements IGameWordSummary {
    word: IWordPair;
    guesses: string[];
    success: boolean;
    correct_guess: string;
    constructor(word: GameWords) {
        this.word = word.get_word();
        this.success = word.is_success();
        this.guesses = word.get_guesses();
        this.correct_guess = word.correct_guess;
    }
}

class GameSummary implements IGameSummary {
    correct_words: IGameWordSummary[];
    wrong_words: IGameWordSummary[];

    constructor(words: GameWords[]) {
        this.correct_words = [];
        this.wrong_words = [];

        for(let i = 0; i < words.length; i++) {
            if (words[i].is_success())
                this.correct_words.push(new GameWordSummary(words[i]));
            else
                this.wrong_words.push(new GameWordSummary(words[i]));
        }
    }
}

export enum GameCrossroad {
    GoPickLanguage,
    GoPickWords,
    GoGame
};

export class GameWords {
    private readonly word: IWordPair;
    private guesses: string[];
    private correct: boolean;
    private readonly max_guesses: number;
    public picked: boolean;
    public correct_guess: string = null;

    constructor(word: IWordPair, max_guesses: number) {
        this.word = word;
        this.guesses = [];
        this.correct = false;
        this.max_guesses = max_guesses;
        this.picked = false;
    }

    public guess(guess_word: string): boolean {
        this.guesses.push(guess_word);

        let tguess = guess_word.trim().toLowerCase();

        if (tguess == this.word.target.trim().toLowerCase()) {
            this.correct = true;
            this.correct_guess = guess_word;
            return true;
        }

        let self = this;
        for(let i = 0; i < this.word.target_alternatives?.length ?? 0; i++) {
            const word = this.word.target_alternatives[i].trim().toLowerCase();
            if (word == tguess) {
                self.correct = true;
                this.correct_guess = guess_word;
                return true;
            }
        }

        return (this.guesses.length >= this.max_guesses);
    }

    public get_word(): IWordPair {
        return this.word;
    }

    get_guesses(): string[] {
        return this.guesses;
    }

    is_success(): boolean {
        return this.correct;
    }
}

export class WordGame implements IUIComponent {
    private _words: GameWords[];
    private _current: GameWords|null;
    private _game_done_callback: (crossroad: GameCrossroad) => void;
    private _gui: IGuiGame;

    constructor(gui: IGuiGame) {
        this._current = null;
        this._gui = gui;
        /*
        gui.bind_newgame(() => this.start());
        gui.bind_guess((word) => this.guess(word));
        gui.bind_next(() => this.next());
        gui.bind_summary(() => this.summary());
        */
    }
    hide(): void {
        this._gui.hide();
    }

    start_game(_words: IWordPair[], game_done: (crossroad: GameCrossroad) => void) {
        this._words = [];
        _words.forEach(word => this._words.push(new GameWords(word, 3)));
        this._game_done_callback = game_done;
        this._gui.newgame(() => game_done(GameCrossroad.GoGame), () => game_done(GameCrossroad.GoPickLanguage));

        this.show_next_word();
    }

    summary():IGameSummary {
        return new GameSummary(this._words);
    }

    private show_next_word() {
        let word = this.next();
        if (word == null) {
            this._gui.show_summary(this.summary());
        }
        else {
            this._gui.show_next_word(word, (guess) => this.handel_guess(guess));
        }
    }

    private handel_guess(guess: string): void {
        if (this._current == null) {
            return this.show_next_word();
        }

        let result = this._current.guess(guess);
        if (result) {
            if (this._current.is_success()) {
                this._gui.show_word_correct(() => this.show_next_word());
            }
            else {
                this._gui.show_word_wrong(() => this.show_next_word());
            }
        }
    }

    private next(): IWordPair|null {
        // TODO: Implement logic here. like an random picker
        for(let i = 0; i < this._words.length; i++) {
            if (!this._words[i].picked) {
                this._words[i].picked = true;
                this._current = this._words[i];
                return this._current.get_word();
            }
        }

        return null;
    }
}