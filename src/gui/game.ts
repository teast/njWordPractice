import { IGameSummary, IGameWordSummary } from "../logic/game";
import { IWordPair } from "../lang_config";

export interface IGuiGame {
    show_word_correct(callback: () => void): void;
    show_word_wrong(callback: () => void): void;
    //bind_newgame(callback: () => void):void;
    //bind_guess(callback: (guess:string) => boolean):void;
    //bind_summary(callback: () => IGameSummary): void;
    //bind_next(callback: () => IWordPair|null):void;
    newgame(retry: () => void, choose_new_words: () => void):void;
    show_next_word(word: IWordPair, callback: (guess:string) => void): void;
    show_summary(summary: IGameSummary): void;
    hide(): void;
}

export class GuiGame implements IGuiGame {
    private callback_guess: (guess: string) => void;
    private element_source_hint: HTMLElement;
    private element_source_lang: HTMLElement;
    private element_guess_input: HTMLInputElement;
    private is_started: boolean;
    private _callback_retry: () => void = null;
    private _callback_choose_new_words: () => void = null;

    constructor() {
        this.is_started = false;
        this.element_source_hint = document.getElementById('source-hint1');
        this.element_source_lang = document.getElementById('source-lang');
        this.element_guess_input = <HTMLInputElement>document.getElementById('guess-input');
        this.element_guess_input.addEventListener('keypress', (e) => this.handle_key_press(e));
        (<HTMLInputElement>document.getElementById('game-summary-btn-retry')).onclick = (e) => this.handle_btn_retry(e);
        (<HTMLInputElement>document.getElementById('game-summary-btn-start')).onclick = (e) => this.handle_btn_goto_start(e);
    }

    hide(): void {
        document.getElementById('game-summary').style.display = 'none';
        document.getElementById('game-board').style.display = 'none';
    }

    handle_btn_goto_start(e: MouseEvent): any {
        if (this._callback_choose_new_words != null) this._callback_retry();
    }

    handle_btn_retry(e: MouseEvent) {
        if (this._callback_retry != null) this._callback_retry();
    }

    handle_key_press(e: KeyboardEvent) {
        if (this.is_started != true) return;
        if (e.key != 'Enter') return;

        let word = this.element_guess_input.value;
        if (word == null || word == '') return;

        this.element_guess_input.value = '';
        this.callback_guess(word);
    }

    public newgame(retry: () => void, choose_new_words: () => void):void {
        this._callback_retry = retry
        this._callback_choose_new_words = choose_new_words;
        
        document.getElementById('game-summary').style.display = 'none';
        this.is_started = true;
        document.getElementById('game-board').style.display = 'block';
    }

    public show_summary(summary: IGameSummary): void {
        this.is_started = false;
        document.getElementById('game-board').style.display = 'none';

        document.getElementById('game-summary-success').innerText = summary.correct_words.length.toString();
        document.getElementById('game-summary-wrong').innerText = summary.wrong_words.length.toString();

        let word_list = document.getElementById('game-summary-word-list');
        while(word_list.firstChild) {
            word_list.removeChild(word_list.lastChild);
        }

        for(let i = 0; i < summary.wrong_words.length; i++) {
            word_list.appendChild(this.create_word_summary_element(summary.wrong_words[i]));
        }

        for(let i = 0; i < summary.correct_words.length; i++) {
            word_list.appendChild(this.create_word_summary_element(summary.correct_words[i]));
        }

        document.getElementById('game-summary').style.display = 'block';
    }

    create_word_summary_element(word: IGameWordSummary): HTMLElement {
        let outer = <HTMLDivElement>document.createElement('div');
        outer.className = 'flex-container flex-between summary-' + (word.success ? 'correct' : 'wrong');
            let center = <HTMLDivElement>document.createElement('div');
            center.className = 'flex-container flex-center has-text-centered';
            const card = this._build_word_card(word.word.source, word.word.source_hint1);
            center.appendChild(card);
            const expected = this._build_word_card(word.word.target, 'Expected');
            center.appendChild(card);
        outer.appendChild(center);
            center = <HTMLDivElement>document.createElement('div');
            center.className = 'flex-container flex-center has-text-centered';
            center.appendChild(expected);
        outer.appendChild(center);
            center = <HTMLDivElement>document.createElement('div');
            center.className = 'flex-container flex-center has-text-centered';
            const inner_center = document.createElement('div');
            for(let i = 0; i < word.guesses.length; i++) {
                const span = document.createElement('span');
                span.innerText = word.guesses[i];
                if (word.guesses[i] == word.correct_guess) {
                    span.className = 'summary-word-guess success-guess';
                }
                else {
                    span.className = 'summary-word-guess';
                }

                inner_center.appendChild(span);
            }
            center.appendChild(inner_center)
        outer.appendChild(center);

        return outer;
    }

    private _build_word_card(word: string, hint: string): HTMLDivElement {
        let card = <HTMLDivElement>document.createElement('div');
        card.className = 'word-card';
        if (hint?.length > 0) {
                let heading = <HTMLParagraphElement>document.createElement('p');
                heading.className = "heading";
                heading.innerText = hint;
            card.appendChild(heading);
        }
            let title = <HTMLParagraphElement>document.createElement('p');
            title.className = "title";
            title.innerText = word;
        card.appendChild(title);
        return card;
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