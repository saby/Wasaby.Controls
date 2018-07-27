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
   });
});
