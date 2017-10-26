/**
 * Created by kraynovdo on 18.10.2017.
 */
define('js!Controls/Lists/ListControl/ListRender', [
   'js!Controls/Lists/ItemsRender',
   'tmpl!Controls/Lists/ListControl/ListRender'
], function (ItemsRender, ItemsRenderTpl
   ) {
   'use strict';

   var ListRender = ItemsRender.extend(
      {
         _controlName: 'Controls/Lists/ListControl/ListRender',
         _template: ItemsRenderTpl,

         _onItemClick: function(e, dispItem) {
            this._notify('onItemClick', dispItem);
         }
      });



   return ListRender;
});