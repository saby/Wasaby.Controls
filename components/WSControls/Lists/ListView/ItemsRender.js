/**
 * Created by kraynovdo on 22.09.2017.
 */
define('js!WSControls/Lists/ListView/ItemsRender', [
   'js!WSControls/Lists/ItemsView/ItemsRender',
   'tmpl!WSControls/Lists/ListView/ItemsRender'
], function (ItemsViewRender, ItemsRenderTpl
   ) {
   'use strict';

   var ItemsRender = ItemsViewRender.extend(
      {
         _controlName: 'WSControls/Lists/ListView/ItemsRender',

         _template: ItemsRenderTpl

      });

   return ItemsRender;
});