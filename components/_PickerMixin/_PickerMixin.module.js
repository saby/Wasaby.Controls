define('js!SBIS3.CONTROLS._PickerMixin', ['js!SBIS3.CONTROLS.FloatArea'], function(FloatArea) {
   /**
    * Контрол умеющий отображать выдающий вниз блок, в котором можно что-то выбрать
    * Задается контент (протектед методом каким-то) и методы которые позволяют открывать, закрывать блок.
    * @mixin SBIS3.CONTROLS._PickerMixin
    */
   var _PickerMixin = /** @lends SBIS3.CONTROLS._PickerMixin.prototype */{
      $protected: {
         _picker : null,
         _options: {

         }
      },

      $constructor: function() {
         var
            self = this,
            pickerContainer = $('<div></div>'),
            container = this._container;

         // чтобы не нарушать выравнивание по базовой линии
         $('body').append(pickerContainer);
         this._picker = this._createPicker(pickerContainer);
         this._picker.getContainer().width(container.outerWidth() - 2/*ширина бордеров*/);
         container.hover(function(){
            self._picker.getContainer().addClass('controls-Picker__owner__hover');
         }, function(){
            self._picker.getContainer().removeClass('controls-Picker__owner__hover');
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

      _createPicker: function(pickerContainer){
         var picker = new FloatArea({
            element : pickerContainer,
            target : this._container
         });
         return picker;
      },

      /**
       * Показывает выпадающий блок
       */
      showPicker: function() {
         this._container.addClass('controls-Picker__show');
         this._picker.getContainer().width(container.outerWidth() - 2/*ширина бордеров*/);
         this._picker.show();
      },
      /**
       * Скрывает выпадающий блок
       */
      hidePicker: function() {
         this._container.removeClass('controls-Picker__show');
         this._picker.hide();
      },

      togglePicker: function() {
         this._container.toggleClass('controls-Picker__show');
         this._picker.toggle();
      },

      after : {
         destroy : function(){
            this._picker.destroy();
         }
      }

   };

   return _PickerMixin;

});