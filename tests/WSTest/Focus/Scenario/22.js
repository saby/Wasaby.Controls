/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('WSTest/Focus/Scenario/22', [
   'Core/constants',
   'WSTest/Focus/TestFocusHelpers'
], function (cConstants,
             fHelpers) {
   'use strict';
   /*
      AreaAbstract0
         AreaAbstract1
            Textbox1
            Textbox2, tabindex=3
            Textbox3, tabindex=1
            Textbox4, tabindex=2
            Textbox5
            Textbox6, tabindex=5

      AreaAbstract0.setActive(true), tab,tab,tab,tab,tab
      переходы фокуса - Textbox1, Textbox3, Textbox2, Textbox4, Textbox5, Textbox6
      табиндексы равны 1 4 2 3 5 6 соответственно
    */
   return function scenario22(testControl) {
      fHelpers.setControlActive(testControl.getChildControlByName('AreaAbstract1'), true);
      fHelpers.childHasFocus(testControl, 'TextBox1');

      fHelpers.fireTab(testControl.getChildControlByName('TextBox1'));
      fHelpers.childHasFocus(testControl, 'TextBox4');

      fHelpers.fireTab(testControl.getChildControlByName('TextBox3'));
      fHelpers.childHasFocus(testControl, 'TextBox2');

      fHelpers.fireTab(testControl.getChildControlByName('TextBox2'));
      fHelpers.childHasFocus(testControl, 'TextBox3');

      fHelpers.fireTab(testControl.getChildControlByName('TextBox4'));
      fHelpers.childHasFocus(testControl, 'TextBox5');

      fHelpers.fireTab(testControl.getChildControlByName('TextBox5'));
      fHelpers.childHasFocus(testControl, 'TextBox6');
   };
});