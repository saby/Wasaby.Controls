define('js!SBIS3.CONTROLS.SuggestTextBox', [
   'js!SBIS3.CONTROLS.TextBox',
   'js!SBIS3.CONTROLS.TextBoxUtils',
   'js!SBIS3.CONTROLS.PickerMixin',
   'js!SBIS3.CONTROLS.SuggestMixin',
   'js!SBIS3.CONTROLS.ChooserMixin',
   'js!SBIS3.CONTROLS.SuggestTextBoxMixin',
   'js!SBIS3.CONTROLS.SearchMixin',
   'js!SBIS3.CONTROLS.SearchController',
   'tmpl!SBIS3.CONTROLS.SuggestTextBox/resources/afterFieldWrapper',
   'Core/core-instance',
   'css!SBIS3.CONTROLS.SuggestTextBox'
], function (
    TextBox,
    TextBoxUtils,
    PickerMixin,
    SuggestMixin,
    ChooserMixin,
    SuggestTextBoxMixin,
    SearchMixin,
    SearchController,
    afterFieldWrapper,
    cInstance ) {
   'use strict';

   /**
    * Поле ввода с автодополнением
    * @class SBIS3.CONTROLS.SuggestTextBox
    * @extends SBIS3.CONTROLS.TextBox
    * @mixes SBIS3.CONTROLS.PickerMixin
    * @mixes SBIS3.CONTROLS.SuggestMixin
    * @mixes SBIS3.CONTROLS.ChooserMixin
    * @mixes SBIS3.CONTROLS.SearchMixin
    * @mixes SBIS3.CONTROLS.SuggestTextBoxMixin
    * @demo SBIS3.CONTROLS.Demo.MySuggestTextBox Поле ввода с автодополнением
    * @author Крайнов Дмитрий Олегович
    *
    * @control
    * @public
    * @category Inputs
    * @cssModifier controls-SuggestTextBox__withoutCross Скрыть крестик удаления значения.
    */
   var SuggestTextBox = TextBox.extend([PickerMixin, SuggestMixin, ChooserMixin, SuggestTextBoxMixin, SearchMixin], {
      $protected: {
         _options: {
            afterFieldWrapper: afterFieldWrapper
         },
         _crossContainer: null
      },
      $constructor: function() {
         this._crossContainer =  $('.js-controls-SuggestTextBox__reset', this._getAfterFieldWrapper());

         this.subscribe('onTextChange', function(e, text) {
            this._crossContainer.toggleClass('ws-hidden', !text);
         });

         this._crossContainer.click(this.resetSearch.bind(this));
      },

      _chooseCallback: function(result) {
         if(result && cInstance.instanceOfModule(result[0], 'WS.Data/Entity/Model')) {
            var item = result[0];
            this._onListItemSelect(item.getId(), item);
         }
      },

      _modifyOptions: function() {
         var opts = SuggestTextBox.superclass._modifyOptions.apply(this, arguments);
         opts.cssClassName += ' controls-SuggestTextBox';
         return opts;
      },

      showPicker: function() {
         SuggestTextBox.superclass.showPicker.apply(this, arguments);
          TextBoxUtils.setEqualPickerWidth(this._picker);
      },

      _onListDrawItems: function() {
         SuggestTextBox.superclass._onListDrawItems.apply(this, arguments);
          TextBoxUtils.setEqualPickerWidth(this._picker);
      },

      destroy: function(){
         SuggestTextBox.superclass.destroy.apply(this, arguments);
         this._crossContainer.unbind('click');
         this._crossContainer = null;
      }
   });

   return SuggestTextBox;
});
