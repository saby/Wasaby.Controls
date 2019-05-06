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
            const component = createComponent(StickyHeader, {fixedZIndex: 2, position: 'topbottom'});
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

      describe('set top', function() {
         it('should update top', function () {
            const component = createComponent(StickyHeader, {});
            component._model = {fixedPosition: ''};
            sinon.stub(component, '_forceUpdate');

            assert.strictEqual(component._stickyHeadersHeight.top, 0);
            component.top = 20;
            assert.strictEqual(component._stickyHeadersHeight.top, 20);
            sinon.assert.called(component._forceUpdate);
            sinon.restore();
         });

         it('should not force update if top did not changed', function () {
            const component = createComponent(StickyHeader, {});
            component._model = {fixedPosition: ''};
            sinon.stub(component, '_forceUpdate');

            component._stickyHeadersHeight.top = 20;
            component.top = 20;
            sinon.assert.notCalled(component._forceUpdate);
            sinon.restore();
         });
      });

      describe('set bottom', function() {
         it('should update bottom', function () {
            const component = createComponent(StickyHeader, {});
            component._model = {fixedPosition: ''};
            sinon.stub(component, '_forceUpdate');

            assert.strictEqual(component._stickyHeadersHeight.bottom, 0);
            component.bottom = 20;
            assert.strictEqual(component._stickyHeadersHeight.bottom, 20);
            sinon.assert.called(component._forceUpdate);
            sinon.restore();
         });

         it('should not force update if bottom did not changed', function () {
            const component = createComponent(StickyHeader, {});
            component._model = {fixedPosition: ''};
            sinon.stub(component, '_forceUpdate');

            component._stickyHeadersHeight.bottom = 20;
            component.bottom = 20;
            sinon.assert.notCalled(component._forceUpdate);
            sinon.restore();
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

      describe('_updateStickyShadow', function() {
         it('should turn on a shadow and generate force update if the corresponding identifier is passed.', function() {
            const component = createComponent(StickyHeader, {});
            component._shadowVisible = false;
            sinon.stub(component, '_forceUpdate');
            component._updateStickyShadow(null, [component._index]);
            assert.isTrue(component._shadowVisible);
            sinon.assert.called(component._forceUpdate);
            sinon.restore();
         });
         it('should turn off a shadow and generate force update if the corresponding identifier is not passed.', function() {
            const component = createComponent(StickyHeader, {});
            component._shadowVisible = true;
            sinon.stub(component, '_forceUpdate');
            component._updateStickyShadow(null, ['someId']);
            assert.isFalse(component._shadowVisible);
            sinon.assert.called(component._forceUpdate);
            sinon.restore();
         });
         it('should not apply force update if the shadow has not changed.', function() {
            const component = createComponent(StickyHeader, {});
            component._shadowVisible = true;
            sinon.stub(component, '_forceUpdate');
            component._updateStickyShadow(null, [component._index]);
            assert.isTrue(component._shadowVisible);
            sinon.assert.notCalled(component._forceUpdate);
            sinon.restore();
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
