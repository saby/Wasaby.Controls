/**
 * Created by ps.borisov on 09.12.2016.
 */
define('SBIS3.CONTROLS/Filter/Panel/components/Chooser/RadioGroup', [
   'SBIS3.CONTROLS/Filter/Panel/components/Chooser/Base',
   'tmpl!SBIS3.CONTROLS/Filter/Panel/components/Chooser/RadioGroup/resources/FilterPanelChooserRadioGroupTpl',
   'Core/core-clone',
   'SBIS3.CONTROLS/Radio/Group',
   'css!SBIS3.CONTROLS/Filter/Panel/components/Chooser/RadioGroup/FilterPanelChooser-RadioGroup'
], function(FilterPanelChooserBase, chooserTpl, coreClone) {
   'use strict';
   /**
    * Класс редактора "Набор радиокнопок".
    * Применяется для панели фильтра с набираемыми параметрами (см. {@link SBIS3.CONTROLS/Filter/FilterPanel}).
    * Реализует выборку идентификатора из списка {@link SBIS3.CONTROLS/Radio/Group}.
    *
    * <h2>Конфигурация редактора</h2>
    * Чтобы изменить конфигурацию редактора, используют подопцию *properties.properties* (см. {@link https://wi.sbis.ru/docs/js/SBIS3/CONTROLS/Filter/FilterPanel/typedefs/FilterPanelItem/}) в {@link SBIS3.CONTROLS/Filter/FilterPanel#items}.
    * По умолчанию опции для контрола редактора {@link SBIS3.CONTROLS/Radio/Group} не установлены. Полный список опций и примеры конфигурации радиокнопок вы можете найти в описании его класса.
    *
    * <h2>Создание пользовательского редактора</h2>
    * Вы можете создать собственный класс редактора, на основе класса редактора "Набор радиокнопок".
    * Особенность: контрол, который будет использован в редакторе, должен иметь фиксированное имя в опции {@link Lib/Control/Control#name} - "controls-FilterPanelChooser__RadioGroup".
    *
    * @class SBIS3.CONTROLS/Filter/Panel/components/Chooser/RadioGroup
    * @extends SBIS3.CONTROLS/Filter/Panel/components/Chooser/Base
    * @author Авраменко А.С.
    * @public
    *
    * @demo Examples/FilterPanel/FilterPanelSimple/FilterPanelSimple
    */
   var FilterPanelChooserRadioGroup = FilterPanelChooserBase.extend( /** @lends SBIS3.CONTROLS/Filter/Panel/components/Chooser/RadioGroup.prototype */ {
      $protected: {
         _options: {
            chooserTemplate: chooserTpl
         },
         _radioGroup: undefined
      },

      init: function() {
         var
            radioGroup;
         FilterPanelChooserRadioGroup.superclass.init.apply(this, arguments);
         radioGroup = this._getRadioGroup();
         radioGroup.subscribe('onSelectedItemChange', this._updateValue.bind(this));
      },

      setValue: function(value) {
         this._setValue(value);
         this._updateView(value);
      },

      _setValue: function(value) {
         FilterPanelChooserRadioGroup.superclass.setValue.apply(this, arguments);
      },

      _updateView: function(value) {
         this._getRadioGroup().setSelectedKey(value);
      },

      _updateValue: function() {
         this._setValue(coreClone(this._getRadioGroup().getSelectedKey()));
      },

      _getRadioGroup: function() {
         if (!this._radioGroup) {
            this._radioGroup = this.getChildControlByName('controls-FilterPanelChooser__RadioGroup');
         }
         return this._radioGroup;
      },
      _updateTextValue: function() {
         this.setTextValue(this._getRadioGroup().getTextValue());
      }
   });
   return FilterPanelChooserRadioGroup;

});
