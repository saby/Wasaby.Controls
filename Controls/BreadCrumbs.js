define('Controls/BreadCrumbs', [
   'Core/Control',
   'tmpl!Controls/BreadCrumbs/BreadCrumbs',
   'tmpl!Controls/BreadCrumbs/resources/itemTemplate',
   'tmpl!Controls/BreadCrumbs/resources/itemsTemplate',
   'tmpl!Controls/BreadCrumbs/resources/menuContentTemplate',
   'css!Controls/BreadCrumbs/BreadCrumbs'
], function(
   Control,
   template,
   itemTemplate,
   itemsTemplate
) {
   'use strict';

   /**
    * Компонент - хлебные крошки
    * @class Controls/BreadCrumbs
    * @extends Controls/Control
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IHighlighter
    * @control
    * @public
    * @category List
    */

   var BreadCrumbs = Control.extend({
      _template: template,
      _itemTemplate: itemTemplate,
      _itemsTemplate: itemsTemplate,

      _onItemClick: function(e, itemData) {
         this._notify('itemClick', [e, itemData.item, itemData.isDots]);
      },

      _onHomeClick: function() {
         this._notify('itemClick', [this._options.items[0].item]);
      }
   });
   return BreadCrumbs;
});
