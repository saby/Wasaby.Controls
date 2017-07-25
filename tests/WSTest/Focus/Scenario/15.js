/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('js!WSTest/Focus/Scenario/15', [
   'Core/constants',
   'js!SBIS3.CONTROLS.TextBox',
   'js!WSTest/Focus/TestFocusHelpers',
   'js!SBIS3.CORE.Window',
   'js!WSTest/Focus/Case15Parent',
   'js!WSTest/Focus/Case15',
   'css!' + wsConfig.wsRoot + 'css/core.css',
   'css!' + wsConfig.wsRoot + 'css/themes/wi_scheme.css'
], function (cConstants,
             TextBox,
             fHelpers,
             W) {
   'use strict';
   return function scenario15(done) {//TODO Фокус остается на TextBox1
      var wndParent = new W({
         template: 'js!WSTest/Focus/Case15Parent',
         top: 0,
         width: '500px',
         height: '200px'
      });

      setTimeout(function() {
         fHelpers.fireClick(wndParent.getChildControlByName('TextBox0'));
         fHelpers.childHasFocus(wndParent, 'TextBox0');

         var wndChild = new W({
            template: 'js!WSTest/Focus/Case15',
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
            done();
         }, 10);
      }, 10);


   };
});