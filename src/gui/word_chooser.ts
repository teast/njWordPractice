import { ILangConfig, IWordGroup } from "../lang_config";
import { UIHelper } from "./ui_helper";

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

        if (target.classList.contains('checkbox')) {
            return this._checkbox_ticked(target);
        }
    }

    private _checkbox_ticked(input: HTMLElement): void {
        const is_item_checkbox = input.parentElement?.parentElement?.classList?.contains('expander-content');
        if (is_item_checkbox) {
            return this._update_group_checkbox_from_row_clicked(input);
        }
        else {
            return this._handle_group_checkbox_clicked(input);
        }
    }

    private _handle_group_checkbox_clicked(input: HTMLElement) {
        const checked = !input.hasAttribute('checked');
        let expander = input.parentElement;
        while(expander != null) {
            if (expander.classList.contains('expander')) break;
            expander = expander.parentElement;
        }

        if (expander == null) {
            console.error('Could not find expander from group checkbox click!');
            return;
        }

        let content = expander.querySelectorAll('.expander-content .checkbox');
        for (let i = 0; i < content.length; i++) {
            if (checked) {
                content[i].setAttribute('checked', '');
            }
            else {
                content[i].removeAttribute('checked');
            }
        }

        let nr_of_words = expander.querySelector('.nr-of-words');
        if (nr_of_words != null) {
            const ticked = checked ? content.length : 0;
            (<HTMLElement>nr_of_words).innerText = `${ticked}/${content.length}`;
        }
    }

    private _update_group_checkbox_from_row_clicked(input: HTMLElement) {
        let expander = input.parentElement;
        while(expander != null) {
            if (expander.classList.contains('expander')) break;
            expander = expander.parentElement;
        }

        if (expander == null) {
            console.error('Could not find expander from group checkbox click!');
            return;
        }

        let content = expander.querySelectorAll('.expander-content .checkbox');
        let checked = 0;
        let unchecked = 0;

        for (let i = 0; i < content.length; i++) {
            if (content[i] == input) {
                if (input.hasAttribute('checked')) unchecked++; else checked++;
            }
            else {
                if (content[i].hasAttribute('checked')) checked++; else unchecked++;
            }
        }

        let group_checkbox = expander.querySelector('.expander-inner .checkbox');
        if (group_checkbox == null) {
            console.error('Could not find group checkbox when updating from an item checkbox tick');
            return;
        }

        if (checked == content.length) {
            group_checkbox.setAttribute('checked', '');
        }
        else {
            group_checkbox.removeAttribute('checked');
        }

        let nr_of_words = expander.querySelector('.nr-of-words');
        if (nr_of_words != null) {
            (<HTMLElement>nr_of_words).innerText = `${checked}/${content.length}`;
        }
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
            tbody.appendChild(this._build_word_group(language.groups[i], i));
        }

        document.getElementById('game-choose-words').style.display = 'block';
    }

    private _build_word_group(group: IWordGroup, index: number): HTMLElement {
        const expander = UIHelper.expander('', 'word-list');

        expander.outer.setAttribute('data-id', index.toString());
        expander.header.classList.add('flex-container');
        expander.header.classList.add('flex-row');
        expander.header.appendChild(UIHelper.to_html(`<span class="checkbox"></span>`));
        expander.header.appendChild(UIHelper.to_html(`<span class="heading flex-space-2">${group.name}</span>`));
        expander.header.appendChild(UIHelper.to_html(`<span class="nr-of-words">0/${group.words.length}</span>`));

        for(let i = 0; i < group.words.length; i++) {
            const e = UIHelper.word_list_item(i, index, group.words[i].source, group.words[i].source_hint1, group.words[i].target);
            e.setAttribute('data-id', i.toString());
            expander.content.appendChild(e);
        }
        
        return expander.outer;
    }

    private _handle_start(e: MouseEvent): any {
        if (this._callback_words_picked == null) return;

        const tbody = document.getElementById('game-choose-words-tbody');
        const response: { [group_id: number]: number[] } = [];
        const all_inputs = tbody.querySelectorAll('.expander-content.word-list .checkbox[checked]');
        console.log('all checkboxes: ', tbody, all_inputs);
        for(let i = 0; i < all_inputs.length; i++) {
            const checkbox = all_inputs[i];
            
            if (!checkbox.hasAttribute('data-item-id') || !checkbox.hasAttribute('data-group-id')) {
                console.error('Missing data-item-id or data-group-id on checkbox. Will ignore: ', checkbox);
                continue;
            }

            const item_id = parseInt(checkbox.getAttribute('data-item-id'));
            const group_id = parseInt(checkbox.getAttribute('data-group-id'));

            if (isNaN(item_id)) {
                console.error('Expected an number for data-item-id on checkbox (but found: "' + checkbox.getAttribute('data-item-id') + '"). will ignore: ', checkbox);
                continue;
            }

            if (isNaN(group_id)) {
                console.error('Expected an number for data-group-id on checkbox (but found: "' + checkbox.getAttribute('data-group-id') + '"). will ignore: ', checkbox);
                continue;
            }

            if (response[group_id] == null) response[group_id] = [];
            response[group_id].push(item_id);
        }

        console.log('going to start game with ', response);
        if (Object.keys(response).length == 0) {
            console.log('not going to start due to empty array');
            return;
        }

        this._callback_words_picked(response);
    }

    private _handle_go_back(e: MouseEvent): any {
        if (this._callback_go_back == null) return;
        this._callback_go_back();
    }
}