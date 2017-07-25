/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('js!WSTest/Focus/Scenario/13', [
   'js!WSTest/Focus/TestFocusHelpers',
   'js!SBIS3.CORE.Window',
   'tmpl!WSTest/Focus/Case1',
   'js!WSTest/Focus/Case13',
   'js!WSTest/Focus/CaseControl',
   'css!' + wsConfig.wsRoot + 'css/core.css',
   'css!' + wsConfig.wsRoot + 'css/themes/wi_scheme.css'
], function (fHelpers,
             W,
             caseTemplate) {
   'use strict';
   return function scenario13(done) {//TODO Jquery
      var wnd = new W({
         element: $('#component'),
         template: 'js!WSTest/Focus/Case13',
         top: 0,
         componentOptions: {
            _dotTplFn: caseTemplate
         },
         width: '500px',
         height: '200px'
      });
      setTimeout(function () {
         fHelpers.childHasFocus(wnd, 'TextBox1');
         wnd.destroy();
         done();
      }, 10);
   };
});