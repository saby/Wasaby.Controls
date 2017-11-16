/**
 * Created by kraynovdo on 22.09.2017.
 */
define('js!Controls/List/ItemsView', [
   'Core/Control',
   'tmpl!Controls/List/ItemsView',
   'WS.Data/Type/descriptor',
   'js!Controls/List/ListControl/ItemsViewModel'
], function (BaseControl,
             ItemsRenderTpl,
             Types,
             ItemsViewModel
   ) {
   'use strict';

   var ItemsRender = BaseControl.extend(
      {
         _controlName: 'Controls/List/ItemsView',
         _template: ItemsRenderTpl,

         constructor: function (cfg) {
            ItemsRender.superclass.constructor.apply(this, arguments);
            this._onListChangeFnc = this._onListChange.bind(this);
         },

         _beforeMount: function(newOptions) {
            if (newOptions.items) {
               this._listModel = new ItemsViewModel ({
                  items : newOptions.items,
                  idProperty: newOptions.idProperty,
                  displayProperty: newOptions.displayProperty
               });
               this._listModel.subscribe('onListChange', this._onListChangeFnc);
            }
         },

         _beforeUpdate: function(newOptions) {
            if (newOptions.items && (this._options.items != newOptions.items)) {
               this._listModel = new ItemsViewModel ({
                  items : newOptions.items,
                  idProperty: newOptions.idProperty,
                  displayProperty: newOptions.displayProperty
               });
               this._listModel.subscribe('onListChange', this._onListChangeFnc);
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