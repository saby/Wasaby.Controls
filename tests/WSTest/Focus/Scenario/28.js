/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('js!WSTest/Focus/Scenario/28', [
   'Core/constants',
   'js!WSTest/Focus/TestFocusHelpers'
], function (cConstants,
             fHelpers) {
   'use strict';
   /*
      AreaAbstract0, activableByClick=false
         textbox0

      кликаем на область AreaAbstract0, но не на textbox0 - textbox0 не фокусируется, ничего не активируется
    */
   return function scenario28(testControl) {
      fHelpers.fireClick(testControl.getChildControlByName('AreaAbstract0'));
      fHelpers.childIsNotActive(testControl, 'AreaAbstract0');
      fHelpers.childHasFocus(testControl, 'TextBox1');
   };
});
