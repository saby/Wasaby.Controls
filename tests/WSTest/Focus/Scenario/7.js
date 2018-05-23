/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('WSTest/Focus/Scenario/7', [
   'Core/constants',
   'WSTest/Focus/TestFocusHelpers'
], function (cConstants,
             fHelpers) {
   'use strict';
   /*
      AreaAbstract0
         AreaAbstract1
            Textbox0
            AreaAbstract2
               AreaAbstract3
                  Textbox1, enabled=false

      AreaAbstract2.setActive(true) - Textbox1, AreaAbstract3, AreaAbstract2 неактивны и не в фокусе
      AreaAbstract0.setActive(true) - Textbox0 в фокусе
    */
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