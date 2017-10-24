/**
 * Created by kraynovdo on 22.09.2017.
 */
define('js!WSControls/Lists/ItemsView', [
   'Core/core-extend',
   'Core/Control',
   'tmpl!WSControls/Lists/ItemsView',
   'js!WSControls/Lists/resources/utils/ItemsUtil',
   'WS.Data/Type/descriptor'
], function (extend,
             BaseControl,
             ItemsRenderTpl,
             ItemsUtil,
             Types
   ) {
   'use strict';

   var ItemsRender = BaseControl.extend(
      {
         _controlName: 'WSControls/Lists/ItemsView',
         iWantVDOM: true,
         _isActiveByClick: false,
         _template: ItemsRenderTpl,
         _items: null,

         constructor: function (cfg) {
            ItemsRender.superclass.constructor.apply(this, arguments);
            this._onCollectionChangeFnc = this._onCollectionChange.bind(this);
         },

         _beforeMount: function(newOptions) {
            if (newOptions.items) {
               this._items = newOptions.items;
               this.__initDisplay(newOptions.items, newOptions);
            }
         },

         _beforeUpdate: function(newOptions) {
            if (newOptions.items && (this._items != newOptions.items)) {
               this._items = newOptions.items;
               this.__initDisplay(newOptions.items, newOptions);
            }
         },

         __initDisplay: function(items, cfg) {
            if (this._items) {
               //TODO убрать дестрой, проверить утечки памяти
               if (this._display) {
                  this._display.destroy();
               }
               this._display = this._createDefaultDisplay(items, cfg);
               this._display.subscribe('onCollectionChange', this._onCollectionChangeFnc);
            }
         },

         _onCollectionChange: function() {
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