import { IWordChooserGui } from "../gui/word_chooser";
import { ILangConfig, IWordPair } from "../lang_config";
import { IUIComponent } from "../ui_component";
import { ILanguagePick } from "./lang_chooser";

export class WordChooser implements IUIComponent {
    private readonly _gui: IWordChooserGui;
    private _callback_words_picked: (words: IWordPair[]) => void;
    private _language: ILangConfig;
    private _callback_go_back: () => void = null;

    constructor(gui: IWordChooserGui) {
        this._gui = gui;
        this._gui.bind_event_go_back(() => {
            if (this._callback_go_back == null) return;
            this._callback_go_back();
        })
    }

    public bind_event_go_back(callback: () => void): void {
        this._callback_go_back = callback;
    }

    public hide(): void {
        this._gui.hide();
    }

    public show_and_pick_words(language: ILanguagePick, callback: (words: IWordPair[]) => void): void {
        this._callback_words_picked = callback;
        this._language = language.get_config();

        this._gui.bind_words_picked((dictionary: {[group_id: number]: number[]}) => this._handle_words_picked(dictionary));
        this._gui.display_words(this._language);
    }

    private _handle_words_picked(dictionary: {[group_id: number]: number[]}): void {
        const all_words = [];
        for(let group_id in dictionary) {
            for(let i = 0; i < dictionary[group_id].length; i++) {
                const word_id = dictionary[group_id][i];
                all_words.push(this._language.groups[group_id].words[word_id]);
            }
        }

        this._callback_words_picked(all_words);
    }
}