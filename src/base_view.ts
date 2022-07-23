import { BaseObject } from "./base_object";
import { Ioc } from "./ioc";
import { Routing } from "./routing";

export interface IView extends BaseObject {
    /* name of the view to render */
    readonly view: string;

    /* Gets called when the view is pushed to the front and should be rendered */
    show(data: any): void;

    /* Gets called when the view is no longer on top of visible routes */
    hide(): void;
}

export abstract class BaseView extends BaseObject implements IView {
    protected readonly ioc: Ioc;
    abstract readonly view: string;
    protected get router(): Routing {
        return this.ioc.get(Routing.static_type_name);
    }

    constructor(ioc: Ioc) {
        super();

        this.ioc = ioc;
    }

    protected get is_visible(): boolean {
        return this.router.is_visible(this);
    }
    
    show(data: any = null): Promise<void> {
        return Promise.resolve();
    }

    hide(): Promise<void> {
        return Promise.resolve();
    }
}