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
      },

      _initializePicker: function () {
         var
            self = this,
            pickerContainer = $('<div></div>'),
            container = self._container;

         // чтобы не нарушать выравнивание по базовой линии
         $('body').append(pickerContainer);
         self._picker = this._createPicker(pickerContainer);
         self._setWidth();
         container.hover(function(){
            self._picker.getContainer().addClass('controls-Picker__owner__hover');
         }, function () {
            self._picker.getContainer().removeClass('controls-Picker__owner__hover');
         });
         self._setPickerContent();
      },

      _createPicker: function(pickerContainer){
         var picker = new FloatArea({
            element : pickerContainer,
            target : this._container,
            corner: 'bl',
            verticalAlign: {
               side: 'top'
            },
            horizontalAlign: {
               side: 'left'
            },
            closeByExternalClick: true
         });
         return picker;
      },

      /**
       * Показывает выпадающий блок
       */
      showPicker: function() {
         if (!this._picker) {
            this._initializePicker();
         }
         this._container.addClass('controls-Picker__show');
         this._setWidth();
         this._picker.show();
      },
      /**
       * Скрывает выпадающий блок
       */
      hidePicker: function() {
         if (!this._picker) {
            this._initializePicker();
         }
         this._container.removeClass('controls-Picker__show');
         this._picker.hide();
      },

      togglePicker: function() {
         if (!this._picker) {
            this._initializePicker();
         }
         this._container.toggleClass('controls-Picker__show');
         if (this._picker.isVisible()){
            this.hidePicker();
         }else {
            this.showPicker();
         }
      },

      _setWidth: function(){
         var self = this;
         this._picker.getContainer().css({
            'min-width': self._container.outerWidth() - 2/*ширина бордеров*/
         });
      },

      _setPickerContent: function () {
         /*Method must be implemented*/
      },

      after : {
         destroy : function(){
            if (this._picker) {
               this._picker.destroy();
            }
         }
      }

   };

   return _PickerMixin;

});