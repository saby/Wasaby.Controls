define(
   [
      'Controls/_scroll/StickyHeader/_StickyHeader/Model'
   ],
   function(Model) {

      'use strict';

      describe('Controls/_scroll/StickyHeader/_StickyHeader/Model', function() {
         var topTarget = {};
         var bottomTarget = {};
         var result, model;

         describe('constructor', function() {
            beforeEach(function() {
               model = new Model({
                  topTarget: topTarget,
                  bottomTarget: bottomTarget
               });
            });

            it('Create a component', function() {
               result = model.fixedPosition;

               assert.equal(result, '');
            });
         });
         describe('update', function() {
            describe('position top', function() {
               beforeEach(function() {
                  model = new Model({
                     topTarget: topTarget,
                     bottomTarget: bottomTarget,
                     position: 'top'
                  });
               });

               it('Both targets not intersection', function () {
                  model.update([
                     {
                        target: topTarget,
                        rootBounds: { top: 0 },
                        boundingClientRect: { top: -3 },
                     },
                     {
                        target: bottomTarget,
                        rootBounds: { bottom: 100 },
                        boundingClientRect: { bottom: 103 },
                     }
                  ]);

                  result = model.fixedPosition;

                  assert.equal(result, '');
               });
               it('The top target not intersection and the bottom target intersection', function () {
                  model.update([
                     {
                        target: topTarget,
                        rootBounds: { top: 0 },
                        boundingClientRect: { top: -3 },
                     },
                     {
                        target: bottomTarget,
                        rootBounds: { bottom: 100 },
                        boundingClientRect: { bottom: 90 },
                     }
                  ]);

                  result = model.fixedPosition;

                  assert.equal(result, 'top');
               });
               it('The top target intersection and the bottom target not intersection', function () {
                  model.update([
                     {
                        target: topTarget,
                        rootBounds: { top: 0 },
                        boundingClientRect: { top: 0 }
                     },
                     {
                        target: bottomTarget,
                        rootBounds: { bottom: 100 },
                        boundingClientRect: { bottom: 103 },
                     }
                  ]);

                  result = model.fixedPosition;

                  assert.equal(result, '');
               });
               it('Both targets intersection', function () {
                  model.update([
                     {
                        target: topTarget,
                        rootBounds: { top: 0 },
                        boundingClientRect: { top: 0 }
                     },
                     {
                        target: bottomTarget,
                        rootBounds: { bottom: 100 },
                        boundingClientRect: { bottom: 90 }
                     }
                  ]);

                  result = model.fixedPosition;

                  assert.equal(result, '');
               });
            });
            describe('position bottom', function() {
               beforeEach(function() {
                  model = new Model({
                     topTarget: topTarget,
                     bottomTarget: bottomTarget,
                     position: 'bottom'
                  });
               });
               it('Both targets not intersection', function () {
                  model.update([
                     {
                        target: topTarget,
                        rootBounds: { top: 0 },
                        boundingClientRect: { top: -3 }
                     },
                     {
                        target: bottomTarget,
                        rootBounds: { bottom: 100 },
                        boundingClientRect: { bottom: 103 },
                     }
                  ]);

                  result = model.fixedPosition;

                  assert.equal(result, '');
               });
               it('The top target not intersection and the bottom target intersection', function () {
                  model.update([
                     {
                        target: topTarget,
                        rootBounds: { top: 0 },
                        boundingClientRect: { top: -3 },
                     },
                     {
                        target: bottomTarget,
                        rootBounds: { bottom: 100 },
                        boundingClientRect: { bottom: 90 }
                     }
                  ]);

                  result = model.fixedPosition;

                  assert.equal(result, '');
               });
               it('The top target intersection and the bottom target not intersection', function () {
                  model.update([
                     {
                        target: topTarget,
                        rootBounds: { top: 0 },
                        boundingClientRect: { top: 0 },
                     },
                     {
                        target: bottomTarget,
                        rootBounds: { bottom: 100 },
                        boundingClientRect: { bottom: 103 }
                     }
                  ]);

                  result = model.fixedPosition;

                  assert.equal(result, 'bottom');
               });
               it('Both targets intersection', function () {
                  model.update([
                     {
                        target: topTarget,
                        rootBounds: { top: 0 },
                        boundingClientRect: { top: 0 },
                     },
                     {
                        target: bottomTarget,
                        rootBounds: { bottom: 100 },
                        boundingClientRect: { bottom: 90 }
                     }
                  ]);

                  result = model.fixedPosition;

                  assert.equal(result, '');
               });
            });
         });
      });
   }
);
