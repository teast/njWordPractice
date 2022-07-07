import { ILangConfig } from "../lang_config";
import { LangReader } from "../lang_reader";
import { IPreGameGui } from "../gui/lang_chooser";
import { IUIComponent } from "../ui_component";

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

export class LangChooser implements IUIComponent {
    private _reader: LangReader;
    private _languages: ILanguagePick[] = [];
    private _callback_language_picked: (language: ILanguagePick) => void;
    private _gui: IPreGameGui;

    constructor(gui: IPreGameGui, reader: LangReader) {
        this._gui = gui;
        this._reader = reader;
    }

    public hide(): void {
        this._gui.hide();
    }

    public async show_and_pick_language(callback: (language: ILanguagePick) => void): Promise<void> {

        this._callback_language_picked = callback;
        const language= await this._reader.Load('dummy');
        let jp = new LanguagePick(language);
        this._languages = [jp];

        this._gui.bind_language_picked((index: number) => this._handle_language_picked(index));
        this._gui.display_languages(this._languages);
    }

    private _handle_language_picked(index: number): void {
        if (index < 0 || index > this._languages.length) return;
        this._callback_language_picked(this._languages[index]);
    }
}