define('Controls/Dropdown/resources/template/DropdownList',
   [
      'Core/Control',
      'wml!Controls/Dropdown/resources/template/DropdownList',
      'Controls/Dropdown/resources/DropdownViewModel',
      'Controls/Popup/PopupContext',
      'wml!Controls/Dropdown/resources/template/defaultGroupTemplate',
      'wml!Controls/Dropdown/resources/template/itemTemplate',
      'wml!Controls/Dropdown/resources/template/defaultHeadTemplate',
      'wml!Controls/Dropdown/resources/template/defaultContentHeadTemplate',

      'css!theme?Controls/Dropdown/resources/template/DropdownList'
   ],
   function(Control, MenuItemsTpl, DropdownViewModel, PopupContext, groupTemplate, itemTemplate, defaultHeadTemplate, defaultContentHeadTemplate) {
      var _private = {

         setPopupOptions: function(self, horizontalAlign) {
            var align = horizontalAlign || 'right';
            self._popupOptions = {

               // submenu doesn't catch focus, because parent menu can accept click => submenu will deactivating and closing
               autofocus: false,
               horizontalAlign: {
                  side: align
               },
               corner: {
                  horizontal: align
               },
               eventHandlers: {
                  onResult: self.resultHandler
               }
            };
         },

         getDropdownClass: function(verticalAlign, typeShadow) {
            return 'controls-DropdownList__popup-' + verticalAlign.side +
               ' controls-DropdownList__popup-shadow-' + typeShadow;
         },

         getSubMenuPosition: function(options, popupOptions) {
            // The first level of the popup is always positioned on the right by standard
            if (!options.rootKey) {
               return {
                  corner: {
                     horizontal: 'right'
                  },
                  horizontalAlign: {
                     side: 'right'
                  }
               };
            }

            // The others child menu levels are positioned in the same direction as the parent.
            return popupOptions;
         },

         getSubMenuOptions: function(options, popupOptions, event, item) {
            var subMenuPosition = _private.getSubMenuPosition(options, popupOptions);
            return {
               templateOptions: {
                  items: options.items,
                  itemTemplate: options.itemTemplate,
                  itemTemplateProperty: options.itemTemplateProperty,
                  keyProperty: options.keyProperty,
                  displayProperty: options.displayProperty,
                  parentProperty: options.parentProperty,
                  nodeProperty: options.nodeProperty,
                  selectedKeys: options.selectedKeys,
                  rootKey: item.get(options.keyProperty),
                  showHeader: false,
                  dropdownClassName: options.dropdownClassName,
                  defaultItemTemplate: options.defaultItemTemplate
               },
               corner: subMenuPosition.corner,
               horizontalAlign: subMenuPosition.horizontalAlign,
               target: event.target
            };
         }

      };

      /**
       *
       * Действие открытия прилипающего окна
       * @control
       * @public
       * @category Popup
       */

      /**
        * @name Controls/Menu#menuStyle
        * @cfg {String} Отображения меню
        * @variant defaultHead Стандартный заголовок
        * @variant duplicateHead Иконка вызывающего элемента дублрируется в первый пункт. Заголовка с фоном нет.
        */
      /**
        * @name Controls/Menu#showHeader
        * @cfg {Boolean} Показывать ли заголовок в меню.
        * @variant true Заголовок есть
        * @variant false Заголовка нет.
        */
      var Menu = Control.extend([], {
         _template: MenuItemsTpl,
         _expanded: false,
         _groupTemplate: groupTemplate,
         _defaultItemTemplate: itemTemplate,
         _defaultHeadTemplate: defaultHeadTemplate,
         _defaultContentHeadTemplate: defaultContentHeadTemplate,
         _hasHierarchy: false,
         _listModel: null,

         constructor: function(config) {
            var self = this;
            var sizes = ['small', 'medium', 'large'];
            var iconSize;

            if (config.defaultItemTemplate) {
               this._defaultItemTemplate = config.defaultItemTemplate;
            }
            if (config.groupTemplate) {
               this._groupTemplate = config.groupTemplate;
            }

            if (config.showHeader) {
               this._headConfig = config.headConfig || {};
               this._headConfig.caption = this._headConfig.caption || config.caption;
               this._headConfig.icon = this._headConfig.icon || config.icon;
               this._headConfig.menuStyle = this._headConfig.menuStyle || 'defaultHead';

               if (this._headConfig.icon) {
                  sizes.forEach(function(size) {
                     if (self._headConfig.icon.indexOf('icon-' + size) !== -1) {
                        iconSize = size;
                     }
                  });
               } else if (config.iconPadding[config.parentProperty]) {
                  this._headConfig.icon = config.iconPadding[config.parentProperty][1];
               }
               if (this._headConfig.menuStyle === 'duplicateHead') {
                  this._duplicateHeadClassName = 'control-MenuButton-duplicate-head_' + iconSize;
               }
            }
            Menu.superclass.constructor.apply(this, arguments);
            this.resultHandler = this.resultHandler.bind(this);
            this._mousemoveHandler = this._mousemoveHandler.bind(this);
         },
         _beforeMount: function(newOptions) {
            if (newOptions.items) {
               this._listModel = new DropdownViewModel({
                  items: newOptions.items,
                  rootKey: newOptions.rootKey || null,
                  selectedKeys: newOptions.selectedKeys,
                  keyProperty: newOptions.keyProperty,
                  additionalProperty: newOptions.additionalProperty,
                  itemTemplateProperty: newOptions.itemTemplateProperty,
                  displayProperty: newOptions.displayProperty,
                  nodeProperty: newOptions.nodeProperty,
                  parentProperty: newOptions.parentProperty,
                  emptyText: newOptions.emptyText,
                  groupTemplate: newOptions.groupTemplate,
                  groupMethod: newOptions.groupMethod
               });
               this._hasHierarchy = this._listModel.hasHierarchy();
               this._hasAdditional = this._listModel.hasAdditional();
               _private.setPopupOptions(this);
            }
         },

         _beforeUpdate: function(newOptions, context) {
            var rootChanged = newOptions.rootKey !== this._options.rootKey,
               itemsChanged = newOptions.items !== this._options.items;

            if (rootChanged) {
               this._listModel.setRootKey(newOptions.rootKey);
            }

            if (itemsChanged) {
               this._listModel.setItems(newOptions);
               if (this._hasHierarchy) {
                  this._children.subDropdownOpener.close();
               }
            }

            if (rootChanged || itemsChanged) {
               this._hasHierarchy = this._listModel.hasHierarchy();
               this._hasAdditional = this._listModel.hasAdditional();
            }

            if (context && context.stickyCfg.horizontalAlign &&
               (!this._popupOptions || this._popupOptions.horizontalAlign !== context.stickyCfg.horizontalAlign)) {
               this._dropdownClass = _private.getDropdownClass(context.stickyCfg.verticalAlign, newOptions.typeShadow);
               _private.setPopupOptions(this, context.stickyCfg.horizontalAlign.side);
            }
         },

         _itemMouseEnter: function(event, item, hasChildren) {
            if (hasChildren) {
               var config = _private.getSubMenuOptions(this._options, this._popupOptions, event, item);
               this._children.subDropdownOpener.open(config, this);
            } else if (this._hasHierarchy) {
               this._children.subDropdownOpener.close();
            }
         },

         //TODO FOR COMPATIBLE. для чистого вдома этот метод излишен, но логику не ломает
         _mouseOutHandler: function(event) {
            //todo https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
            var container = this._container.get ? this._container.get(0) : this._container;
            if (!event.target.closest('.controls-DropdownList__popup') && container.closest('.controls-DropdownList__subMenu')) {
               this._children.subDropdownOpener.close();
            }
         },

         _additionMouseenter: function() {
            if (this._hasHierarchy) {
               this._children.subDropdownOpener.close();
            }
         },

         resultHandler: function(result) {
            switch (result.action) {
               case 'itemClick':
                  this._children.subDropdownOpener.close();
               case 'pinClicked':
                  this._notify('sendResult', [result]);
            }
         },

         _onItemSwipe: function(event, itemData) {
            if (event.nativeEvent.direction === 'left') {
               this._listModel.setSwipeItem(itemData);
            }
            if (event.nativeEvent.direction === 'right') {
               this._listModel.setSwipeItem(null);
            }
         },

         _itemClickHandler: function(event, item, pinClicked) { // todo нужно обсудить
            var result = {
               action: pinClicked ? 'pinClicked' : 'itemClick',
               event: event,
               data: [item]
            };

            // means that pin button was clicked
            if (pinClicked) {
               event.stopPropagation();
            }
            this._notify('sendResult', [result]);
         },
         _footerClick: function(event) {
            var result = {
               action: 'footerClick',
               event: event
            };
            this._notify('sendResult', [result]);
         },
         _headerClick: function() {
            this._notify('close');
         },
         _closeClick: function() {
            this._notify('close');
         },
         _mousemoveHandler: function(emitterEvent, event) {
            //todo https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
            var container = this._container.get ? this._container.get(0) : this._container;
            if (!event.target.closest('.controls-DropdownList__popup') && container.closest('.controls-DropdownList__subMenu')) {
               this._notify('close');
            }
         },
         _toggleExpanded: function() {
            this._listModel.toggleExpanded(this._expanded);
            this._hasHierarchy = this._listModel.hasHierarchy();
            this._forceUpdate();
         },
         _beforeUnmount: function() {
            if (this._listModel) {
               this._listModel.destroy();
               this._listModel = null;
            }
         }
      });

      Menu._private = _private;

      Menu.contextTypes = function() {
         return {
            stickyCfg: PopupContext
         };
      };

      Menu.getDefaultOptions = function() {
         return {
            menuStyle: 'defaultHead',
            typeShadow: 'default'
         };
      };

      return Menu;
   });
