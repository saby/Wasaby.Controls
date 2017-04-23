define('js!SBIS3.CONTROLS.SuggestTextBox', [
   'js!SBIS3.CONTROLS.TextBox',
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
         this._setEqualPickerWidth();
      },

      _onListDrawItems: function() {
         SuggestTextBox.superclass._onListDrawItems.apply(this, arguments);
         this._setEqualPickerWidth();
      },

      destroy: function(){
         SuggestTextBox.superclass.destroy.apply(this, arguments);
         this._crossContainer.unbind('click');
         this._crossContainer = null;
      },

      _setEqualPickerWidth: function() {
         var textBoxWidth = this.getContainer()[0].clientWidth,
             pickerContainer = this._picker.getContainer()[0],
             needSetWidth = true,
             minWidth;

         if (this._picker && textBoxWidth !== pickerContainer.clientWidth) {
            /* Почему установлен maxWidth и width ?
               popup в текущей реализации не понимает, что ему размер кто-то установил извне и
               при пересчётах может спокойно перетирать эти размеры. Поэтому, для того чтобы зафиксировать ширину,
               устанавливаем maxWidth (maxWidth не стирается при пересчётах popup'a).
               Но учитываем, что maxWidth не будет учитываться, если автодополнение меньше поля ввода, и поэтому после
               расчётов позиции устанавливаем width - чтобы гаррантировать одинаковую ширину поля ввода и автодополнения.
               Прикладной программист может увеличить ширину автодополнения установив min-width.
               Для правильного позиционирования popup необходимо чтобы в момент расчета размеры соотвествовали конечным
               поэтому устанавливаем min-width, а после его затираем, чтобы не перебивать прикладные стили
                */
            minWidth = parseInt(this._picker.getContainer().css('min-width'));
            needSetWidth = !minWidth || minWidth < textBoxWidth;
            if(needSetWidth) {
               pickerContainer.style.minWidth = textBoxWidth + 'px';
               pickerContainer.style.maxWidth = textBoxWidth + 'px';
            }
            this._picker.recalcPosition(true);
            if(needSetWidth) {
                pickerContainer.style.width = textBoxWidth + 'px';
                pickerContainer.style.minWidth = '';
            }
         }
      }
   });

   return SuggestTextBox;
});
