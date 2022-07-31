import { BaseObject } from "./base_object";
import { Records } from "./record";

export interface IStorage {
    put(key: string, data: any): Promise<void>;
    get<T>(key: string): Promise<T>;
}

export class Storage extends BaseObject implements IStorage {
    public static readonly static_type_name = "Storage";
    public readonly type_name = Storage.static_type_name;

    private _storage: Records<string, any> = new Records();

    public async put(key: string, data: any): Promise<void> {
        this._storage.push(key, data);
        
    }

    public async get<T>(key: string): Promise<T> {
        return Promise.resolve(this._storage.get(key));
    }
}