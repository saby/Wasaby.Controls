/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('WSTest/Focus/Scenario/1', [
   'Core/constants',
   'WSTest/Focus/TestFocusHelpers'
], function (cConstants,
             fHelpers) {
   'use strict';
   /*
      AreaAbstract0
         Textbox0, tabindex=5
         AreaAbstract1
            Textbox1, tabindex=1
            Textbox2, tabindex=0
            Textbox3, tabindex=2

      кликаем на Textbox0 - Textbox0 в фокусе, Textbox0 активен, AreaAbstract0 активен
      нажимаем таб - Textbox1 в фокусе, Textbox1 активен, AreaAbstract1 активен, AreaAbstract0 активен.
      нажимаем таб - Textbox3 в фокусе.
      кликаем на свободную область AreaAbstract1 - фокус на Textbox3
      нажимаем таб - Textbox2 не в фокусе, AreaAbstract1 неактивен, AreaAbstract0 неактивен.
      кликаем на свободную область AreaAbstract1 - фокус на Textbox1
    */
   return function scenario1(testControl) {//TODO Уход фокуса с контролов на не контрол
      fHelpers.fireClick(testControl.getChildControlByName('TextBox0'));
      fHelpers.childIsActive(testControl, 'TextBox0');
      fHelpers.childHasFocus(testControl, 'TextBox0');
      fHelpers.isActive(testControl);

      fHelpers.fireTab(testControl.getChildControlByName('TextBox0'));
      fHelpers.childIsActive(testControl, 'TextBox1');
      fHelpers.childIsActive(testControl, 'AreaAbstract1');
      fHelpers.childHasFocus(testControl, 'TextBox1');
      fHelpers.isActive(testControl);

      fHelpers.fireTab(testControl.getChildControlByName('TextBox1'));
      fHelpers.childHasFocus(testControl, 'TextBox3');

      fHelpers.fireClick(testControl.getChildControlByName('AreaAbstract1'));
      fHelpers.childHasFocus(testControl, 'TextBox3');
      //
      // fHelpers.fireTab(testControl.getChildControlByName('TextBox3'));
      // fHelpers.childIsNotInFocus(testControl, 'TextBox2');
      // fHelpers.childIsNotActive(testControl, 'AreaAbstract1');
      // fHelpers.notActive(testControl);
      //
      // fHelpers.fireClick(testControl.getChildControlByName('AreaAbstract1'));
      // fHelpers.childHasFocus(testControl, 'TextBox1');
   };
});