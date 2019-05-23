define('Controls-demo/Input/Money/Money',
   [
      'Core/core-merge',
      'Controls-demo/Input/Base/Base',
      'json!Controls-demo/Input/Money/Money'
   ],

   function(cMerge, Base, config) {
      'use strict';

      var _private = {
         CONTENT: 'Controls/input:Money'
      };

      var Money = Base.extend({
         _content: _private.CONTENT,

         _beforeMount: function() {
            Money.superclass._beforeMount.apply(this, arguments);

            this._componentOptions.value = '0.00';
            this._componentOptions.name = 'InputMoney';
            this._componentOptions.onlyPositive = false;

            this._metaData = cMerge(this._metaData, config[_private.CONTENT].properties['ws-config'].options);
         }
      });

      return Money;
   });
