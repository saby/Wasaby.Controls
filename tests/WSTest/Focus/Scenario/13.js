/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('js!WSTest/Focus/Scenario/13', [
   'Core/constants',
   'js!WSTest/Focus/TestFocusHelpers',
   'js!SBIS3.CORE.Window',
   'js!WSTest/Focus/Case13',
   'css!' + wsConfig.wsRoot + 'css/core.css',
   'css!' + wsConfig.wsRoot + 'css/themes/wi_scheme.css'
], function (cConstants,
             fHelpers,
             W) {
   'use strict';
   return function scenario13(done) {//TODO Jquery
      var wnd = new W({
         element: $('#component'),
         template: 'js!WSTest/Focus/Case13',
         top: 0,
         width: '500px',
         height: '200px'
      });
      setTimeout(function() {
         wnd.destroy();
         // done();
      }, 10);
      // done();
      // setTimeout(function () {
      //    fHelpers.childHasFocus(wnd, 'TextBox1');
      //    wnd.destroy();
      //    done();
      // }, 10);
   };
});