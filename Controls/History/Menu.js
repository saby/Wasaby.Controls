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
       * Button menu with history by clicking on which a drop-down list opens.
       *
       * <a href="/materials/demo-ws4-button-menu">Demo-example</a>.
       *
       * @class Controls/History/Menu
       * @extends Controls/Button/Menu
       * @control
       * @public
       * @author Герасимов А.М.
       * @category Menu
       * @demo Controls-demo/Menu/MenuVdom
       */

      'use strict';
   
      var _private = {
         getMetaPinned: function(item) {
            return {
               $_pinned: !item.get('pinned')
            };
         },
      
         getMetaHistory: function() {
            return  {
               $_history: true
            };
         },
         prepareFilter: function(filter) {
            return merge(_private.getMetaHistory(), filter);
         }
      };
   
      var HistoryMenu = Menu.extend({
         _itemTemplate: itemTemplate,
         _filter: null,

         _beforeMount: function(options) {
            this._offsetClassName = MenuUtils.cssStyleGeneration(options);
            this._filter = _private.prepareFilter(options.filter);
         },
         
         _beforeUpdate: function(newOptions) {
            if (!isEqual(this._options.filter, newOptions.filter) || this._options.source !== newOptions.source) {
               this._filter = _private.prepareFilter(newOptions.filter);
            }
         },

         _onItemClickHandler: function(result, items) {
            this._notify('onMenuItemActivate', [items[0]]);
            this._options.source.update(items[0], _private.getMetaHistory());
            this._items = this._options.source.getItems();
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
