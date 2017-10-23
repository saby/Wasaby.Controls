/**
 * Created by kraynovdo on 18.10.2017.
 */
define('js!WSControls/Lists/ListControl/ListRender', [
   'js!WSControls/Lists/ItemsRender',
   'tmpl!WSControls/Lists/ListControl/ListRender'
], function (ItemsRender, ItemsRenderTpl
   ) {
   'use strict';

   var ListRender = ItemsRender.extend(
      {
         _controlName: 'WSControls/Lists/ListControl/ListRender',
         _template: ItemsRenderTpl,

         constructor: function(cfg) {
            ListRender.superclass.constructor.apply(this, arguments);
            this.__initSelectedItem(cfg);
         },

         _beforeUpdate: function(newOptions) {
            ListRender.superclass._beforeUpdate.apply(this, arguments);
            this.__initSelectedItem(newOptions);
         },

         __initSelectedItem: function(cfg) {



            //TODO обработать virt scroll
         },

         _onItemClick: function(e, dispItem) {
            this._notify('onItemClick', dispItem);
         }
      });



   return ListRender;
});