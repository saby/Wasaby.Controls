define('Controls-demo/Decorators/Money/Money',
   [
      'UI/Base',
      'json!Controls-demo/Decorators/Money/Money',
      'tmpl!Controls-demo/PropertyGrid/DemoPG'
   ],

   function(Base, config, template) {
      'use strict';

      var _private = {
         CONTENT: 'Controls/_decorator/Money'
      };

      var Money = Base.Control.extend({
         _template: template,

         _metaData: null,

         _dataObject: null,

         _componentOptions: null,

         _content: _private.CONTENT,

         _beforeMount: function() {
            this._dataObject = {
               style: {
                  emptyText: 'none',
                  placeholder: 'select',
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 0
               }
            };
            this._componentOptions = {
               title: '',
               value: '0.00',
               style: 'default',
               name: 'DecoratorMoney',
               useGrouping: true,
               showEmptyDecimals: true
            };
            this._metaData = config[_private.CONTENT].properties['ws-config'].options;
         }
      });

      return Money;
   });
