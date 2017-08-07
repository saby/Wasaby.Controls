/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('js!WSTest/Focus/Scenario/19', [
   'Core/constants',
   'js!WSTest/Focus/TestFocusHelpers',
   'js!SBIS3.CORE.Window',
   'css!' + wsConfig.wsRoot + 'css/core.css',
   'css!' + wsConfig.wsRoot + 'css/themes/wi_scheme.css'
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
         template: 'js!' + caseControlName,
         top: 0,
         showOnControlsReady: true,
         width: '500px',
         height: '200px'
      });

      setTimeout(function() {
         fHelpers.childHasFocus(wnd, 'TextBox0');
         wnd.destroy();
         delete window[caseControlName];
         done();
      }, 50);


   };
});