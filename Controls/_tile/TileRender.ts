import { TemplateFunction } from 'UI/Base';

// FIXME FIXME FIXME
// Import from the library, but think about how it can be loaded
// only when actually used
import BaseRender from 'Controls/_list/Render';

import template = require('wml!Controls/_tile/TileRender/TileRender');
import defaultItemTemplate = require('wml!Controls/_tile/TileRender/resources/ItemTemplate');

export default class TileRender extends BaseRender {
    protected _template: TemplateFunction = template;

    protected _beforeMount(options): void {
        this._templateKeyPrefix = `tile-render-${this.getInstanceId()}`;
        this._itemTemplate = options.itemTemplate || defaultItemTemplate;
    }
}
