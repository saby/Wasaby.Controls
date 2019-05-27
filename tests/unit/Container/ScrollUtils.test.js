define(
   [
      'Env/Env',
      'Controls/Container/Scroll/ScrollWidthUtil',
      'Controls/Container/Scroll/ScrollHeightFixUtil'
   ],
   function(Env, ScrollWidthUtil, ScrollHeightFixUtil) {

      'use strict';

      var
         mockEnv = function(envField) {
            oldEnvValue = Env.detection[envField];
            if (typeof window === 'undefined') {
               Env.detection['test::' + envField] = true;
            } else {
               Env.detection[envField] = true;
            }
         },
         restoreEnv = function(envField) {
            if (typeof window === 'undefined') {
               Env.detection['test::' + envField] = undefined;
            } else {
               Env.detection[envField] = oldEnvValue;
            }
         },
         oldEnvValue;

      describe('Controls.Container.Scroll.Utils', function() {
         var
            constWidthScrollbar = 20,
            detection, result;

         ScrollWidthUtil._private.calcScrollbarWidthByMeasuredBlock = function() {
            return constWidthScrollbar;
         };

         describe('calcOverflow', function() {
            var container;
            it('chrome', function() {
               mockEnv('chrome');

               result = ScrollHeightFixUtil.calcHeightFix();
               assert.equal(result, false);
               restoreEnv('chrome');
            });
            it('ie', function() {
               mockEnv('isIE');

               container = {
                  scrollHeight: 101,
                  offsetHeight: 100
               };
               result = ScrollHeightFixUtil.calcHeightFix(container);
               if (window) {
                  assert.equal(result, true);
               } else {
                  assert.equal(result, undefined);
               }

               container = {
                  scrollHeight: 200,
                  offsetHeight: 100
               };
               result = ScrollHeightFixUtil.calcHeightFix(container);
               if (window) {
                  assert.equal(result, false);
               } else {
                  assert.equal(result, undefined);
               }
               restoreEnv('isIE');
            });
            it('firefox', function() {
               mockEnv('firefox');

               container = {
                  offsetHeight: 10,
                  scrollHeight: 10
               };
               result = ScrollHeightFixUtil.calcHeightFix(container);
               if (window) {
                  assert.equal(result, true);
               } else {
                  assert.equal(result, undefined);
               }

               container = {
                  offsetHeight: 40,
                  scrollHeight: 40
               };
               result = ScrollHeightFixUtil.calcHeightFix(container);
               if (window) {
                  assert.equal(result, false);
               } else {
                  assert.equal(result, undefined);
               }
               restoreEnv('firefox');
            });
         });

         describe('calcScrollbarWidth', function() {
            it('webKit', function() {
               detection = {
                  webkit: true
               };

               result = ScrollWidthUtil._private.calcScrollbarWidth(detection);
               assert.equal(result, 0);
            });
            it('ie12', function() {
               detection = {
                  isIE12: true
               };

               detection.IEVersion = 16;
               result = ScrollWidthUtil._private.calcScrollbarWidth(detection);
               assert.equal(result, 12);

               detection.IEVersion = 17;
               result = ScrollWidthUtil._private.calcScrollbarWidth(detection);
               assert.equal(result, 16);
            });
            it('ie11', function() {
               detection = {
                  isIE11: true
               };

               result = ScrollWidthUtil._private.calcScrollbarWidth(detection);
               assert.equal(result, 17);
            });
            it('ie10', function() {
               detection = {
                  isIE10: true
               };

               result = ScrollWidthUtil._private.calcScrollbarWidth(detection);
               assert.equal(result, 17);
            });
            it('firefox', function() {
               detection = {
                  firefox: true
               };

               result = ScrollWidthUtil._private.calcScrollbarWidth(detection);
               if (typeof window === 'undefined') {
                  assert.equal(result, undefined);
               } else {
                  assert.equal(result, 20);
               }
            });
         });

         describe('calcStyleHideScrollbar', function() {
            result = ScrollWidthUtil._private.calcStyleHideScrollbar(0, {}, {});
            assert.equal(result, '');

            result = ScrollWidthUtil._private.calcStyleHideScrollbar(17, {}, {});
            assert.equal(result, 'margin-right: -17px;');
         });
      });
   }
);
