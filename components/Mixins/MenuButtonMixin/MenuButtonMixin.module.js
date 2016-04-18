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

      //TODO: Можно будет выпилить когда меню будет сделано через таблицу
      //3.7.3.10: придрот для отсупа в пунктах меню, если ни в одном пункте нет иконки а у кнопки есть
      _checkItemsIcons: function(items){
         var icon = 'sprite:';
         if (this._options.icon && items && !this._container.hasClass('controls-Menu__hide-menu-header')){
            if (this._options.icon.indexOf('icon-16') !== -1){
               icon += 'icon-16';
            } else if (this._options.icon.indexOf('icon-24') !== -1){
               icon += 'icon-24';
            }
            var field = {name: 'icon', type: 'string'},
               owner,
               item,
               i;
            for (i = 0; i < items.length; i++){
               item = items[i];
               //отступы нужны только в основном меню, но не в сабменю
               if (!item.has('icon')) {
                  owner = item.getOwner();
                  if (owner) {
                     owner.addField(field);
                  } else {
                     item.addField(field);
                  }
               }
               if (!item.get('icon') && !item.get(this._options.hierField)) { item.set('icon', icon);}
            }
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
         var header = $('<div class="controls-Menu__header">');
         if (this._options.icon) {
            header.append('<i class="controls-Menu__header-icon ' + this._iconTemplate(this._options) + '"></i>');
         }
         header.append('<span class="controls-Menu__header-caption">' + (this._options.caption || '')  + '</span>');
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
         redraw: function(){
            this.getItems() && this._checkItemsIcons(this.getItems().toArray());
         },

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
