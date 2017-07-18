/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('js!WSTest/Focus/Scenario/12', [
   'Core/constants',
   'js!WSTest/Focus/TestFocusHelpers'
], function (cConstants,
             fHelpers) {
   'use strict';
   return function scenario12(testControl) {//TODO Jquery
      $('.moveTb').prependTo('.AA1');
      fHelpers.fireClick(testControl.getChildControlByName('TextBox0'));
      fHelpers.childHasFocus(testControl, 'TextBox0');

      fHelpers.fireTab(testControl.getChildControlByName('TextBox0'));
      fHelpers.childHasFocus(testControl, 'TextBox1');
   };
});