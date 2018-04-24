/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('WSTest/Focus/Scenario/8', [
   'Core/constants',
   'WSTest/Focus/TestFocusHelpers'
], function (cConstants,
             fHelpers) {
   'use strict';
   /*
      AreaAbstract0
         AreaAbstract1
            Textbox0, enabled=false
            AreaAbstract2
               AreaAbstract3
                  Textbox1, enabled=false

      AreaAbstract0.setActive(true) - никто не в фокусе и неактивен
    */
   return function scenario8(testControl) {
      fHelpers.setControlActive(testControl);
      fHelpers.notActive(testControl);
      fHelpers.notInFocus(testControl);
      fHelpers.childIsNotInFocus(testControl, 'TextBox0');
      fHelpers.childIsNotInFocus(testControl, 'TextBox1');
      fHelpers.childIsNotInFocus(testControl, 'AreaAbstract1');
      fHelpers.childIsNotInFocus(testControl, 'AreaAbstract2');
      fHelpers.childIsNotInFocus(testControl, 'AreaAbstract3');
      fHelpers.childIsNotActive(testControl, 'TextBox0');
      fHelpers.childIsNotActive(testControl, 'TextBox1');
      fHelpers.childIsNotActive(testControl, 'AreaAbstract1');
      fHelpers.childIsNotActive(testControl, 'AreaAbstract2');
      fHelpers.childIsNotActive(testControl, 'AreaAbstract3');
   };
});