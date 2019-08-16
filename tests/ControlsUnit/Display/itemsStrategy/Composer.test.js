/* global define, describe, it, assert, beforeEach, afterEach */
define([
   'Types/_display/itemsStrategy/Composer'
], function(
   Composer
) {
   'use strict';

   Composer = Composer.default;

   describe('Types/_display/itemsStrategy/Composer', function() {
      var getStrategy = function() {
         return function(options) {
            Object.assign(this, options || {});
         };
      };

      describe('.append()', function() {
         it('should append a strategy to the empty composer', function() {
            var Strategy = getStrategy(),
               composer = new Composer();

            composer.append(Strategy);
            assert.instanceOf(composer.getResult(), Strategy);
         });

         it('should append a strategy to the end', function() {
            var StrategyA = getStrategy(),
               StrategyB = getStrategy(),
               composer = new Composer();

            composer
               .append(StrategyA)
               .append(StrategyB);

            assert.instanceOf(composer.getResult(), StrategyB);
            assert.isUndefined(composer.getInstance(StrategyA).source);
            assert.instanceOf(composer.getInstance(StrategyB).source, StrategyA);
         });

         it('should append a strategy after given', function() {
            var StrategyA = getStrategy(),
               StrategyB = getStrategy(),
               StrategyC = getStrategy(),
               composer = new Composer();

            composer
               .append(StrategyA)
               .append(StrategyB)
               .append(StrategyC, {}, StrategyA);

            assert.instanceOf(composer.getResult(), StrategyB);
            assert.isUndefined(composer.getInstance(StrategyA).source);
            assert.instanceOf(composer.getInstance(StrategyC).source, StrategyA);
            assert.instanceOf(composer.getInstance(StrategyB).source, StrategyC);
         });
      });

      describe('.prepend()', function() {
         it('should prepend a strategy to the empty composer', function() {
            var Strategy = getStrategy(),
               composer = new Composer();

            composer.prepend(Strategy);
            assert.instanceOf(composer.getResult(), Strategy);
         });

         it('should prepend a strategy to the begin', function() {
            var StrategyA = getStrategy(),
               StrategyB = getStrategy(),
               composer = new Composer();

            composer
               .prepend(StrategyA)
               .prepend(StrategyB);

            assert.instanceOf(composer.getResult(), StrategyA);
            assert.isUndefined(composer.getInstance(StrategyB).source);
            assert.instanceOf(composer.getInstance(StrategyA).source, StrategyB);
         });

         it('should prepend a strategy before given', function() {
            var StrategyA = getStrategy(),
               StrategyB = getStrategy(),
               StrategyC = getStrategy(),
               composer = new Composer();

            composer
               .prepend(StrategyA)
               .prepend(StrategyB)
               .prepend(StrategyC, {}, StrategyA);

            assert.instanceOf(composer.getResult(), StrategyA);
            assert.isUndefined(composer.getInstance(StrategyB).source);
            assert.instanceOf(composer.getInstance(StrategyC).source, StrategyB);
            assert.instanceOf(composer.getInstance(StrategyA).source, StrategyC);
         });
      });

      describe('.remove()', function() {
         it('should return undefined for empty composer', function() {
            var Strategy = getStrategy(),
               composer = new Composer();

            assert.isUndefined(composer.remove(Strategy));
            assert.isNull(composer.getResult());
         });

         it('should return removed instance', function() {
            var StrategyA = getStrategy(),
               StrategyB = getStrategy(),
               StrategyC = getStrategy(),
               composer = new Composer();

            composer
               .append(StrategyA)
               .append(StrategyB)
               .append(StrategyC);

            assert.instanceOf(composer.remove(StrategyB), StrategyB);
            assert.instanceOf(composer.getResult(), StrategyC);
            assert.isUndefined(composer.getInstance(StrategyA).source);
            assert.isUndefined(composer.getInstance(StrategyB));
            assert.instanceOf(composer.getInstance(StrategyC).source, StrategyA);
         });

         it('should affect result', function() {
            var StrategyA = getStrategy(),
               StrategyB = getStrategy(),
               composer = new Composer();

            composer
               .append(StrategyA)
               .append(StrategyB);

            assert.instanceOf(composer.remove(StrategyB), StrategyB);
            assert.instanceOf(composer.getResult(), StrategyA);
         });
      });

      describe('.reset()', function() {
         it('should reset result', function() {
            var Strategy = getStrategy(),
               composer = new Composer();

            composer
               .append(Strategy)
               .reset();

            assert.isNull(composer.getResult());
         });
      });

      describe('.getInstance()', function() {
         it('should return an instance', function() {
            var Strategy = getStrategy(),
               composer = new Composer();

            composer.append(Strategy);

            assert.instanceOf(composer.getInstance(Strategy), Strategy);
         });

         it('should return undefined if strategy not composed', function() {
            var Strategy = getStrategy(),
               composer = new Composer();

            assert.isUndefined(composer.getInstance(Strategy));
         });
      });

      describe('.getResult()', function() {
         it('should return null by default', function() {
            var composer = new Composer();
            assert.isNull(composer.getResult());
         });

         it('should return instance of given stratgey', function() {
            var Strategy = getStrategy(),
               composer = new Composer();

            composer.append(Strategy);

            assert.instanceOf(composer.getResult(), Strategy);
         });
      });
   });
});
