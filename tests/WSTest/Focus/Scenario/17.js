/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('WSTest/Focus/Scenario/17', [
   'Core/constants',
   'WSTest/Focus/TestFocusHelpers',
   'Lib/Control/Window/Window',
   'css!' + wsConfig.wsRoot + 'css/core.css',
   'css!' + wsConfig.wsRoot + 'css/themes/wi_scheme.css',
   'WSTest/Focus/Case17'
], function (cConstants,
             fHelpers,
             W) {
   'use strict';
   /*
    FloatArea
    content
    AreaAbstract0 enabled=true
    Textbox0 enabled=false

    открываем панель - фокус уходит на FloatArea
    */
   var caseControlName = 'WSTest/Focus/Case17';
   return function scenario17(done) {//TODO Фокус остается на TextBox1
      var wnd = new W({
         template: caseControlName,
         top: 0,
         width: '500px',
         height: '200px'
      });

      setTimeout(function () {
            try {
               fHelpers.hasFocus(wnd);
            } finally {
               wnd.destroy();
               delete window[caseControlName];
               done();
            }
         }
         , 100);


   };
});