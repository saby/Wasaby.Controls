define('Controls-demo/DragNDrop/ListEntity', ['Controls/DragNDrop/Entity/List/Items'],
   function(EntityItems) {
      'use strict';

      var Items = EntityItems.extend({
         getMainText: function() {
            return this._getFirstItem().get('title');
         },

         getLogo: function() {
            return this._getFirstItem().get('logo');
         },

         getAdditionalText: function() {
            return this._getFirstItem().get('additional');
         },

         getImage: function() {
            return this._getFirstItem().get('image');
         },

         _getFirstItem: function() {
            return this._options.firstItem;
         }
      });

      return Items;
   });
