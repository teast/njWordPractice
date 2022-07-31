import { BaseObject } from "../base_object";
import { UIHelper } from "./ui_helper";

export class BottomBar extends BaseObject {
    public static readonly static_type_name = "BottomBar";
    public override readonly type_name = BottomBar.static_type_name;
    
    public clear() {
        const bar = this._get_bottom_bar();
        if (bar == null || bar == undefined) return;

        while(bar.firstChild) bar.removeChild(bar.lastChild);
    }

    public add_button(label:string, on_click: (event: MouseEvent) => void) {
        /*
        const html = UIHelper.to_html(`<a class="navbar-item is-expanded  is-block has-text-centered">
            <i class="fa fa-user"></i>
            <p class="is-sizesdf-7">${label}</p>
        </a>`);
        */
       const html = UIHelper.to_html(`
        <div class="button-container">
          <a class="has-text-centered">
            <p>${label}</p>
          </a>
        </div>
       `);

        html.onclick = (ev) => on_click(ev);

        const bar = this._get_bottom_bar();
        if (bar == null || bar == undefined) return;

        bar.appendChild(html);
    }

    private _get_bottom_bar(): HTMLElement {
        return <HTMLElement>document.querySelector('.navbar.is-fixed-bottom');
    }
}