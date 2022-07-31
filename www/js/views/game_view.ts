import { BaseObject, IBaseObject } from "../base_object";
import { BaseView } from "../base_view";
import { Ioc } from "../ioc";
import { IWordPair } from "../lang_config";
import { Routes } from "../routing";

export class GameView extends BaseView  {
    public static static_type_name: string = 'GameView';
    public override readonly type_name: string = GameView.static_type_name;

    override readonly view: string = 'game.html';

    override async show(words: IWordPair[]): Promise<void> {
        this._gui.show();
        this.start_game(words)

    }

    override async hide(): Promise<void> {
    }

    private _words: GameWords[];
    private _current: GameWords|null;
    private _gui: IGuiGame;

    constructor(ioc: Ioc) {
        super(ioc);

        this._current = null;
        this._gui = ioc.get<IGuiGame>(GuiGame.static_type_name);

    }

    start_game(_words: IWordPair[]) {
        this._words = [];
        _words.forEach(word => this._words.push(new GameWords(word, 3)));
        this._gui.newgame();

        this.show_next_word();
    }



    private show_next_word() {
        let word = this.next();
        if (word == null) {
            this.router.push_and_replace(Routes.Summary, this._words);
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


export interface IGuiGame extends IBaseObject {
    show_word_correct(callback: () => void): void;
    show_word_wrong(callback: () => void): void;
    newgame():void;
    show_next_word(word: IWordPair, callback: (guess:string) => void): void;
    show(): void;
}

export class GuiGame extends BaseObject implements IGuiGame {
    public static readonly static_type_name = "GuiGame";
    public override readonly type_name = GuiGame.static_type_name;

    private callback_guess: (guess: string) => void;
    private element_source_hint: HTMLElement;
    private element_source_lang: HTMLElement;
    private element_guess_input: HTMLInputElement;
    private is_started: boolean;

    constructor() {
        super();
        
        this.is_started = false;
    }

    show(): void {
        this.element_source_hint = document.getElementById('source-hint1');
        this.element_source_lang = document.getElementById('source-lang');
        this.element_guess_input = <HTMLInputElement>document.getElementById('guess-input');
        this.element_guess_input.addEventListener('keypress', (e) => this.handle_key_press(e));
    }

    handle_key_press(e: KeyboardEvent) {
        if (this.is_started != true) return;
        if (e.key != 'Enter') return;

        let word = this.element_guess_input.value;
        if (word == null || word == '') return;

        this.element_guess_input.value = '';
        this.callback_guess(word);
    }

    public newgame():void {
        this.is_started = true;
    }


    public show_word_correct(callback: () => void) {
        // TODO: implement show word was correct aniamtion
        callback();
    }

    public show_word_wrong(callback: () => void) {
        // TODO: implement show word was wrong aniamtion
        callback();
    }

    public show_next_word(word: IWordPair, callback: (guess: string) => void): void {
        this.callback_guess = callback;

        this.element_source_hint.textContent = word.source_hint1;
        this.element_source_lang.textContent = word.source;
        this.element_guess_input.value = '';
        this.element_guess_input.focus();
    }

    private escape_html_chars(s: string): string {
        return s
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;"); 
    }
}