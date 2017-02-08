define('js!SBIS3.CONTROLS.FilterPanelChooser.FieldLink', [
    'js!SBIS3.CONTROLS.FilterPanelChooser.Base',
    'tmpl!SBIS3.CONTROLS.FilterPanelChooser.FieldLink/resources/FilterPanelChooserFieldLinkTpl',
   'js!SBIS3.CONTROLS.FieldLink'
], function(FilterPanelChooserBase, FieldLinkChooserTemplate) {

    'use strict';

    /**
     * Класс редактора "Поле связи".
     * Применяется для панели фильтрации (см. {@link SBIS3.CONTROLS.FilterPanel/FilterPanelItem.typedef FilterPanelItem}).
     * <br/>
     * Реализует выборку идентификаторов из поля связи.
     * <br/>
     * @class SBIS3.CONTROLS.FilterPanelChooser.FieldLink
     * @extends SBIS3.CONTROLS.FilterPanelChooser.Base
     * @author Авраменко Алексей Сергеевич
     * @public
     */

    var FilterPanelChooserFieldLink = FilterPanelChooserBase.extend(/** @lends SBIS3.CONTROLS.FilterPanelChooser.FieldLink.prototype */ {
        $protected: {
            _options: {
                _chooserTemplate: FieldLinkChooserTemplate,
                className: 'controls-FilterPanelChooser__FieldLink'
            },
            _selectorAction: undefined,
            _fieldLink: undefined,
            _afterSelection: false
        },
        init: function() {
            FilterPanelChooserFieldLink.superclass.init.apply(this, arguments);
            this._getFieldLink().subscribe('onSelectedItemsChange', this._selectedItemsChangeHandler.bind(this));
        },
        _selectedItemsChangeHandler: function(event, selectedKeys) {
            this._setValue(selectedKeys);
        },
        setValue: function(value) {
            this._setValue(value);
            this._getFieldLink().setSelectedKeys(value);
        },
        _setValue: function(value) {
            FilterPanelChooserFieldLink.superclass.setValue.apply(this, arguments);
        },
        _getFieldLink: function() {
            if (!this._fieldLink) {
                this._fieldLink = this.getChildControlByName('controls-FilterPanelChooser__FieldLink-component');
            }
            return this._fieldLink;
        },
        _updateTextValue: function() {
            this.setTextValue(this._getFieldLink().getTextValue());
        }
    });

    return FilterPanelChooserFieldLink;

});
