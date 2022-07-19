export class Point {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

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

    public static get_offset(e: HTMLElement): Point {
        const rect = e.getBoundingClientRect();
        return new Point(
            rect.left + window.scrollX,
            rect.top + window.scrollY
        );
    }

    public static button(content: string, classList: string): HTMLElement {
        const html = `<div class="button-plate ${classList}">${content}</div>`;
        return this.to_html(html);
    }

    public static language_button(index: number, name: string, source: string, target: string): HTMLElement {
        const html = `<div class="button-plate" id="language-button-${index}">
            <p class="heading strong">${name}</p>
            <div class="language-circle">
            <span class="language">${source}</span>
            </div>
            <span class="language-equalizer">⬌</span>
            <div class="language-circle">
                <span class="language">${target}</span>
            </div>
        </div>`;

        return this.to_html(html);
    }

    public static dialog(content: string|HTMLElement): HTMLElement {
        const rcontent = typeof content == 'string' ? this.to_html(content) : content;
        const outer = this.to_html('<div class="popup-dialog"></div>');
        const inner = this.to_html('<div class="popup-border"></div>');
        inner.appendChild(rcontent);
        outer.appendChild(inner);
        
        return outer;
    }
}