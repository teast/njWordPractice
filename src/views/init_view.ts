import { BaseView } from "../base_view";
import { Routes } from "../routing";

export class InitView extends BaseView  {
    public static static_type_name: string = 'InitView';
    public override readonly type_name: string = InitView.static_type_name;

    public override readonly view: string = 'init.html';

    override async show(): Promise<void> {
    }

    override async hide(): Promise<void> {
    }

    init_done() {
        if (this.is_visible)
            this.router.push_and_replace(Routes.PickLanguage);
    }
}