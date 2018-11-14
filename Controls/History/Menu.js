define('Controls/History/Menu',
   [
      'Controls/Button/Menu',
      'wml!Controls/History/resources/itemTemplate',
      'Core/core-merge',
      'Core/helpers/Object/isEqual',
      'Controls/Button/Menu/MenuUtils',
      'css!theme?Controls/History/Menu'
   ],
   function(Menu, itemTemplate, merge, isEqual, MenuUtils) {
      /**
       * Button
       *
       * @class Controls/History/Menu
       * @extends Controls/Button/Menu
       * @control
       * @public
       * @author Герасимов А.М.
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
   
      var _private = {
         getMetaPinned: function(item) {
            return {
               $_pinned: !item.get('pinned')
            };
         }
      };
   
      var HistoryMenu = Menu.extend({
         _itemTemplate: itemTemplate,
         _filter: null,

         _beforeMount: function(options) {
            this._offsetClassName = MenuUtils.cssStyleGeneration(options);
         },

         _beforeUpdate: function(newOptions) {
            if (this._options.size !== newOptions.size || this._options.icon !== newOptions.icon ||
               this._options.viewMode !== newOptions.viewMode) {
               this._offsetClassName = MenuUtils.cssStyleGeneration(newOptions);
            }
         },

         _onItemClickHandler: function(result, items) {
            this._notify('onMenuItemActivate', [items[0]]);
         },

         _onPinClickHandler: function(event, items) {
            var self = this;
            this._options.source.update(items[0], _private.getMetaPinned(items[0])).addCallback(function(result) {
               if (!result) {
                  self._children.notificationOpener.open({
                     template: 'wml!Controls/Popup/Templates/Notification/Simple',
                     templateOptions: {
                        style: 'error',
                        text: 'Невозможно закрепить более 10 пунктов',
                        icon: 'Alert'
                     }
                  });
               }
            });
         }
      });
   
      HistoryMenu._private = _private;
      
      return HistoryMenu;
   }
);
