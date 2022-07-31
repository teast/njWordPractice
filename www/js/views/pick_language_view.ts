import { BaseObject, IBaseObject } from "../base_object";
import { BaseView } from "../base_view";
import { UIHelper } from "../gui/ui_helper";
import { Ioc } from "../ioc";
import { ILangConfig } from "../lang_config";
import { LangReader } from "../lang_reader";
import { Routes } from "../routing";

export class PickLanguageView extends BaseView  {
    public static static_type_name: string = 'PickLanguageView';
    public override readonly type_name: string = PickLanguageView.static_type_name;
    override readonly view: string = 'pick_language.html';

    private readonly _reader: LangReader;
    private _languages: ILanguagePick[] = [];
    private readonly _gui: ILangChooserGui;
    

    constructor(ioc: Ioc) {
        super(ioc);
        this._gui = ioc.get<ILangChooserGui>(LangChooserGui.static_type_name);
        this._reader = ioc.get<LangReader>(LangReader.static_type_name);
    }

    override async show(): Promise<void> {
        this._gui.show();

        const language = await this._reader.Load('dummy');
        let jp = new LanguagePick(language);
        this._languages = [jp];

        this._gui.bind_language_picked((index: number) => this._handle_language_picked(index));
        this._gui.display_languages(this._languages);

    }

    private _handle_language_picked(index: number): void {
        if (index < 0 || index > this._languages.length) return;
        this.router.push(Routes.PickWords, this._languages[index]);
    }
}


export interface ILangChooserGui extends IBaseObject {
    bind_language_picked(arg0: (index: number) => void): void;
    display_languages(languages: ILanguagePick[]):void;
    show(): void;
}

export interface ILanguagePick {
    source: string;
    target: string;
    get_config(): ILangConfig,
}

class LanguagePick implements ILanguagePick {
    source: string;
    target: string;

    private readonly _lang: ILangConfig;

    constructor(lang: ILangConfig) {
        this._lang = lang;
        this.source = this._lang.source;
        this.target = this._lang.target;
    }

    get_config(): ILangConfig {
        return this._lang;
    }
}

export class LangChooserGui extends BaseObject implements ILangChooserGui {
    public static static_type_name: string = 'LangChooserGui';
    public override readonly type_name: string = LangChooserGui.static_type_name;    

    private _callback_language_picked: (index: number) => void;
    private _languages: {[lang:string]: string} = {};

    constructor() {
        super();

        this._languages['Japanese'] = '🇯🇵';
        this._languages['English'] = '🇺🇸';
        this._languages['Swedish'] = '🇸🇪';
    }

    public show(): void {
        let tbody = document.getElementById('game-choose-language-tbody');
        let self = this;
        tbody.addEventListener('click', (ev) => self._handle_click(ev));
    }

    public bind_language_picked(callback: (index: number) => void): void {
        this._callback_language_picked = callback;
    }

    public display_languages(languages: ILanguagePick[]): void {
        let tbody = document.getElementById('game-choose-language-tbody');
        while(tbody.firstChild) {
            tbody.removeChild(tbody.lastChild);
        }

        for(let i = 0; i < languages.length; i++) {
           const row = this.build_language_row(languages[i], i);
           tbody.appendChild(row);
        }

        document.getElementById('game-choose-language').style.display = 'block';
    }

    private _handle_click(ev: MouseEvent) {
        let t = <HTMLElement>ev.target;

        while(t) {
            if (t.tagName == 'DIV' && t.id.startsWith('language-button-')) {
                break;
            }

            t = t.parentElement;
        }

        if (t == null) return;

        // Found div!
        let index = parseInt(t.id.replace('language-button-', ''));
        if (isNaN(index) || index == null) return;
        ev.preventDefault();
        ev.stopPropagation();
        UIHelper.show_dialog(document.getElementById(`language-dialog-${index}`));
    }

    private build_language_row(language: ILanguagePick, index: number): HTMLElement {
        const name = UIHelper.fix_undefined(language.get_config().name);
        const description = UIHelper.fix_undefined(language.get_config().description);
        const source = UIHelper.fix_undefined(language.source in this._languages ? this._languages[language.source] : language.source);
        const target = UIHelper.fix_undefined(language.target in this._languages ? this._languages[language.target] : language.target);

        const dialog_content = UIHelper.to_html(`<div>
                <p class="title">${name}</p>
                <p>${description}</p>
            </div>`);
        const dialog_buttons = UIHelper.to_html('<div class="flex-container"></div>');
        dialog_buttons.appendChild(UIHelper.button("Go", "go"));
        dialog_buttons.appendChild(UIHelper.button("Cancel", "cancel"));
        dialog_content.appendChild(dialog_buttons);

        const btn = UIHelper.language_button(index, name, source, target);
        const dlg = UIHelper.dialog(dialog_content);

        dlg.style.display = 'none';
        dlg.id = `language-dialog-${index}`;
        dlg.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const lst = (<HTMLElement>e.target).classList;
            if (lst.contains('button-plate') && lst.contains('go')) {
                UIHelper.hide_dialog();
                this._callback_language_picked(index);
            }
            else if (lst.contains('button-plate') && lst.contains('cancel')) {
                UIHelper.hide_dialog();
            }
        };

        const e = document.createElement('div');
        e.appendChild(btn);
        e.appendChild(dlg);
        return e;
    }
}