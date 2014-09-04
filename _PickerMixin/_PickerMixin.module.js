define('js!SBIS3.CONTROLS._PickerMixin', ['js!SBIS3.CONTROLS.FloatArea'], function(FloatArea) {
   /**
    * Отображение выпадающего вниз блока, с возможностью выбора
    * @mixin SBIS3.CONTROLS._PickerMixin
    */
   var _FormWidgetMixin = /** @lends SBIS3.CONTROLS._PickerMixin.prototype */{
      $protected: {
         _picker : null,
         _options: {

         }
      },

      $constructor: function() {
         var
            self = this,
            container = this._container,
            pickerContainer = $('<div></div>');
         container.after(pickerContainer);

         this._picker = new FloatArea({
            element : pickerContainer,
            target : container
         });

         /*TODO это как то получше надо переписать*/
         $('body *').mousedown(function(e){
            var inCombobox = self._container.find($(e.target));
            var inPicker = self._picker.getContainer().find($(e.target));
            if (!inCombobox.length && !inPicker.length) {
               self.hidePicker();
            }
         });
      },
      /**
       * Показывает выпадающий блок
       */
      showPicker: function() {
         this._picker.recalcPosition();
         this._picker.show();
      },
      /**
       * Скрывает выпадающий блок
       */
      hidePicker: function() {
         this._picker.hide();
      },

      togglePicker: function() {
         this._picker.recalcPosition();
         this._picker.toggle();
      }

   };

   return _FormWidgetMixin;

});