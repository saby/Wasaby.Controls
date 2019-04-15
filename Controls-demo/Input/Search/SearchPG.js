define('Controls-demo/Input/Search/SearchPG',
   [
      'Core/Control',
      'tmpl!Controls-demo/PropertyGrid/DemoPG',
      'Types/source',
      'json!Controls-demo/PropertyGrid/pgtext',

      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Wrapper/Wrapper',
      'css!Controls-demo/Input/Search/Search'
   ],

   function(Control, template, source, config) {
      'use strict';

      var InputSearchPg = Control.extend({
         _template: template,
         _metaData: null,
         _content: 'Controls/Input/Search',
         _dataObject: null,
         _componentOptions: null,
         _componentClass: 'ControlsDemo__searchPG',

         _beforeMount: function() {

            this._dataObject = {
               value: {
                  readOnly: true
               },
               constraint: {
                  items: [
                     { id: 1, title: '[0-9]', value: '[0-9]', example: 'You can use only digits' },
                     { id: 2, title: '[a-zA-Z]', value: '[a-zA-Z]', example: 'You can use only letters' },
                     { id: 3, title: '[a-z]', value: '[a-z]', example: 'You can use only lowercase letters' },
                     { id: 4, title: '[A-Z]', value: '[A-Z]', example: 'You can use only uppercase letters' }
                  ],
                  config: {
                     template: 'custom',
                     value: 'title',
                     comment: 'example'
                  }
               }
            };
            this._componentOptions = {
               name: 'inputSearch',
               constraint: '',
               trim: false,
               value: '',
               maxLength: 100,
               selectOnClick: true,
               readOnly: false,
               searchButtonVisible: true,
               tooltip: 'myTooltip'
            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return InputSearchPg;
   });
