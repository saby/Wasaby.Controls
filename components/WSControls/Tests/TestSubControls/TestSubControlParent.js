define('js!WSControls/Tests/TestSubControls/TestSubControlParent',
   [
      'js!WSControls/Control/Base',
      'tmpl!WSControls/Tests/TestSubControls/TestSubControlParent'
   ],
   function(Base, template) {

      'use strict';

      var TestSubControlParent = Base.extend({
         _template: template,
         Constructor: function(cfg) {
            TestSubControlParent.superclass.constructor.call(this, cfg);
         }
      });

      return TestSubControlParent;
   }
)