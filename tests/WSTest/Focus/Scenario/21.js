/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('WSTest/Focus/Scenario/21', [
   'Core/constants',
   'WSTest/Focus/TestFocusHelpers'
], function (cConstants,
             fHelpers) {
   'use strict';
   /*
      AreaAbstract0
         AreaAbstract1, tabindex=2
            Textbox1, tabindex=1
            Textbox2, tabindex=0
            Textbox3, tabindex=2
         AreaAbstract2, tabindex=1
            Textbox4, tabindex=1
            Textbox5, tabindex=0
            Textbox6, tabindex=2

      AreaAbstract0.setActive(true) - фокус на Textbox4
      переходы по табу - Textbox6, Textbox1, Textbox3, last div, вышли из дома, first div, Textbox4, Textbox6, ...
      переходы shift+tab - то же самое в обратную сторону
    */
   return function scenario21(testControl) {//TODO Фокус на textbox0, Уход фокуса с контролов
      fHelpers.setControlActive(testControl, true);
      fHelpers.childHasFocus(testControl, 'TextBox4');

      fHelpers.fireTab(testControl.getChildControlByName('TextBox4'));
      fHelpers.childHasFocus(testControl, 'TextBox6');

      fHelpers.fireTab(testControl.getChildControlByName('TextBox6'));
      fHelpers.childHasFocus(testControl, 'TextBox1');

      fHelpers.fireTab(testControl.getChildControlByName('TextBox1'));
      fHelpers.childHasFocus(testControl, 'TextBox3');

      fHelpers.fireTab(testControl.getChildControlByName('TextBox3'));
      fHelpers.focusOnLastDiv();

      fHelpers.focusOn($('.ws-focus-in'));
      fHelpers.childHasFocus(testControl, 'TextBox4');

      fHelpers.fireTab(testControl.getChildControlByName('TextBox4'));
      fHelpers.childHasFocus(testControl, 'TextBox6');

      fHelpers.fireShiftTab(testControl.getChildControlByName('TextBox6'));
      fHelpers.childHasFocus(testControl, 'TextBox4');

      fHelpers.fireShiftTab(testControl.getChildControlByName('TextBox4'));
      fHelpers.focusOn($('.ws-focus-in'));
   };
});