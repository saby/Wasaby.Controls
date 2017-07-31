/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('js!WSTest/Focus/Scenario/26', [
   'Core/constants',
   'js!WSTest/Focus/TestFocusHelpers',
   'js!WSTest/Focus/Case26'
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
   return function scenario26(done) {
      var testControl = new caseControl({
         element: $('#component')
      });
      fHelpers.setControlActive(testControl, true);
      fHelpers.checkFocusOn('div1');
      testControl.destroy();
      done();
   };
});
