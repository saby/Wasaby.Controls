define([
   'Env/Env',
   'Controls/StickyHeader/Controller',
   'Controls/StickyHeader/Utils',
   'Core/core-merge'
], function(
   Env,
   Controller,
   stickyUtils,
   coreMerge
) {

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
      },
      data = {
            id: 2,
            position: 'top',
            inst: {
               getOffset: function() {
                  return 0;
               }
            }
         };

   'use strict';
   describe('Controls.StickyHeader.Controller', function() {
      let component, result;

      beforeEach(function() {
         component = createComponent(Controller.default, {});
         component._children.stickyHeaderShadow = {
            start: sinon.fake()
         };
      });

      describe('_stickyRegisterHandler', function() {
         it('should stopImmediatePropagation event', function() {
            let event = {
               blockUpdate: false,
               stopImmediatePropagation: sinon.fake()
            };
            component._stickyRegisterHandler(event, data, true);
            sinon.assert.calledOnce(event.stopImmediatePropagation);
         });
         it('should register new header', function() {
            let
               event = {
                  stopImmediatePropagation: sinon.fake()
               };
            component._stickyRegisterHandler(event, data, true);
            assert.deepEqual(component._headers[data.id], data);
         });
         it('should unregister deleted header', function() {
            let event = {
               blockUpdate: false,
               stopImmediatePropagation: sinon.fake()
            };
            component._headers[data.id] = data;
            component._stickyRegisterHandler(event, data, false);
            assert.isUndefined(component._headers[data.id]);
         });
      });

      describe('StickyHeader', function() {
         var event = {
            stopPropagation: function() {}
         };

         describe('_fixedHandler', function() {
            it('Header with id equal to "sticky" stops being fixed', function() {
               component._fixedHandler(event, coreMerge({
                  id: 'sticky',
                  fixedPosition: ''
               }, data, {preferSource: true}));

               assert.isEmpty(component._fixedHeadersStack.top);
               assert.isEmpty(component._fixedHeadersStack.bottom);
            });
            it('Header with id equal to "sticky" fixed', function() {
               component._fixedHandler(event, {
                  id: 'stickyTop',
                  fixedPosition: 'top'
               });
               assert.include(component._fixedHeadersStack.top, 'stickyTop');

               component._fixedHandler(event, {
                  id: 'stickyBottom',
                  fixedPosition: 'bottom'
               });
               assert.include(component._fixedHeadersStack.bottom, 'stickyBottom');
            });
            it('Header with id equal to "sticky" fixed and then stop being fixed', function() {
               component._fixedHandler(event, {
                  id: 'sticky',
                  fixedPosition: 'top'
               });
               component._fixedHandler(event, {
                  id: 'sticky',
                  fixedPosition: '',
                  prevPosition: 'top'
               });

               assert.isEmpty(component._fixedHeadersStack.top);
               assert.isEmpty(component._fixedHeadersStack.bottom);
            });
            it('Header with id equal to "sticky1" fixed, Header with id equal to "sticky2" stop being fixed', function() {
               component._fixedHandler(event, {
                  id: 'sticky1',
                  fixedPosition: 'top'
               });
               component._fixedHandler(event, {
                  id: 'sticky2',
                  fixedPosition: '',
                  prevPosition: 'top'
               });

               assert.include(component._fixedHeadersStack.top, 'sticky1');
               assert.notInclude(component._fixedHeadersStack.top, 'sticky2');
            });
            it('Header with id equal to "sticky1" stop being fixed, Header with id equal to "sticky2" fixed', function() {
               component._fixedHandler(event, {
                  id: 'sticky1',
                  fixedPosition: '',
                  prevPosition: 'top'
               });
               component._fixedHandler(event, {
                  id: 'sticky2',
                  fixedPosition: 'top'
               });

               assert.include(component._fixedHeadersStack.top, 'sticky2');
               assert.notInclude(component._fixedHeadersStack.top, 'sticky1');
            });
            it('Should increase headers height if stackable header is fixed', function() {
               component._fixedHandler(event, {
                  id: 'sticky1',
                  fixedPosition: 'top',
                  mode: 'stackable',
                  height: 10
               });

               assert.equal(component._headersHeight.top, 10);
            });
            it('Should decrease headers height if stackable header is unfixed', function() {
               component._fixedHeadersStack.top = ['sticky1'];
               component._headersHeight.top = 10;
               component._fixedHandler(event, {
                  id: 'sticky1',
                  fixedPosition: '',
                  prevPosition: 'top',
                  mode: 'stackable',
                  height: 10
               });
               assert.equal(component._headersHeight.top, 0);
            });
            it('Should not change headers height if replaceable header is fixed', function() {
               component._fixedHandler(event, {
                  id: 'sticky1',
                  fixedPosition: '',
                  prevPosition: 'top',
                  mode: 'replaceable',
                  height: 10
               });
               assert.equal(component._headersHeight.top, 0);
            });
            it('Should decrease headers height if stackable header is unfixed', function() {
               component._fixedHeadersStack.top = ['sticky1'];
               component._headersHeight.top = 10;
               component._fixedHandler(event, {
                  id: 'sticky1',
                  fixedPosition: '',
                  prevPosition: 'top',
                  mode: 'replaceable',
                  height: 10
               });
               assert.equal(component._headersHeight.top, 10);
            });
            it('Should not notify new state if one header registered', function() {
               component._fixedHandler(event, {
                  id: 'sticky1',
                  fixedPosition: 'top',
                  mode: 'stackable',
                  height: 10
               });
               sinon.assert.notCalled(component._children.stickyHeaderShadow.start);
            });
         });
      });
   });
});
