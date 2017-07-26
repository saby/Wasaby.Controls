/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('js!WSTest/Focus/Scenario/22', [
   'Core/constants',
   'js!WSTest/Focus/TestFocusHelpers'
], function (cConstants,
             fHelpers) {
   'use strict';
   return function scenario22(testControl) {//TODO Фокус на textbox0
      fHelpers.setControlActive(testControl.getChildControlByName('AreaAbstract1'), true);
      fHelpers.childHasFocus(testControl, 'TextBox1');

      fHelpers.fireTab(testControl.getChildControlByName('TextBox1'));
      fHelpers.childHasFocus(testControl, 'TextBox4');

      fHelpers.fireTab(testControl.getChildControlByName('TextBox3'));
      fHelpers.childHasFocus(testControl, 'TextBox2');

      fHelpers.fireTab(testControl.getChildControlByName('TextBox2'));
      fHelpers.childHasFocus(testControl, 'TextBox3');

      fHelpers.fireTab(testControl.getChildControlByName('TextBox4'));
      fHelpers.childHasFocus(testControl, 'TextBox5');

      fHelpers.fireTab(testControl.getChildControlByName('TextBox5'));
      fHelpers.childHasFocus(testControl, 'TextBox6');
   };
});