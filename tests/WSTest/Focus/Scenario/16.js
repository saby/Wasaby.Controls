/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('js!WSTest/Focus/Scenario/16', [
   'Core/constants',
   'js!WSTest/Focus/TestFocusHelpers',
   'js!SBIS3.CORE.Window',
   'css!' + wsConfig.wsRoot + 'css/core.css',
   'css!' + wsConfig.wsRoot + 'css/themes/wi_scheme.css',
   'js!WSTest/Focus/Case16'
], function (cConstants,
             fHelpers,
             W) {
   'use strict';
   /*
      FloatArea
         content
            AreaAbstract0 enabled=false
               Textbox0 enabled=true

      открываем панель - фокус уходит на floatArea
    */
   var caseControlName = 'WSTest/Focus/Case16';
   return function scenario16(done) {//TODO Фокус остается на TextBox1
      var wnd = new W({
         template: 'js!' + caseControlName,
         top: 0,
         width: '500px',
         height: '200px'
      });

      setTimeout(function() {
         fHelpers.hasFocus(wnd);
         wnd.destroy();
         delete window[caseControlName]
         done();
      }, 100);


   };
});