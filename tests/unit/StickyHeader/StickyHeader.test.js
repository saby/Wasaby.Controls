define([
   'Controls/StickyHeader/_StickyHeader',
   'Controls/StickyHeader/Utils',
   'Core/core-merge'
], function(
   StickyHeader,
   stickyUtils,
   coreMerge
) {

   'use strict';

   const
      createComponent = function(Component, cfg) {
         let mv;
         if (Component.getDefaultOptions) {
            cfg = coreMerge(cfg, Component.getDefaultOptions(), {preferSource: true});
         }
         mv = new Component(cfg);
         mv.saveOptions(cfg);
         mv._beforeMount(cfg);
         return mv;
      },
      options = {
      };

   describe('Controls.StickyHeader._StickyHeader', function() {
      describe('Initialisation', function() {
         it('should set correct header id', function() {
            const component = createComponent(StickyHeader, options);
            assert.strictEqual(component._index, stickyUtils._lastId);
         });
      });

      describe('_getStyle', function() {
         it('should set correct z-index', function() {
            const component = createComponent(StickyHeader, {fixedZIndex: 2});
            component._context = {
               stickyHeader: { top: 0, bottom: 0 }
            };

            component._model = { fixedPosition: 'top' };
            assert.include(component._getStyle(), 'z-index: 2;');

            component._model = { fixedPosition: 'bottom' };
            assert.include(component._getStyle(), 'z-index: 2;');
         });

         it('should return correct top.', function() {
            const component = createComponent(StickyHeader, {fixedZIndex: 2});
            component._context = {
               stickyHeader: { top: 2, bottom: 5 }
            };
            component._stickyHeadersHeight = {
               top: 10,
               bottom: 20
            };

            component._model = { fixedPosition: 'top' };
            assert.include(component._getStyle(), 'top: 12px;');

            component._model = { fixedPosition: 'bottom' };
            assert.include(component._getStyle(), 'bottom: 25px;');
         });
      });

      describe('_updateStickyHeight', function() {
         it('should update height if header not fixed', function() {
            const component = createComponent(StickyHeader, {});
            component._model = { fixedPosition: '' };

            assert.strictEqual(component._stickyHeadersHeight.top, 0);
            assert.strictEqual(component._stickyHeadersHeight.bottom, 0);
            component._updateStickyHeight(null, {
               top: 10,
               bottom: 20
            });
            assert.strictEqual(component._stickyHeadersHeight.top, 10);
            assert.strictEqual(component._stickyHeadersHeight.bottom, 20);
         });

         it('should not update height if header fixed', function() {
            const component = createComponent(StickyHeader, {});
            component._model = { fixedPosition: 'top' };

            assert.strictEqual(component._stickyHeadersHeight.top, 0);
            assert.strictEqual(component._stickyHeadersHeight.bottom, 0);
            component._updateStickyHeight(null, {
               top: 10,
               bottom: 20
            });
            assert.strictEqual(component._stickyHeadersHeight.top, 0);
            assert.strictEqual(component._stickyHeadersHeight.bottom, 0);
         });
      });

      describe('_getTopObserverStyle', function() {
         it('should return correct style', function() {
            const component = createComponent(StickyHeader, {});
            component._model = { fixedPosition: '' };

            assert.strictEqual(component._getObserverStyle('top'), 'top: -3px;');
            assert.strictEqual(component._getObserverStyle('bottom'), 'bottom: -3px;');
            component._stickyHeadersHeight = {
               top: 2,
               bottom: 3
            };
            assert.strictEqual(component._getObserverStyle('top'), 'top: -5px;');
            assert.strictEqual(component._getObserverStyle('bottom'), 'bottom: -6px;');
         });
      });

      describe('_fixationStateChangeHandler', function() {
         it('should notify fixed event', function() {
            const component = createComponent(StickyHeader, {});
            component._container = {
               offsetParent: 0,
               offsetHeight: 10
            }
            sinon.stub(component, '_notify');
            component._fixationStateChangeHandler('', 'top')
            sinon.assert.calledWith(
               component._notify,
               'fixed',
               [{
                  fixedPosition: '',
                  id: component._index,
                  mode: "replaceable",
                  offsetHeight: 10,
                  prevPosition: "top"
               }], {
                  bubbling: true
               }
            );
            sinon.restore();
         });
         it('should use previous offsetHeight if container is hidden', function() {
            const component = createComponent(StickyHeader, {});
            component._offsetHeight = 10;
            component._container = {
               offsetParent: null,
               offsetHeight: 0
            }
            sinon.stub(component, '_notify');
            component._fixationStateChangeHandler('', 'top')
            sinon.assert.calledWith(
               component._notify,
               'fixed',
               [{
                  fixedPosition: '',
                  id: component._index,
                  mode: "replaceable",
                  offsetHeight: 10,
                  prevPosition: "top"
               }], {
                  bubbling: true
               }
            );

            sinon.restore();
         });
      });
   });

});
