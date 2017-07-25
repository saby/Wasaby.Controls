/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('js!WSTest/Focus/Scenario/21', [
   'Core/constants',
   'js!WSTest/Focus/TestFocusHelpers'
], function (cConstants,
             fHelpers) {
   'use strict';
   return function scenario21(testControl) {//TODO Фокус на textbox0
      fHelpers.setControlActive(testControl, true);
      fHelpers.childHasFocus(testControl, 'TextBox4');

      fHelpers.fireTab(testControl.getChildControlByName('TextBox4'));
      fHelpers.childHasFocus(testControl, 'TextBox6');

      fHelpers.fireTab(testControl.getChildControlByName('TextBox6'));
      fHelpers.childHasFocus(testControl, 'TextBox1');

      fHelpers.fireTab(testControl.getChildControlByName('TextBox1'));
      fHelpers.childHasFocus(testControl, 'TextBox3');

      fHelpers.fireTab(testControl.getChildControlByName('TextBox3'));
      fHelpers.focusOnLastDiv();



   };
});