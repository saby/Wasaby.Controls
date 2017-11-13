/**
 * Created by kraynovdo on 22.09.2017.
 */
define('js!Controls/List/ItemsView', [
   'Core/core-extend',
   'Core/Control',
   'tmpl!Controls/List/ItemsView',
   'js!Controls/List/resources/utils/ItemsUtil',
   'Core/core-instance',
   'WS.Data/Type/descriptor'
], function (extend,
             BaseControl,
             ItemsRenderTpl,
             ItemsUtil,
             cInstance,
             Types
   ) {
   'use strict';

   var _private = {
      //проверка на то, нужно ли создавать новый инстанс рекордсета или же можно положить данные в старый
      isEqualRecordset: function(oldList, newList) {
         return oldList && cInstance.instanceOfModule(oldList, 'WS.Data/Collection/RecordSet')
            && (newList.getModel() === oldList.getModel())
            && (Object.getPrototypeOf(newList).constructor == Object.getPrototypeOf(newList).constructor)
            && (Object.getPrototypeOf(newList.getAdapter()).constructor == Object.getPrototypeOf(oldList.getAdapter()).constructor)
      },

      initDisplay: function(items, cfg) {
         if (this._items) {
            //TODO убрать дестрой, проверить утечки памяти
            if (this._display) {
               this._display.destroy();
            }
            this._display = this._createDefaultDisplay(items, cfg);
            this._display.subscribe('onCollectionChange', this._onCollectionChangeFnc);
         }
      }
   };

   var ItemsRender = BaseControl.extend(
      {
         _controlName: 'Controls/List/ItemsView',
         iWantVDOM: true,
         _isActiveByClick: false,
         _template: ItemsRenderTpl,
         _items: null,
         _display: null,
         _startIndex: 0,
         _stopIndex: 0,
         _curIndex: 0,
         _tplData: null,

         constructor: function (cfg) {
            ItemsRender.superclass.constructor.apply(this, arguments);
            this._onCollectionChangeFnc = this._onCollectionChange.bind(this);
            this._tplData = {};
         },

         _beforeMount: function(newOptions) {
            if (newOptions.items) {
               this._items = newOptions.items;
               _private.initDisplay.call(this, newOptions.items, newOptions);
               this._initIndices();
               this._initTplData(newOptions);
            }
         },

         _beforeUpdate: function(newOptions) {
            if (newOptions.items && (this._items != newOptions.items)) {
               this._items = newOptions.items;
               _private.initDisplay.call(this, newOptions.items, newOptions);
               this._initTplData(newOptions);
            }
         },

         setItems: function(items) {
            if (_private.isEqualRecordset(this._items, items)) {
               this._items.setMetaData(items.getMetaData());
               this._items.assign(items);
            } else {
               this._items = items;
            }
         },

         _initIndices: function() {
            this._startIndex = 0;
            this._stopIndex = this._display.getCount();
         },


         //
         _initTplData: function(cfg) {
            this._itemTplData = {
               getPropValue: ItemsUtil.getPropertyValue,
               listConfig: cfg
            }
         },

         _getStartEnumerationPosition: function() {
            this._curIndex = this._startIndex;
         },

         _getNextEnumerationPosition: function() {
            this._curIndex++;
         },

         _checkConditionForEnumeration: function() {
            return this._curIndex < this._stopIndex;
         },

         _onCollectionChange: function() {
            this._initIndices();
            this._initTplData(this._options);
            this._forceUpdate();
         },


         _createDefaultDisplay: function(items, cfg) {
            return ItemsUtil.getDefaultDisplayFlat(items, cfg)
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