define('Controls-demo/PropertyGrid/TimeIntervalTemplate',
   [
      'Core/Control',
      'wml!Controls-demo/PropertyGrid/TimeIntervalTemplate',
      'css!Controls-demo/Input/resources/VdomInputs'
   ],
   function(Control, template) {
      'use strict';

      var timeIntervalTmpl = Control.extend({
         _template: template,
         _valueChangedHandler: function(event, tmp) {
            this._notify('valueChanged', [tmp]);
         }
      });


      return timeIntervalTmpl;
   });
