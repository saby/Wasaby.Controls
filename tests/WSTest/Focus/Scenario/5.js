/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('js!WSTest/Focus/Scenario/5', [
   'Core/constants',
   'js!WSTest/Focus/TestFocusHelpers'
], function (cConstants,
             fHelpers) {
   'use strict';
   return function scenario5(testControl) {
      fHelpers.fireClick(testControl.getChildControlByName('TextBox0'));
      fHelpers.childHasFocus(testControl, 'TextBox0');
      fHelpers.childIsActive(testControl, 'TextBox0');
      fHelpers.childIsActive(testControl, 'AreaAbstract1');
      fHelpers.isActive(testControl);

      fHelpers.fireClick(testControl.getChildControlByName('AreaAbstract2'));
      fHelpers.childHasFocus(testControl, 'TextBox1');
      fHelpers.childIsActive(testControl, 'TextBox1');
      fHelpers.childIsActive(testControl, 'AreaAbstract3');
      fHelpers.childIsActive(testControl, 'AreaAbstract2');
      fHelpers.childIsActive(testControl, 'AreaAbstract1');
      fHelpers.isActive(testControl);

      fHelpers.fireClick(testControl.getChildControlByName('TextBox0'));
      fHelpers.childHasFocus(testControl, 'TextBox0');
      fHelpers.childIsActive(testControl, 'TextBox0');
      fHelpers.childIsActive(testControl, 'AreaAbstract1');
      fHelpers.isActive(testControl);
   };
});