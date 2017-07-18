/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('js!WSTest/Focus/Scenario/13', [
   'Core/constants',
   'js!WSTest/Focus/TestFocusHelpers',
   'js!SBIS3.CORE.Window',
   'js!WSTest/Focus/Case13',
   'css!test/testPackages/Integration/../../../ws/css/core.css',
   'css!test/testPackages/Integration/../../../ws/css/themes/wi_scheme.css'
], function (cConstants,
             fHelpers,
             Window,
             Case) {
   'use strict';
   return function scenario13() {//TODO Jquery
      var wnd = new Window({
         element: $('#component'),
         template: 'js!WSTest/Focus/Case13',
         top: 0,
         left: '200px',
         width: '300px'
      });
      // wnd.destroy();
   };
});