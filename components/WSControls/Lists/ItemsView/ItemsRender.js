/**
 * Created by kraynovdo on 22.09.2017.
 */
define('js!WSControls/Lists/ItemsView/ItemsRender', [
   'Core/core-extend',
   'Core/Control',
   'tmpl!WSControls/Lists/ItemsView/ItemsRender',
   'js!WSControls/Lists/resources/utils/ItemsUtil',
   'js!WS.Data/Type/descriptor'
], function (extend,
             BaseControl,
             ItemsRenderTpl,
             ItemsUtil,
             Types
   ) {
   'use strict';

   var ItemsRender = BaseControl.extend(
      {
         _controlName: 'WSControls/Lists/ItemsView/ItemsRender',
         _enumIndexes: null,
         iWantVDOM: true,
         _isActiveByClick: false,
         _template: ItemsRenderTpl,
         _items: null,

         constructor: function (cfg) {
            ItemsRender.superclass.constructor.apply(this, arguments);
            this._enumIndexes = {
               _startIndex: 0,
               _stopIndex: 0,
               _curIndex: 0
            };
            this._onCollectionChangeFnc = this._onCollectionChange.bind(this);
            this._prepareMountingData(cfg);
         },

         _prepareMountingData: function(newOptions) {
            if (newOptions.items && (this._items != newOptions.items)) {
               this._items = newOptions.items;
               this._itemsChangeCallback(this._items, newOptions);
            }
         },

         _beforeUpdate: function(newOptions) {
            this._prepareMountingData(newOptions);
         },

         _initDisplay: function(items, cfg) {
            if (this._items) {
               //TODO убрать дестрой, проверить утечки памяти
               if (this._display) {
                  this._display.destroy();
               }
               this._display = this._createDefaultDisplay(items, cfg);
               this._display.subscribe('onCollectionChange', this._onCollectionChangeFnc);
            }
         },

         _onCollectionChange: function(event, action, newItems, newItemsIndex, oldItems, oldItemsIndex, groupId) {
            this._displayChangeCallback(this._display, this._options);
            this._forceUpdate();
         },


         _itemsChangeCallback: function(items, cfg) {
            this._initDisplay(items, cfg);
            this._displayChangeCallback(this._display, cfg);
         },

         //при изменениях в проекции
         _displayChangeCallback: function(display, cfg) {
            this._enumIndexes._startIndex = 0;
            this._enumIndexes._stopIndex = this._display.getCount();
         },

         _getStartEnumerationPosition: function() {
            this._enumIndexes._curIndex = this._enumIndexes._startIndex;
         },

         _getNextEnumerationPosition: function() {
            this._enumIndexes._curIndex++;
         },

         _checkConditionForEnumeration: function() {
            return this._enumIndexes._curIndex < this._enumIndexes._stopIndex;
         },

         _getPropertyValue: function(itemContents, field) {
            return ItemsUtil.getPropertyValue(itemContents, field);
         },

         _getItemData: function(projItem, index) {
            return {};
         },


         _createDefaultDisplay: function(items, cfg) {
            return ItemsUtil.getDefaultDisplayFlat(items, cfg)
         },


         _onItemClick: function (evt) {
            //Method must be implemented
         },



         //<editor-fold desc='DataSourceMethods'>
         destroy: function() {
            ItemsRender.superclass.destroy.apply(this, arguments);
            if (this._display) {
               this._display.destroy();
            }
         }
      });

   //TODO https://online.sbis.ru/opendoc.html?guid=17a240d1-b527-4bc1-b577-cf9edf3f6757
   /*ItemsRender.getOptionTypes = function getOptionTypes(){
    return {
    dataSource: Types(ISource)
    }
    };*/

   return ItemsRender;
});