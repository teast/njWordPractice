import { BaseView } from "../base_view";
import { BottomBar } from "../gui/botton_bar";
import { TopBar } from "../gui/top_bar";
import { Ioc } from "../ioc";
import { Routes, Routing } from "../routing";

export class DialogView extends BaseView  {
    public static readonly static_type_name = 'DialogView';
    public readonly type_name = DialogView.static_type_name;
    public override readonly show_topbar: boolean = false;
    override readonly view: string|null = 'dialog.html';

    override async show(data: any): Promise<void> {
        const e = <HTMLElement>data.e;
        const ok = <() => void>data.ok;
        const cancel = <() => void>data.cancel;

        const content = document.getElementById('dialog-content');
        const top_bar = this.ioc.get<TopBar>(TopBar.static_type_name);
        const bottom_bar = this.ioc.get<BottomBar>(BottomBar.static_type_name);
        const router = this.ioc.get<Routing>(Routing.static_type_name);

        if (content == null) {
            console.error(`${DialogView.static_type_name}: could not find #dialog-content element`);
            return;
        }

        content.appendChild(e);
        e.style.display = 'block';

        bottom_bar.add_button('Go', async () => {
            await router.pop();
            ok();
        });

        bottom_bar.add_button('Cancel', async () => {
            await router.pop();
            cancel();
        });
    }

    constructor(ioc: Ioc) {
        super(ioc);
    }

    public static show_dialog(e: HTMLElement, ioc: Ioc, ok: () => void, cancel: () => void): void {

        const router = ioc.get<Routing>(Routing.static_type_name);

        router.push(Routes.Dialog, {
            e: e,
            ok: ok,
            cancel: cancel
        });
    }

    public static hide_dialog(): void {

    }
}
