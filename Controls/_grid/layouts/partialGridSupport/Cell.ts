import Control = require('Core/Control');
import template = require('wml!Controls/_grid/layouts/partialGridSupport/Cell');
import {CssClassList} from "Controls/Utils/CssClassList";


class Cell extends Control {
    protected _template: Function = template;

    getCellClasses(): string {
        let
            itemData = this._options.itemData,
            isNeedToHighlight = this._options.highlightOnHover !== false && <boolean>itemData.isHovered;

        return  CssClassList.add('controls-ListView__itemV')
                            .add('controls-Grid__row_'+ (itemData.style || 'default'))
                            .add('controls-Grid_row-cell_hovered', isNeedToHighlight)
                            .add('controls-Grid__row_highlightOnHover_' + (itemData.style || 'default'))
                            .compile();
    }
    
    private _callHandler(event, item): void {
        if (this._options.itemData.isEditing) {
            return;
        }
        this._options.eventHandlers[event.type](event, item);
    }

}

export = Cell;
