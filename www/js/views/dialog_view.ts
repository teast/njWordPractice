import { BaseView } from "../base_view";
import { Ioc } from "../ioc";

export class DialogView extends BaseView  {
    public static readonly static_type_name = 'DialogView';
    public readonly type_name = DialogView.static_type_name;

    override readonly view: string|null = null;

    override async show(words: any): Promise<void> {
    }

    constructor(ioc: Ioc) {
        super(ioc);
    }
}
