import { BaseView } from "../base_view";
import { IWordPair } from "../lang_config";
import { GameWords } from "./game_view";

export class SummaryView extends BaseView  {
    public static static_type_name: string = 'SummaryView';
    public override readonly type_name: string = SummaryView.static_type_name;

    override readonly view: string = 'summary.html';

    override async show(words: GameWords[]): Promise<void> {
        this.show_summary(new GameSummary(words));
    }

    public show_summary(summary: IGameSummary): void {
        const success = document.getElementById('game-summary-success');
        const wrong = document.getElementById('game-summary-wrong');
        if (success)
            success.innerText = summary.correct_words.length.toString();
        if (wrong)
            wrong.innerText = summary.wrong_words.length.toString();

        let word_list = document.getElementById('game-summary-word-list');
        if (!word_list) return;

        while(word_list.firstChild && word_list?.lastChild) {
            word_list.removeChild(word_list.lastChild);
        }

        for(let i = 0; i < summary.wrong_words.length; i++) {
            word_list.appendChild(this.create_word_summary_element(summary.wrong_words[i]));
        }

        for(let i = 0; i < summary.correct_words.length; i++) {
            word_list.appendChild(this.create_word_summary_element(summary.correct_words[i]));
        }

        const game_summary = document.getElementById('game-summary');
        if (game_summary)
            game_summary.style.display = 'block';
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
}

export interface IGameWordSummary {
    word: IWordPair;
    guesses: string[];
    success: boolean;
    correct_guess: string|null;
}

export interface IGameSummary {
    correct_words: IGameWordSummary[];
    wrong_words: IGameWordSummary[];
}

class GameWordSummary implements IGameWordSummary {
    word: IWordPair;
    guesses: string[];
    success: boolean;
    correct_guess: string|null;
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
