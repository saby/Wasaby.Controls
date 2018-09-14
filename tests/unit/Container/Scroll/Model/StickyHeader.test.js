define(
   [
      'Controls/Container/Scroll/Model/StickyHeader'
   ],
   function(Model) {

      'use strict';

      describe('Controls.Container.Scroll.Model.StickyHeader', function() {
         var model, result;

         beforeEach(function() {
            model = new Model();
         });

         describe('isFixed', function() {
            it('State _stickyHeaderId is null', function() {
               model._stickyHeaderId = null;

               result = model.isFixed();
               assert.equal(result, false);
            });
            it('State _stickyHeaderId is "sticky"', function() {
               model._stickyHeaderId = 'sticky';

               result = model.isFixed();
               assert.equal(result, true);
            });
         });

         describe('updateFixationState', function() {
            it('Header with id equal to "sticky" stops being fixed', function() {
               model.updateFixationState({
                  id: 'sticky',
                  shouldBeFixed: false
               });

               assert.equal(model._stickyHeaderId, null);
            });
            it('Header with id equal to "sticky" fixed', function() {
               model.updateFixationState({
                  id: 'sticky',
                  shouldBeFixed: true
               });

               assert.equal(model._stickyHeaderId, 'sticky');
            });
            it('Header with id equal to "sticky" fixed and then stop being fixed', function() {
               model.updateFixationState({
                  id: 'sticky',
                  shouldBeFixed: true
               });
               model.updateFixationState({
                  id: 'sticky',
                  shouldBeFixed: false
               });

               assert.equal(model._stickyHeaderId, null);
            });
            it('Header with id equal to "sticky1" fixed, Header with id equal to "sticky2" stop being fixed', function() {
               model.updateFixationState({
                  id: 'sticky1',
                  shouldBeFixed: true
               });
               model.updateFixationState({
                  id: 'sticky2',
                  shouldBeFixed: false
               });

               assert.equal(model._stickyHeaderId, 'sticky1');
            });
            it('Header with id equal to "sticky1" stop being fixed, Header with id equal to "sticky2" fixed', function() {
               model.updateFixationState({
                  id: 'sticky1',
                  shouldBeFixed: false
               });
               model.updateFixationState({
                  id: 'sticky2',
                  shouldBeFixed: true
               });

               assert.equal(model._stickyHeaderId, 'sticky2');
            });
         });
      });
   }
);
