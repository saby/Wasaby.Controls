/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('WSTest/Focus/Scenario/18', [
   'Core/constants',
   'WSTest/Focus/TestFocusHelpers',
   'Lib/Control/Window/Window',
   'css!' + wsConfig.wsRoot + 'css/core.css',
   'css!' + wsConfig.wsRoot + 'css/themes/wi_scheme.css',
   'WSTest/Focus/Case18'
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
         template: caseControlName,
         top: 0,
         width: '500px',
         height: '200px'
      });

      setTimeout(function() {
         try {
            fHelpers.childIsNotInFocus(wnd, 'AreaAbstract0');
            fHelpers.isActive(wnd);
            fHelpers.hasFocus(wnd);
         } finally {
            wnd.destroy();
            delete window[caseControlName];
            done();
         }
      }, 100);


   };
});