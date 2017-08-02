/**
 * Created by dv.zuev on 18.05.2017.
 */
define([
   'Core/constants',
   'js!SBIS3.CORE.CompoundControl',
   'css!WSTest/Focus/FocusTests'
], function (cConstants,
             focusTestControl) {
   'use strict';

   var testNum = 1;

   var skipTests = [21, 24, 26, 28, 30];
   var skipComponent = [13, 14, 15, 16, 17, 18, 19, 20];

   describe('Focus-tests', function () {
      var testControl;
      beforeEach(function () {
         if (typeof $ === 'undefined') {
            this.skip();
         }
         if(~skipTests.indexOf(testNum)) {
            testNum++;
            this.skip();
         }
         else {
            testNum++;
            $('#mocha').append('<div id="component"></div>');
         }
      });

      for (var i = 1; i < 32; i++) {
         (function (i) {
            it('Case' + (i), function (done) {
               require(['tmpl!WSTest/Focus/Case' + i, 'js!WSTest/Focus/Scenario/' + i], function (caseTmpl, func) {
                  if(!~skipComponent.indexOf(i)) {
                     var comp = focusTestControl.extend({
                        _dotTplFn: caseTmpl
                     });

                     testControl = new comp({
                        element: 'component'
                     });
                     func(testControl); //Запускаем функцию проверки
                     done();
                  } else {
                     func(done);
                  }
               });
            });
         })(i);
      }
      afterEach(function () {
         testControl && testControl.destroy();
      });
   });
});
