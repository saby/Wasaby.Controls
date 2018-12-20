define('Controls/Operations/Panel', [
   'Core/Control',
   'wml!Controls/Operations/Panel/Panel',
   'wml!Controls/Operations/Panel/ItemTemplate',
   'WS.Data/Source/Memory',
   'Controls/Operations/Panel/Utils',
   'Controls/Button/validateIconStyle',
   'css!theme?Controls/Operations/Panel/Panel'
], function(
   Control,
   template,
   ItemTemplate,
   Memory,
   WidthUtils,
   validateIconStyle
) {
   'use strict';

   var _private = {
      recalculateToolbarItems: function(self, items, toolbarWidth) {
         if (items) {
            self._oldToolbarWidth = toolbarWidth;
            self._toolbarSource = new Memory({
               idProperty: self._options.keyProperty,
               data: WidthUtils.fillItemsType(self._options.keyProperty, self._options.parentProperty, items, toolbarWidth).getRawData()
            });
            self._forceUpdate();
         }
      },
      checkToolbarWidth: function(self) {
         var newWidth = self._children.toolbarBlock.clientWidth;
         if (self._oldToolbarWidth !== newWidth) {
            self._oldToolbarWidth = newWidth;
            _private.recalculateToolbarItems(self, self._items, newWidth);
         }
      },
      loadData: function(self, source) {
         var result;
         if (source) {
            result = source.query().addCallback(function(dataSet) {
               self._items = dataSet.getAll();

               // TODO: убрать когда полностью откажемся от поддержки задавания цвета в опции иконки. icon: icon-error, icon-done и т.д.
               // TODO: https://online.sbis.ru/opendoc.html?guid=05bbeb41-d353-4675-9f73-6bfc654a5f00
               validateIconStyle.itemsSetOldIconStyle(self._items);
               return self._items;
            });
         }
         return result;
      }
   };


   /**
    * Control for grouping operations.
    * <a href="/materials/demo-ws4-operations-panel">Демо-пример</a>.
    *
    * @class Controls/Operations/Panel
    * @extends Core/Control
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IItemTemplate
    * @mixes Controls/List/interface/IHierarchy
    * @control
    * @public
    * @author Зайцев А.С.
    * @demo Controls-demo/OperationsPanel/Panel
    *
    * @css @background-color_OperationsPanel Background color of the panel.
    * @css @height_OperationsPanel Height of the panel.
    * @css @spacing_OperationsPanel__item-between-icon-caption Spacing between the icon and the caption in items.
    * @css @spacing_OperationsPanel-between-items Spacing between items.
    * @css @margin_OperationsPanel__rightTemplate Margin of rightTemplate.
    */

   /**
    * @name Controls/Operations/Panel#rightTemplate
    * @cfg {Function} Template displayed on the right side of the panel.
    * @example
    * <pre>
    *    <Controls.Operations.Panel rightTemplate="wml!MyModule/OperationsPanelRightTemplate" />
    * </pre>
    */

   /**
    * @event Controls/Operations/Panel#itemClick Occurs when an item was clicked.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {WS.Data/Entity/Record} item Clicked item.
    * @example
    * TMPL:
    * <pre>
    *    <Controls.Operations.Panel on:itemClick="onPanelItemClick()" />
    * </pre>
    * JS:
    * <pre>
    *    onPanelItemClick: function(e, selection) {
    *       var itemId = item.get('id');
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

   var Panel = Control.extend({
      _template: template,
      _oldToolbarWidth: 0,
      _initialized: false,

      _beforeMount: function(options) {
         return _private.loadData(this, options.source);
      },

      _afterMount: function() {
         _private.checkToolbarWidth(this);
         this._initialized = true;
      },

      _beforeUpdate: function(newOptions) {
         if (newOptions.source !== this._options.source) {
            //TODO: нельзя смотреть на то изменился ли source в _afterUpdate, т.к. в oldOptions приходит одно и то же значение, и _afterUpdate зацикливается
            //TODO: будет исправляться по этой ошибке: https://online.sbis.ru/opendoc.html?guid=a48be8fb-7ee2-429a-ba8e-abd407436554
            this._sourceChanged = true;
         }
      },

      _afterUpdate: function() {
         var self = this;
         if (this._sourceChanged) {
            // We should recalculate the size of the toolbar only when all the children have updated, otherwise available width may be incorrect.
            this._sourceChanged = false;
            _private.loadData(this, this._options.source).addCallback(function() {
               _private.recalculateToolbarItems(self, self._items, self._children.toolbarBlock.clientWidth);
            });
         } else {
            //TODO: размеры пересчитываются после каждого обновления, т.к. иначе нельзя понять что изменился rightTemplate (там каждый раз новая функция)
            //TODO: будет исправляться по этой задаче: https://online.sbis.ru/opendoc.html?guid=b4ed11ba-1e4f-4076-986e-378d2ffce013
            _private.checkToolbarWidth(this);
         }
      },

      _onResize: function() {
         _private.checkToolbarWidth(this);
      },

      _toolbarItemClick: function(event, item) {
         this._notify('itemClick', [item]);
      }
   });

   Panel.getDefaultOptions = function() {
      return {
         itemTemplate: ItemTemplate
      };
   };

   return Panel;
});
