import { BaseObject } from "./base_object";
import { ILangConfig, IWordGroup, IWordPair } from "./lang_config"

/*
class LangConfig implements ILangConfig {
    source_iso: string;
    target_iso: string;
    source: string;
    target: string;
    version: number;
    groups: IWordGroup[];

    constructor() {
        this.groups = [];
    }
}
*/

class LangGroup implements IWordGroup {
    name: string;
    words: IWordPair[];

    constructor() {
        this.words = new Array<IWordPair>();
    }
}

class WordPair implements IWordPair {
    source_hint1: string;
    source: string;
    source_alternatives: string[];
    target: string;
    target_alternatives: string[];

    constructor() {
        this.source_alternatives = [];
        this.target_alternatives = [];
    }
}

export class LangReader extends BaseObject {
    public static static_type_name: string = 'LangReader';
    public override readonly type_name: string = LangReader.static_type_name;

    constructor() {
        super();
    }

    public async Load(json_content: string): Promise<ILangConfig> {
        const result = await fetch('duolingo_jp_en.json');
        const json = await result.text();
        const config = <ILangConfig>JSON.parse(json);
        return config;
   }
}