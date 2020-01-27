import BaseRender from './Render';

import { TemplateFunction } from 'UI/Base';
import { detection } from 'Env/Env';

export default class GridRender extends BaseRender {
    protected async _beforeMount(options): Promise<void> {
        super._beforeMount(options);

        this._templateKeyPrefix = `tile-render-${this.getInstanceId()}`;

        return new Promise((resolve) => {
            const layout = this._isFullGridSupport() ? 'grid' : 'table';
            require([
                `wml!Controls/_listRender/Grid/${layout}/Grid`,
                `wml!Controls/_listRender/Grid/${layout}/Item`
            ], (template, itemTemplate) => {
                this._template = template;
                this._itemTemplate = options.itemTemplate || itemTemplate;

                resolve();
            });
        });
    }

    private _isFullGridSupport(): boolean {
        return (
            (!detection.isWinXP || detection.yandex) &&
            (
                !detection.isNotFullGridSupport ||
                (
                    detection.safari &&
                    (detection.isMacOSDesktop || detection.IOSVersion >= 12)
                )
            )
        );
    }
}
