import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/_grid/layout/partialGrid/Cell';
import {CssClassList} from 'Controls/Utils/CssClassList';
import {SyntheticEvent} from 'Vdom/Vdom';
import {CollectionItem} from 'Types/display';

export interface ICellOptions extends IControlOptions {
    highlightOnHover?: boolean;
    clickable?: boolean;
    itemData: {
        style?: string
        isHovered: boolean
        isEditing: boolean
    };
    eventHandlers: Array<(event: SyntheticEvent<Event>, item: CollectionItem<unknown>) => void>;
}

export class Cell extends Control<ICellOptions> {
    protected _template: TemplateFunction = template;

    getCellClasses(): string {
        const itemData = this._options.itemData;
        const canBeHighlighted = this._options.highlightOnHover !== false;
        const theme = this._options.theme || 'default';
        return CssClassList.add('controls-ListView__itemV')
            .add('controls-ListView__itemV_cursor-default', this._options.clickable === false)
            .add('controls-ListView__itemV_cursor-pointer', this._options.clickable !== false)
            .add('controls-Grid__row_' + (itemData.style || 'default') + `_theme-${theme}`)
            .add('controls-Grid_row-cell_hovered_theme-' + theme, itemData.isHovered)
            .add('controls-Grid__row_highlightOnHover_' + (itemData.style || 'default') + `_theme-${theme}`, canBeHighlighted)
            .compile();
    }

    private _callHandler(event: SyntheticEvent<Event>, item: CollectionItem<{ get?: () => unknown }>): void {
        if (this._options.itemData.isEditing) {
            return;
        }

        // TODO KINGO Не нужно обрабатывать клик по строке с хлебными крошками (в результатах поиска).
        // stopPropogation в SearchView данном случае не срабатывает из-за отстутсвия элемента DOM
        // Поэтому остановить лишние события можно только здесь
        if (event.type === 'click') {
            if (item.getContents && !item.getContents().get) {
                event.stopPropagation();
            } else {
                this._options.eventHandlers[event.type](event, item);
            }
        } else {
            this._options.eventHandlers[event.type](event, item);
        }
    }

}

export default Cell;
