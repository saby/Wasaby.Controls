/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('WSTest/Focus/Scenario/33', [
   'Core/constants',
   'WSTest/Focus/TestFocusHelpers',
   'WSTest/Focus/Case33'
], function (cConstants,
             fHelpers,
             caseControl) {
   'use strict';
   /*
    AreaAbstract0 _getElementToFocus=function(){return div1}
    Textbox0
    div1

    AreaAbstract0.setActive(true) - div1 в фокусе
    */
   return function scenario33(done) {
      var testControl = new caseControl({
         element: $('#component')
      });
      fHelpers.setControlActive(testControl, true);
      fHelpers.childHasFocus(testControl, 'TextBox0');
      testControl.destroy();
      done();
   };
});
