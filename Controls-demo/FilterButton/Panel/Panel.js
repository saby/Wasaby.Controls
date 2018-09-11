define('Controls-demo/FilterButton/Panel/Panel',
   [
      'Core/Control',
      'WS.Data/Source/Memory',
      'wml!Controls-demo/FilterButton/Panel/Panel',
      'Controls/Filter/Button/Panel',
      'wml!Controls-demo/FilterButton/Panel/resources/additionalItemsTemplate2',
      'wml!Controls-demo/Layouts/SearchLayout/FilterButtonTemplate/filterItemsTemplate',
      'wml!Controls-demo/Layouts/SearchLayout/FilterButtonTemplate/additionalItemsTemplate',
      'wml!Controls-demo/FilterButton/Panel/resources/FIO',
      'wml!Controls-demo/FilterButton/Panel/resources/country',
      'wml!Controls-demo/Layouts/SearchLayout/FilterButtonTemplate/vdomFilterButtonTemplate',
      'wml!Controls-demo/FilterButton/Panel/resources/vdomFilterTemplate'
   ],

   function(Control, MemorySource, template) {

      /**
       * @class Controls/Container/Search
       * @extends Controls/Control
       * @control
       * @public
       */

      'use strict';
      var Panel = Control.extend({

         _template: template,
         sourceDropdown: null,
         _text: '',
         _filterChangedHandler: function() {
            this._text += 'Стреляет filterChanged\n';
         },
         _beforeMount: function() {
            this.sourceDropdown = {
               module: 'WS.Data/Source/Memory',
               options: {
                  data: [
                     {key: 1, title: 'все страны'},
                     {key: 2, title: 'Россия'},
                     {key: 3, title: 'США'},
                     {key: 4, title: 'Великобритания'}
                  ],
                  idProperty: 'key'
               }
            };
         },

      });

      return Panel;
   });
