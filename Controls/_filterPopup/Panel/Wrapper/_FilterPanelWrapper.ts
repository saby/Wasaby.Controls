import {Control, TemplateFunction} from 'UI/Base';
import template = require('wml!Controls/_filterPopup/Panel/Wrapper/_FilterPanelWrapper');
import _FilterPanelWrapper = require('Controls/_filterPopup/Panel/Wrapper/_FilterPanelOptions');

/**
* Proxy container for filter panel options.
*
* @class Controls/_filterPopup/Panel/Wrapper/_FilterPanelWrapper
* @extends UI/Base:Control
*
* @private
*/

export = class extends Control {
    protected _template: TemplateFunction = template;

    protected _getChildContext() {
        return {
            filterPanelOptionsField: new _FilterPanelWrapper(this._options)
        };
    }
};
