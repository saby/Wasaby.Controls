import Control = require('Core/Control');
import template = require('wml!Controls/_lookup/MultipleInput/MultipleInput');
import itemTemplate = require('wml!Controls/_lookup/Lookup/itemTemplate');

/**
 * Контрол позволяет выбрать значение в диалоговом окне или предложить список возможных значений.
 * Здесь вы можете увидеть <a href="/materials/demo-ws4-engine-selector-lookup">демонстрационный пример</a>
 *
 * @class Controls/_lookup/MultipleInput
 * @extends Core/Control
 * @mixes Controls/_interface/ILookup
 * @mixes Controls/interface/ISelectedCollection
 * @mixes Controls/interface/ISelectorDialog
 * @mixes Controls/interface/ISuggest
 * @mixes Controls/interface/ISearch
 * @mixes Controls/_interface/ISource
 * @mixes Controls/interface/IFilter
 * @mixes Controls/interface/INavigation
 * @mixes Controls/_interface/IMultiSelectable
 * @mixes Controls/_interface/ISorting
 * @mixes Controls/interface/IInputBase
 * @mixes Controls/interface/IInputText
 * @mixes Controls/_lookup/BaseLookupView/LookupStyles
 * @control
 * @public
 * @author Капустин И.А.
 */
/*
 * The Lookup control allows you to select a value from a dialogs or suggest containing a list of possible values.
 * Here you can see <a href="/materials/demo-ws4-engine-selector-lookup">demo-example</a>.
 *
 * @class Controls/_lookup/MultipleInput
 * @extends Core/Control
 * @mixes Controls/_interface/ILookup
 * @mixes Controls/interface/ISelectedCollection
 * @mixes Controls/interface/ISelectorDialog
 * @mixes Controls/interface/ISuggest
 * @mixes Controls/interface/ISearch
 * @mixes Controls/_interface/ISource
 * @mixes Controls/interface/IFilter
 * @mixes Controls/interface/INavigation
 * @mixes Controls/_interface/IMultiSelectable
 * @mixes Controls/_interface/ISorting
 * @mixes Controls/interface/IInputBase
 * @mixes Controls/interface/IInputText
 * @mixes Controls/_lookup/BaseLookupView/LookupStyles
 * @control
 * @public
 * @author Капустин И.А.
 */

var MultipleInput = Control.extend({
    _template: template,

    showSelector: function (popupOptions) {
        return this._children.controller.showSelector(popupOptions);
    }
});

MultipleInput.getDefaultOptions = function() {
    return {
        itemTemplate: itemTemplate
    };
};

export = MultipleInput

