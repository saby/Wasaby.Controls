import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import template = require('wml!Controls/_grid/SortResources/SortButton');
import 'css!theme?Controls/grid';

/**
 * Контрол, используюемый для изменения сортировки внутри таблиц
 *
 * @class Controls/_grid/SortButton
 * @extends Core/Control
 * @mixes Controls/_grid/SortButton/Styles
 * @private
 * @see Controls/grid:SortMenu
 */

/**
 * @name Controls/_grid/SortButton#type
 * @cfg {String} Способ соритровки
 * @variant single Сортировка по одному полю.
 * @variant multi Сортировка по несокльким полям.
 */

/**
 * @name Controls/_grid/SortButton#property
 * @cfg {String} Поле для сортировки.
 */

/*
 * Graphical control element that used for changing sorting in Grid control
 *
 * @class Controls/_grid/SortButton
 * @extends Core/Control
 * @mixes Controls/_grid/SortButton/Styles
 * @private
 */

/*
 * @name Controls/_grid/SortButton#type
 * @cfg {String} Type of sorting.
 * @variant single Sorting by single field.
 * @variant multi Allows you to sort by multiple fields.
 */

/*
 * @тame Controls/_grid/SortButton#property
 * @cfg {String} Sorting property.
 */
export interface ISortButtonOptions extends IControlOptions {
    type: string;
    property: string;
}
class SortButton extends Control<ISortButtonOptions> {
    static _theme: [string] = ['Controls/grid'];
    protected _template: TemplateFunction = template;

    protected _clickHandler(): void {
        this._notify('sortingChanged', [this._options.property, this._options.type], {bubbling: true});
    }
}

export default SortButton;
