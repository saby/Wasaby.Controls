define('js!WSTest/TestSubControls/TestSubControlParent',
   [
      'js!WSControls/Control/Base',
      'tmpl!WSTest/TestSubControls/TestSubControlParent'
   ],
   function(Base, template) {

      'use strict';

      var TestSubControlParent = Base.extend({
         iWantVDOM: true,
         _template: template,
         constructor: function(cfg) {
            TestSubControlParent.superclass.constructor.call(this, cfg);
         }
      });

      return TestSubControlParent;
   }
)