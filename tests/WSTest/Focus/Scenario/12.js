/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('WSTest/Focus/Scenario/12', [
   'Core/constants',
   'WSTest/Focus/TestFocusHelpers'
], function (cConstants,
             fHelpers) {
   'use strict';
   /*
      AreaAbstract1
         Textbox0, parent=AreaAbstract2
         AreaAbstract2
            Textbox1

      клик на Textbox0 - фокус ушел на него
      таб - фокус ушел на Textbox1
    */
   return function scenario12(testControl) {//TODO Jquery
      $('.moveTb').prependTo('.AA1');
      fHelpers.fireClick(testControl.getChildControlByName('TextBox0'));
      fHelpers.childHasFocus(testControl, 'TextBox0');

      fHelpers.fireTab(testControl.getChildControlByName('TextBox0'));
      fHelpers.childHasFocus(testControl, 'TextBox1');
   };
});