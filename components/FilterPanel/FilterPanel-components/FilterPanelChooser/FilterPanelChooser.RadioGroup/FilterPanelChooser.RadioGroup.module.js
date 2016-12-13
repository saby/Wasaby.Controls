/**
 * Created by ps.borisov on 09.12.2016.
 */
define('js!SBIS3.CONTROLS.FilterPanelChooser.RadioGroup', [
   'js!SBIS3.CONTROLS.FilterPanelChooser.Base',
   'js!SBIS3.CONTROLS.RadioGroup',
   'tmpl!SBIS3.CONTROLS.FilterPanelChooser.RadioGroup/resources/FilterPanelChooserRadioGroup',
   'Core/core-functions'
], function(FilterPanelChooserBase, RadioGroup, chooserTpl , cFunctions) {
   'use strict';
   /**
    * Класс редактора "Набор радиокнопок".
    * Применяется для панели фильтрации (см. {@link SBIS3.CONTROLS.FilterPanel/FilterPanelItem.typedef FilterPanelItem}).
    * <br/>
    * Реализует выборку идентификатора из списка {@link SBIS3.CONTROLS.Ragiogroup}.
    * <br/>
    * @class SBIS3.CONTROLS.FilterPanelChooser.RadioGroup
    * @extends SBIS3.CONTROLS.FilterPanelChooserBase
    * @author Борисов Петр Сергеевич
    * @demo SBIS3.CONTROLS.Demo.MyFilterView
    */
   var FilterPanelChooserRadioGroup = FilterPanelChooserBase.extend( /** @lends SBIS3.CONTROLS.FilterPanelChooser.RadioGroup.prototype */ {
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
         this._setValue(cFunctions.clone(this._getRadioGroup().getSelectedKey()));
      },

      _getRadioGroup: function() {
         if (!this._radioGroup) {
            this._radioGroup = this.getChildControlByName('controls-FilterPanelChooser__RadioGroup');
         }
         return this._radioGroup;
      }
   });
   return FilterPanelChooserRadioGroup;

});
