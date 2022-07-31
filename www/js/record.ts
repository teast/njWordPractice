export class KeyValuePair<T1, T2> {
    readonly item1: T1;
    readonly item2: T2;

    constructor(item1: T1, item2: T2) {
        this.item1 = item1;
        this.item2 = item2;
    }
}

export class RecordsAsync<T, T2> {
    readonly items: KeyValuePair<T,() => Promise<T2>>[];

    constructor(... items: KeyValuePair<T,() => Promise<T2>>[]) {
        this.items = items;
    }

    public push(key: T, value: T2): void {
        this.items.push(new KeyValuePair(key, () => Promise.resolve(value)));
    }

    public async get(key: T): Promise<T2|null> {
        for(let i = 0; i < this.items.length; i++) {
            if (this.items[i].item1 == key) {
                return this.items[i].item2();
            }
        }

        return null;
    }
}

export class Records<T, T2> {
    readonly items: KeyValuePair<T, T2>[];

    constructor(... items: KeyValuePair<T,T2>[]) {
        this.items = items;
    }

    public push(key: T, value: T2): void {
        this.items.push(new KeyValuePair(key, value));
    }

    public get(key: T): T2|null {
        for(let i = 0; i < this.items.length; i++) {
            if (this.items[i].item1 == key) {
                return this.items[i].item2;
            }
        }

        return null;
    }
}

