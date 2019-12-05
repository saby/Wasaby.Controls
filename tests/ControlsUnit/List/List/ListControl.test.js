define([
   'Controls/list',
   'Core/Deferred',
   'Core/core-instance',
   'Controls/Utils/PropStorageUtil'
], function(
   lists,
   Deferred,
   cInstance,
   PropStorageUtil
) {
   describe('Controls.List.ListControl', function() {
      describe('propStorageId', function() {
         let origSaveConfig = PropStorageUtil.saveConfig;
         afterEach(() => {
            PropStorageUtil.saveConfig = origSaveConfig;
         });
         it('saving sorting', function() {
            var saveConfigCalled = false;
            PropStorageUtil.saveConfig = function() {
               saveConfigCalled = true;
            };
            var cfg = {sorting: [1]};
            var cfg1 = {sorting: [2], propStorageId: '1'};
            var listControl = new lists.ListControl(cfg);
            listControl.saveOptions(cfg);
            listControl._beforeUpdate(cfg);
            assert.isFalse(saveConfigCalled);
            listControl._beforeUpdate({sorting: [3]});
            assert.isFalse(saveConfigCalled);
            listControl._beforeUpdate(cfg1);
            assert.isTrue(saveConfigCalled);

         });
      });
      describe('EditInPlace', function() {
         it('beginEdit', function() {
            var opt = {
               test: '123'
            };
            var
               listControl = new lists.ListControl({});
            listControl._children = {
               baseControl: {
                  beginEdit: function(options) {
                     assert.equal(opt, options);
                     return Deferred.success();
                  }
               }
            };
            var result = listControl.beginEdit(opt);
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isTrue(result.isSuccessful());
         });

         it('beginEdit, readOnly: true', function() {
            var opt = {
               test: '123'
            };
            var
               listControl = new lists.ListControl({});
            listControl.saveOptions({ readOnly: true });
            var result = listControl.beginEdit(opt);
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isFalse(result.isSuccessful());
         });

         it('beginAdd', function() {
            var opt = {
               test: '123'
            };
            var
               listControl = new lists.ListControl({});
            listControl._children = {
               baseControl: {
                  beginAdd: function(options) {
                     assert.equal(opt, options);
                     return Deferred.success();
                  }
               }
            };
            var result = listControl.beginAdd(opt);
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isTrue(result.isSuccessful());
         });

         it('beginAdd, readOnly: true', function() {
            var opt = {
               test: '123'
            };
            var
               listControl = new lists.ListControl({});
            listControl.saveOptions({ readOnly: true });
            var result = listControl.beginAdd(opt);
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isFalse(result.isSuccessful());
         });

         it('cancelEdit', function() {
            var
               listControl = new lists.ListControl({});
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
               listControl = new lists.ListControl({});
            listControl.saveOptions({ readOnly: true });
            var result = listControl.cancelEdit();
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isFalse(result.isSuccessful());
         });

         it('commitEdit', function() {
            var
               listControl = new lists.ListControl({});
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
               listControl = new lists.ListControl({});
            listControl.saveOptions({ readOnly: true });
            var result = listControl.commitEdit();
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isFalse(result.isSuccessful());
         });

         it('reloadItem', function() {
            var list = new lists.ListControl({});
            list._children = {
               baseControl: {
                  reloadItem: function(key, readMeta, direction) {
                     assert.equal(key, 'test');
                     assert.deepEqual(readMeta, {test: 'test'});
                     assert.equal(direction, 'depth');
                  }
               }
            };
            list.reloadItem('test', {test: 'test'}, 'depth');
         });
      });
   });
});
