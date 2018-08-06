define(['Controls/List/ListControl'], function(ListControl) {
   describe('Controls.List.ListControl', function() {
      describe('EditInPlace', function() {
         it('editItem', function(done) {
            var opt = {
               test: '123'
            };
            var
               listControl = new ListControl({});
            listControl._children = {
               baseControl: {
                  editItem: function(options) {
                     assert.equal(opt, options);
                     done();
                  }
               }
            };
            listControl.editItem(opt);
         });

         it('addItem', function(done) {
            var opt = {
               test: '123'
            };
            var
               listControl = new ListControl({});
            listControl._children = {
               baseControl: {
                  addItem: function(options) {
                     assert.equal(opt, options);
                     done();
                  }
               }
            };
            listControl.addItem(opt);
         });

         it('cancelEdit', function(done) {
            var
               listControl = new ListControl({});
            listControl._children = {
               baseControl: {
                  cancelEdit: function() {
                     done();
                  }
               }
            };
            listControl.cancelEdit();
         });

         it('commitEdit', function(done) {
            var
               listControl = new ListControl({});
            listControl._children = {
               baseControl: {
                  commitEdit: function() {
                     done();
                  }
               }
            };
            listControl.commitEdit();
         });
      });
   });
});
