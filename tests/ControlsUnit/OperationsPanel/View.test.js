define([
   'Controls/operations',
	'Controls/operationsPanel',
   'Types/source',
	'Controls/_operationsPanel/OperationsPanel/Utils',
   'Controls/toolbars',
   'Types/entity',
   'Types/collection'
], function(
   View,
	ViewPanel,
   sourceLib,
   WidthUtils,
   toolbars,
   entity,
   collection
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

         if (visibleItemsKeys.length > 1 && currentWidth > availableWidth) {
            for (var i = visibleItemsKeys.length - 1; i >= 0; i--) {
               items.getRecordById(visibleItemsKeys[i]).set('showType', currentWidth > availableWidth ? 0 : 1);
               currentWidth -= itemsSizes[i];
            }
         } else {
            items.each(function (item) {
               item.set('showType', 2);
            });
         }

         return items;
      };
   }

	describe('Controls/_operationsPanel/OperationsPanel', function() {
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
            source: new sourceLib.Memory({
               keyProperty: 'id',
               data: data
            }),
            keyProperty: 'id'
         },
         cfgWithOneItem = {
            source: new sourceLib.Memory({
               keyProperty: 'id',
               data: [data[0]]
            }),
            keyProperty: 'id'
         },
         cfgWithoutItems = {
            keyProperty: 'id'
         };

      beforeEach(function() {
			instance = new ViewPanel.OperationsPanel();
         instance._container = {
            offsetParent: 100
         };
         instance.saveOptions(cfg);
         oldFillItemsType = WidthUtils.fillItemsType;
      });

      afterEach(function() {
         WidthUtils.fillItemsType = oldFillItemsType;
         instance = null;
      });


      describe('_beforeMount', function() {

         it('several items', (done) => {
            assert.isFalse(instance._initialized);
            instance._beforeMount(cfg).addCallback(function(items) {
               assert.isFalse(instance._initialized);
               assert.deepEqual(items.getRawData(), data);
               assert.deepEqual(instance._items.getRawData(), data);
               done();
            });
         });

         it('without items', () => {
            assert.isFalse(instance._initialized);
            instance._beforeMount(cfgWithoutItems);
            assert.isTrue(instance._initialized);
         });

         it('without source', () => {
            var cfgWithoutSource = {
               keyProperty: 'id'
            };
            instance._initialized = false;
            instance._beforeMount(cfgWithoutSource);
            assert.isTrue(instance._initialized);
         });

      });

      describe('_afterMount', function() {
         it('enough space', function(done) {
            var
               forceUpdateCalled = false,
               notifyCalled = false;
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
               instance._notify = function(eventName, eventArgs, eventOptions) {
                  assert.equal(eventName, 'operationsPanelOpened');
                  notifyCalled = true;
               };
               instance._afterMount();
               assert.isTrue(instance._initialized);
               assert.isTrue(notifyCalled);
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
                  source: new sourceLib.Memory({
                     keyProperty: 'id',
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
               assert.isFalse(forceUpdateCalled);
               done();
            });
         });
      });

      describe('_afterUpdate', function() {
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
               instance._afterUpdate(cfg);
               assert.isFalse(forceUpdateCalled);
               done();
            });
         });
         it('new source', function(done) {
            var
               forceUpdateCalled = false,
               newCfg = {
                  source: new sourceLib.Memory({
                     keyProperty: 'id',
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
               instance._afterUpdate(newCfg);
               assert.isTrue(forceUpdateCalled);
               done();
            });
         });
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
               instance._afterUpdate(cfg);
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
               instance._afterUpdate(cfg);
               instance._toolbarSource.query().addCallback(function(result) {
                  assert.equal(result.getAll().getRecordById(0).get('showType'), 1);
                  assert.equal(result.getAll().getRecordById(1).get('showType'), 0);
                  assert.isTrue(forceUpdateCalled);
                  done();
               });
            });
         });

         it('not enough space for one item', function(done) {
            var forceUpdateCalled = false;
            instance._children = {
               toolbarBlock: {
                  clientWidth: 50
               }
            };
            instance._forceUpdate = function() {
               forceUpdateCalled = true;
            };
            WidthUtils.fillItemsType = mockFillItemsType([80]);
            instance._beforeMount(cfgWithOneItem).addCallback(function() {
               instance._options = cfgWithOneItem;
               instance._afterUpdate(cfgWithOneItem);
               instance._toolbarSource.query().addCallback(function(result) {
                  assert.equal(result.getAll().getRecordById(0).get('showType'), 2);
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

      it('panel is not visible', function(done) {
         var forceUpdateCalled = false;
         instance._container = {
            offsetParent: null
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
            instance._children.toolbarBlock.clientWidth = 0;
            instance._afterUpdate(cfg);
            assert.isFalse(forceUpdateCalled);
            done();
         });
      });
   });

	describe('Controls/_operationsPanel/OperationsPanel/Utils', () => {

      describe('getContentTemplate', () => {
         it('returns itemTemplate from item if it has one', () => {
            const fakeItem = {
               get: (name) => name === 'customTemplate' ? 'this template' : 'wrong field'
            };
            assert.strictEqual(
               WidthUtils._private.getContentTemplate(fakeItem, 'default', 'customTemplate'),
               'this template'
            );
         });

         it('returns itemTemplate from panel if item does not have one', () => {
            const fakeItem = {
               get: (name) => name === 'myOwnTemplate' ? null : 'wrong field'
            };
            assert.strictEqual(
               WidthUtils._private.getContentTemplate(fakeItem, 'default template', 'myOwnTemplate'),
               'default template'
            );
         });

         it('returns nothing if no template is specified', () => {
            const fakeItem = {
               get: () => null
            };
            assert.isNotOk(WidthUtils._private.getContentTemplate(fakeItem, null, null));
         });

         it('returns nothing if default template is toolbars:ItemTemplate', () => {
            const fakeItem = {
               get: (name) => name === 'myOwnTemplate' ? null : 'wrong field'
            };
            assert.isNotOk(
               WidthUtils._private.getContentTemplate(fakeItem, toolbars.ItemTemplate, 'myOwnTemplate')
            );
         });

      });

      it('setShowType', () => {
         let items = new collection.List({
            items: [new entity.Model({
               rawData: {id: 1},
               keyProperty: 'id'
            }), new entity.Model({
               rawData: {id: 2},
               keyProperty: 'id'
            })]
         });

         WidthUtils._private.setShowType(items, 1);
         assert.equal(items.at(0).get('showType'), 1);
         assert.equal(items.at(1).get('showType'), 1);
      });
   });
});
