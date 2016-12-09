define('js!SBIS3.CONTROLS.FilterPanelChooser.Base', [
    'js!SBIS3.CORE.CompoundControl',
    'js!SBIS3.CONTROLS.IFilterItem',
    'tmpl!SBIS3.CONTROLS.FilterPanelChooser.Base',
    'Core/IoC',
    'js!WS.Data/Collection/RecordSet'
], function(CompoundControl, IFilterItem, dotTplFn, IoC, RecordSet) {

    'use strict';

    /**
     * @author Крайнов Дмитрий Олегович
     * @class SBIS3.CONTROLS.FilterPanelChooser.Base
     * @extends SBIS3.CONTROLS.CompoundControl
     */

    var FilterPanelChooserBase = CompoundControl.extend([IFilterItem], /** @lends SBIS3.CONTROLS.FilterPanelChooser.Base.prototype */ {
        _dotTplFn: dotTplFn,
        $protected: {
            _options: {
                /**
                 * @cfg {WS.Data/Collection/RecordSet} Набор элементов из которых будет производиться выбор.
                 **/
                items: undefined,
                value: [],
                keyField: 'id',
                displayField: 'title',
                chooserTemplate: undefined
            }
        },

        _modifyOptions: function() {
            var opts = FilterPanelChooserBase.superclass._modifyOptions.apply(this, arguments);
            if (Array.isArray(opts.items)) {
                IoC.resolve('ILogger').log('items', 'Array type option is deprecated. Use WS.Data/Collection/RecordSet.');
                opts.items = new RecordSet({
                    rawData: opts.items,
                    idProperty: opts.keyField
                });
            }
            return opts;
        },

        getValue: function() {
            return this._options.value;
        },

        setValue: function(value) {
            this._options.value = value;
            this._updateTextValue();
            this._notifyOnPropertyChanged('value');
        },

        _updateTextValue: function() {
        },

        getTextValue: function() {
            return this._options.textValue;
        },

        setTextValue: function(textValue) {
            if (textValue !== this._options.textValue) {
                this._options.textValue = textValue;
                this._notifyOnPropertyChanged('textValue');
            }
        }

    });

    return FilterPanelChooserBase;

});
