define('Controls/History/Menu',
   [
      'Controls/Button/MenuButton',
      'tmpl!Controls/History/resources/itemTemplate',
      'css!Controls/History/Menu'
   ],
   function(MenuButton, itemTemplate) {

      /**
        * Button
        *
        * @class Controls/History/Menu
        * @extends Controls/Button/MenuButton
        * @control
        * @public
        * @category Menu
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

      var HistoryMenu = MenuButton.extend({
         _defaultItemTemplate: itemTemplate,
         _source: null,
         _filter: null,

         _beforeMount: function(options) {
            this._filter = {
               $_history: true
            };
            options.defaultItemTemplate = itemTemplate;
            this._onResult = this._onResult.bind(this);
         },

         _onResult: function(result) {
            var actionName = result.action;
            var data = result.data;
            var item = data[0];
            var pin = data[1];

            if (pin === true) {
               actionName = 'pinnedClick';
            }

            switch (actionName) {
               case 'itemClick':
                  this._notify('onMenuItemActivate', data);
                  this._options.source.update(item, {
                     $_history: true
                  });
                  this._items = this._options.source.getItems();
                  this._children.DropdownOpener.close();
                  break;
               case 'pinnedClick':
                  this._options.source.update(item, {
                     $_pinned: !item.get('pinned')
                  });
                  this._items = this._options.source.getItems();
                  this._open();
                  break;
            }
         }
      });

      return HistoryMenu;
   }
);
