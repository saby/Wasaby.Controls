/**
 * Created by iv.cheremushkin on 23.01.2015.
 */
define('js!SBIS3.CONTROLS.MenuButtonMixin', ['js!SBIS3.CONTROLS.ContextMenu'], function(ContextMenu) {
   /**
    * Миксин, добавляющий поведение хранения одного или нескольких выбранных элементов
    * @mixin SBIS3.CONTROLS.MenuButtonMixin
    */
   'use strict';

   var MenuButtonMixin = /**@lends SBIS3.CONTROLS.MenuButtonMixin.prototype  */{
      $protected: {
         _options: {
         }
      },

      $constructor: function () {
         this._publish('onMenuItemActivate');
      },

      _setPickerConfig: function(){
         return {
            parent: this.getParent(),
            context: this.getParent() ? this.getParent().getLinkedContext() : {},
            element: $('<div></div>'),
            target : this.getContainer(),
            items: this._items,
            corner : 'bl',
            enabled: this.isEnabled(),
            hierField: this._options.hierField,
            keyField: this._options.keyField,
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

      _createPicker: function(){
         return new ContextMenu(this._setPickerConfig());
      },

      after : {
         _initializePicker : function() {
            var self = this;
            this._picker.subscribe('onMenuItemActivate', function(e, id) {
               self._notify('onMenuItemActivate', id)
            })
         }
      },

      _drawItems : function() {
         var self = this;
         if (this._picker) {
            this._picker.destroy();
         }
         this._initializePicker();
         this._initMenu();
      }
   };

   return MenuButtonMixin;
});

