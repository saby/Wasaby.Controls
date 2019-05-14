define(
   [
      'Env/Env',
      'Controls/scroll',
      'Controls/StickyHeader/Utils',
      'wml!unit/Container/resources/Content'
   ],
   function(Env, scrollMod, stickyUtils, Content) {

      'use strict';

      describe('Controls.Container.Scroll', function() {
         var scroll, result;

         beforeEach(function() {
            scroll = new scrollMod.Container({});

            var templateFn = scroll._template;

            scroll._template = function(inst) {
               inst._options = {
                  content: Content
               };
               var markup = templateFn.call(this, inst);

               markup = markup.replace(/ ?(ws-delegates-tabfocus|ws-creates-context|__config|tabindex|name)=".+?"/g, '');
               markup = markup.replace(/\s+/g, ' ');

               return markup;
            };
            scroll._registeredHeadersIds = [];
            scroll._stickyHeadersIds = {
               top: [],
               bottom: []
            };
            scroll._headersHeight = {
               top: 0,
               bottom: 0
            };
            scroll._children.stickyHeaderShadow = {
               start: sinon.fake()
            };
            scroll._children.content = {
               scrollHeight: 50
            };
            scroll._displayState = {
               contentHeight: 0
            }
         });

         describe('_scrollbarTaken', function() {
            it('Should generate scrollbarTaken event if scrollbar displayed', function() {
               const sandbox = sinon.sandbox.create();
               scroll._displayState = { hasScroll: true };
               sandbox.stub(scroll, '_notify');
               scroll._scrollbarTaken();
               sinon.assert.calledWith(scroll._notify, 'scrollbarTaken');
               sandbox.restore();
            });
            it('Should not generate scrollbarTaken event if scrollbar not displayed', function() {
               const sandbox = sinon.sandbox.create();
               scroll._displayState = { hasScroll: false };
               sandbox.stub(scroll, '_notify');
               scroll._scrollbarTaken();
               sinon.assert.notCalled(scroll._notify);
               sandbox.restore();
            });
         });

         describe('_mouseenterHandler', function() {
            it('Should show scrollbar and generate scrollbarTaken event on mouseenter', function() {
               const sandbox = sinon.sandbox.create();
               scroll._displayState = { hasScroll: true };
               scroll._options.scrollbarVisible = true;
               sandbox.stub(scroll, '_notify');
               scroll._mouseenterHandler();
               sinon.assert.calledWith(scroll._notify, 'scrollbarTaken');
               assert.isTrue(scroll._scrollbarVisibility());
               sandbox.restore();
            });
            it('Should hide scrollbar and generate scrollbarReleased event on mouseleave', function() {
               const sandbox = sinon.sandbox.create();
               scroll._displayState = { hasScroll: false };
               sandbox.stub(scroll, '_notify');
               scroll._mouseenterHandler();
               scroll._mouseleaveHandler();
               sinon.assert.calledWith(scroll._notify, 'scrollbarReleased');
               assert.isFalse(scroll._scrollbarVisibility());
               sandbox.restore();
            });
         });

         describe('_adjustContentMarginsForBlockRender', function() {
            if (!Env.constants.isBrowserPlatform) {
               return;
            }

            it('should not update the context if the height has not changed', function() {
               sinon.stub(window, 'getComputedStyle').returns({ marginTop: 0, marginRight: 0 });
               scroll._styleHideScrollbar = '';
               scroll._stickyHeaderContext = {
                  top: 0,
                  updateConsumers: sinon.fake()
               };
               scroll._adjustContentMarginsForBlockRender();
               sinon.assert.notCalled(scroll._stickyHeaderContext.updateConsumers);
               sinon.restore();
            });
         });

         describe('Template', function() {
            it('Hiding the native scroll', function() {
               result = scroll._template(scroll);

               assert.equal(result, '<div class="controls-Scroll ws-flexbox ws-flex-column">' +
                                       '<div class="controls-Scroll__content ws-BlockGroup controls-Scroll__content_hideNativeScrollbar controls-Scroll__content_hidden">' +
                                          '<div class="controls-Scroll__userContent">test</div>' +
                                       '</div>' +
                                       '<div></div>' +
                                    '</div>');

               scroll._contentStyles = 'margin-right: -15px;';
               result = scroll._template(scroll);

               assert.equal(result, '<div class="controls-Scroll ws-flexbox ws-flex-column">' +
                                       '<div style="margin-right: -15px;" class="controls-Scroll__content ws-BlockGroup controls-Scroll__content_hideNativeScrollbar controls-Scroll__content_scroll">' +
                                          '<div class="controls-Scroll__userContent">test</div>' +
                                       '</div>' +
                                       '<div></div>' +
                                    '</div>');
            });
         });

         describe('_scrollMoveHandler', function() {
            beforeEach(function() {
               scroll._pagingState = {
                  visible: true
               };
            });
            it('up', function() {
               scroll._scrollMoveHandler({}, {
                  position: 'up'
               });
               assert.equal('disabled', scroll._pagingState.stateUp, 'Wrong paging state');
               assert.equal('normal', scroll._pagingState.stateDown, 'Wrong paging state');
            });
            it('down', function() {
               scroll._scrollMoveHandler({}, {
                  position: 'down'
               });
               assert.equal('normal', scroll._pagingState.stateUp, 'Wrong paging state');
               assert.equal('disabled', scroll._pagingState.stateDown, 'Wrong paging state');
            });
            it('middle', function() {
               scroll._scrollMoveHandler({}, {
                  position: 'middle'
               });
               assert.equal('normal', scroll._pagingState.stateUp, 'Wrong paging state');
               assert.equal('normal', scroll._pagingState.stateDown, 'Wrong paging state');
            });

         });

         describe('_fixedHandler', function() {
            it('Should update scroll style when header fixed', function() {
               scroll._fixedHandler(null, 10, 10);
               assert.strictEqual(scroll._scrollbarStyles, 'top:10px; bottom:10px;');
               assert.strictEqual(scroll._displayState.contentHeight, 30);
            });
            it('Should update scroll style when header unfixed', function() {
               scroll._headersHeight = { top: 10, bottom: 20 };
               scroll._fixedHandler(null, 0, 0);
               assert.strictEqual(scroll._scrollbarStyles, 'top:0px; bottom:0px;');
               assert.strictEqual(scroll._displayState.contentHeight, 50);
            });
         })
      });

      describe('selectedKeysChanged', function() {
         var instance;
         beforeEach(function() {
            instance = new scrollMod.Container();
         })
         it('should forward event', function() {
            var
               notifyCalled = false,
               event = {
                  propagating: function() {
                     return false;
                  }
               };
            instance._notify = function(eventName, eventArgs) {
               assert.equal(eventName, 'selectedKeysChanged');
               assert.deepEqual(eventArgs, ['1', '2', '3']);
               notifyCalled = true;
            };
            instance.selectedKeysChanged(event, '1', '2', '3');
            assert.isTrue(notifyCalled);
         });

         it('should not forward event', function() {
            var
               notifyCalled = false,
               event = {
                  propagating: function() {
                     return true;
                  }
               };
            instance._notify = function() {
               notifyCalled = true;
            };
            instance.selectedKeysChanged(event, '1', '2', '3');
            assert.isFalse(notifyCalled);
         });
      });

      describe('excludedKeysChanged', function() {
         var instance;
         beforeEach(function() {
            instance = new scrollMod.Container();
         })
         it('should forward event', function() {
            var
               notifyCalled = false,
               event = {
                  propagating: function() {
                     return false;
                  }
               };
            instance._notify = function(eventName, eventArgs) {
               assert.equal(eventName, 'excludedKeysChanged');
               assert.deepEqual(eventArgs, ['1', '2', '3']);
               notifyCalled = true;
            };
            instance.excludedKeysChanged(event, '1', '2', '3');
            assert.isTrue(notifyCalled);
         });

         it('should not forward event', function() {
            var
               notifyCalled = false,
               event = {
                  propagating: function() {
                     return true;
                  }
               };
            instance._notify = function() {
               notifyCalled = true;
            };
            instance.excludedKeysChanged(event, '1', '2', '3');
            assert.isFalse(notifyCalled);
         });
      });

      describe('Controls.Container.Shadow', function() {
         var result;
         describe('calcShadowPosition', function() {
            it('Тень сверху', function() {
               result = scrollMod.Container._private.calcShadowPosition(100, 100, 200);
               assert.equal(result, 'top');
            });
            it('Тень снизу', function() {
               result = scrollMod.Container._private.calcShadowPosition(0, 100, 200);
               assert.equal(result, 'bottom');
            });
            it('Should hide bottom shadow if there is less than 1 pixel to the bottom.', function() {
               // Prevent rounding errors in the scale do not equal 100%
               result = scrollMod.Container._private.calcShadowPosition(99.234, 100, 200);
               assert.notInclude(result, 'bottom');
            });
            it('Тень сверху и снизу', function() {
               result = scrollMod.Container._private.calcShadowPosition(50, 100, 200);
               assert.equal(result, 'topbottom');
            });
         });
         describe('getSizes', function() {
            var container = {
               scrollHeight: 200,
               offsetHeight: 100,
               scrollTop: 0
            };

            it('getScrollHeight', function() {
               result = scrollMod.Container._private.getScrollHeight(container);
               assert.equal(result, 200);
            });
            it('getContainerHeight', function() {
               result = scrollMod.Container._private.getContainerHeight(container);
               assert.equal(result, 100);
            });
            it('getScrollTop', function() {
               result = scrollMod.Container._private.getScrollTop(container);
               assert.equal(result, 0);
            });
         });
      });
   }
);
