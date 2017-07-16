/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('js!WSTest/Focus/Scenario/2', [
   'Core/constants',
   'js!WSTest/Focus/TestFocusHelpers'
], function (cConstants,
             fHelpers) {
   'use strict';
   return function scenario2(testControl) {
      fHelpers.fireClick(testControl.getChildControlByName('TextBox0'));
      fHelpers.childHasFocus(testControl, 'TextBox0');

      fHelpers.fireTab(testControl.getChildControlByName('TextBox0'));
      fHelpers.childHasFocus(testControl, 'TextBox1');

      fHelpers.fireTab(testControl.getChildControlByName('TextBox1'));
      fHelpers.childHasFocus(testControl, 'TextBox3');

      fHelpers.fireTab(testControl.getChildControlByName('TextBox3'));
      fHelpers.childHasFocus(testControl, 'TextBox1');

      fHelpers.fireTab(testControl.getChildControlByName('TextBox1'));
      fHelpers.childHasFocus(testControl, 'TextBox3');
   };
});