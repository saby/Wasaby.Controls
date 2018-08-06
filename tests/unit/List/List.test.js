define(['Controls/List'], function(List) {
   describe('Controls.List', function() {
      describe('EditInPlace', function() {
         it('editItem', function(done) {
            var opt = {
               test: '123'
            };
            var
               list = new List({});
            list._children = {
               listControl: {
                  editItem: function(options) {
                     assert.equal(opt, options);
                     done();
                  }
               }
            };
            list.editItem(opt);
         });

         it('addItem', function(done) {
            var opt = {
               test: '123'
            };
            var
               list = new List({});
            list._children = {
               listControl: {
                  addItem: function(options) {
                     assert.equal(opt, options);
                     done();
                  }
               }
            };
            list.addItem(opt);
         });

         it('cancelEdit', function(done) {
            var
               list = new List({});
            list._children = {
               listControl: {
                  cancelEdit: function() {
                     done();
                  }
               }
            };
            list.cancelEdit();
         });

         it('commitEdit', function(done) {
            var
               list = new List({});
            list._children = {
               listControl: {
                  commitEdit: function() {
                     done();
                  }
               }
            };
            list.commitEdit();
         });
      });
   });
});
