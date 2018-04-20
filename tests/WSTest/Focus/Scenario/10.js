/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('WSTest/Focus/Scenario/10', [
   'Core/constants',
   'WSTest/Focus/TestFocusHelpers'
], function (cConstants,
             fHelpers) {
   'use strict';
   /*
      AreaAbstract0
         AreaAbstract1
            Textbox0
            AreaAbstract2, css visibility=hidden
               AreaAbstract3
                  Textbox1

      Textbox0.setActive(true) - он сфокусировался и заактивировался
      Textbox1.setActive(true) - фокус слетает в body
    */
   return function scenario10(testControl) {//TODO Фокус на textbox0
      fHelpers.setChildActive(testControl, 'TextBox0', true);
      fHelpers.childHasFocus(testControl, 'TextBox0');
      fHelpers.childIsActive(testControl, 'TextBox0');

      fHelpers.setChildActive(testControl, "TextBox1", true);
      // fHelpers.checkFocusOnBody();
   };
});