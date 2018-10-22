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
         it('beginEdit', function() {
            var opt = {
               test: '123'
            };
            var
               list = new List({});
            list._children = {
               listControl: {
                  beginEdit: function(options) {
                     assert.equal(opt, options);
                     return Deferred.success();
                  }
               }
            };
            var result = list.beginEdit(opt);
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isTrue(result.isSuccessful());
         });

         it('beginEdit, readOnly: true', function() {
            var opt = {
               test: '123'
            };
            var
               list = new List({});
            list.saveOptions({ readOnly: true });
            var result = list.beginEdit(opt);
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isFalse(result.isSuccessful());
         });

         it('beginAdd', function() {
            var opt = {
               test: '123'
            };
            var
               list = new List({});
            list._children = {
               listControl: {
                  beginAdd: function(options) {
                     assert.equal(opt, options);
                     return Deferred.success();
                  }
               }
            };
            var result = list.beginAdd(opt);
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isTrue(result.isSuccessful());
         });

         it('beginAdd, readOnly: true', function() {
            var opt = {
               test: '123'
            };
            var
               list = new List({});
            list.saveOptions({ readOnly: true });
            var result = list.beginAdd(opt);
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
