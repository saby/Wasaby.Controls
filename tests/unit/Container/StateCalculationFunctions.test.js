define(
   [
      'Controls/Container/Scroll/ScrollWidthController',
      'Controls/Container/Scroll/ScrollOverflowController'
   ],
   function(ScrollWidthController, ScrollOverflowController) {

      'use strict';

      describe('Controls.Container.Scroll.Controllers', function() {
         var
            constWidthScrollbar = 20,
            detection, result;

         ScrollWidthController._private.calcScrollbarWidthByMeasuredBlock = function() {
            return constWidthScrollbar;
         };

         it('calcChildHeight', function() {
            var container = {
               children: [
                  {
                     offsetHeight: 10
                  },
                  {
                     offsetHeight: 20
                  },
                  {
                     offsetHeight: 30
                  },
                  {
                     offsetHeight: 40
                  },
                  {
                     offsetHeight: 50
                  }
               ]
            };
            result = ScrollOverflowController._private.calcChildHeight(container);
            assert.equal(result, 150);
         });
         describe('calcOverflow', function() {
            var container, calcOverflow;
            it('chrome', function() {
               detection = {
                  chrome: true
               };
               calcOverflow = ScrollOverflowController._private.calcOverflowFn(detection);

               result = calcOverflow();
               assert.equal(result, 'scroll');
            });
            it('ie', function() {
               detection = {
                  isIE: true
               };
               calcOverflow = ScrollOverflowController._private.calcOverflowFn(detection);

               container = {
                  scrollHeight: 101,
                  offsetHeight: 100
               };
               result = calcOverflow(container);
               assert.equal(result, 'hidden');

               container = {
                  scrollHeight: 200,
                  offsetHeight: 100
               };
               result = calcOverflow(container);
               assert.equal(result, 'scroll');
            });
            it('firefox', function() {
               detection = {
                  firefox: true
               };
               calcOverflow = ScrollOverflowController._private.calcOverflowFn(detection);

               container = {
                  children: [
                     {
                        offsetHeight: 10
                     }
                  ]
               };
               result = calcOverflow(container);
               assert.equal(result, 'hidden');

               container = {
                  children: [
                     {
                        offsetHeight: 40
                     }
                  ]
               };
               result = calcOverflow(container);
               assert.equal(result, 'scroll');
            });
         });

         describe('calcScrollbarWidth', function() {
            it('webKit', function() {
               var userAgent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36';

               result = ScrollWidthController._private.calcScrollbarWidth(userAgent);
               assert.equal(result, 0);
            });
            it('ie12', function() {
               detection = {
                  isIE12: true
               };

               result = ScrollWidthController._private.calcScrollbarWidth('', detection);
               assert.equal(result, 16);
            });
            it('ie11', function() {
               detection = {
                  isIE11: true
               };

               result = ScrollWidthController._private.calcScrollbarWidth('', detection);
               assert.equal(result, 17);
            });
            it('ie10', function() {
               detection = {
                  isIE10: true
               };

               result = ScrollWidthController._private.calcScrollbarWidth('', detection);
               assert.equal(result, 17);
            });
            it('firefox', function() {
               detection = {
                  firefox: true
               };

               result = ScrollWidthController._private.calcScrollbarWidth('', detection);
               assert.equal(result, 20);
            });
         });

         describe('calcStyleHideScrollbar', function() {
            result = ScrollWidthController._private.calcStyleHideScrollbar(17, {}, {});
            assert.equal(result, 'margin-right: -17px;');

            result = ScrollWidthController._private.calcStyleHideScrollbar(17, {
               isIE: true
            }, {
               touch: true
            });
            assert.equal(result, 'margin-right: -17px;padding-right: 17px;');
         });
      });
   }
);