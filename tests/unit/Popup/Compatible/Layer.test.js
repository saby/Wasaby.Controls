define(
   [
      'Controls/Popup/Compatible/Layer',
      'Core/Deferred',
      'require'
   ],

   function(Layer, Deferred, require) {
      'use strict';

      describe('Controls/Popup/Compatible/Layer', function() {
         var deferred = new Deferred();
         it('check deps loaded', function(done) {
            Layer.isNewEnvironment = function() {
               return true;
            };
            Layer.load(null, true).addCallback(function() {
               assert.isTrue(require.defined('Core/Control'));
               assert.isTrue(require.defined('Lib/Control/Control.compatible'));
               assert.isTrue(require.defined('Lib/Control/AreaAbstract/AreaAbstract.compatible'));
               assert.isTrue(require.defined('Lib/Control/BaseCompatible/BaseCompatible'));
               assert.isTrue(require.defined('Core/vdom/Synchronizer/resources/DirtyCheckingCompatible'));
               assert.isTrue(require.defined('Lib/StickyHeader/StickyHeaderMediator/StickyHeaderMediator'));
               assert.isTrue(require.defined('View/Executor/GeneratorCompatible'));
               assert.isTrue(require.defined('Core/nativeExtensions'));
               done();
               return deferred;
            });
         });
         it('check deferred not ready', function(done) {
            Layer.load().addCallback(function() {

               //Если из колбэка вернули другой деферед, то проверяем, что дефереды не стали зависимыми
               //Т.е. на момент второй загрузки Layer, деферед вернувшийся из 1 загрузки ещё не завершился
               assert.equal(deferred.isReady(), false);
               done();
            });

         });
      })
   }
);