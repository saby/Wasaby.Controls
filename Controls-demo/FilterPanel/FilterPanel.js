define('Controls-demo/FilterPanel/FilterPanel',
   [
      'Core/Control',
      'WS.Data/Source/Memory',
      'tmpl!Controls-demo/FilterPanel/FilterPanel',
      'Controls/Input/Number',
      'Controls/Input/Password',
      'Controls/Input/Area',
      'Controls/Input/Dropdown',
      'Controls/Filter/Button/Panel'
   ],

   function(Control, Memory, template) {
      'use strict';

      var FilterPanel = Control.extend({

         _template: template,
         areaText: '',
         sKey: 1,

         sourceDropdown: {
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
         },

         changeHandler: function(event, value) {
            this.areaText = value['0'];
            this.areaText += '\n' + value['1'] + '\n' + value['2'];
         }



      });

      return FilterPanel;
   });
