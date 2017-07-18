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

   var testNum = 1, skipNum = 13;

   var skipComponent = [13];

   describe('Focus-tests', function () {
      var testControl;
      beforeEach(function () {
         // if (typeof $ === 'undefined') {
         //    this.skip();
         // }
         if(testNum != skipNum) {
            testNum++;
            this.skip();
         }
         $('#mocha').append('<div id="component"></div>');
      });

      for (var i = 1; i < 14; i++) {
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
                  }
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
