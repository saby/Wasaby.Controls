/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('WSTest/Focus/Scenario/29', [
   'Core/constants',
   'WSTest/Focus/TestFocusHelpers'
], function (cConstants,
             fHelpers) {
   'use strict';
   /*
      AreaAbstract0
         AreaAbstract1, activableByClick=false
            input

      кликаем в input - что происходит?
      надо поиграться с activableByClick, написать еще пару тестов
    */
   return function scenario29(testControl) {
      fHelpers.focusOn($('.input1'));
      fHelpers.childHasFocus(testControl, 'AreaAbstract1');
   };
});
