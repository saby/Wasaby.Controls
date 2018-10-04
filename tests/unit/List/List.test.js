define([
   'Controls/List',
   'Core/Deferred',
   'Core/core-instance'
], function(
   List,
   Deferred,
   cInstance
) {
   describe('Controls.List', function() {
      describe('EditInPlace', function() {
         it('editItem', function() {
            var opt = {
               test: '123'
            };
            var
               list = new List({});
            list._children = {
               listControl: {
                  editItem: function(options) {
                     assert.equal(opt, options);
                     return Deferred.success();
                  }
               }
            };
            var result = list.editItem(opt);
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isTrue(result.isSuccessful());
         });

         it('editItem, readOnly: true', function() {
            var opt = {
               test: '123'
            };
            var
               list = new List({});
            list.saveOptions({ readOnly: true });
            var result = list.editItem(opt);
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isFalse(result.isSuccessful());
         });

         it('addItem', function() {
            var opt = {
               test: '123'
            };
            var
               list = new List({});
            list._children = {
               listControl: {
                  addItem: function(options) {
                     assert.equal(opt, options);
                     return Deferred.success();
                  }
               }
            };
            var result = list.addItem(opt);
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isTrue(result.isSuccessful());
         });

         it('addItem, readOnly: true', function() {
            var opt = {
               test: '123'
            };
            var
               list = new List({});
            list.saveOptions({ readOnly: true });
            var result = list.addItem(opt);
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isFalse(result.isSuccessful());
         });

         it('cancelEdit', function() {
            var
               list = new List({});
            list._children = {
               listControl: {
                  cancelEdit: function() {
                     return Deferred.success();
                  }
               }
            };
            var result = list.cancelEdit();
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isTrue(result.isSuccessful());
         });

         it('cancelEdit, readOnly: true', function() {
            var
               list = new List({});
            list.saveOptions({ readOnly: true });
            var result = list.cancelEdit();
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isFalse(result.isSuccessful());
         });

         it('commitEdit', function() {
            var
               list = new List({});
            list._children = {
               listControl: {
                  commitEdit: function() {
                     return Deferred.success();
                  }
               }
            };
            var result = list.commitEdit();
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isTrue(result.isSuccessful());
         });

         it('commitEdit, readOnly: true', function() {
            var
               list = new List({});
            list.saveOptions({ readOnly: true });
            var result = list.commitEdit();
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isFalse(result.isSuccessful());
         });
      });
   });
});
