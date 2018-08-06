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
         assert.deepEqual({}, treeControl._loadedNodes, 'Incorrect value "_loadedNodes" after call "treeControl.reload()".');
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
   });
});
