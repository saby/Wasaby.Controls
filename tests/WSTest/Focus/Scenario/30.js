/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('js!WSTest/Focus/Scenario/30', [
   'Core/constants',
   'js!WSTest/Focus/TestFocusHelpers'
], function (cConstants,
             fHelpers) {
   'use strict';
   /*
      AreaAbstract0
         Textbox0
         CORE.Button tabindex=0 onclick=function(){floatarea1.show()}
      FloatArea1
         Textbox1

      кликаем на Textbox0, кликаем на кнопку, открылась панель, нажимаем esc, активность должна уйти на Textbox0
    */
   return function scenario30(testControl) {
      fHelpers.focusOn($('.input1'));
      fHelpers.childHasFocus(testControl, 'AreaAbstract1');
   };
});
