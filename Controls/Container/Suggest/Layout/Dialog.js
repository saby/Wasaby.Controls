define('Controls/Container/Suggest/Layout/Dialog',
   [
      'Core/Control',
      'wml!Controls/Container/Suggest/Layout/Dialog',
      'Controls/Container/Search/SearchContextField',
      'Controls/Container/Filter/FilterContextField',
      'Controls/Container/Scroll/Context',
      'css!theme?Controls/Container/Suggest/Layout/Dialog',
      'Controls/Container/Scroll',
      'Controls/Popup/Templates/Dialog/DialogTemplate'
   ],

   function(Control, template, SearchContextField, FilterContextField, ScrollData) {

      /**
       * Dialog for list in Suggest component.
       * @class Controls/Container/Suggest/List
       * @extends Controls/Control
       * @author Герасимов Александр
       * @control
       * @public
       */

      'use strict';

      var List = Control.extend({

         _template: template,
         _resizeTimeout: null,

         _beforeMount: function() {
            this._scrollData = new ScrollData({pagingVisible: false});

            //TODO временное решение, контекст должен долетать от Application'a, удалить, как будет сделано (Шипин делает)
            //https://online.sbis.ru/opendoc.html?guid=91b2abcb-ca15-46ea-8cdb-7b1f51074c65
            this._searchData = new SearchContextField(null);
         },

         _getChildContext: function() {
            return {
               searchLayoutField: this._searchData,
               ScrollData: this._scrollData,
               filterLayoutField: new FilterContextField({filter: this._options.filter})
            };
         },

         _afterMount: function() {
            /* Костыль до 400. В 400 сделано распростронение resize */
            var self = this;
            self._resizeTimeout = setTimeout(function() {
               self._children.scroll._children.scrollWatcher._resizeHandler({}, true);
            });
         },

         _beforeUnmount: function() {
            clearTimeout(this._resizeTimeout);
            this._resizeTimeout = null;
         },

         _itemClick: function(event, item) {
            this._notify('sendResult', [item], { bubbling: true });
            this._notify('close', [], { bubbling: true });
         }

      });

      return List;
   });

