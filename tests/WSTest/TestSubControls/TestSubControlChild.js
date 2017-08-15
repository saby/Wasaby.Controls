define('js!WSTest/TestSubControls/TestSubControlChild',
   [
      'Core/Control',
      'tmpl!WSTest/TestSubControls/TestSubControlChild'
   ],
   function(Base, template) {

      'use strict';

      var TestSubControlChild = Base.extend({
         _template: template,
         constructor: function(cfg) {
            TestSubControlChild.superclass.constructor.call(this, cfg);
         },
         launchTestEvent: function(){
            this._notify('onMyEvent');
         }
      });

      return TestSubControlChild;
   }
)