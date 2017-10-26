/**
 * Created by kraynovdo on 18.10.2017.
 */
define('js!Controls/List/ListControl/ListRender', [
   'js!Controls/List/ItemsRender',
   'tmpl!Controls/List/ListControl/ListRender'
], function (ItemsRender, ItemsRenderTpl
   ) {
   'use strict';

   var ListRender = ItemsRender.extend(
      {
         _controlName: 'Controls/List/ListControl/ListRender',
         _template: ItemsRenderTpl,

         _onItemClick: function(e, dispItem) {
            this._notify('onItemClick', dispItem);
         }
      });



   return ListRender;
});