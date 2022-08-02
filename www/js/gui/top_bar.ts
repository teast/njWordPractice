import { BaseObject } from "../base_object";
import { Ioc } from "../ioc";
import { Routing } from "../routing";

export class TopBar extends BaseObject {
    public static readonly static_type_name = "TopBar";
    public readonly type_name = TopBar.static_type_name;

    private readonly router: Routing;
    private back_button_visible: boolean = false;
    private back_handlers: Array<() => Promise<void>> = [];

    constructor(ioc: Ioc) {
        super();
        const self = this;

        this.router = ioc.get<Routing>(Routing.static_type_name);
        this.router.on_router_change(() => self._handle_router_change());
    }

    private _handle_router_change(): void {
        if (this.back_button_visible && !this.router.can_back()) {
            this._hide_back_button();
        }
        else if (this.back_button_visible && this.router.can_back() && !this._back_button_actual_visible()) {
            this._show_back_button();
        }
    }

    public init() {
        const el = <HTMLElement>document.querySelector('.navbar-back');
        const self = this;
        el.onclick = async () =>  {
            for(let i = 0; i < self.back_handlers.length; i++) {
                try {
                    await self.back_handlers[i]();
                }
                catch (e) {
                    console.error(`Unhandled error in back-button handler (index: ${i}): `, e);
                }
            }
        };
    }

    public back_button_click(callback: () => Promise<void>) {
        this.back_handlers.push(callback);
    }

    public show_topbar() {
        const el = <HTMLElement>document.querySelector('.navbar');
        if (el)
            el.style.display = 'block';
    }

    public hide_topbar() {
        const el = <HTMLElement>document.querySelector('.navbar.is-fixed-top');
        if (el)
            el.style.display = 'none';
    }

    public show_back_button() {
        this.back_button_visible = true;
        this._show_back_button();
    }

    public hide_back_button() {
        this.back_button_visible = false;
        this._hide_back_button();
    }

    private _back_button_actual_visible(): boolean {
        const el = <HTMLElement>document.querySelector('.navbar-back');
        if (el == null || el == undefined) return false;
        
        return el.style.display != 'none';
    }

    private _show_back_button() {
        if (!this.router.can_back()) {
            this._hide_back_button();
            return;
        }

        const el = <HTMLElement>document.querySelector('.navbar-back');
        if (el == null || el == undefined) return;
        el.style.display = "table";
    }

    private _hide_back_button() {
        const el = <HTMLElement>document.querySelector('.navbar-back');
        if (el == null || el == undefined) return;
        el.style.display = "none";
    }
}