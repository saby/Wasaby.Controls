define([
   'Controls/List/ListControl',
   'Core/Deferred',
   'Core/core-instance'
], function(
   ListControl,
   Deferred,
   cInstance
) {
   describe('Controls.List.ListControl', function() {
      describe('EditInPlace', function() {
         it('editItem', function() {
            var opt = {
               test: '123'
            };
            var
               listControl = new ListControl({});
            listControl._children = {
               baseControl: {
                  editItem: function(options) {
                     assert.equal(opt, options);
                     return Deferred.success();
                  }
               }
            };
            var result = listControl.editItem(opt);
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isTrue(result.isSuccessful());
         });

         it('editItem, readOnly: true', function() {
            var opt = {
               test: '123'
            };
            var
               listControl = new ListControl({});
            listControl.saveOptions({ readOnly: true });
            var result = listControl.editItem(opt);
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isFalse(result.isSuccessful());
         });

         it('addItem', function() {
            var opt = {
               test: '123'
            };
            var
               listControl = new ListControl({});
            listControl._children = {
               baseControl: {
                  addItem: function(options) {
                     assert.equal(opt, options);
                     return Deferred.success();
                  }
               }
            };
            var result = listControl.addItem(opt);
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isTrue(result.isSuccessful());
         });

         it('addItem, readOnly: true', function() {
            var opt = {
               test: '123'
            };
            var
               listControl = new ListControl({});
            listControl.saveOptions({ readOnly: true });
            var result = listControl.addItem(opt);
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isFalse(result.isSuccessful());
         });

         it('cancelEdit', function() {
            var
               listControl = new ListControl({});
            listControl._children = {
               baseControl: {
                  cancelEdit: function() {
                     return Deferred.success();
                  }
               }
            };
            var result = listControl.cancelEdit();
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isTrue(result.isSuccessful());
         });

         it('cancelEdit, readOnly: true', function() {
            var
               listControl = new ListControl({});
            listControl.saveOptions({ readOnly: true });
            var result = listControl.cancelEdit();
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isFalse(result.isSuccessful());
         });

         it('commitEdit', function() {
            var
               listControl = new ListControl({});
            listControl._children = {
               baseControl: {
                  commitEdit: function() {
                     return Deferred.success();
                  }
               }
            };
            var result = listControl.commitEdit();
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isTrue(result.isSuccessful());
         });

         it('commitEdit, readOnly: true', function() {
            var
               listControl = new ListControl({});
            listControl.saveOptions({ readOnly: true });
            var result = listControl.commitEdit();
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isFalse(result.isSuccessful());
         });
      });
   });
});
