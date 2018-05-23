/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('WSTest/Focus/Scenario/2', [
   'Core/constants',
   'WSTest/Focus/TestFocusHelpers'
], function (cConstants,
             fHelpers) {
   'use strict';
   /*
      AreaAbstract0
         Textbox0, tabindex=5
         AreaAbstract1, ignoreTabCycles=false
            Textbox1, tabindex=1
            Textbox2, tabindex=0
            Textbox3, tabindex=2

      кликаем на Textbox0 - Textbox0 в фокусе
      нажимаем таб - Textbox1 в фокусе.
      нажимаем таб - Textbox3 в фокусе.
      нажимаем таб - Textbox1 в фокусе.
      нажимаем таб - Textbox3 в фокусе.
    */
   return function scenario2(testControl) {
      fHelpers.fireClick(testControl.getChildControlByName('TextBox0'));
      fHelpers.childHasFocus(testControl, 'TextBox0');

      fHelpers.fireTab(testControl.getChildControlByName('TextBox0'));
      fHelpers.childHasFocus(testControl, 'TextBox1');

      fHelpers.fireTab(testControl.getChildControlByName('TextBox1'));
      fHelpers.childHasFocus(testControl, 'TextBox3');

      fHelpers.fireTab(testControl.getChildControlByName('TextBox3'));
      fHelpers.childHasFocus(testControl, 'TextBox1');

      fHelpers.fireTab(testControl.getChildControlByName('TextBox1'));
      fHelpers.childHasFocus(testControl, 'TextBox3');
   };
});