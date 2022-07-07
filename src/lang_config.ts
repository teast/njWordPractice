export interface ILangConfig {
    source_iso: string,
    target_iso: string,
    source: string,
    target: string,
    version: number,
    groups: IWordGroup[]
}

export interface IWordGroup {
    name: string,
    words: IWordPair[]
}

export interface IWordPair {
    source_hint1: string,
    source: string,
    source_alternatives: string[],
    target: string,
    target_alternatives: string[]
}