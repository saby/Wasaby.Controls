/**
 * Created by dv.zuev on 18.05.2017.
 */
define([
   'Core/constants',
   'js!SBIS3.CORE.CompoundControl',
   'css!WSTest/Focus/FocusTests'
], function (cConstants,
             focusTestControl,
             fHelpers) {
   'use strict';

   var scenario = [

      function (testControl) {//Case11 //
         setChildActive(testControl, 'TextBox0', true);
         childHasFocus(testControl, 'TextBox0');
         childIsActive(testControl, 'TextBox0');

         setChildActive(testControl, "TextBox1", true);
         // checkFocusOnBody();
      }

   ];

   describe('Focus-tests', function () {
      var testControl;
      beforeEach(function () {
         if (typeof $ === 'undefined') {
            this.skip();
         }
         $('#mocha').append('<div id="component"></div>');
         $('#mocha').append('<div id="freeArea"></div>');

      });

      for (var i = 1; i < 11; i++) {
         (function (i) {
            it('Case' + (i), function (done) {
               require(['tmpl!WSTest/Focus/Case' + i, 'js!WSTest/Focus/Scenario/' + i], function (caseTmpl, func) {
                  var comp = focusTestControl.extend({
                     _dotTplFn: caseTmpl
                  });
                  testControl = new comp({
                     element: 'component'
                  });
                  //scenario[i]
                  func(testControl); //Запускаем функцию проверки
                  done();
               });
            });
         })(i);
      }
      afterEach(function () {
         testControl && testControl.destroy();
      });

   });

});
