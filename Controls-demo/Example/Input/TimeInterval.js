define('Controls-demo/Example/Input/TimeInterval',
   [
      'Core/Control',
      'Types/entity',
      'Controls-demo/Example/Input/SetValueMixin',
      'wml!Controls-demo/Example/Input/TimeInterval/TimeInterval',

      'Controls/input',
      'Controls-demo/Example/resource/BaseDemoInput'
   ],
   function(Control, entity, SetValueMixin, template) {
      'use strict';

      var TimeInterval = Control.extend([SetValueMixin], {
         _template: template,

         constructor: function() {
            TimeInterval.superclass.constructor.apply(this, arguments);

            var fTimeInterval = entity.TimeInterval;

            this._default1Value = new fTimeInterval('P0DT12H30M00S');
            this._default2value = new fTimeInterval('P0DT12H30M00S');
            this._default3value = new fTimeInterval('P0DT120H00M00S');
            this._default4value = new fTimeInterval('P0DT9H35M27S');
         }
      });

      return TimeInterval;
   });
