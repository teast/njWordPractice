import { BaseObject } from "./base_object";
import { BaseView } from "./base_view";
import { BottomBar } from "./gui/botton_bar";
import { TopBar } from "./gui/top_bar";
import { UIHelper } from "./gui/ui_helper";
import { Ioc } from "./ioc";
import { KeyValuePair, Records, RecordsAsync } from "./record";
import { GameView } from "./views/game_view";
import { InitView } from "./views/init_view";
import { PickLanguageView } from "./views/pick_language_view";
import { PickWordsView } from "./views/pick_words_view";
import { SummaryView } from "./views/summary_view";

export enum Routes {
    Init = '',
    PickLanguage = '#pick-language',
    PickWords = '#pick-words',
    WordGame = '#game',
    Summary = '#summary'
}

export class Routing extends BaseObject {
    public static static_type_name: string = 'Routing';
    public type_name: string = Routing.static_type_name;

    private readonly ioc: Ioc;
    private _event_router_change: Array<() => void> = [];
    private view_stack: Array<KeyValuePair<Routes, BaseView>> = [];
    private view_data: Records<string, string> = new Records<string, string>();
    private routes: RecordsAsync<Routes, BaseView> = new RecordsAsync<Routes, BaseView>(
        new KeyValuePair(Routes.Init, () => Promise.resolve(this.ioc.get<BaseView>(InitView.static_type_name))),
        new KeyValuePair(Routes.PickLanguage, () => Promise.resolve(this.ioc.get<BaseView>(PickLanguageView.static_type_name))),
        new KeyValuePair(Routes.PickWords, () => Promise.resolve(this.ioc.get<BaseView>(PickWordsView.static_type_name))),
        new KeyValuePair(Routes.WordGame, () => Promise.resolve(this.ioc.get<BaseView>(GameView.static_type_name))),
        new KeyValuePair(Routes.Summary, () => Promise.resolve(this.ioc.get<BaseView>(SummaryView.static_type_name))),
    )

    constructor(ioc: Ioc) {
        super();

        const self = this;
        this.ioc = ioc;
        window.addEventListener('popstate', (ev) => self._pop_event(ev));
    }

    private _pop_event(ev: PopStateEvent): any {
        console.log('popevent! ', ev);
    }

    public on_router_change(handler: () => void): void {
        this._event_router_change.push(handler);
    }

    public can_back(): boolean {
        return this.view_stack.length > 1;
    }

    private _visible_view(): BaseView|null {
        return this.view_stack.length == 0 ? null : this.view_stack[this.view_stack.length - 1].item2;
    }

    public async init(): Promise<void> {
        const bar = this.ioc.get<TopBar>(TopBar.static_type_name);
        const self = this;
        bar.back_button_click(async () => {
            const view = self._visible_view();
            if (view == null) return;
            try {
                await view.go_back_handler();
            }
            catch(e) {
                console.error(`unhandled error in go_back handler for view ${view?.type_name}: `, e);
            }
        });

        switch(window.location.hash.toLowerCase()) {
            case Routes.PickLanguage:
                return this.push(Routes.PickLanguage);
            case Routes.PickWords:
                return this.push(Routes.PickWords);
            case Routes.WordGame:
                return this.push(Routes.WordGame);
            case Routes.Summary:
                return this.push(Routes.Summary);
            default:
                return this.push(Routes.Init);
        }
    }

    private async _get_view_data(view_name: string): Promise<HTMLCollection> {

        const collection = this.view_data.get(view_name);
        if (collection != null) return UIHelper.to_all_html(collection);

        const result = await fetch(`views/${view_name}`);
        if (result.status != 200) {
            console.error(`unhandled exception, received http status ${result.status} when fetching view "${view_name}"`);
            return null;
        }

        const data = await result.text();
        const html = UIHelper.to_all_html(data);
        this.view_data.push(view_name, data);
        return html;
    }

    private async _render_view(view: BaseView, old_view: BaseView|null, data: any): Promise<void> {
        const html = await this._get_view_data(view.view);
        const main_div = document.getElementById('main-div');

        while(main_div.firstChild)
            main_div.removeChild(main_div.lastChild);

        if (html == null) {
            console.error('unknown error. could not fetch view "' + view.view + '"');
            return;
        }

        for(let i = 0; i < html.length; i++) main_div.append(html[i]);

        if (old_view != null) await old_view.hide();
        await view.show(data);
    }

    is_visible(view: BaseView): boolean {
        if (this.view_stack.length == 0) return false;
        const visible = this.view_stack[this.view_stack.length - 1];
        return visible.item2.type_name == view.type_name;
    }

    public push_and_replace(route: Routes, data: any = null): Promise<void> {
        return this._do_push(route, data, true);
    }

    public push(route: Routes, data: any = null): Promise<void> {
        return this._do_push(route, data, false);
    }

    private async _do_push(route: Routes, data: any, replace_view: boolean): Promise<void> {
        const view = await this.routes.get(route);
        if (view == null) {
            console.error('Unknown route: ', route);
            return;
        }

        const old_view = this.view_stack.length > 0 ? this.view_stack[this.view_stack.length - 1] : null;

        if (replace_view) {
            history.replaceState(null, null, route);
            if (this.view_stack.length > 0)
                this.view_stack.pop();
        }
        else {
            history.pushState(null, null, route);
        }

        this.view_stack.push(new KeyValuePair(route, view));
        this._render_view(view, old_view?.item2, data);
        this._update_topbar(view);
        this._update_bottombar(view);
        this._notify_all_listeners_for_on_change();
    }

    private _update_topbar(view: BaseView): void {
        const topbar = this.ioc.get<TopBar>(TopBar.static_type_name);        
        if (view.show_back_button)
            topbar.show_back_button();
        else
            topbar.hide_back_button();
        if (view.show_topbar)
            topbar.show_topbar();
        else
            topbar.hide_topbar();
    }

    private _update_bottombar(view: BaseView): void {
        const bar = this.ioc.get<BottomBar>(BottomBar.static_type_name);        
        bar.clear();
    }

    private _notify_all_listeners_for_on_change(): void  {
        for(let i = 0; i < this._event_router_change.length; i++)
            this._event_router_change[i]();
    }

    public async pop(): Promise<boolean> {
        const result = this._pop();
        if (result == null) return false;
        await result.item1.hide();
        await this._render_view(result.item2, null, null);
        this._update_topbar(result.item2);
        this._update_bottombar(result.item2);
        this._notify_all_listeners_for_on_change();
    }

    public async pop_until(route: Routes): Promise<void> {
        let result: KeyValuePair<BaseView, BaseView>|null = null;
        let is_first = true;

        while(this.view_stack.length > 0) {
            const view = this.view_stack[this.view_stack.length - 1];
            if (view.item1 == route) {
                await this._render_view(result.item2, null, null);
                break;
            }
            result = await this._pop();

            if (is_first) {
                result.item1.hide();
                is_first = false;
            }
        }

        // We have done at least one pop
        if (!is_first && this.view_stack.length > 1) {
            this._update_topbar(this.view_stack[this.view_stack.length - 1].item2);
            this._update_bottombar(this.view_stack[this.view_stack.length - 1].item2);
            this._notify_all_listeners_for_on_change();
        }
    }

    private _pop(): KeyValuePair<BaseView, BaseView>|null {
        if (this.view_stack.length == 0) return null;
        const prev = this.view_stack[this.view_stack.length - 1];
        history.back();
        this.view_stack.pop();
        const next = this.view_stack[this.view_stack.length - 1];

        return new KeyValuePair(prev.item2, next.item2);
    }
}
