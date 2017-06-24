define('js!WSControls/Tests/TestSubControls/TestSubControlChild',
   [
      'js!WSControls/Control/Base',
      'tmpl!WSControls/Tests/TestSubControls/TestSubControlChild'
   ],
   function(Base, template) {

      'use strict';

      var TestSubControlChild = Base.extend({
         _template: template,
         Constructor: function(cfg) {
            TestSubControlChild.superclass.constructor.call(this, cfg);
         }
      });

      return TestSubControlChild;
   }
)