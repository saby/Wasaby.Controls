/**
 * Created by iv.cheremushkin on 23.01.2015.
 */
define('js!SBIS3.CONTROLS.MenuButtonMixin', [], function() {

   /**
    * Миксин, добавляющий поведение хранения одного или нескольких выбранных элементов
    * @mixin SBIS3.CONTROLS.MenuButtonMixin
    */

   var MenuButtonMixin = /**@lends SBIS3.CONTROLS.MenuButtonMixin.prototype  */{
      $protected: {
         _options: {
         }
      },

      $constructor: function () {

      },

      _setPickerConfig: function(){
         return {
            parent: this.getParent(),
            context: this.getParent() ? this.getParent().getLinkedContext() : {},
            element: $('<div></div>'),
            target : this.getContainer(),
            items: this._items,
            corner : 'bl',
            hierField: 'par',
            verticalAlign: {
               side: 'top'
            },
            horizontalAlign: {
               side: 'left'
            },
            closeByExternalClick: true,
            targetPart: true
         };
      },

      _drawItems : function() {
         if (this._picker) {
            this._picker.destroy();
         }
         this._initializePicker();
      },

      after: {
         showPicker: function(){
            this._container.css('z-index', this._picker._container.css('z-index') + 1);
         },

         hidePicker: function(){
            this._container.css('z-index', this._zIndex);
         }
      }
   };

   return MenuButtonMixin;
});

