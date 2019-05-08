import Control = require('Core/Control');
import template = require('wml!Controls/_grid/layouts/partialGridSupport/Cell');
import {CssClassList} from "Controls/Utils/CssClassList";


class Cell extends Control {
    protected _template: Function = template;

    getCellClasses() {
        let
            itemData = this._options.itemData,
            isNeedToHighlight = this._options.highlightOnHover !== false && itemData.isHovered;

        return  CssClassList.add('controls-ListView__itemV')
                            .add('controls-Grid__row_'+ itemData.style || 'default')
                            .add('controls-Grid_row-cell_hovered', isNeedToHighlight)
                            .add('controls-Grid__row_highlightOnHover_' + itemData.style || 'default')
                            .compile();
    }

    _onClick(event) {
        this._options.eventHandlers.click(event, this._options.itemData.dispItem);
    }
    _onMouseEnter(event) {
        this._options.eventHandlers.mouseenter(event, this._options.itemData);
    }
    _onMouseLeave(event) {
        this._options.eventHandlers.mouseleave(event, this._options.itemData);
    }
    _onMouseMoveHandler(event) {
        this._options.eventHandlers.mousemove(event, this._options.itemData);
    }
    _onMouseDown(event) {
        this._options.eventHandlers.mousedown(event, this._options.itemData);
    }
    _onWheel(event) {
        this._options.eventHandlers.wheel(event, this._options.itemData);
    }
    _onContextMenu(event) {
        this._options.eventHandlers.contextmenu(event, this._options.itemData);
    }
    _onSwipe(event) {
        this._options.eventHandlers.swipe(event, this._options.itemData);
    }

}

export = Cell;
