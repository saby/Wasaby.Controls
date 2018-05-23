/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('WSTest/Focus/Scenario/4', [
   'Core/constants',
   'WSTest/Focus/TestFocusHelpers'
], function (cConstants,
             fHelpers) {
   'use strict';
   /*
      AreaAbstract0
         Textbox0, tabindex=5
         AreaAbstract1

      кликаем на Textbox0 - Textbox0 в фокусе
      нажимаем таб - AreaAbstract1 в фокусе
    */
   return function scenario4(testControl) {
      fHelpers.fireClick(testControl.getChildControlByName('TextBox0'));
      fHelpers.childHasFocus(testControl, 'TextBox0');

      fHelpers.fireTab(testControl.getChildControlByName('TextBox0'));
      fHelpers.childHasFocus(testControl, 'AreaAbstract1');
   };
});