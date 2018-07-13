define('Controls/OperationsPanel', [
   'Core/Control',
   'tmpl!Controls/OperationsPanel/OperationsPanel',
   'tmpl!Controls/OperationsPanel/ItemTemplate',
   'Controls/Controllers/SourceController',
   'WS.Data/Source/Memory',
   'Controls/OperationsPanel/Utils',
   'Controls/Toolbar',
   'css!Controls/OperationsPanel/OperationsPanel'
], function(
   Control,
   template,
   ItemTemplate,
   SourceController,
   Memory,
   WidthUtils
) {
   'use strict';

   /**
    * Control for grouping operations.
    *
    * @class Controls/Operations/Panel
    * @extends Core/Control
    * @mixes Controls/interface/ISource
    * @mixes Controls/List/interface/IHierarchy
    * @mixes Controls/List/interface/IExpandable
    * @control
    * @public
    */

   /**
    * @name Controls/Operations/Panel#multiSelectorVisibility
    * @cfg {Boolean} multiSelector Show multiSelector block.
    */

   /**
    * @event Controls/Operations/Panel#itemClick Occurs when item was clicked.
    * @param {WS.Data/Entity/Record} item Clicked item.
    */

   var _private = {

      loadItems: function(instance, source) {
         instance._sourceController = new SourceController({
            source: source
         });
         return instance._sourceController.load().addCallback(function(items) {
            instance._items = items.getRawData();
            _private.recalcToolbarItems(instance);
            return items;
         });
      },

      recalcToolbarItems: function(instance) {
         instance._lastWidth = _private.getAvailableWidth(instance);
         WidthUtils.fillItemsType(instance,  instance._items, instance._lastWidth);
         instance._toolbarSource = new Memory({
            idProperty: 'id',
            data: instance._items
         });
         instance._forceUpdate();
      },
      getAvailableWidth: function(instance) {
         var
            multiSelectorBlock = instance._container.getElementsByClassName('controls-operationsPanelV__multiSelector')[0],
            multiSelectorWidth = multiSelectorBlock ? multiSelectorBlock.clientWidth : 0;
         return  instance._container.clientWidth - multiSelectorWidth;
      }
   };
   var OperationsPanel = Control.extend({
      _template: template,
      _itemTemplate: ItemTemplate,
      _toolbarSource: null,
      _lastWidth: 0,

      _afterMount: function() {
         //todo: при первом построении не нужно
         if (this._options.source) {
            _private.loadItems(this, this._options.source);
         }
      },

      _beforeUpdate: function(newOptions) {
         if (newOptions.source && newOptions.source !== this._options.source) {
            return _private.loadItems(this, newOptions.source);
         }
      },

      _afterUpdate: function() {
         if (this._lastWidth !== _private.getAvailableWidth(this)) {
            _private.recalcToolbarItems(this);
         }
      },

      _toolbarItemClick: function(event, item) {
         this._notify('itemClick', [item]);
      },

      _onResize: function() {
         //Пустой обработчик чисто ради того, чтобы при ресайзе запускалась перерисовка
      }
   });

   return OperationsPanel;
});
