define([
   'Controls/List/TreeControl',
   'Core/Deferred',
   'Core/core-instance'
], function(
   TreeControl,
   Deferred,
   cInstance
) {
   describe('Controls.List.TreeControl', function() {
      it('TreeControl.reload', function() {
         var
            treeControl = new TreeControl({});
         treeControl._loadedNodes = {
            1: true,
            2: true,
            3: true
         };
         treeControl._children = {
            baseControl: {
               reload: function() {}
            }
         };
         treeControl.reload();
         assert.deepEqual({}, treeControl._loadedNodes, 'Invalid value "_loadedNodes" after call "treeControl.reload()".');
      });
      it('TreeControl._beforeUpdate', function() {
         var
            reloadCalled = false,
            setRootCalled = false,
            opts = { parentProperty: 'parent' },
            treeControl = new TreeControl(opts);
         treeControl.saveOptions(opts);
         treeControl._loadedNodes = {
            1: true,
            2: true,
            3: true
         };
         treeControl._children = {
            baseControl: {
               reload: function(filter) {
                  reloadCalled = true;
                  assert.equal(filter['parent'], 'testRoot', 'Invalid value "filter[parentProperty]" after call "_beforeUpdate" with new "root"');
               },
               getViewModel: function() {
                  return {
                     setRoot: function() {
                        setRootCalled = true;
                     }
                  };
               }
            }
         };
         treeControl._beforeUpdate({ root: 'testRoot' });
         assert.isTrue(reloadCalled, 'Invalid call "reload" after call "_beforeUpdate" and apply new "root".');
         assert.isTrue(setRootCalled, 'Invalid call "setRoot" after call "_beforeUpdate" and apply new "root".');
      });

      describe('EditInPlace', function() {
         it('editItem', function() {
            var opt = {
               test: '123'
            };
            var
               treeControl = new TreeControl({});
            treeControl._children = {
               baseControl: {
                  editItem: function(options) {
                     assert.equal(opt, options);
                     return Deferred.success();
                  }
               }
            };
            var result = treeControl.editItem(opt);
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isTrue(result.isSuccessful());
         });

         it('editItem, readOnly: true', function() {
            var opt = {
               test: '123'
            };
            var
               treeControl = new TreeControl({});
            treeControl.saveOptions({ readOnly: true });
            var result = treeControl.editItem(opt);
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isFalse(result.isSuccessful());
         });

         it('addItem', function() {
            var opt = {
               test: '123'
            };
            var
               treeControl = new TreeControl({});
            treeControl._children = {
               baseControl: {
                  addItem: function(options) {
                     assert.equal(opt, options);
                     return Deferred.success();
                  }
               }
            };
            var result = treeControl.addItem(opt);
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isTrue(result.isSuccessful());
         });

         it('addItem, readOnly: true', function() {
            var opt = {
               test: '123'
            };
            var
               treeControl = new TreeControl({});
            treeControl.saveOptions({ readOnly: true });
            var result = treeControl.addItem(opt);
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isFalse(result.isSuccessful());
         });
         it('cancelEdit', function() {
            var
               treeControl = new TreeControl({});
            treeControl._children = {
               baseControl: {
                  cancelEdit: function() {
                     return Deferred.success();
                  }
               }
            };
            var result = treeControl.cancelEdit();
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isTrue(result.isSuccessful());
         });

         it('cancelEdit, readOnly: true', function() {
            var
               treeControl = new TreeControl({});
            treeControl.saveOptions({ readOnly: true });
            var result = treeControl.cancelEdit();
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isFalse(result.isSuccessful());
         });

         it('commitEdit', function() {
            var
               treeControl = new TreeControl({});
            treeControl._children = {
               baseControl: {
                  commitEdit: function() {
                     return Deferred.success();
                  }
               }
            };
            var result = treeControl.commitEdit();
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isTrue(result.isSuccessful());
         });

         it('commitEdit, readOnly: true', function() {
            var
               treeControl = new TreeControl({});
            treeControl.saveOptions({ readOnly: true });
            var result = treeControl.commitEdit();
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isFalse(result.isSuccessful());
         });
      });
      it('TreeControl._onNodeRemoved', function() {
         var
            treeControl = new TreeControl({});
         treeControl._loadedNodes = {
            1: true,
            2: true,
            3: true
         };
         treeControl._onNodeRemoved(null, 1);
         assert.deepEqual({ 2: true, 3: true }, treeControl._loadedNodes, 'Incorrect value "_loadedNodes" after call "treeControl._onNodeRemoved(null, 1)".');
      });
   });
});
