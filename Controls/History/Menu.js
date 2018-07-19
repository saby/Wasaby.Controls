define('Controls/History/Menu',
   [
      'Controls/Button/Menu',
      'tmpl!Controls/History/resources/itemTemplate',
      'css!Controls/History/Menu'
   ],
   function(Menu, itemTemplate) {

      /**
       * Button
       *
       * @class Controls/History/Menu
       * @extends Controls/Button/Menu
       * @control
       * @public
       * @category Menu
       * @demo Controls-demo/Menu/MenuVdom
       */

      /**
       * @name Controls/History/Menu#historySource
       * @cfg {Object} The special source whose has two source inside.
       * The first source is standard, the second source determines where the data will be stored.
       * If you use History/Service, then it will work with the History of Input service
       */

      /**
       * @name Controls/History/Menu#historyId
       * @cfg {String} history id
       */

      'use strict';

      var HistoryMenu = Menu.extend({
         _itemTemplate: itemTemplate,
         _filter: null,

         _beforeMount: function() {
            this._filter = {
               $_history: true
            };
         },

         _onItemClickHandler: function(result, items) {
            this._notify('onMenuItemActivate', [items[0]]);
            this._options.source.update(items[0], {
               $_history: true
            });
            this._items = this._options.source.getItems();
         },

         _onPinClickHandler: function(event, items) {
            this._options.source.update(items[0], {
               $_pinned: !items[0].get('pinned')
            });
            this._items = this._options.source.getItems();
         }
      });

      return HistoryMenu;
   }
);
