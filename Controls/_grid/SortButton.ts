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
 * @тame Controls/_grid/SortButton#property
 * @cfg {String} Sorting property.
 */
export interface ISortButtonOptions extends IControlOptions {
    property: string;
}
class SortButton extends Control<ISortButtonOptions> {
    protected _template: TemplateFunction = template;

    protected _clickHandler(): void {
        this._notify('sortingChanged', [this._options.property], {bubbling: true});
    }

    static _theme: [string] = ['Controls/grid'];
}

export default SortButton;
