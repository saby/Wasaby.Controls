/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('WSTest/Focus/Scenario/6', [
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
                  Textbox1

      AreaAbstract0.setActive(true) - Textbox1 в фокусе
    */
   return function scenario6(testControl) {
      fHelpers.fireClick(testControl);
      fHelpers.childHasFocus(testControl, 'TextBox1');
   };
});