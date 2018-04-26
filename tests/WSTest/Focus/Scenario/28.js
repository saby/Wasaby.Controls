/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('WSTest/Focus/Scenario/28', [
   'Core/constants',
   'WSTest/Focus/TestFocusHelpers'
], function (cConstants,
             fHelpers) {
   'use strict';
   /*
      AreaAbstract0
         AreaAbstract1, activableByClick=false
            textbox0

      кликаем на область AreaAbstract0, но не на textbox0 - textbox0 фокусируется
    */
   return function scenario28(testControl) {
      fHelpers.fireClick(testControl.getChildControlByName('AreaAbstract0'));
      fHelpers.childIsActive(testControl, 'AreaAbstract0');
      fHelpers.childHasFocus(testControl, 'TextBox0');
   };
});
