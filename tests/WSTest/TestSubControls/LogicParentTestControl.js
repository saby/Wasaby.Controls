define('js!WSTest/TestSubControls/LogicParentTestControl',
   [
      'js!WSControls/Control/Base',
      'tmpl!WSTest/TestSubControls/LogicParentTestControl'
   ],
   function(Base, template) {

      'use strict';

      var LogicParentTestControl = Base.extend({
         iWantVDOM: true,
         _template: template,
         constructor: function(cfg) {
            LogicParentTestControl.superclass.constructor.call(this, cfg);
         }
      });

      return LogicParentTestControl;
   }
)