/**
 * Created by kraynovdo on 22.09.2017.
 */
define('js!Controls/List/ItemsView', [
   'Core/core-extend',
   'Core/Control',
   'tmpl!Controls/List/ItemsView',
   'js!Controls/List/resources/utils/ItemsUtil',
   'WS.Data/Type/descriptor',
   'js!Controls/List/ListControl/ItemsViewModel'
], function (extend,
             BaseControl,
             ItemsRenderTpl,
             ItemsUtil,
             Types,
             ItemsViewModel
   ) {
   'use strict';

   var _private = {
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

         constructor: function (cfg) {
            ItemsRender.superclass.constructor.apply(this, arguments);
            this._onListChangeFnc = this._onListChange.bind(this);
         },

         _beforeMount: function(newOptions) {
            if (newOptions.items) {
               this._listModel = new ItemsViewModel ({items : newOptions.items});
            }
         },

         _beforeUpdate: function(newOptions) {
            if (newOptions.items && (this._items != newOptions.items)) {
               this._listModel = new ItemsViewModel ({items : newOptions.items});
            }
         },




         _getStartEnumerationPosition: function() {
            this._listModel.reset();
         },

         _getNextEnumerationPosition: function() {
            this._listModel.goToNext();
         },

         _checkConditionForEnumeration: function() {
            return this._listModel.isEnd();
         },

         _onListChange: function() {
            this._forceUpdate();
         },


         //<editor-fold desc='DataSourceMethods'>
         destroy: function() {
            ItemsRender.superclass.destroy.apply(this, arguments);
            if (this._listModel) {
               this._listModel.destroy();
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