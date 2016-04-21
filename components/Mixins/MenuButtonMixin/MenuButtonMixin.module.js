/**
 * Created by iv.cheremushkin on 23.01.2015.
 */
define('js!SBIS3.CONTROLS.MenuButtonMixin', ['js!SBIS3.CONTROLS.ContextMenu'], function(ContextMenu) {
   /**
    * Миксин, добавляющий поведение работы с выподающим меню
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
         if (this._container.hasClass('controls-Menu__hide-menu-header')){
            this._options.pickerClassName += ' controls-Menu__hide-menu-header';
         }
      },

      _createPicker: function(targetElement){
         var menuconfig = {
            parent: this.getParent(),
            opener: this,
            groupBy: this._options.groupBy,
            context: this.getParent() ? this.getParent().getLinkedContext() : {},
            element: targetElement,
            target : this.getContainer(),
            //items могли задать через опцию или через setItems
            items: this._options.items  ||  this._items,
            corner : 'tl',
            filter: this._options.filter,
            enabled: this.isEnabled(),
            hierField: this._options.hierField,
            keyField: this._options.keyField,
            allowChangeEnable: this._options.allowChangeEnable,
            //title задано для совместимости со старыми контролами, когда люди не указывали displayField
            displayField: this._options.displayField || 'title',
            verticalAlign: {
               side: 'top'
            },
            horizontalAlign: {
               side: 'left'
            },
            closeByExternalClick: true,
            targetPart: true
         };
         menuconfig = this._modifyPickerOptions(menuconfig);
         if (this._dataSource) {
            menuconfig.dataSource = this._dataSource;
         }
         return new ContextMenu(menuconfig);
      },

      _modifyPickerOptions: function(opts) {
         return opts;
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
         var header = $('<tr class="controls-Menu__header">');
         var colspan = '';
         if (this._options.icon) {
            header.append('<td class="controls-Menu__header-icon ' + this._iconTemplate(this._options) + '"></td>');
         } else {
            colspan='colspan="3"';
         }
         header.append('<td class="controls-Menu__header-caption"' + colspan + '>' + (this._options.caption || '')  + '</td>');
         return header;
      },

      _onHeaderClick: function(){
         this.togglePicker();
      },

      //Прокидываем вызов метода в меню
      getItemsInstances: function() {
         if (!this._picker) {
            this._initializePicker();
         }
         return this._picker.getItemsInstances.apply(this._picker, arguments);
      },

      _clickHandler: function (event) {
         if (this._items){
            if (this._items.getCount() > 1) {
               this.togglePicker();
            } else {
               if (this._items.getCount() == 1) {
                  var id = this._items.at(0).getId();
                  this._notify('onMenuItemActivate', id, event);
               }
            }
         }
      },

      _dataLoadedCallback : function() {
         if (this._picker) this.hidePicker();
      },

      _setWidth: function(){
         //Установить ширину меню
      },
      after : {

         _initializePicker : function() {
            var self = this;
            this._picker.subscribe('onMenuItemActivate', function(e, id, mEvent) {
               self._notify('onMenuItemActivate', id, mEvent);
            });
            this._setWidth();
         },

         //TODO в 3.7.3 ждать починки от Вити
         setEnabled: function (enabled) {
            if (this._picker) {
               this._picker.setEnabled(enabled);
            }
         },
         _drawIcon: function(icon){
            if (this._picker){
               var $icon = $('.controls-Menu__header-icon', this._picker.getContainer()),
                  newclass = 'controls-Menu__header-icon ' + this._iconClass;
               if (icon) {
                  if ($icon.length){
                     $icon.get(0).className = newclass;
                  } else {
                     var $caption = $('.controls-Menu__header-caption', this._picker.getContainer().get(0));
                     $icon = $('<i class="' + newclass + '"></i>');
                     $caption.before($icon);
                  }
               } else {
                  $icon && $icon.remove();
               }
            }
         }
      },

      _redraw  : function() {
         if (this._picker) {
            this._picker.destroy();
            this._initializePicker();
         }
      },
      /*TODO придротный метод для совместимости, надо выпилить*/
      addItem : function(item) {
         var items = this.getItems() || [];
         items.push(item);
         this.setItems(items);
      }
   };

   return MenuButtonMixin;
});
