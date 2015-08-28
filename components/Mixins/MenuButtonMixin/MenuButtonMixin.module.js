/**
 * Created by iv.cheremushkin on 23.01.2015.
 */
define('js!SBIS3.CONTROLS.MenuButtonMixin', ['js!SBIS3.CONTROLS.ContextMenu'], function(ContextMenu) {
   /**
    * Миксин, добавляющий поведение хранения одного или нескольких выбранных элементов
    * @mixin SBIS3.CONTROLS.MenuButtonMixin
    * @public
    */
   'use strict';

   var MenuButtonMixin = /**@lends SBIS3.CONTROLS.MenuButtonMixin.prototype  */{
      /**
       * @event onMenuItemActivate При активации пункта меню
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} id Идентификатор пункта меню.
       * @example
       * <pre>
       *     MenuIcon.subscribe('onMenuItemActivate', function(e, id) {
        *        alert('Вы нажали на ' + this._items.getItem(id).title)
        *     })
       * </pre>
       */
      $protected: {
         _options: {
            /**
             * @cfg {String} Поле иерархии
             */
            hierField : null
         }
      },

      $constructor: function () {
         this._publish('onMenuItemActivate');
      },

      _createPicker: function(targetElement){
         var menuconfig = {
            parent: this.getParent(),
            opener: this,
            context: this.getParent() ? this.getParent().getLinkedContext() : {},
            element: targetElement,
            target : this.getContainer(),
            items: this._options.items,
            corner : 'tl',
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
         if (this._dataSource) {
            menuconfig.dataSource = this._dataSource;
         }
         else {
            menuconfig.items = this._options.items;
         }
         return new ContextMenu(menuconfig);
      },

      after: {
         _initializePicker : function() {
            var self = this;
            this._picker.subscribe('onMenuItemActivate', function(e, id) {
               self._notify('onMenuItemActivate', id);
            });
         }
      },

      around: {
         addItem: function(parentFunc, item) {
            this._items.addItem(item);
            if (this._picker) {
               this._redraw();
            }
         }
      },

      _drawItems : function() {
         if (this._picker) {
            this._picker.destroy();
         }
         this._initializePicker();
         this._initMenu();
      }
   };

   return MenuButtonMixin;
});