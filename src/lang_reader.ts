import { ILangConfig, IWordGroup, IWordPair } from "./lang_config"

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

export class LangReader {
    public async Load(json_content: string): Promise<ILangConfig> {
        const result = await fetch('duolingo_jp_en.json');
        const json = await result.text();
        const config = <ILangConfig>JSON.parse(json);
        return config;

        /*
        let word = new WordPair();
        word.source_hint1 = 'たべ';
        word.source = '食べ';
        word.target = 'to eat';
        word.target_alternatives.push('eat');

        let group = new LangGroup();
        group.name = 'Lesson 1';
        group.words.push(word);

        word = new WordPair();
        word.source_hint1 = 'いけ';
        word.source = '行け';
        word.target = 'to go';
        word.target_alternatives.push('go');
        group.words.push(word);

        let config = new LangConfig();
        config.source_iso = 'jp';
        config.source = 'Japanese';
        config.target_iso = 'en';
        config.target = 'English'
        config.version = 1;
        config.groups.push(group);

        // 2nd group
        word = new WordPair();
        word.source_hint1 = '';
        word.source = 'おはよう';
        word.target = 'good morning';
        word.target_alternatives.push('morning');

        group = new LangGroup();
        group.name = 'Lesson 2';
        group.words.push(word);

        word = new WordPair();
        word.source_hint1 = '';
        word.source = 'またね';
        word.target = 'see you';
        word.target_alternatives.push('later');
        word.target_alternatives.push('se you again');
        group.words.push(word);

        config.groups.push(group);

        return config;
        */
    }
}