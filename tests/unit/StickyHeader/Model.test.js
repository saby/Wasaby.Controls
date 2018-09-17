define(
   [
      'Controls/StickyHeader/Model'
   ],
   function(Model) {

      'use strict';

      describe('Controls.StickyHeader.Model', function() {
         var topTarget = {};
         var bottomTarget = {};
         var result, model;

         beforeEach(function() {
            model = new Model({
               topTarget: topTarget,
               bottomTarget: bottomTarget
            });
         });

         describe('constructor', function() {
            it('Create a component', function() {
               result = model.shouldBeFixed;

               assert.equal(result, false);
            });
         });
         describe('update', function() {
            it('Both targets not intersection', function() {
               model.update([
                  {
                     target: topTarget,
                     isIntersecting: false
                  },
                  {
                     target: bottomTarget,
                     isIntersecting: false
                  }
               ]);

               result = model.shouldBeFixed;

               assert.equal(result, false);
            });
            it('The top target not intersection and the bottom target intersection', function() {
               model.update([
                  {
                     target: topTarget,
                     isIntersecting: false
                  },
                  {
                     target: bottomTarget,
                     isIntersecting: true
                  }
               ]);

               result = model.shouldBeFixed;

               assert.equal(result, true);
            });
            it('The top target intersection and the bottom target not intersection', function() {
               model.update([
                  {
                     target: topTarget,
                     isIntersecting: true
                  },
                  {
                     target: bottomTarget,
                     isIntersecting: false
                  }
               ]);

               result = model.shouldBeFixed;

               assert.equal(result, false);
            });
            it('Both targets intersection', function() {
               model.update([
                  {
                     target: topTarget,
                     isIntersecting: true
                  },
                  {
                     target: bottomTarget,
                     isIntersecting: true
                  }
               ]);

               result = model.shouldBeFixed;

               assert.equal(result, false);
            });
         });
      });
   }
);
