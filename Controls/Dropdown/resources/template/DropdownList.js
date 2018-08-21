define('Controls/Dropdown/resources/template/DropdownList',
   [
      'Core/Control',
      'tmpl!Controls/Dropdown/resources/template/DropdownList',
      'Controls/Dropdown/resources/DropdownViewModel',
      'tmpl!Controls/Dropdown/resources/template/defaultGroupTemplate',
      'tmpl!Controls/Dropdown/resources/template/itemTemplate',
      'tmpl!Controls/Dropdown/resources/template/defaultHeadTemplate',
      'tmpl!Controls/Dropdown/resources/template/defaultContentHeadTemplate',
      'Controls/Container/Scroll/Context',

      'css!Controls/Dropdown/resources/template/DropdownList'
   ],
   function(Control, MenuItemsTpl, DropdownViewModel, groupTemplate, itemTemplate, defaultHeadTemplate, defaultContentHeadTemplate, ScrollData) {
      // TODO: Убрать определение контекста для Scroll, когда будет готова поддержка контекста для старого окружения.
      var _private = {
         setPopupOptions: function(self) {
            self._popupOptions = {

               // submenu doesn't catch focus, because parent menu can accept click => submenu will deactivating and closing
               autofocus: false,
               corner: {
                  horizontal: 'right'
               },
               eventHandlers: {
                  onResult: self.resultHandler
               }
            };
         }
      };

      /**
       * Действие открытия прилипающего окна
       * @class Controls/Popup/Opener/Menu
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

         constructor: function(config) {
            var self = this;
            var sizes = ['small', 'medium', 'large'];
            var iconSize;

            if (config.defaultItemTemplate) {
               this._defaultItemTemplate = config.defaultItemTemplate;
            }
            if (config.itemsGroup && config.itemsGroup.template) {
               this._groupTemplate = config.itemsGroup.template;
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
               }
               if (this._headConfig.menuStyle === 'duplicateHead') {
                  this._duplicateHeadClassName = 'control-MenuButton-duplicate-head_' + iconSize;
               }
            }
            Menu.superclass.constructor.apply(this, arguments);
            this.resultHandler = this.resultHandler.bind(this);
            this._mousemoveHandler = this._mousemoveHandler.bind(this);

            this._scrollData = new ScrollData({ pagingVisible: false });
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
                  nodeProperty: newOptions.nodeProperty,
                  parentProperty: newOptions.parentProperty,
                  emptyText: newOptions.emptyText,
                  itemsGroup: newOptions.itemsGroup
               });
               this._hasHierarchy = this._listModel.hasHierarchy();
            }
            _private.setPopupOptions(this, newOptions);
         },

         _beforeUpdate: function(newOptions) {
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
            }
         },

         _itemMouseEnter: function(event, item, hasChildren) {
            if (hasChildren) {
               var config = {
                  templateOptions: {
                     items: this._options.items,
                     itemTemplate: this._options.itemTemplate,
                     keyProperty: this._options.keyProperty,
                     parentProperty: this._options.parentProperty,
                     nodeProperty: this._options.nodeProperty,
                     selectedKeys: this._options.selectedKeys,
                     rootKey: item.get(this._options.keyProperty),
                     showHeader: false,
                     defaultItemTemplate: this._options.defaultItemTemplate
                  },
                  corner: {
                     horizontal: 'right'
                  },
                  target: event.target
               };
               this._children.subDropdownOpener.open(config, this);
            } else if (this._hasHierarchy) {
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
               case 'pinClicked':
                  this._notify('sendResult', [result]);
            }
         },

         _onItemSwipe: function(event, itemData) {
            if (event.nativeEvent.direction === 'left') {
               this._listModel.setSwipeItem(itemData);
            }
            if (event.nativeEvent.direction === 'right') {
               this._listModel.removeSwipeItem();
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
            if (!event.target.closest('.controls-DropdownList__popup') && this._container.closest('.controls-DropdownList__subMenu')) { // Если увели курсор мимо - закрываемся
               this._notify('close');
            }
         },
         _toggleExpanded: function() {
            this._expanded = !this._expanded;
            this._listModel.toggleExpanded(this._expanded);
            this._hasHierarchy = this._listModel.hasHierarchy();
            this._forceUpdate();
         },
         _getChildContext: function() {
            return {
               ScrollData: this._scrollData
            };
         }
      });

      Menu._private = _private;

      Menu.getDefaultOptions = function() {
         return {
            menuStyle: 'defaultHead',
            typeShadow: 'default'
         };
      };

      return Menu;
   });
