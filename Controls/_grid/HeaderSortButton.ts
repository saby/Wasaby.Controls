import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import template = require('wml!Controls/_grid/SortResources/HeaderSortButton');
import 'css!theme?Controls/grid';

/**
 * Контрол, используюемый для изменения сортировки внутри таблиц
 *
 * @class Controls/_grid/HeaderSortButton
 * @extends Core/Control
 * @mixes Controls/_grid/HeaderSortButton/Styles
 * @private
 * @see Controls/grid:SortMenu
 */

/**
 * @name Controls/_grid/HeaderSortButton#property
 * @cfg {String} Поле для сортировки.
 */

export interface IHeaderSortButtonOptions extends IControlOptions {
    property: string;
}
class HeaderSortButton extends Control<IHeaderSortButtonOptions> {
    protected _template: TemplateFunction = template;

    protected _clickHandler(): void {
        this._notify('sortingChanged', [this._options.property], {bubbling: true});
    }

    static _theme: [string] = ['Controls/grid'];
}

export default HeaderSortButton;
