/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('WSTest/Focus/Scenario/24', [
   'Core/constants',
   'WSTest/Focus/TestFocusHelpers'
], function (cConstants,
             fHelpers) {
   'use strict';
   /*
      tag input1
      AreaAbstract1
         tag input2
      AreaAbstract2
         tag input3

      Кликаем на tag input1, проверяем активность AreaAbstract
      Кликаем на tag input2, проверяем активность AreaAbstract
      Кликаем на tag input3, проверяем активность AreaAbstract
      Кликаем на tag input2, проверяем активность AreaAbstract
      Кликаем на tag input1, проверяем активность AreaAbstract
    */
   return function scenario24(testControl) {
      fHelpers.fireClick(testControl.getChildControlByName('Button0'));
      fHelpers.childIsNotActive(testControl, 'AreaAbstract1');
      fHelpers.childIsNotActive(testControl, 'AreaAbstract2');

      fHelpers.focusOn($('.input2'));
      fHelpers.childHasFocus(testControl, 'AreaAbstract1');

      fHelpers.focusOn($('.input3'));
      fHelpers.childHasFocus(testControl, 'AreaAbstract2');

      fHelpers.focusOn($('.input2'));
      fHelpers.childHasFocus(testControl, 'AreaAbstract1');

      fHelpers.focusOn($('.input1'));
      fHelpers.childIsNotInFocus(testControl, 'AreaAbstract2')

      fHelpers.fireClick(testControl.getChildControlByName('Button0'));
      fHelpers.childIsNotActive(testControl, 'AreaAbstract1');
      fHelpers.childIsNotActive(testControl, 'AreaAbstract2');
   };
});
