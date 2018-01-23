/**
 * Created by kraynovdo on 22.09.2017.
 */
define('js!Controls/List/ListControl/ListView', [
   'Core/Control',
   'tmpl!Controls/List/ListControl/ListView',
   'js!Controls/List/resources/utils/ItemsUtil',
   'tmpl!Controls/List/ListControl/ItemTemplate',
   'css!Controls/List/ListControl/ListView'
], function (BaseControl,
             ListViewTpl,
             ItemsUtil,
             defaultItemTemplate
   ) {
   'use strict';

   var _private = {
      onListChange: function() {
         this._forceUpdate();
      }
   };

   var ListView = BaseControl.extend(
      {
         _controlName: 'Controls/List/ListControl/ListView',

         _listModel: null,
         _template: ListViewTpl,
         _defaultItemTemplate: defaultItemTemplate,

         constructor: function (cfg) {
            ListView.superclass.constructor.apply(this, arguments);
            this._onListChangeFnc = _private.onListChange.bind(this);
         },

         _beforeMount: function(newOptions) {
            if (newOptions.listModel) {
               this._listModel = newOptions.listModel;
               this._listModel.subscribe('onListChange', this._onListChangeFnc);
            }
            this._itemTemplate = newOptions.itemTemplate || this._defaultItemTemplate;
         },

         _beforeUpdate: function(newOptions) {
            if (newOptions.listModel && (this._listModel != newOptions.listModel)) {
               this._listModel = newOptions.listModel;
               this._listModel.subscribe('onListChange', this._onListChangeFnc);
            }
            this._itemTemplate = newOptions.itemTemplate || this._defaultItemTemplate;
         },

         _onItemClick: function(e, dispItem) {
            var item, newKey;
            item = dispItem.getContents();
            newKey = ItemsUtil.getPropertyValue(item, this._options.idProperty);
            this._listModel.setSelectedKey(newKey);
            this._notify('itemClick', [item], {bubbling: true});
         }
      });



   return ListView;
});