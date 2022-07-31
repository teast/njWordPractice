export interface IBaseObject {
    get type_name(): string;
}

export abstract class BaseObject implements IBaseObject {
    public abstract get type_name(): string;
}
