import { IBaseObject } from "./base_object";

export class Ioc {
    private _container: Map<string, any> = new Map<string, any>();

    public bind_singleton<T extends IBaseObject, T2 extends T>(obj: T2) {
        this._container.set(obj.type_name, obj);
    }

    public get<T extends IBaseObject>(identifier: string) : T {
        const target = this._container.get(identifier);

        if (target == null) throw Error(`Could not find type "${identifier}" in Ioc`);

        return target;
    }
}