/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('WSTest/Focus/Scenario/14', [
   'Core/constants',
   'WSTest/Focus/TestFocusHelpers',
   'Lib/Control/Window/Window',
   'WSTest/Focus/Case14',
   'css!' + wsConfig.wsRoot + 'css/core.css',
   'css!' + wsConfig.wsRoot + 'css/themes/wi_scheme.css'
], function (cConstants,
             fHelpers,
             W) {
   'use strict';
   /*
      FloatArea
         header
            textbox1
            textbox2
         content
            textbox3, class=ws-autofocus
            textbox4

      Открываем панель - фокус уходит на textbox3
    */
   var caseControlName = 'WSTest/Focus/Case14';
   return function scenario14(done) {
      var wnd = new W({
         element: $('#component'),
         template: caseControlName,
         top: 0,
         width: '500px',
         height: '200px',
         name: 'WindowScenario14'
      });
      setTimeout(function() {
         try {
            fHelpers.childHasFocus(wnd, 'TextBox3');
         } finally {
            wnd.destroy();
            delete window[caseControlName];
            done();
         }
      }, 100);
   };
});