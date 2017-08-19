/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('js!WSTest/Focus/Scenario/18', [
   'Core/constants',
   'js!WSTest/Focus/TestFocusHelpers',
   'js!SBIS3.CORE.Window',
   'css!' + wsConfig.wsRoot + 'css/core.css',
   'css!' + wsConfig.wsRoot + 'css/themes/wi_scheme.css',
   'js!WSTest/Focus/Case18'
], function (cConstants,
             fHelpers,
             W) {
   'use strict';
   /*
      FloatArea
         content
            AreaAbstract0 enabled=true, class=ws-autofocus
               Textbox0 enabled=false

      открываем панель - фокус уходит в AreaAbstract0?
    */
   var caseControlName = 'WSTest/Focus/Case18';
   return function scenario18(done) {//TODO Фокус остается на TextBox1
      var wnd = new W({
         template: 'js!' + caseControlName,
         top: 0,
         width: '500px',
         height: '200px'
      });

      setTimeout(function() {
         fHelpers.childHasFocus(wnd, 'AreaAbstract0');
         wnd.destroy();
         delete window[caseControlName];
         done();
      }, 100);


   };
});