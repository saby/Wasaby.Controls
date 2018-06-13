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
            massSelectorBlock = instance._container.getElementsByClassName('controls-operationsPanelV__massSelector')[0],
            massSelectorWidth = massSelectorBlock ? massSelectorBlock.clientWidth : 0;
         return  instance._container.clientWidth - massSelectorWidth;
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
