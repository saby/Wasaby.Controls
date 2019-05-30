define('Controls-demo/Input/Number/NumberPG',
   [
      'Core/core-merge',
      'Controls-demo/Input/Base/Base',
      'json!Controls-demo/Input/Number/Number'
   ],

   function(cMerge, Base, config) {
      'use strict';

      var _private = {
         CONTENT: 'Controls/input:Number'
      };

      var NumberPG = Base.extend({
         _content: _private.CONTENT,

         _beforeMount: function() {
            NumberPG.superclass._beforeMount.apply(this, arguments);

            this._componentOptions.value = null;
            this._componentOptions.precision = 2;
            this._componentOptions.integersLength = 5;
            this._componentOptions.name = 'InputNumber';
            this._componentOptions.useGrouping = true;
            this._componentOptions.onlyPositive = true;
            this._componentOptions.showEmptyDecimals = true;

            this._metaData = cMerge(this._metaData, config[_private.CONTENT].properties['ws-config'].options);
         }
      });
      return NumberPG;
   });
