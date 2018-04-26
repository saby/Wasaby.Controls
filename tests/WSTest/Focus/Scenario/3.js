/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('WSTest/Focus/Scenario/3', [
   'Core/constants',
   'WSTest/Focus/TestFocusHelpers'
], function (cConstants,
             fHelpers) {
   'use strict';
   /*
      AreaAbstract0
         Textbox0, tabindex=5
         AreaAbstract1
            Textbox2, tabindex=0

      кликаем на Textbox0 - Textbox0 в фокусе
      нажимаем таб - AreaAbstract1 не в фокусе, Textbox2 не в фокусе.
      сбрасываем фокус
      кликаем на Textbox2 - что с фокусом и активностью?
      сбрасываем фокус
      AreaAbstract1.setActive(true) - AreaAbstract1 взяло фокус и активность на себя
    */
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