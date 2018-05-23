define('Controls/History/Menu',
   [
      'Controls/Button/MenuButton',
      'tmpl!Controls/History/resources/itemTemplate'
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

         constructor: function(config) {
            this._source = config.source;
            config.filter = {
               $_history: true
            };
            config.defaultItemTemplate = itemTemplate;
            this._onResult = this._onResult.bind(this);
            HistoryMenu.superclass.constructor.apply(this, arguments);
         },

         _onResult: function(args) {
            var actionName = args[0];
            var data = args[2];
            var item = data[0];
            var pin = data[1];

            if (pin === true) {
               actionName = 'pinnedClick';
            }

            switch (actionName) {
               case 'itemClick':
                  this._notify('onMenuItemActivate', data);
                  this._source.update(item, {
                     $_history: true
                  });
                  this._items = this._source.getItems();
                  this._open();
                  this._children.DropdownOpener.close();
                  break;
               case 'pinnedClick':
                  this._source.update(item, {
                     $_pinned: !item.get('pinned')
                  });
                  this._items = this._source.getItems();
                  this._open();
                  this._children.DropdownOpener.close();
                  break;
            }
         }
      });

      return HistoryMenu;
   }
);
