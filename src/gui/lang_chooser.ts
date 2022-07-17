import { ILanguagePick } from "../logic/lang_chooser";
import { UIHelper } from "./ui_helper";

export interface IPreGameGui {
    bind_language_picked(arg0: (index: number) => void): void;
    display_languages(languages: ILanguagePick[]):void;
    hide(): void;
}

export class LangChooserGui implements IPreGameGui {
    private _callback_language_picked: (index: number) => void;

    private _languages: {[lang:string]: string} = {};

    constructor() {
        let tbody = document.getElementById('game-choose-language-tbody');
        let self = this;
        tbody.addEventListener('click', (ev) => self._handle_click(ev));
        this._languages['Japanese'] = '🇯🇵';
        this._languages['English'] = '🇺🇸';
        this._languages['Swedish'] = '🇸🇪';
    }

    public hide(): void {
        document.getElementById('game-choose-language').style.display = 'none';
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
        UIHelper.show_dialog(document.getElementById(`language-dialog-${index}`));
    }

    private build_language_row(language: ILanguagePick, index: number): HTMLElement {
        const name = UIHelper.fix_undefined(language.get_config().name);
        const description = UIHelper.fix_undefined(language.get_config().description);
        const source = UIHelper.fix_undefined(language.source in this._languages ? this._languages[language.source] : language.source);
        const target = UIHelper.fix_undefined(language.target in this._languages ? this._languages[language.target] : language.target);

        const html_button = `
                <div class="button-plate" id="language-button-${index}">
                    <p class="heading strong">${name}</p>
                    <div class="language-circle">
                    <span class="language">${source}</span>
                    </div>
                    <span class="language-equalizer">⬌</span>
                    <div class="language-circle">
                        <span class="language">${target}</span>
                    </div>
                </div>
        `;
        const html_dialog = `
                <div class="popup-dialog" style="display: none" id="language-dialog-${index}">
                    <div class="popup-border">
                        <p class="title">${name}</p>
                        <p>${description}</p>
                        <div class="level-item has-text-centered">
                            <div class="button-plate go">
                                Go
                            </div>
                            <div class="button-plate cancel">
                                Cancel
                            </div>
                        </div>
                    </div>
                </div>
        `;

        const btn = UIHelper.to_html(html_button);
        const dlg = UIHelper.to_html(html_dialog);

        const self = this;
        dlg.onclick = (e) => {
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