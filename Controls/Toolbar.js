define('Controls/Toolbar', [
   'Core/Control',
   'Controls/Controllers/SourceController',
   'wml!Controls/Toolbar/Toolbar',
   'wml!Controls/Toolbar/ToolbarItemTemplate',
   'WS.Data/Collection/Factory/RecordSet',
   'Controls/Utils/Toolbar',
   'Controls/Button',
   'css!theme?Controls/Toolbar/Toolbar'
], function(Control, SourceController, template, toolbarItemTemplate, recordSetFactory, tUtil) {
   'use strict';

   /**
    * Graphical control element on which buttons, menu and other input or output elements are placed.
    * <a href="/materials/demo-ws4-buttons">Demo-example</a>.
    *
    * @class Controls/Toolbar
    * @extends Core/Control
    * @mixes Controls/interface/ICaption
    * @mixes Controls/Button/interface/IIcon
    * @mixes Controls/interface/ITooltip
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IItemTemplate
    * @mixes Controls/List/interface/IHierarchy
    * @control
    * @public
    * @category Toolbar
    * @author Михайловский Д.С.
    * @demo Controls-demo/Toolbar/ToolbarVdom
    */

   /**
    * @event Controls/Toolbar#itemClick Occurs when item was clicked.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {WS.Data/Entity/Record} item Clicked item.
    * @example
    * TMPL:
    * <pre>
    *    <Controls.Toolbar on:itemClick="onToolbarItemClick()" />
    * </pre>
    * JS:
    * <pre>
    *    onToolbarItemClick: function(e, selectedItem) {
    *       var itemId = selectedItem.get('id');
    *       switch (itemId) {
    *          case 'remove':
    *             this._removeItems();
    *             break;
    *          case 'move':
    *             this._moveItems();
    *             break;
    *    }
    * </pre>
    */

   var _private = {
      loadItems: function(instance, source) {
         var self = this;

         instance._sourceController = new SourceController({
            source: source
         });
         return instance._sourceController.load().addCallback(function(items) {
            instance._items = items;
            instance._menuItems = self.getMenuItems(instance._items);
            instance._needShowMenu = instance._menuItems && instance._menuItems.getCount();
            return items;
         });
      },

      getMenuItems: function(items) {
         return tUtil.getMenuItems(items).value(recordSetFactory, {
            adapter: items.getAdapter(),
            idProperty: items.getIdProperty(),
            format: items.getFormat()
         });
      },

      setPopupOptions: function(self, newOptions) {
         self._popupOptions = {
            className: (newOptions.popupClassName || '') + ' controls-Toolbar__menu-position',
            corner: { vertical: 'top', horizontal: 'right' },
            horizontalAlign: { side: 'left' },
            eventHandlers: {
               onResult: self._onResult,
               onClose: self._closeHandler
            },
            opener: self,
            templateOptions: {
               keyProperty: newOptions.keyProperty,
               parentProperty: newOptions.parentProperty,
               nodeProperty: newOptions.nodeProperty,
               iconSize: newOptions.size,
               showClose: true
            }
         };
      },

      getItemClassName: function(item, size) {
         return 'controls-Toolbar_' + item.get('buttonViewMode') + '_' + size;
      },

      generateItemPopupConfig: function(item, event, self) {
         return {
            corner: { vertical: 'top', horizontal: 'left' },
            horizontalAlign: { side: 'right' },
            className: this.getItemClassName(item, self._options.size) + ' ' + (item.get('popupClassName') || ''),
            templateOptions: {
               items: self._items,
               rootKey: item.get(self._options.keyProperty),
               showHeader: item.get('showHeader'),
               headConfig: {
                  icon: item.get('icon'),
                  caption: item.get('title'),
                  iconStyle: item.get('iconStyle')
               }
            },
            target: event.target
         };
      },

      generateMenuConfig: function(self) {
         return {
            className: 'controls-Toolbar__menu-position ' + (self._options.popupClassName || ''),
            templateOptions: {
               items: self._menuItems,
               iconSize: self._options.size
            },
            target: self._children.popupTarget
         };
      }
   };

   var Toolbar = Control.extend({
      showType: tUtil.showType,
      _template: template,
      _defaultItemTemplate: toolbarItemTemplate,
      _needShowMenu: null,
      _menuItems: null,
      _parentProperty: null,
      _nodeProperty: null,
      _items: null,
      _popupOptions: null,

      constructor: function() {
         this._onResult = this._onResult.bind(this);
         this._closeHandler = this._closeHandler.bind(this);
         Toolbar.superclass.constructor.apply(this, arguments);
      },
      _beforeMount: function(options, context, receivedState) {
         this._parentProperty = options.parentProperty;
         this._nodeProperty = options.nodeProperty;

         _private.setPopupOptions(this, options);
         if (receivedState) {
            this._items = receivedState;
            this._menuItems = _private.getMenuItems(this._items);
            this._needShowMenu = this._menuItems && this._menuItems.getCount();
         } else if (options.source) {
            return _private.loadItems(this, options.source);
         }
      },
      _beforeUpdate: function(newOptions) {
         if (newOptions.keyProperty !== this._options.keyProperty ||
            this._options.parentProperty !== newOptions.parentProperty ||
            this._options.nodeProperty !== newOptions.nodeProperty ||
            this._options.size !== newOptions.size ||
            this._options.popupClassName !== newOptions.popupClassName) {
            _private.setPopupOptions(this, newOptions);
         }
         if (newOptions.source && newOptions.source !== this._options.source) {
            _private.loadItems(this, newOptions.source).addCallback(function() {
               this._forceUpdate();
            }.bind(this));
         }
         this._nodeProperty = newOptions.nodeProperty;
         this._parentProperty = newOptions.parentProperty;
      },
      _onItemClick: function(event, item) {
         if (item.get(this._nodeProperty)) {
            var config = _private.generateItemPopupConfig(item, event, this);
            this._children.menuOpener.open(config, this);

            // TODO нотифай событий menuOpened и menuClosed нужен для работы механизма корректного закрытия превьювера переделать
            // TODO по задаче https://online.sbis.ru/opendoc.html?guid=76ed6751-9f8c-43d7-b305-bde84c1e8cd7

            this._notify('menuOpened', [], { bubbling: true });
         }
         event.stopPropagation();
         this._notify('itemClick', [item]);
         item.handler && item.handler(item);
      },

      _showMenu: function() {
         var config = _private.generateMenuConfig(this);
         this._notify('menuOpened', [], { bubbling: true });
         this._children.menuOpener.open(config, this);
      },

      _onResult: function(result) {
         if (result.action === 'itemClick') {
            var item = result.data[0];
            this._notify('itemClick', [item]);

            // menuOpener may not exist because toolbar can be closed by toolbar parent in item click handler
            if (this._children.menuOpener && !item.get(this._nodeProperty)) {
               this._children.menuOpener.close();
            }
         }
      },

      _closeHandler: function() {
         this._notify('menuClosed', [], { bubbling: true });
      }
   });

   Toolbar.getDefaultOptions = function() {
      return {
         size: 'm'
      };
   };

   Toolbar._private = _private;

   return Toolbar;
});
