/**
 * Created by iv.cheremushkin on 23.01.2015.
 */
define('js!SBIS3.CONTROLS.MenuButtonMixin', ['js!SBIS3.CONTROLS.ContextMenu', 'Core/helpers/collection-helpers', 'Core/IoC'], function(ContextMenu, colHelpers, IoC) {
   /**
    * Миксин, добавляющий поведение работы с выподающим меню
    * @mixin SBIS3.CONTROLS.MenuButtonMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    */
   'use strict';

   var MenuButtonMixin = /**@lends SBIS3.CONTROLS.MenuButtonMixin.prototype  */{
       /**
        * @event onMenuItemActivate Происходит при активации пункта меню.
        * @remark
        * Например, при клике по пункту меню.
        * @param {$ws.proto.EventObject} eventObject Дескриптор события.
        * @param {String} id Идентификатор пункта меню.
        * @example
        * <pre>
        *     MenuIcon.subscribe('onMenuItemActivate', function(eventObject, id) {
        *        // getItems() - возвращает экземпляр класса WS.Data/Collection/RecordSet
        *        alert('Вы нажали на ' + MenuIcon.getItems().at(1).get('title'));
        *     })
        * </pre>
        */
      $protected: {
         _options: {
            /**
             * @cfg {String} Устанавливает поле иерархии, по которому будут установлены иерархические связи записей списка.
             * @remark
             * Поле иерархии хранит первичный ключ той записи, которая является узлом для текущей. Значение null - запись расположена в корне иерархии.
             * Например, поле иерархии "Раздел". Название поля "Раздел" необязательное, и в каждом случае может быть разным.
             * @example
             * <pre>
             *    <option name="parentProperty">Раздел</option>
             * </pre>
             */
            parentProperty: null,
            /**
             * @cfg {String} Устанавливает поле в котором хранится признак типа записи в иерархии
             * @remark
             * null - лист, false - скрытый узел, true - узел
             *
             * @example
             * <pre>
             *    <option name="parentProperty">Раздел@</option>
             * </pre>
             */
            nodeProperty: null
         }
      },

      $constructor: function () {
         this._publish('onMenuItemActivate');
         if (this._container.hasClass('controls-Menu__hide-menu-header')){
            this._options.pickerClassName += ' controls-Menu__hide-menu-header';
         }
      },

      //TODO: Постараться придумать что то получше
      // Вешаем на пункты меню отступы слева в соответствии с иконкой у самой кнопки
      _checkItemsIcons: function(items){
         var padding = 'controls-MenuItem__';
         if (this._options.icon && items && !this._container.hasClass('controls-Menu__hide-menu-header')){
            if (this._options.icon.indexOf('icon-16') !== -1){
               padding += 'padding-16';
            } else if (this._options.icon.indexOf('icon-24') !== -1){
               padding += 'padding-24';
            }
         }
         $('> .controls-MenuItem', this._picker.getContainer().find('.controls-Menu__itemsContainer')).each(function(){
            var $this = $(this);
            if (!$this.find('.controls-MenuItem__icon').length) {
               $this.addClass(padding);
            }
         });
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
            parentProperty: this._options.parentProperty,
            nodeProperty: this._options.nodeProperty,
            idProperty: this._options.idProperty,
            additionalProperty: this._options.additionalProperty,
            allowChangeEnable: this._options.allowChangeEnable,
            //title задано для совместимости со старыми контролами, когда люди не указывали displayField
            displayProperty: this._options.displayProperty || 'title',
            verticalAlign: {
               side: 'top'
            },
            horizontalAlign: {
               side: 'left'
            },
            closeByExternalClick: true,
            targetPart: true,
            footerTpl: this._options.footerTpl
         };
         if (this._options.pickerConfig){
            colHelpers.forEach(this._options.pickerConfig, function(val, key) {
               menuconfig[key] = val;
            });
         }
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
         this._picker.getItems() && this._checkItemsIcons(this._picker.getItems());
         this._picker.getContainer().prepend(header);
      },

      _getHeader: function(){
         var header = $('<div class="controls-Menu__header">'),
             headerWrapper = $('<div class="controls-Menu-headWrapper">');

         if (this._options.icon) {
            headerWrapper.append('<i class="controls-Menu__header-icon ' + this._iconTemplate(this._options) + '"></i>');
         }
         headerWrapper.append('<span class="controls-Menu__header-caption">' + (this._options.caption || '')  + '</span>');
         header.append(headerWrapper);
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
                  var firstItem = this._items.at(0);
                  if (firstItem.has('command')) {
                     var sendCommandArgs = [];
                     sendCommandArgs.push(firstItem.get('command'));
                     if (firstItem.has('commandArgs')) {
                        sendCommandArgs.push(firstItem.get('commandArgs'));
                     }
                     this.sendCommand.apply(this, sendCommandArgs);
                  }
                  var id = firstItem.getId();
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
      before : {
         _modifyOptions: function (cfg) {
            if (cfg.hierField) {
               IoC.resolve('ILogger').log('MenuButton', 'Опция hierField является устаревшей, используйте parentProperty');
               cfg.parentProperty = cfg.hierField;
            }
            if (cfg.parentProperty && !cfg.nodeProperty) {
               cfg.nodeProperty = cfg.parentProperty + '@';
            }
         }
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
         setAllowChangeEnable: function (allowChangeEnable) {
            if (this._picker) {
               this._picker.setAllowChangeEnable(allowChangeEnable);
            }
         },
         _drawIcon: function(icon){
            if (this._picker){
               var $icon = $('.controls-Menu__header-icon', this._picker.getContainer()),
                  newclass = 'controls-Menu__header-icon ' + this._options._iconClass;
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
         },

         setCaption: function(caption){
            if (this._picker){
               $('.controls-Menu__header-caption', this._picker._container).html(caption);
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
      },

      /*TODO блок сеттеров для временного решения проблем с названиями опций полей. Избавиться с переходм на интерфейсы вместо миксинов*/
      setKeyField: function(prop) {
         IoC.resolve('ILogger').log('MenuButtonMixin', 'Метод setKeyField устарел, используйте setIdProperty');
         this.setIdProperty(prop);
      },

      setIdProperty: function(prop) {
         this._options.idProperty = prop;
      },

      setDisplayField: function(prop) {
         IoC.resolve('ILogger').log('MenuButtonMixin', 'Метод setDisplayField устарел, используйте setDisplayProperty');
         this.setDisplayProperty(prop);
      },

      setDisplayProperty: function(prop) {
         this._options.displayProperty = prop;
      },

      setHierField: function(prop) {
         IoC.resolve('ILogger').log('MenuButtonMixin', 'Метод setHierField устарел, используйте setParentProperty/setNodeProperty');
         this.setParentProperty(prop);
      },

      setParentProperty: function(prop) {
         this._options.parentProperty = prop;
      },
      setNodeProperty: function(prop) {
         this._options.nodeProperty = prop;
      }
   };

   return MenuButtonMixin;
});
