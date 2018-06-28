/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('WSTest/Focus/Scenario/15', [
   'Core/constants',
   'SBIS3.CONTROLS/TextBox',
   'WSTest/Focus/TestFocusHelpers',
   'Lib/Control/Window/Window',
   'WSTest/Focus/Case15Parent',
   'WSTest/Focus/Case15',
   'css!' + wsConfig.wsRoot + 'css/core.css',
   'css!' + wsConfig.wsRoot + 'css/themes/wi_scheme.css'
], function (cConstants,
             TextBox,
             fHelpers,
             W) {
   'use strict';
   /*
      Textbox0
      FloatArea
         header
            textbox1, class=ws-autofocus
            textbox2
         content
            textbox3
            textbox4

      кликаем на textbox0 - фокус в нем
      Открываем панель - фокус уходит на textbox1
      таб - уходит на textbox2
      таб - уходит на textbox3
      таб - уходит на textbox4
      таб - уходит на textbox1
      floatArea.hide() - фокус возвращается на textbox0
    */
   var caseParentControlName = 'WSTest/Focus/Case15Parent';
   var caseChildControlName = 'WSTest/Focus/Case15';
   return function scenario15(done) {//TODO Фокус остается на TextBox1
      var wndParent = new W({
         template: caseParentControlName,
         top: 0,
         width: '500px',
         height: '200px'
      });

      setTimeout(function() {
         fHelpers.fireClick(wndParent.getChildControlByName('TextBox0'));
         fHelpers.childHasFocus(wndParent, 'TextBox0');

         var wndChild = new W({
            template: caseChildControlName,
            opener: wndParent,
            width: '500px',
            height: '200px'
         });

         setTimeout(function() {
            fHelpers.childHasFocus(wndChild, 'TextBox1');

            fHelpers.fireTab(wndChild.getChildControlByName('TextBox3'));
            fHelpers.childHasFocus(wndChild, 'TextBox2');

            fHelpers.fireTab(wndChild.getChildControlByName('TextBox2'));
            fHelpers.childHasFocus(wndChild, 'TextBox3');

            fHelpers.fireTab(wndChild.getChildControlByName('TextBox3'));
            fHelpers.childHasFocus(wndChild, 'TextBox4');

            fHelpers.fireTab(wndChild.getChildControlByName('TextBox4'));
            fHelpers.childHasFocus(wndChild, 'TextBox1');

            wndChild.destroy();
            fHelpers.childHasFocus(wndParent, 'TextBox0');
            wndParent.destroy();
            delete window[caseChildControlName];
            delete window[caseParentControlName];
            done();
         }, 100);
      }, 100);


   };
});