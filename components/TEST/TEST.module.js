define('js!SBIS3.CONTROLS.TEST', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.TEST',
   'js!SBIS3.CONTROLS.TextBox',
   'js!SBIS3.CONTROLS.ComboBox'
], function(CompoundControl, dot){
   'use strict';
   var TEST = CompoundControl.extend({
      _dotTplFn : dot,
      $contstructor : function(){

      },
      init : function() {
         TEST.superclass.init.call(this);
      }
   });
   return TEST;
});