/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('js!WSTest/Focus/Scenario/27', [
   'Core/constants',
   'js!WSTest/Focus/TestFocusHelpers'
], function (cConstants,
             fHelpers) {
   'use strict';
   /*
      AreaAbstract0
         Textbox0

      AreaAbstract0.destroy()
      AreaAbstract0.setActive(true) - не сфокусировалось
    */
   return function scenario27(testControl) {
      var aa1 = testControl.getChildControlByName('AreaAbstract0');
      aa1.destroy();
      fHelpers.setControlActive(aa1, true);
      fHelpers.notActive(aa1);
   };
});