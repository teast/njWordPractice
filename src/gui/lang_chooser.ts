import { ILanguagePick } from "../logic/lang_chooser";

export interface IPreGameGui {
    bind_language_picked(arg0: (index: number) => void): void;
    display_languages(languages: ILanguagePick[]):void;
    hide(): void;
}

export class LangChooserGui implements IPreGameGui {
    private _callback_language_picked: (index: number) => void;

    constructor() {
        let tbody = document.getElementById('game-choose-language-tbody');
        let self = this;
        tbody.addEventListener('click', (ev) => self._handle_click(ev));
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
            if (t.tagName == 'TR') {
                break;
            }

            t = t.parentElement;
        }

        if (t == null) return;

        // Found tr!
        let index = parseInt(t.getAttribute('data-id'));
        if (isNaN(index) || index == null) return;
        this._callback_language_picked(index);
    }

    private build_language_row(language: ILanguagePick, index: number): HTMLTableRowElement {
        const row = <HTMLTableRowElement>document.createElement('tr');
        row.setAttribute('data-id', index.toString());
            let td = document.createElement('td');
            td.innerText = language.source;
        row.appendChild(td);
            td = document.createElement('td');
            td.innerText = language.target;
        row.appendChild(td);

        return row;
    }
}