/**
 * Created by dv.zuev on 22.06.2017.
 */
/**
 * Created by dv.zuev on 11.06.2017.
 */
define([
   'WSTest/VdomCompoundVdom/VdomCompoundVdom'
], function (VdomCompoundVdom) {
   'use strict';

   describe('CreateVdomTest', function () {
      var testControl;
      beforeEach(function () {
         if (typeof $ === 'undefined') {//Проверка того, что тесты выполняются в браузере
            this.skip();
         }
         else {
            $(document.body).append('<div id="component"></div>');//Для добавления верстки на страницу
         }
      });
      describe('vdomToCompound', function () {
         it('vdomToCompound', function (done) {
            var vdomControl = new VdomCompoundVdom({
               element: $('#component'),
               name: 'upper vdom'
            });
            setTimeout(function () {
               vdomControl.text = 'changed text';
               vdomControl._forceUpdate();
               setTimeout(function() {
                  vdomControl.text = 'double changed text';
                  vdomControl._forceUpdate();
                  setTimeout(function() {
                     assert.isTrue(vdomControl._children['compound']._options.compoundText === 'double changed text');
                     vdomControl.destroy();
                     done();
                  }, 50)
               }, 50)
            }, 50);
         });
      });

   });

});