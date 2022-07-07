import { ILangConfig, IWordGroup } from "../lang_config";

export interface IWordChooserGui {
    hide(): void;
    bind_words_picked(callback: (dictionary: {[group_id: number]: number[]}) => void): void;
    display_words(language: ILangConfig): void;
    bind_event_go_back(callback: () => void): void;
}

export class WordChooserGui implements IWordChooserGui {
    private _callback_words_picked: (dictionary: {[group_id: number]: number[]}) => void = null;
    private _callback_go_back: () => void;
    
    constructor() {
        const self = this;
        document.getElementById('game-choose-words-tbody').addEventListener('click', (ev) => this._handle_click(ev));
    }
    private _handle_click(ev: MouseEvent): any {
        const target = <HTMLElement>ev.target;
        if (target.tagName == 'INPUT') {
            return this._input_clicked(<HTMLInputElement>target);
        }

        let t = target.parentElement;
        while(t) {
            if (t.tagName == 'TR') {
                const input = t.querySelector('input');
                if (input != null) {
                    input.checked = !input.checked;
                    return this._input_clicked(input);
                }
            }

            t = t.parentElement;
        }
    }

    private _input_clicked(input: HTMLInputElement): void {
        let tr = input.parentElement;
        while(tr) {
            if (tr.tagName == 'TR') break;
            tr = tr.parentElement;
        }

        if (tr.tagName != 'TR') {
            console.error('Could not find parent tr of checkbox for word selection');
            return;
        }

        if (tr.classList.contains('word-group')) {
            return this._handle_group_checkbox_clicked(input, <HTMLTableRowElement>tr);
        }

        return this._update_group_checkbox_from_row_clicked(input, <HTMLTableRowElement>tr);
    }

    private _handle_group_checkbox_clicked(input: HTMLInputElement, group_tr: HTMLTableRowElement) {
        const id = group_tr.getAttribute('data-id');
        let tbody = document.getElementById('game-choose-words-tbody');
        const checked = input.checked;

        const all_inputs = tbody.querySelectorAll('tr[data-group-id="' + id + '"] input[type="checkbox"]');
        for(let i = 0; i < all_inputs.length; i++) {
            (<HTMLInputElement>all_inputs[i]).checked = checked;
        }
    }

    private _update_group_checkbox_from_row_clicked(input: HTMLInputElement, word_tr: HTMLTableRowElement) {
        const group_id = word_tr.getAttribute('data-group-id');
        let tbody = document.getElementById('game-choose-words-tbody');
        const group_tr = tbody.querySelector('tr[data-id="' + group_id + '"].word-group');
        if (group_tr == null) {
            console.error("could not find word group");
            return;
        }

        let all_checked = true;
        const all_inputs = tbody.querySelectorAll('tr[data-group-id="' + group_id + '"] input[type="checkbox"]');
        for(let i = 0; i < all_inputs.length; i++) {
            all_checked = all_checked && (<HTMLInputElement>all_inputs[i]).checked;
            if (!all_checked) break;
        }

        (<HTMLInputElement>group_tr.querySelector('input[type="checkbox"]')).checked = all_checked;
    }

    public hide(): void {
        document.getElementById('game-choose-words').style.display = 'none';
        document.getElementById('game-choose-words-btn-back').onclick = (e) => this._handle_go_back(e);
        document.getElementById('game-choose-words-btn-start').onclick = (e) => this._handle_start(e);
    }

    public bind_event_go_back(callback: () => void)
    {
        this._callback_go_back = callback;
    }

    public bind_words_picked(callback: (dictionary: {[group_id: number]: number[]}) => void): void {
        this._callback_words_picked = callback;
    }

    public display_words(language: ILangConfig): void {
        let tbody = document.getElementById('game-choose-words-tbody');
        while(tbody.firstChild) {
            tbody.removeChild(tbody.lastChild);
        }

        for(let i = 0; i < language.groups.length; i++) {
            this._build_word_group(language.groups[i], i).forEach(tr => tbody.appendChild(tr));
        }

        document.getElementById('game-choose-words').style.display = 'block';
    }

    private _build_word_group(group: IWordGroup, index: number): HTMLElement[] {
        const all_trs = [];
        const tr_group = document.createElement('tr');
        tr_group.setAttribute('data-id', index.toString());
        tr_group.className = 'word-group';
        const td = this._build_td_with_checkbox(group.name, '', true);
        td.colSpan = 3;
        tr_group.appendChild(td);
        all_trs.push(tr_group);

        for(let i = 0; i < group.words.length; i++) {
            const tr_word = document.createElement('tr');
            tr_word.className = 'word-row';
            tr_word.setAttribute('data-id', i.toString());
            tr_word.setAttribute('data-group-id', index.toString());
            tr_word.appendChild(this._build_empty_td(5));
            tr_word.appendChild(this._build_td_with_checkbox(group.words[i].source, group.words[i].source_hint1, true));
            tr_word.appendChild(this._build_td_with_checkbox(group.words[i].target, '', false));
            all_trs.push(tr_word);
        }

        return all_trs;
    }

    private _build_empty_td(width: number): HTMLTableCellElement {
        const td = document.createElement('td');
        td.style.width = width.toString() + "px";
        return td;
    }

    private _build_td_with_checkbox(text: string, hint: string, with_checkbox: boolean): HTMLTableCellElement {
        const td = document.createElement('td');
        if (with_checkbox) {
            const input = document.createElement('input');
            input.type = 'checkbox';
            td.appendChild(input);
        }
        const span = document.createElement('span');

        span.innerText = text;
        if (hint?.length > 0) {
            span.innerText += ' (' + hint + ')';
        }

        td.appendChild(span);

        return td;
    }

    private _handle_start(e: MouseEvent): any {
        if (this._callback_words_picked == null) return;

        const tbody = document.getElementById('game-choose-words-tbody');
        const response: { [group_id: number]: number[] } = [];

        const all_inputs = tbody.querySelectorAll('tr.word-row input[type="checkbox"]:checked');
        for(let i = 0; i < all_inputs.length; i++) {
            const tr = this._get_parent_element(<HTMLElement>all_inputs[i], 'tr');
            if (tr == null) continue;

            const group_id = parseInt(tr.getAttribute('data-group-id'));
            const id = parseInt(tr.getAttribute('data-id'));
            if (group_id == null || isNaN(group_id) || id == null || isNaN(id)) continue;

            if (response[group_id] == null) response[group_id] = [];

            response[group_id].push(id);
        }

        this._callback_words_picked(response);
    }

    private _get_parent_element(e: HTMLElement, name: string): HTMLElement|null {
        let t = e.parentElement;
        const tname = name.toUpperCase();
        while(t) {
            if (t.tagName == tname) {
                return t;
            }
            t = t.parentElement;
        }

        return null;
    }

    private _handle_go_back(e: MouseEvent): any {
        if (this._callback_go_back == null) return;
        this._callback_go_back();
    }
}