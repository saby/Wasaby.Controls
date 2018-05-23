/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('WSTest/Focus/Scenario/31', [
   'Core/constants',
   'WSTest/Focus/TestFocusHelpers'
], function (cConstants,
             fHelpers) {
   'use strict';
   /*
      AreaAbstract0
         Textbox0

      AreaAbstract0.destroy()
      AreaAbstract0.setActive(true) - не сфокусировалось
    */
   return function scenario31(testControl) {
      var aa0 = testControl.getChildControlByName('AreaAbstract0');
      var tb0 = testControl.getChildControlByName('TextBox0');
      fHelpers.fireClick(testControl.getChildControlByName('TextBox0'));
      aa0.destroy();
      fHelpers.notActive(aa0);
      fHelpers.notActive(tb0);
   };
});
