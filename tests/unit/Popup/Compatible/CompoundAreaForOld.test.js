/**
 * Created by as.krasilnikov on 17.09.2018.
 */
define(
   [
      'Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea',
      'Core/Deferred'
   ],

   function(CompoundArea, Deferred) {
      'use strict';

      var Area = new CompoundArea({});
      Area._beforeMount({});

      describe('Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea', function() {
         it('check options for reload', () => {
            let opt = {
               template: 'newTemplate',
               record: 'record',
               templateOptions: {
                  testOptions: 'test'
               }
            };
            Area._setCompoundAreaOptions(opt);
            assert.equal(Area._record, opt.record);
            assert.equal(Area._childControlName, opt.template);
            assert.equal(Area._childConfig, opt.templateOptions);
         });

         describe('pending operations', () => {
            afterEach(() => {
               Area._childControl = null;
            });

            it('registers and unregisters pending operations', () => {
               var
                  operation1 = { operation: true },
                  operation2 = { operation: true, number: 2 };

               Area.sendCommand('registerPendingOperation', operation2);
               assert.strictEqual(Area._childPendingOperations.length, 1);
               assert.isOk(Area._allChildrenPendingOperation);

               Area.sendCommand('registerPendingOperation', operation2);
               Area.sendCommand('unregisterPendingOperation', operation1);

               // operation2 is still registered
               assert.isOk(Area._allChildrenPendingOperation);

               Area.sendCommand('unregisterPendingOperation', operation2);

               // all pending operations are unregistered
               assert.isNotOk(Area._allChildrenPendingOperation);
            });

            it('can finish pending operations', () => {
               var
                  finishCount = 0,
                  cleanUpCount = 0,
                  operation1 = {
                     finishFunc: function() {
                        finishCount++;
                     },
                     cleanup: function() {
                        cleanUpCount++;
                     }
                  },
                  operation2 = {
                     finishFunc: function() {
                        finishCount++;

                        // pendings can have deferred results
                        return new Deferred().callback(true);
                     },
                     cleanup: function()  {
                        cleanUpCount++;
                     }
                  };

               Area.sendCommand('registerPendingOperation', operation1);
               Area.sendCommand('registerPendingOperation', operation2);

               Area.finishChildPendingOperations();

               assert.strictEqual(finishCount, 2);
               assert.strictEqual(cleanUpCount, 2);

               // all pending operations should be unregistered after finish
               assert.strictEqual(Area._childPendingOperations.length, 0);
               assert.isNotOk(Area._allChildrenPendingOperation);
            });

            it('does not manage pendings if child can', () => {
               var operation = { operation: true };

               // fake child control that has PendingOperationParentMixin
               Area._childControl = {
                  '[Lib/Mixins/PendingOperationParentMixin]': true,
                  _mixins: {}
               };
               Area.sendCommand('registerPendingOperation', operation);

               // pending operation should not register in CompoundArea, because it should
               // register in childControl itself
               assert.strictEqual(Area._childPendingOperations.length, 0);
               assert.isNotOk(Area._allChildrenPendingOperation);
            });
         });
      });
   }
);
