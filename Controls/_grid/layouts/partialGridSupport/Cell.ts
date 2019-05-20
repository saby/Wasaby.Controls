import Control = require('Core/Control');
import template = require('wml!Controls/_grid/layouts/partialGridSupport/Cell');
import {CssClassList} from "Controls/Utils/CssClassList";


class Cell extends Control {
    protected _template: Function = template;

    getCellClasses(): string {
        let
            itemData = this._options.itemData,
            canBeHighlighted = this._options.highlightOnHover !== false;

        return  CssClassList.add('controls-ListView__itemV')
                            .add('controls-Grid__row_'+ (itemData.style || 'default'))
                            .add('controls-Grid_row-cell_hovered', itemData.isHovered)
                            .add('controls-Grid__row_highlightOnHover_' + (itemData.style || 'default'), canBeHighlighted)
                            .compile();
    }

    private _callHandler(event, item): void {
        this._options.eventHandlers[event.type](event, item);
    }

}

export = Cell;
