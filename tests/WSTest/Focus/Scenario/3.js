/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('js!WSTest/Focus/Scenario/3', [
   'Core/constants',
   'js!WSTest/Focus/TestFocusHelpers'
], function (cConstants,
             fHelpers) {
   'use strict';
   return function scenario3(testControl) {
      fHelpers.fireClick(testControl.getChildControlByName('TextBox0'));
      fHelpers.childHasFocus(testControl, 'TextBox0');

      fHelpers.fireTab(testControl.getChildControlByName('TextBox0'));
      fHelpers.childIsNotInFocus(testControl, 'AreaAbstract1');
      fHelpers.childIsNotInFocus(testControl, 'TextBox2');

      fHelpers.dropFocus();
      fHelpers.setChildActive(testControl, 'AreaAbstract1', true);
      fHelpers.childHasFocus(testControl, 'AreaAbstract1');
      fHelpers.childIsActive(testControl, 'AreaAbstract1');
   };
});