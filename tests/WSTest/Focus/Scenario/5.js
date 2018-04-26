/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('WSTest/Focus/Scenario/5', [
   'Core/constants',
   'WSTest/Focus/TestFocusHelpers'
], function (cConstants,
             fHelpers) {
   'use strict';
   /*
      AreaAbstract0
         AreaAbstract1
            Textbox0
            AreaAbstract2
               AreaAbstract3
                  Textbox1

      кликаем на Textbox0 - Textbox0 в фокусе, он и всего его паренты активны, остальные неактивны
      кликаем на AreaAbstract2 - Textbox1 в фокусе, он и всего его паренты активны
      кликаем на Textbox0 - Textbox0 в фокусе, он и всего его паренты активны, остальные неактивны
    */
   return function scenario5(testControl) {
      fHelpers.fireClick(testControl.getChildControlByName('TextBox0'));
      fHelpers.childHasFocus(testControl, 'TextBox0');
      fHelpers.childIsActive(testControl, 'TextBox0');
      fHelpers.childIsActive(testControl, 'AreaAbstract1');
      fHelpers.isActive(testControl);

      fHelpers.fireClick(testControl.getChildControlByName('AreaAbstract2'));
      fHelpers.childHasFocus(testControl, 'TextBox1');
      fHelpers.childIsActive(testControl, 'TextBox1');
      fHelpers.childIsActive(testControl, 'AreaAbstract3');
      fHelpers.childIsActive(testControl, 'AreaAbstract2');
      fHelpers.childIsActive(testControl, 'AreaAbstract1');
      fHelpers.isActive(testControl);

      fHelpers.fireClick(testControl.getChildControlByName('TextBox0'));
      fHelpers.childHasFocus(testControl, 'TextBox0');
      fHelpers.childIsActive(testControl, 'TextBox0');
      fHelpers.childIsActive(testControl, 'AreaAbstract1');
      fHelpers.isActive(testControl);
   };
});