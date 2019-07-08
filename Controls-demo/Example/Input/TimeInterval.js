define('Controls-demo/Example/Input/TimeInterval',
   [
      'Core/Control',
      'Types/entity',
      'wml!Controls-demo/Example/Input/TimeInterval/TimeInterval',

      'Controls/input',
      'Controls-demo/Example/resource/BaseDemoInput'
   ],
   function(Control, entity, template) {
      'use strict';

      var TimeInterval = Control.extend({
         _template: template,

         constructor: function() {
            TimeInterval.superclass.constructor.apply(this, arguments);

            var fTimeInterval = entity.TimeInterval;

            this._value1 = new fTimeInterval('P0DT12H30M00S');
            this._value2 = new fTimeInterval('P0DT12H30M00S');
            this._value3 = new fTimeInterval('P0DT120H00M00S');
            this._value4 = new fTimeInterval('P0DT9H35M27S');
         }
      });

      return TimeInterval;
   });
