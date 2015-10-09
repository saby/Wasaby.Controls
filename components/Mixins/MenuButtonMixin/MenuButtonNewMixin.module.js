/*global $,$ws, define */
define('js!SBIS3.CONTROLS.MenuButtonNewMixin', ['js!SBIS3.CONTROLS.ContextMenuNew'], function(ContextMenu) {
   /**
    * Миксин, добавляющий поведение хранения одного или нескольких выбранных элементов
    * @mixin SBIS3.CONTROLS.MenuButtonMixin
    * @public
    * @author Крайнов Дмитрий Олегович
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
         if (this.Source) {
            menuconfig.Source = this.Source;
         }
         else {
            menuconfig.items = this._options.items;
         }
         return new ContextMenu(menuconfig);
      },

      _setPickerContent: function(){
         var self = this,
            header = this._getHeader();
         header.bind('click', function(){
            self._onHeaderClick();
         });
         this._picker.getContainer().prepend(header);
      },

      _getHeader: function(){
         var header = $('<div class="controls-Menu__header">');
         if (this._options.icon) {
            header.append('<i class="' + this._options.iconTemplate(this._options) + '"></i>');
         }
         header.append('<span class="controls-Menu__header-caption">' + (this._options.caption || '')  + '</span>');
         return header;
      },

      _onHeaderClick: function(){
         this.togglePicker();
      },

      after : {
         _initializePicker : function() {
            var self = this;
            this._picker.subscribe('onMenuItemActivate', function(e, id) {
               self._notify('onMenuItemActivate', id);
            });
         },

         //TODO в 3.7.3 ждать починки от Вити
         setEnabled: function (enabled) {
            if (this._picker) {
               this._picker.setEnabled(enabled);
            }
         }
      },

      _redraw  : function() {
         if (this._picker) {
            this._picker.destroy();
            this._initializePicker();
         }
      }
   };

   return MenuButtonMixin;
});
