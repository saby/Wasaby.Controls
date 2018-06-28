/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('WSTest/Focus/Scenario/13', [
   'WSTest/Focus/TestFocusHelpers',
   'Lib/Control/Window/Window',
   'tmpl!WSTest/Focus/Case1',
   'WSTest/Focus/Case13',
   'WSTest/Focus/CaseControl',
   'css!' + wsConfig.wsRoot + 'css/core.css',
   'css!' + wsConfig.wsRoot + 'css/themes/wi_scheme.css'
], function (fHelpers,
             W,
             caseTemplate,
             caseControl) {
   'use strict';
   /*
      FloatArea
         header
            textbox1
            textbox2
         content
            textbox3
            textbox4

      Открываем панель - фокус уходит на textbox1
    */
   var caseControlName = 'WSTest/Focus/Case13';
   return function scenario13(done) {//TODO Jquery
      var wnd = new W({
         element: $('#component'),
         template: caseControlName,
         top: 0,
         width: '500px',
         height: '200px'
      });
      setTimeout(function () {
         try {
            fHelpers.childHasFocus(wnd, 'TextBox1');
         } finally {
            wnd.destroy();
            delete window[caseControlName];
            done();
         }
      }, 100);
   };
});