import { BaseView } from "../base_view";
import { Ioc } from "../ioc";
import { UIHelper } from "../gui/ui_helper";

export class DialogView extends BaseView  {
    public static readonly static_type_name = 'DialogView';
    public readonly type_name = DialogView.static_type_name;

    override readonly view: string|null = null;

    private static _parent: HTMLElement|null;
    private static _previous_display: string|null;

    override async show(words: any): Promise<void> {
    }

    constructor(ioc: Ioc) {
        super(ioc);
    }

    public static show_dialog(e: HTMLElement, ioc: Ioc, ok: () => void, cancel: () => void): void {
        this._parent = e.parentElement;


        const dlg = UIHelper.dialog(e);
        const dialog_buttons = UIHelper.to_html('<div class="flex-container"></div>');
        dialog_buttons.appendChild(UIHelper.button("Go", "go"));
        dialog_buttons.appendChild(UIHelper.button("Cancel", "cancel"));
        dlg.firstChild.appendChild(dialog_buttons);

        const container = document.createElement('div');
        const black = document.createElement('div');
        black.className = 'overlay-dialog';
        container.className = 'overlay-container';
        black.appendChild(container);
        container.appendChild(dlg);
        dlg.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const lst = (<HTMLElement>e.target).classList;
            if (lst.contains('button-plate') && lst.contains('go')) {
                DialogView.hide_dialog();
                ok();
            }
            else if (lst.contains('button-plate') && lst.contains('cancel')) {
                DialogView.hide_dialog();
                cancel();
            }
        };
        

        this._previous_display = e.style.display;
        e.style.display = 'block';

        const self = this;
        black.onclick = (e) => self.hide_dialog();
        container.onclick = (e) => e.stopPropagation();

        document.body.appendChild(black);
    }

    public static hide_dialog(): void {
        const elements = document.querySelectorAll('.overlay-dialog');
        for(var i = 0; i < elements.length; i++) {
            if (elements[i].firstChild != null && this._parent != null) {
                if (this._previous_display != null) {
                    (<HTMLElement>elements[i].firstChild).style.display = this._previous_display;
                }

                if (elements[i].firstChild != null)
                    this._parent.appendChild(elements[i].firstChild!);
            }
    
            elements[i].remove();
        }

        this._parent = null;
        this._previous_display = null;
    }
}