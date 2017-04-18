define('js!WS.Controls.MenuButton', [
   'js!WS.Controls.Button',
   'js!SBIS3.CONTROLS.ContextMenu',
   'js!SBIS3.CONTROLS.PickerMixin',
   'js!SBIS3.CONTROLS.DSMixin',
   'Core/helpers/dom&controls-helpers',
   'Core/helpers/collection-helpers',
   'Core/IoC',
   'css!WS.Controls.MenuButton'
], function(Button, ContextMenu, PickerMixin, DSMixin, dcHelpers, colHelpers, IoC) {

   'use strict';

   /**
    * Класс контрола "Кнопка с выпадающим меню".
    * @class SBIS3.CONTROLS.MenuButton
    * @extends SBIS3.CONTROLS.Button
    * @remark
    * !Важно: Если в меню задан только один пункт, то меню НЕ будет показано, а при нажатии на кнопку будет выполнено действие, соответствующее этому пункту.
    * Кнопка с меню - это кнопка с выбором варината действия, и если возможно только одно действие, то оно и будет выполнено по нажатию.
    * @demo SBIS3.CONTROLS.Demo.MyMenuButton Пример кнопки с выпадающим меню
    *
    * @mixes SBIS3.CONTROLS.PickerMixin
    * @mixes SBIS3.CONTROLS.DSMixin
    *
    * @author Крайнов Дмитрий Олегович
    *
    * @ignoreOptions independentContext contextRestriction extendedTooltip validators
    * @ignoreOptions element linkedContext handlers parent autoHeight autoWidth horizontalAlignment
    * @ignoreOptions isContainerInsideParent owner stateKey subcontrol verticalAlignment
    *
    * @ignoreMethods activate activateFirstControl activateLastControl addPendingOperation changeControlTabIndex
    * @ignoreMethods applyEmptyState applyState findParent getAlignment getEventHandlers getEvents getExtendedTooltip
    * @ignoreMethods getId getLinkedContext getMinHeight getMinSize getMinWidth getOwner getOwnerId getParentByClass
    * @ignoreMethods getParentByName getParentByWindow getStateKey getTopParent getUserData hasEvent hasEventHandlers
    * @ignoreMethods isDestroyed isSubControl makeOwnerName once sendCommand setOwner setStateKey setUserData setValue
    * @ignoreMethods subscribe unbind unsubscribe
    *
    * @ignoreEvents onDragIn onDragMove onDragOut onDragStart onDragStop onStateChanged onTooltipContentRequest onChange
    * @ignoreEvents onBeforeShow onAfterShow onBeforeLoad onAfterLoad onBeforeControlsLoad onKeyPressed onResize
    * @ignoreEvents onFocusIn onFocusOut onReady onDragIn onDragStart onDragStop onDragMove onDragOut
    *
    * @control
    * @public
    * @category Buttons
    * @initial
    * <component data-component='SBIS3.CONTROLS.MenuButton'>
    *    <option name='caption' value='Кнопка с меню'></option>
    *    <options name="items" type="array">
    *        <options>
    *            <option name="id">1</option>
    *            <option name="title">Пункт1</option>
    *        </options>
    *        <options>
    *            <option name="id">2</option>
    *            <option name="title">Пункт2</option>
    *        </options>
    *    </options>
    * </component>
    */

   var MenuButton = Button.extend( [PickerMixin, DSMixin], /** @lends SBIS3.CONTROLS.MenuButton.prototype */ {
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
            nodeProperty: null,
            /**
             * @cfg {String} Устанавливает заголовок меню, если не задан, то будет отображаться опция caption
             * @example
             * <pre>
             *    <option name="menuCaption">Отметить</option>
             * </pre>
             * @see setMenuCaption
             * @see getMenuCaption
             */
             menuCaption: ''
         }
      },

      _modifyOptions : function(cfg) {
         if (cfg.hierField) {
            IoC.resolve('ILogger').log('MenuButton', 'Опция hierField является устаревшей, используйте parentProperty');
            cfg.parentProperty = cfg.hierField;
         }
         if (cfg.parentProperty && !cfg.nodeProperty) {
            cfg.nodeProperty = cfg.parentProperty + '@';
         }

         var opts = MenuButton.superclass._modifyOptions.apply(this, arguments);
         //opts.pickerClassName += ' controls-MenuButton__Menu';
         //opts.pickerClassName += ' controls-MenuLink__Menu';
         return opts;
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

      init: function(){
         this._container.addClass('controls-MenuButton');
         if(this._container.hasClass('controls-Button__big')){
            this._options.pickerClassName += ' controls-Menu__big';
         }
         this.reload();
         MenuButton.superclass.init.call(this);
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
      /**
       * Показывает меню у кнопки
       */
      showPicker: function() {
         MenuButton.superclass.showPicker.call(this);
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

      _setWidth: function(){
         //Установить ширину меню
      },

      _initializePicker: function(){
         MenuButton.superclass._initializePicker.call(this);
         var self = this;
         this._picker._oppositeCorners.tl.horizontal.top = 'tr';
         this._picker._oppositeCorners.tr.horizontal.top = 'tl';
         this._picker.subscribe('onDrawItems', function(){
            self._picker.recalcPosition(true);
         });

         this._picker.subscribe('onMenuItemActivate', function(e, id, mEvent) {
            self._notify('onMenuItemActivate', id, mEvent);
         });
         this._setWidth();
      },

      setEnabled: function (enabled) {
         MenuButton.superclass.setEnabled.apply(this, arguments);
         if (this._picker) {
            this._picker.setEnabled(enabled);
         }
      },

      setAllowChangeEnable: function (allowChangeEnable) {
         MenuButton.superclass.setAllowChangeEnable.apply(this, arguments);
         if (this._picker) {
            this._picker.setAllowChangeEnable(allowChangeEnable);
         }
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

      setCaption: function(caption){
         MenuButton.superclass.setCaption.apply(this, arguments);
         !this._options.menuCaption && this.setMenuCaption(caption);
      },

       setMenuCaption: function (menuCaption) {
           this._options.menuCaption = menuCaption || '';
           if (this._picker && menuCaption){
               $('.controls-Menu__header-caption', this._picker._container).html(menuCaption);
           }
       },

       getMenuCaption: function () {
           return this._options.menuCaption;
       },

      _drawIcon: function(icon){
         MenuButton.superclass._drawIcon.apply(this, arguments);
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

      _getHeader: function(){
         var header = $('<div class="controls-Menu__header">'),
             headerWrapper = $('<div class="controls-Menu-headWrapper">');

         if (this._options.icon) {
            headerWrapper.append('<i class="controls-Menu__header-icon ' + this._iconTemplate(this._options) + '"></i>');
         }
         headerWrapper.append('<span class="controls-Menu__header-caption">' + (this._options.menuCaption || this._options.caption || '')  + '</span>');
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

      _redraw  : function() {
         if (this._picker) {
            this._picker.destroy();
            this._initializePicker();
         }
      },

       _dataLoadedCallback : function() {
         if (this._picker){
            this.hidePicker();
         }
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
   });

   return MenuButton;

});