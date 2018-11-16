define('SBIS3.CONTROLS/WSControls/Buttons/MenuButton', [
   'SBIS3.CONTROLS/WSControls/Buttons/Button',
   'SBIS3.CONTROLS/Mixins/PickerMixin',
   'SBIS3.CONTROLS/Mixins/DSMixin',
   'Core/IoC',
   'Core/detection',
   'Core/Sanitize',
   'Core/helpers/String/escapeHtml',
   'Core/Deferred',
   'Core/ParallelDeferred',
   'Core/moduleStubs'
], function(
   Button, PickerMixin, DSMixin, IoC, detection, Sanitize, escapeHtml, Deferred, ParallelDeferred, moduleStubs
) {

   'use strict';
   
   function _getContextMenu(callback, history) {
      var ctxMenu = history ? 'SBIS3.CONTROLS/Menu/SbisMenu' : 'SBIS3.CONTROLS/Menu/ContextMenu';
      if (requirejs.defined(ctxMenu)) {
         return callback(requirejs(ctxMenu));
      } else {
         requirejs([ctxMenu], function(menu) {
            return callback(menu);
         });
      }
   }

   /**
    * Класс контрола "Кнопка с выпадающим меню".
    * @class WSControls/Buttons/MenuButton
    * @extends WSControls/Buttons/Button
    * @remark
    * !Важно: Если в меню задан только один пункт, то меню НЕ будет показано, а при нажатии на кнопку будет выполнено действие, соответствующее этому пункту.
    * Кнопка с меню - это кнопка с выбором варината действия, и если возможно только одно действие, то оно и будет выполнено по нажатию.
    * @demo Examples/MenuButton/MyMenuButton/MyMenuButton Пример кнопки с выпадающим меню
    *
    * @mixes SBIS3.CONTROLS/Mixins/PickerMixin
    * @mixes SBIS3.CONTROLS/Mixins/DSMixin
    *
    * @author Романов Валерий
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
    * @category Button
    * @initial
    * <component data-component='SBIS3.CONTROLS/WSControls/Buttons/MenuButton'>
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

   var MenuButton = Button.extend([PickerMixin, DSMixin], /** @lends WSControls/Buttons/MenuButton.prototype */ {
      /**
       * @event onMenuItemActivate Происходит при клике по пункту меню.
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @param {String} id Идентификатор пункта.
       * @param {Object} mEvent Объект, который содержит более полную информацию о событии (по сравнению с объектом события eventObject).
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
            menuCaption: '',

            /**
              * @cfg {String} Идентификатор истории ввода
              */
            historyId: null,

            /**
              * @cfg {Boolean} Показывать ли припиненные
              */
            pinned: false,

            /**
              * @cfg {Boolean} Показывать ли наиболее частые
              */
            frequent: false,

            /**
             * @cfg {Boolean} Экранирует текст в пунктах меню, если опция не задана на элементе
             */
            escapeHtmlItems: false,

            /**
             * @cfg {Boolean} При открытии меню не перегружает данные из dataSource, а использует уже подгруженные
             */
            fromItems: false
         },
         // из menu приходит готовый набор элементов и нет необходимости посылать повторно запрос на БЛ
         _loadFromItems: false
      },

      _modifyOptions: function(cfg) {
         if (cfg.hierField) {
            IoC.resolve('ILogger').log('MenuButton', 'Опция hierField является устаревшей, используйте parentProperty');
            cfg.parentProperty = cfg.hierField;
         }
         if (cfg.parentProperty && !cfg.nodeProperty) {
            cfg.nodeProperty = cfg.parentProperty + '@';
         }

         var opts = MenuButton.superclass._modifyOptions.apply(this, arguments);

         opts.caption = Sanitize(opts.caption, {validNodes: {component: true}});
         opts.menuCaption = Sanitize(opts.menuCaption, {validNodes: {component: true}});

         return opts;
      },

      $constructor: function() {
         this._publish('onMenuItemActivate');
         if (this._container.hasClass('controls-Menu__hide-menu-header')) {
            this._options.pickerClassName += ' controls-Menu__hide-menu-header';
         }
      },

      //TODO: Постараться придумать что то получше
      // Вешаем на пункты меню отступы слева в соответствии с иконкой у самой кнопки
      _checkItemsIcons: function(items) {
         var self = this,
            padding = 'controls-MenuItem__',
            sizes = ['16', '24', '32', 'small', 'medium', 'large'];
         if (this._options.icon && items && !this._container.hasClass('controls-Menu__hide-menu-header')) {
            sizes.forEach(function(size) {
               if (self._options.icon.indexOf('icon-' + size) !== -1) {
                  padding += 'padding-' + size;
               }
            });
         }
         $('> .controls-MenuItem', this._picker.getContainer().find('.controls-Menu__itemsContainer')).each(function() {
            var $this = $(this);
            if (!$this.find('.controls-MenuItem__icon').length) {
               $this.addClass(padding);
            }
         });
      },

      init: function() {
         this._container.addClass('controls-MenuButton');
         if (this._container.hasClass('controls-Button__big')) {
            this._options.pickerClassName += ' controls-Menu__big';
         }
         this.reload();
         MenuButton.superclass.init.call(this);
      },

      _clickHandler: function(event) {
         if (this._items) {
            if (this._items.getCount() > 1) {
               this.togglePicker();
            } else {
               if (this._items.getCount() == 1) {
                  var id = this._items.at(0).getId(),
                     command = this._items.at(0).get('command'),
                     commandArgs, args;

                  if (command) {
                     commandArgs = this._items.at(0).get('commandArgs');
                     args = [command].concat(commandArgs ? commandArgs : []);
                     this.sendCommand.apply(this, args);
                  }

                  this._notify('onMenuItemActivate', id, event);
               }
            }
         }
      },

      /**
       * Показывает меню у кнопки
       */
      showPicker: function() {
         var self = this,
            loadContextMenu = function() {
               var loadDef = new Deferred();
               _getContextMenu(function() {
                  loadDef.callback();
               }, self._options.historyId);
               return loadDef;
            },
            finalCallBack = function() {
               MenuButton.superclass.showPicker.call(self);
               self._picker.subscribe('ondrawitems', function() {
                  self._checkItemsIcons(self._picker.getItems());
               });
            };
         if (!self._options.footerTpl && self._options.footerTemplateName) {
            var loadDependencies = new ParallelDeferred();
            loadDependencies.push(loadContextMenu());
            loadDependencies.push(moduleStubs.require(self._options.footerTemplateName).addCallback(function(footerTpl) {
               self._options.footerTpl = footerTpl;
            }));
            loadDependencies.done().getResult().addCallback(finalCallBack);
         } else {
            loadContextMenu().addCallback(finalCallBack);
         }
      },

      getPicker: function() {
         if (!requirejs.defined('SBIS3.CONTROLS/Menu/ContextMenu')) {
            IoC.resolve('ILogger').log('MenuButton', 'ContextMenu не загружено');
            return;
         }
         return MenuButton.superclass.getPicker.call(this);
      },

      _createPicker: function(targetElement) {
         var menuconfig = {
            parent: this.getParent(),
            opener: this,
            groupBy: this._options.groupBy,
            context: this.getParent() ? this.getParent().getLinkedContext() : {},
            element: targetElement,
            target: this.getContainer(),
            className: this._options.pickerClassName,

            //items могли задать через опцию или через setItems
            items: this._items || this._options.items,
            corner: 'tl',
            filter: this._options.filter,
            enabled: this.isEnabled(),
            parentProperty: this._options.parentProperty,
            nodeProperty: this._options.nodeProperty,
            idProperty: this._options.idProperty,
            additionalProperty: this._options.additionalProperty,
            allowChangeEnable: this._options.allowChangeEnable,
            escapeHtmlItems: this._options.escapeHtmlItems,
            //title задано для совместимости со старыми контролами, когда люди не указывали displayField
            displayProperty: this._options.displayProperty || 'title',
            verticalAlign: {
               side: 'top'
            },
            horizontalAlign: {
               side: 'left'
            },
            closeByExternalClick: true,
            closeOnTargetMove: true,
            targetPart: true,
            footerTpl: this._options.footerTpl,
            _canScroll: true,
            loadFromItems: this._options.fromItems ? this._loadFromItems : false
         };
         if (this._options.historyId) {
            menuconfig['historyId'] = this._options.historyId;
            menuconfig['pinned'] = this._options.pinned;
            menuconfig['frequent'] = this._options.frequent;
            menuconfig['recent'] = this._options.recent;

         }
         if (this._options.pickerConfig) {
            for (var key in this._options.pickerConfig) {
               if (this._options.pickerConfig.hasOwnProperty(key)) {
                  menuconfig[key] = this._options.pickerConfig[key];
               }
            }
         }
         menuconfig = this._modifyPickerOptions(menuconfig);
         if (this._dataSource) {
            menuconfig.dataSource = this._dataSource;
         }

         // Передаем в контекстное меню стратегию позиционирования
         menuconfig.subMenuLocationStrategy = this._options.subMenuLocationStrategy;

         //_getContextMenu отработает синхронно, т.к. в _createPicker попадаем когда menu уже загружено
         return _getContextMenu(function(menu) {
            return new menu(menuconfig);
         }, this._options.historyId);
      },

      _modifyPickerOptions: function(opts) {
         return opts;
      },

      _setWidth: function() {
         //Установить ширину меню
      },

      _initializePicker: function() {
         MenuButton.superclass._initializePicker.call(this);
         var self = this;
         this._picker._oppositeCorners.tl.horizontal.top = 'tr';
         this._picker._oppositeCorners.tr.horizontal.top = 'tl';
         this._picker.subscribe('onDrawItems', function() {
            self._picker.recalcPosition(true);
         });

         this._picker.subscribe('onMenuItemActivate', function(e, id, mEvent) {
            self._notify('onMenuItemActivate', id, mEvent);
         });
         this._setWidth();

         //В ie и ff баг с flex-direction: column-reverse: С overflow: hidden скролл на контейнере не появляется
         //Убрал flex с основного контейнера, меню перемещаю через изменение положения узла в dom-дереве
         //https://stackoverflow.com/questions/34249501/flexbox-column-reverse-and-overflow-in-firefox-ie
         //https://bugzilla.mozilla.org/show_bug.cgi?id=1042151
         if (detection.firefox || detection.isIE) {
            this.getPicker().subscribe('onAlignmentChange', function() {
               var picker = this.getPicker(),
                  isVerticalRevert = picker.getContainer().hasClass('controls-popup-revert-vertical'),
                  header = $('.controls-Menu__header', picker.getContainer());
               if (header.length) {
                  if (isVerticalRevert) {
                     picker.getContainer().append(header);
                  } else {
                     picker.getContainer().prepend(header);
                  }
               }

            }.bind(this));
         }
      },

      setEnabled: function(enabled) {
         MenuButton.superclass.setEnabled.apply(this, arguments);
         if (this._picker) {
            this._picker.setEnabled(enabled);
         }
      },

      setAllowChangeEnable: function(allowChangeEnable) {
         MenuButton.superclass.setAllowChangeEnable.apply(this, arguments);
         if (this._picker) {
            this._picker.setAllowChangeEnable(allowChangeEnable);
         }
      },

      _setPickerContent: function() {
         var self = this,
            header = this._getHeader();
         header.bind('click', function() {
            self._onHeaderClick();
         });
         this._picker.getItems() && this._checkItemsIcons(this._picker.getItems());
         this._picker.getContainer().prepend(header);
      },

      setCaption: function(caption) {
         MenuButton.superclass.setCaption.apply(this, arguments);
         !this._options.menuCaption && this._drawMenuCaption(caption);
      },

      setMenuCaption: function(menuCaption) {
         this._options.menuCaption = menuCaption || '';
         this._drawMenuCaption(menuCaption);
      },

      _drawMenuCaption: function(menuCaption) {
         if (this._picker && menuCaption) {
            if (this._options.escapeCaptionHtml) {
               menuCaption = escapeHtml(menuCaption);
            }
            menuCaption = Sanitize(menuCaption, {validNodes: {component: true}});
            $('.controls-Menu__header-caption', this._picker._container).html(menuCaption);
         }
      },

      getMenuCaption: function() {
         return this._options.menuCaption;
      },

      _drawIcon: function(icon) {
         MenuButton.superclass._drawIcon.apply(this, arguments);
         if (this._picker) {
            var $icon = $('.controls-Menu__header-icon', this._picker.getContainer()),
               newclass = 'controls-Menu__header-icon ' + this._options._iconClass;
            if (icon) {
               if ($icon.length) {
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

      _getHeader: function() {
         var header = $('<div class="controls-Menu__header">'),
            headerWrapper = $('<div class="controls-Menu-headWrapper">');

         if (this._options.icon) {
            headerWrapper.append('<i class="controls-Menu__header-icon ' + this._iconTemplate(this._options) + '"></i>');
         }
         headerWrapper.append('<span class="controls-Menu__header-caption">' + (this._options.menuCaption || this._options.caption || '')  + '</span>');
         header.append(headerWrapper);
         return header;
      },

      _onHeaderClick: function() {
         this.togglePicker();
      },

      //Прокидываем вызов метода в меню
      getItemsInstances: function() {
         if (!this._picker) {
            throw new Error('SBIS3.CONTROLS/WSControls/Buttons/MenuButton::getItemsInstances  Попытка получения инстансов элементов меню до инициализации пикера.');
         }
         return this._picker.getItemsInstances.apply(this._picker, arguments);
      },

      _redraw: function() {
         if (this._picker) {
            this._picker.destroy();
            this._initializePicker();
         }
      },

      _dataLoadedCallback: function() {
         var items = this.getItems();
         this._loadFromItems = true;

         if (this._picker) {
            this.hidePicker();
            this._picker.setItems(items);
         }

         // если в меню один пункт, то состояние доступности кнопки определяется по этому пункту
         if (items.getCount() === 1 && items.at(0).has('enabled')) {
            this.setEnabled(items.at(0).get('enabled'));
         }
      },

      /*TODO блок сеттеров для временного решения проблем с названиями опций полей. Избавиться с переходм на интерфейсы вместо миксинов*/
      setKeyField: function(prop) {
         IoC.resolve('ILogger').log('MenuButton', 'Метод setKeyField устарел, используйте setIdProperty');
         this.setIdProperty(prop);
      },

      setIdProperty: function(prop) {
         this._options.idProperty = prop;
      },

      setDisplayField: function(prop) {
         IoC.resolve('ILogger').log('MenuButton', 'Метод setDisplayField устарел, используйте setDisplayProperty');
         this.setDisplayProperty(prop);
      },

      setDisplayProperty: function(prop) {
         this._options.displayProperty = prop;
      },

      setHierField: function(prop) {
         IoC.resolve('ILogger').log('MenuButton', 'Метод setHierField устарел, используйте setParentProperty/setNodeProperty');
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
