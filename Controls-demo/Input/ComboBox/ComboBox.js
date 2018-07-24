define('Controls-demo/Input/ComboBox/ComboBox',
   [
      'Core/Control',
      'tmpl!Controls-demo/Input/ComboBox/ComboBox',
      'WS.Data/Source/Memory',
      'Controls/Input/ComboBox'
   ],
   function(Control, template, Memory) {

      'use strict';


      var ComboBox = Control.extend({
         _template: template,

         _defaultItems: [
            {
               id: '1',
               title: 'Запись 1'
            },
            {
               id: '2',
               title: 'Запись 2'
            },
            {
               id: '3',
               title: 'Запись 3'
            },
            {
               id: '4',
               title: 'Запись 4'
            },
            {
               id: '5',
               title: 'Запись 5'
            },
            {
               id: '6',
               title: 'Запись 6'
            },
            {
               id: '7',
               title: 'Запись 7'
            },
            {
               id: '8',
               title: 'Запись 8'
            }
         ],
         _createMemory: function() {
            return new Memory({
               idProperty: 'id',
               data: this._defaultItems
            });
         },
         _selectedKey: '3',
         _selectedKey5: '4'
      });

      return ComboBox;
   }
);
