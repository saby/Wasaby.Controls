/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('js!WSTest/Focus/Scenario/7', [
   'Core/constants',
   'js!WSTest/Focus/TestFocusHelpers'
], function (cConstants,
             fHelpers) {
   'use strict';
   return function scenario7(testControl) {//TODO AreaAbstract2 активна и в фокусе
      fHelpers.setChildActive(testControl, 'AreaAbstract2', true);
      fHelpers.childIsNotInFocus(testControl, 'TextBox1');
      // fHelpers.childIsNotInFocus(testControl, 'AreaAbstract2');
      fHelpers.childIsNotInFocus(testControl, 'AreaAbstract3');
      fHelpers.childIsNotActive(testControl, 'TextBox1');
      // fHelpers.childIsNotActive(testControl, 'AreaAbstract2');
      fHelpers.childIsNotActive(testControl, 'AreaAbstract3');

      fHelpers.setControlActive(testControl);
      // fHelpers.childHasFocus(testControl, 'TextBox0');
   };
});