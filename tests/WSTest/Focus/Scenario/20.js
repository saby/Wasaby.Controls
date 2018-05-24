/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('WSTest/Focus/Scenario/20', [
   'Core/constants',
   'WSTest/Focus/TestFocusHelpers',
   'Lib/Control/Window/Window',
   'css!' + wsConfig.wsRoot + 'css/core.css',
   'css!' + wsConfig.wsRoot + 'css/themes/wi_scheme.css',
   'WSTest/Focus/Case20'
], function (cConstants,
             fHelpers,
             W) {
   'use strict';
   /*
      FloatArea
         content
            AreaAbstract0
               Textbox0 class=ws-autofocus,ws-hidden

      открываем панель - ???
    */
   var caseControlName = 'WSTest/Focus/Case20';
   return function scenario20(done) {//TODO Фокус остается на TextBox1
      var wnd = new W({
         template: caseControlName,
         top: 0,
         width: '500px',
         height: '200px'
      });

      setTimeout(function() {
         fHelpers.hasFocus(wnd);
         wnd.destroy();
         delete window[caseControlName];
         done();
      }, 100);


   };
});