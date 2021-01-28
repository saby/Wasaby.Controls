import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import template = require('wml!Controls/_menu/Popup/searchHeaderTemplate');

/**
 * Контрол шапка меню с поиском.
 * @class Controls/_menu/Popup/searchHeaderTemplate
 * @extends UI/_base/Control
 * @private
 * @demo Controls-demo/dropdown_new/Search/SearchWidth/Index
 *
 * @author Герасимов А.М.
 */

class SearchHeaderTemplate extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    protected _afterMount(): void {
        this._children.menuSearch.activate();
    }

    static _theme: string[] = ['Controls/menu'];
}

export default SearchHeaderTemplate;
