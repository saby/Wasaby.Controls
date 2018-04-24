/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('WSTest/Focus/Scenario/25', [
   'Core/constants',
   'WSTest/Focus/TestFocusHelpers'
], function (cConstants,
             fHelpers) {
   'use strict';
   /*
      AreaAbstract0
         AreaAbstract1
            AreaAbstract2
               Textbox0
               Textbox1
      AreaAbstract3
         Textbox2

      AreaAbstract0.setActive(true) - Textbox0 в фокусе
      tab - Textbox1 в фокусе
      tab - Textbox2 в фокусе
    */
   return function scenario25(testControl) {
      fHelpers.setControlActive(testControl.getChildControlByName('AreaAbstract0'), true);
      fHelpers.childHasFocus(testControl, 'TextBox0');

      fHelpers.fireTab(testControl.getChildControlByName('TextBox0'));
      fHelpers.childHasFocus(testControl, 'TextBox1');

      fHelpers.fireTab(testControl.getChildControlByName('TextBox1'));
      fHelpers.childHasFocus(testControl, 'TextBox2');
   };
});
