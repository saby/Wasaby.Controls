/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('WSTest/Focus/Scenario/19', [
   'Core/constants',
   'WSTest/Focus/TestFocusHelpers',
   'Lib/Control/Window/Window',
   'css!' + wsConfig.wsRoot + 'css/core.css',
   'css!' + wsConfig.wsRoot + 'css/themes/wi_scheme.css',
   'WSTest/Focus/Case19'
], function (cConstants,
             fHelpers,
             W) {
   'use strict';
   /*
    FloatArea
    content
    AreaAbstract0 enabled=false
    Textbox0 enabled=true, class=ws-autofocus

    открываем панель - фокус уходит в Textbox0
    */
   var caseControlName = 'WSTest/Focus/Case19';
   return function scenario19(done) {//TODO Фокус остается на TextBox1
      var wnd = new W({
         template: caseControlName,
         top: 0,
         showOnControlsReady: true,
         width: '500px',
         height: '200px'
      });

      setTimeout(function () {
         try {
            fHelpers.childHasFocus(wnd, 'TextBox0');
         } finally {
            wnd.destroy();
            delete window[caseControlName];
            done();
         }
      }, 100);


   };
});