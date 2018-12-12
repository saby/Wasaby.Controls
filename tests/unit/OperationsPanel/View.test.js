define([
   'Controls/Operations/Panel',
   'WS.Data/Source/Memory',
   'Controls/Operations/Panel/Utils'
], function(
   View,
   Memory,
   WidthUtils
) {
   'use strict';

   function mockFillItemsType(itemsSizes) {
      return function fillItemsType(keyProperty, parentProperty, items, availableWidth) {
         var
            visibleItemsKeys = [],
            currentWidth = itemsSizes.reduce(function(acc, size) {
               return acc + size;
            }, 0);

         items.each(function(item) {
            if (!item.get(parentProperty)) {
               visibleItemsKeys.push(item.get(keyProperty));
            }
         });

         if (currentWidth > availableWidth) {
            for (var i = visibleItemsKeys.length - 1; i >= 0; i--) {
               items.getRecordById(visibleItemsKeys[i]).set('showType', currentWidth > availableWidth ? 0 : 1);
               currentWidth -= itemsSizes[i];
            }
         } else {
            items.each(function(item) {
               item.set('showType', 2);
            });
         }

         return items;
      };
   }

   describe('Controls.Operations.Panel', function() {
      var
         instance,
         oldFillItemsType,
         data = [{
            id: 0,
            title: 'print'
         }, {
            id: 1,
            title: 'unload'
         }],
         cfg = {
            source: new Memory({
               idProperty: 'id',
               data: data
            }),
            keyProperty: 'id'
         };

      beforeEach(function() {
         instance = new View();
         instance.saveOptions(cfg);
         oldFillItemsType = WidthUtils.fillItemsType;
      });

      afterEach(function() {
         WidthUtils.fillItemsType = oldFillItemsType;
         instance = null;
      });


      it('_beforeMount', function(done) {
         assert.isFalse(instance._initialized);
         instance._beforeMount(cfg).addCallback(function(items) {
            assert.isFalse(instance._initialized);
            assert.deepEqual(items.getRawData(), data);
            assert.deepEqual(instance._items.getRawData(), data);
            done();
         });
      });

      describe('_afterMount', function() {
         it('enough space', function(done) {
            var forceUpdateCalled = false;
            instance._children = {
               toolbarBlock: {
                  clientWidth: 360
               }
            };
            instance._forceUpdate = function() {
               forceUpdateCalled = true;
            };
            WidthUtils.fillItemsType = mockFillItemsType([80, 90]);
            instance._beforeMount(cfg).addCallback(function() {
               assert.isFalse(instance._initialized);
               instance._afterMount();
               assert.isTrue(instance._initialized);
               instance._toolbarSource.query().addCallback(function(result) {
                  assert.equal(result.getAll().getRecordById(0).get('showType'), 2);
                  assert.equal(result.getAll().getRecordById(1).get('showType'), 2);
                  assert.isTrue(forceUpdateCalled);
                  done();
               });
            });
         });

         it('not enough space', function(done) {
            var forceUpdateCalled = false;
            instance._children = {
               toolbarBlock: {
                  clientWidth: 100
               }
            };
            instance._forceUpdate = function() {
               forceUpdateCalled = true;
            };
            WidthUtils.fillItemsType = mockFillItemsType([80, 90]);
            instance._beforeMount(cfg).addCallback(function() {
               assert.isFalse(instance._initialized);
               instance._afterMount();
               assert.isTrue(instance._initialized);
               instance._toolbarSource.query().addCallback(function(result) {
                  assert.equal(result.getAll().getRecordById(0).get('showType'), 1);
                  assert.equal(result.getAll().getRecordById(1).get('showType'), 0);
                  assert.isTrue(forceUpdateCalled);
                  done();
               });
            });
         });
      });

      describe('_beforeUpdate', function() {
         it('old source', function(done) {
            var forceUpdateCalled = false;
            instance._children = {
               toolbarBlock: {
                  clientWidth: 100
               }
            };
            WidthUtils.fillItemsType = mockFillItemsType([80, 90]);
            instance._beforeMount(cfg).addCallback(function() {
               instance._afterMount();
               instance._forceUpdate = function() {
                  forceUpdateCalled = true;
               };
               instance._beforeUpdate(cfg);
               assert.isFalse(forceUpdateCalled);
               done();
            });
         });
         it('new source', function(done) {
            var
               forceUpdateCalled = false,
               newCfg = {
                  source: new Memory({
                     idProperty: 'id',
                     data: data
                  }),
                  keyProperty: 'id'
               };
            instance._children = {
               toolbarBlock: {
                  clientWidth: 100
               }
            };
            WidthUtils.fillItemsType = mockFillItemsType([80, 90]);
            instance._beforeMount(cfg).addCallback(function() {
               instance._afterMount();
               instance._forceUpdate = function() {
                  forceUpdateCalled = true;
               };
               instance._beforeUpdate(newCfg);
               assert.isTrue(forceUpdateCalled);
               done();
            });
         });
      });

      describe('_afterUpdate', function() {
         it('enough space', function(done) {
            var forceUpdateCalled = false;
            instance._children = {
               toolbarBlock: {
                  clientWidth: 360
               }
            };
            instance._forceUpdate = function() {
               forceUpdateCalled = true;
            };
            WidthUtils.fillItemsType = mockFillItemsType([80, 90]);
            instance._beforeMount(cfg).addCallback(function() {
               instance._afterUpdate();
               instance._toolbarSource.query().addCallback(function(result) {
                  assert.equal(result.getAll().getRecordById(0).get('showType'), 2);
                  assert.equal(result.getAll().getRecordById(1).get('showType'), 2);
                  assert.isTrue(forceUpdateCalled);
                  done();
               });
            });
         });

         it('not enough space', function(done) {
            var forceUpdateCalled = false;
            instance._children = {
               toolbarBlock: {
                  clientWidth: 100
               }
            };
            instance._forceUpdate = function() {
               forceUpdateCalled = true;
            };
            WidthUtils.fillItemsType = mockFillItemsType([80, 90]);
            instance._beforeMount(cfg).addCallback(function() {
               instance._afterUpdate();
               instance._toolbarSource.query().addCallback(function(result) {
                  assert.equal(result.getAll().getRecordById(0).get('showType'), 1);
                  assert.equal(result.getAll().getRecordById(1).get('showType'), 0);
                  assert.isTrue(forceUpdateCalled);
                  done();
               });
            });
         });
      });

      describe('_onResize', function() {
         it('enough space', function(done) {
            var forceUpdateCalled = false;
            instance._children = {
               toolbarBlock: {
                  clientWidth: 360
               }
            };
            instance._forceUpdate = function() {
               forceUpdateCalled = true;
            };
            WidthUtils.fillItemsType = mockFillItemsType([80, 90]);
            instance._beforeMount(cfg).addCallback(function() {
               instance._onResize();
               instance._toolbarSource.query().addCallback(function(result) {
                  assert.equal(result.getAll().getRecordById(0).get('showType'), 2);
                  assert.equal(result.getAll().getRecordById(1).get('showType'), 2);
                  assert.isTrue(forceUpdateCalled);
                  done();
               });
            });
         });

         it('not enough space', function(done) {
            var forceUpdateCalled = false;
            instance._children = {
               toolbarBlock: {
                  clientWidth: 100
               }
            };
            instance._forceUpdate = function() {
               forceUpdateCalled = true;
            };
            WidthUtils.fillItemsType = mockFillItemsType([80, 90]);
            instance._beforeMount(cfg).addCallback(function() {
               instance._onResize();
               instance._toolbarSource.query().addCallback(function(result) {
                  assert.equal(result.getAll().getRecordById(0).get('showType'), 1);
                  assert.equal(result.getAll().getRecordById(1).get('showType'), 0);
                  assert.isTrue(forceUpdateCalled);
                  done();
               });
            });
         });
      });

      it('_toolbarItemClick', function() {
         var item = {
            test: 123
         };
         instance._notify = function(e, eventArgs) {
            assert.equal(e, 'itemClick');
            assert.equal(item, eventArgs[0]);
         };
         instance._toolbarItemClick({}, item);
      });
   });
});
