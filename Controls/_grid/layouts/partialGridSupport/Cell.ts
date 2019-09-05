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
                            .add('controls-ListView__itemV_cursor-pointer')
                            .add('controls-Grid__row_'+ (itemData.style || 'default'))
                            .add('controls-Grid_row-cell_hovered', itemData.isHovered)
                            .add('controls-Grid__row_highlightOnHover_' + (itemData.style || 'default'), canBeHighlighted)
                            .compile();
    }

    private _callHandler(event, item): void {
        if (this._options.itemData.isEditing) {
            return;
        }

        // TODO KINGO Не нужно обрабатывать клик по строке с хлебными крошками (в результатах поиска).
        // stopPropogation в SearchView данном случае не срабатывает из-за отстутсвия элемента DOM
        // Поэтому остановить лишние события можно только здесь
        if (event.type === 'click'){
            if (item.getContents && !item.getContents().get){
                event.stopPropagation();
            } else {
                this._options.eventHandlers[event.type](event, item);
            }
        } else {
            this._options.eventHandlers[event.type](event, item);
        }
    }

}

export = Cell;
