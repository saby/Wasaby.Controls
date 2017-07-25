/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('js!WSTest/Focus/Scenario/1', [
   'Core/constants',
   'js!WSTest/Focus/TestFocusHelpers'
], function (cConstants,
             fHelpers) {
   'use strict';
   return function scenario1(testControl) {
      fHelpers.fireClick(testControl.getChildControlByName('TextBox0'));
      fHelpers.childIsActive(testControl, 'TextBox0');
      fHelpers.childHasFocus(testControl, 'TextBox0');
      fHelpers.isActive(testControl);

      fHelpers.fireTab(testControl.getChildControlByName('TextBox0'));
      fHelpers.childIsActive(testControl, 'TextBox1');
      fHelpers.childIsActive(testControl, 'AreaAbstract1');
      fHelpers.childHasFocus(testControl, 'TextBox1');
      fHelpers.isActive(testControl);

      fHelpers.fireTab(testControl.getChildControlByName('TextBox1'));
      fHelpers.childHasFocus(testControl, 'TextBox3');

      fHelpers.fireClick(testControl.getChildControlByName('AreaAbstract1'));
      fHelpers.childHasFocus(testControl, 'TextBox3');
      //
      // fHelpers.fireTab(testControl.getChildControlByName('TextBox3'));
      // fHelpers.childIsNotInFocus(testControl, 'TextBox2');
      // fHelpers.childIsNotActive(testControl, 'AreaAbstract1');
      // fHelpers.notActive(testControl);
      //
      // fHelpers.fireClick(testControl.getChildControlByName('AreaAbstract1'));
      // fHelpers.childHasFocus(testControl, 'TextBox1');
   };
});