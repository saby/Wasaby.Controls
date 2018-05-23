define('SBIS3.CONTROLS/Filter/Panel/components/Chooser/FieldLink', [
    'SBIS3.CONTROLS/Filter/Panel/components/Chooser/Base',
    'tmpl!SBIS3.CONTROLS/Filter/Panel/components/Chooser/FieldLink/resources/FilterPanelChooserFieldLinkTpl',
   'SBIS3.CONTROLS/FieldLink',
   'css!SBIS3.CONTROLS/Filter/Panel/components/Chooser/FieldLink/FilterPanelChooser-FieldLink'
], function(FilterPanelChooserBase, FieldLinkChooserTemplate) {

    'use strict';

    /**
     * Класс редактора "Поле связи".
     * Применяется для панели фильтра с набираемыми параметрами (см. {@link SBIS3.CONTROLS/Filter/FilterPanel}).
     * Реализует выборку идентификаторов из поля связи - {@link SBIS3.CONTROLS/FieldLink}.
     *
     * <h2>Конфигурация редактора</h2>
     * Чтобы изменить конфигурацию редактора, используют подопцию *properties.properties* (см. {@link https://wi.sbis.ru/docs/js/SBIS3/CONTROLS/Filter/FilterPanel/typedefs/FilterPanelItem/}) в {@link SBIS3.CONTROLS/Filter/FilterPanel#items}.
     * По умолчанию опции для контрола редактора {@link SBIS3.CONTROLS/FieldLink} не установлены. Полный список опций и примеры конфигурации поля связи вы можете найти в описании его класса.
     *
     * <h2>Создание пользовательского редактора</h2>
     * Вы можете создать собственный класс редактора, на основе класса редактора "Поле связи".
     * Особенность: контрол, который будет использован в редакторе, должен иметь фиксированное имя в опции {@link Lib/Control/Control#name} - "controls-FilterPanelChooser__FieldLink-component".
     *
     * @class SBIS3.CONTROLS/Filter/Panel/components/Chooser/FieldLink
     * @extends SBIS3.CONTROLS/Filter/Panel/components/Chooser/Base
     * @author Авраменко А.С.
     * @public
     *
     * @demo Examples/FilterPanel/FilterPanelSimple/FilterPanelSimple
     */

    var FilterPanelChooserFieldLink = FilterPanelChooserBase.extend(/** @lends SBIS3.CONTROLS/Filter/Panel/components/Chooser/FieldLink.prototype */ {
        $protected: {
            _options: {
                chooserTemplate: FieldLinkChooserTemplate,
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
