/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('WSTest/Focus/Scenario/23', [
   'Core/constants',
   'WSTest/Focus/TestFocusHelpers'
], function (cConstants,
             fHelpers) {
   'use strict';
   /*
      AreaAbstract0
         tag input
         tag div
         tag div tabindex=1
         tag textarea
         Textbox0
         AreaAbstract1
            textbox1

      кликаем на tag input, AreaAbstract0 активируется, фокус переходит на TextBox0
      нажимаем tab, фокус переходит на TextBox1
    */
   return function scenario23(testControl) {//TODO AreaAbstract.compatible setActive, dom-фокус не меняется
      fHelpers.focusOn($('.input1'));
      // fHelpers.childHasFocus(testControl, 'TextBox0');
      // fHelpers.isActive(testControl);
      //
      // fHelpers.fireTab(testControl.getChildControlByName('TextBox1'));
      // fHelpers.childHasFocus(testControl, 'TextBox1');
   };
});
