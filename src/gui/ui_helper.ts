export class UIHelper {
    private static _parent: HTMLElement;
    private static _previous_display: string;

    public static to_html(html: string): HTMLElement {
        const template = document.createElement('template');
        template.innerHTML = html.trim();
        return <HTMLElement>template.content.firstChild;
    }

    public static fix_undefined(s: string): string {
        return s == undefined ? "" : s;
    }

    public static show_dialog(e: HTMLElement): void {
        this._parent = e.parentElement;

        const container = document.createElement('div');
        const black = document.createElement('div');
        black.className = 'overlay-dialog';
        container.className = 'overlay-container';
        black.appendChild(container);
        container.appendChild(e);

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

                this._parent.appendChild(elements[i].firstChild);
            }
    
            elements[i].remove();
        }

        this._parent = null;
        this._previous_display = null;
    }
}