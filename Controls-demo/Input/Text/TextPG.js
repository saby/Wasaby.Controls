define('Controls-demo/Input/Text/TextPG',
   [
      'Core/core-merge',
      'Controls-demo/Input/Base/Base',
      'json!Controls-demo/Input/Text/Text'
   ],

   function(cMerge, Base, config) {
      'use strict';

      var _private = {
         CONTENT: 'Controls/input:Text'
      };

      var TextPG = Base.extend({
         _content: _private.CONTENT,

         _beforeMount: function() {
            TextPG.superclass._beforeMount.apply(this, arguments);

            this._dataObject.constraint = {
               updateInitiator: 'inputCompleted',
               items: [
                  {
                     id: 1, title: '[0-9]', value: '[0-9]', example: 'You can use only digits'
                  },
                  {
                     id: 2, title: '[a-zA-Z]', value: '[a-zA-Z]', example: 'You can use only letters'
                  },
                  {
                     id: 3, title: '[a-z]', value: '[a-z]', example: 'You can use only lowercase letters'
                  },
                  {
                     id: 4, title: '[A-Z]', value: '[A-Z]', example: 'You can use only uppercase letters'
                  }
               ],
               config: {
                  template: 'custom',
                  value: 'title',
                  comment: 'example'
               }
            };

            this._componentOptions.trim = false;
            this._componentOptions.maxLength = 100;
            this._componentOptions.constraint = '';
            this._componentOptions.name = 'InputText';

            this._metaData = cMerge(this._metaData, config[_private.CONTENT].properties['ws-config'].options);
         }
      });
      return TextPG;
   });
