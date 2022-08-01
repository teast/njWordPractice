import { BaseObject, IBaseObject } from "../base_object";
import { BaseView } from "../base_view";
import { BottomBar } from "../gui/botton_bar";
import { UIHelper } from "../gui/ui_helper";
import { Ioc } from "../ioc";
import { ILangConfig, IWordGroup, IWordPair } from "../lang_config";
import { Routes, Routing } from "../routing";
import { ILanguagePick } from "./pick_language_view";

export class PickWordsView extends BaseView {
    public static static_type_name: string = 'PickWordsView';
    public override readonly type_name: string = PickWordsView.static_type_name;
    override readonly view: string = 'pick_words.html';

    private readonly _gui: IWordChooserGui;
    private _language: ILangConfig;

    constructor(ioc: Ioc) {
        super(ioc);

        this._gui = ioc.get<IWordChooserGui>(WordChooserGui.static_type_name);
    }

    override async show(language: ILanguagePick): Promise<void> {
        const bar = this.ioc.get<BottomBar>(BottomBar.static_type_name);
        this._gui.show(bar, this.router);
        this._language = language.get_config();

        this._gui.bind_words_picked((dictionary: {[group_id: number]: number[]}) => this._handle_words_picked(dictionary));
        this._gui.display_words(this._language);
    }

    private _handle_words_picked(dictionary: {[group_id: number]: number[]}): void {
        const all_words: IWordPair[] = [];
        for(let group_id in dictionary) {
            for(let i = 0; i < dictionary[group_id].length; i++) {
                const word_id = dictionary[group_id][i];
                all_words.push(this._language.groups[group_id].words[word_id]);
            }
        }

        this.router.push_and_replace(Routes.WordGame, all_words);
    }
}

export interface IWordChooserGui extends IBaseObject {
    bind_words_picked(callback: (dictionary: {[group_id: number]: number[]}) => void): void;
    display_words(language: ILangConfig): void;
    show(bar:BottomBar, router: Routing):void;
}

export class WordChooserGui extends BaseObject implements IWordChooserGui {
    public static readonly static_type_name = "WordChooserGui";
    public override readonly type_name = WordChooserGui.static_type_name;

    private _callback_words_picked: ((dictionary: {[group_id: number]: number[]}) => void)|null = null;
    
    constructor() {
        super();
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

    public show(bar:BottomBar, router: Routing): void {
        const tbody = document.getElementById('game-choose-words-tbody');
        if (tbody)
            tbody.addEventListener('click', (ev) => this._handle_click(ev));

        bar.add_button('Start', (e) => this._handle_start(e));
    }

    public bind_words_picked(callback: (dictionary: {[group_id: number]: number[]}) => void): void {
        this._callback_words_picked = callback;
    }

    public display_words(language: ILangConfig): void {
        let tbody = document.getElementById('game-choose-words-tbody');
        if (!tbody) return;

        while(tbody.firstChild && tbody?.lastChild) {
            tbody.removeChild(tbody.lastChild);
        }

        for(let i = 0; i < language.groups.length; i++) {
            tbody.appendChild(this._build_word_group(language.groups[i], i));
        }

        const choose_words = document.getElementById('game-choose-words');
        if (choose_words)
            choose_words.style.display = 'block';
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
        if (tbody == null) return;

        const response: { [group_id: number]: number[] } = [];
        const all_inputs = tbody.querySelectorAll('.expander-content.word-list .checkbox[checked]');
        for(let i = 0; i < all_inputs.length; i++) {
            const checkbox = all_inputs[i];
            
            if (!checkbox.hasAttribute('data-item-id') || !checkbox.hasAttribute('data-group-id')) {
                console.error('Missing data-item-id or data-group-id on checkbox. Will ignore: ', checkbox);
                continue;
            }

            const item_id = parseInt(checkbox.getAttribute('data-item-id')??'NaN');
            const group_id = parseInt(checkbox.getAttribute('data-group-id')??'NaN');

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

        if (Object.keys(response).length == 0) {
            console.log('not going to start due to empty array');
            return;
        }

        this._callback_words_picked(response);
    }
}