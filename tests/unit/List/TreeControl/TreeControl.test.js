define(['Controls/List/TreeControl'], function(TreeControl) {
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
         it('editItem', function(done) {
            var opt = {
               test: '123'
            };
            var
               treeControl = new TreeControl({});
            treeControl._children = {
               baseControl: {
                  editItem: function(options) {
                     assert.equal(opt, options);
                     done();
                  }
               }
            };
            treeControl.editItem(opt);
         });

         it('addItem', function(done) {
            var opt = {
               test: '123'
            };
            var
               treeControl = new TreeControl({});
            treeControl._children = {
               baseControl: {
                  addItem: function(options) {
                     assert.equal(opt, options);
                     done();
                  }
               }
            };
            treeControl.addItem(opt);
         });

         it('cancelEdit', function(done) {
            var
               treeControl = new TreeControl({});
            treeControl._children = {
               baseControl: {
                  cancelEdit: function() {
                     done();
                  }
               }
            };
            treeControl.cancelEdit();
         });

         it('commitEdit', function(done) {
            var
               treeControl = new TreeControl({});
            treeControl._children = {
               baseControl: {
                  commitEdit: function() {
                     done();
                  }
               }
            };
            treeControl.commitEdit();
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
