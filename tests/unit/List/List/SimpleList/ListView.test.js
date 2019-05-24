/**
 * Created by kraynovdo on 23.10.2017.
 */
define([
   'Controls/list',
   'Types/collection'
], function(
   lists,
   collection
) {
   describe('Controls.List.ListView', function() {
      var data, data2, display, sandbox;
      beforeEach(function() {
         data = [
            {
               id : 1,
               title : 'Первый',
               type: 1
            },
            {
               id : 2,
               title : 'Второй',
               type: 2
            },
            {
               id : 3,
               title : 'Третий',
               type: 2
            }
         ];
         data2 = [
            {
               id : 4,
               title : 'Четвертый',
               type: 1
            },
            {
               id : 5,
               title : 'Пятый',
               type: 2
            },
            {
               id : 6,
               title : 'Шестой',
               type: 2
            }
         ];
         sandbox = sinon.createSandbox();
      });

      afterEach(function() {
         sandbox.restore();
      });

      it('Item click', function () {
         var model = new lists.ListViewModel({
            items: data,
            keyProperty: 'id',
            markedKey: null
         });
         var cfg = {
            listModel: model,
            keyProperty: 'id',
            markedKey: 2
         };
         var lv = new lists.ListView(cfg);
         lv.saveOptions(cfg);
         lv._beforeMount(cfg);

         var dispItem = lv._listModel._display.at(2);
         var notifyResult = null;
         lv._notify = function(e, args) {
            notifyResult = args[0];
         };
         lv._onItemClick({}, dispItem);
         assert.equal(notifyResult, dispItem.getContents(), 'Incorrect selected item before updating');
      });

      it('_beforeUpdate', function () {
         var model = new lists.ListViewModel({
            items: data,
            keyProperty: 'id',
            markedKey: null
         });
         var cfg = {
            listModel: model,
            keyProperty: 'id',
            markedKey: 2
         };
         var lv = new lists.ListView(cfg);
         lv.saveOptions(cfg);
         lv._beforeMount(cfg);


         model = new lists.ListViewModel({
            items: data2,
            keyProperty: 'id',
            markedKey: null
         });

         cfg = {
            listModel: model,
            keyProperty: 'id',
            markedKey: 2
         };

         lv._beforeUpdate(cfg);
         assert.equal(model, lv._listModel, 'Incorrect listModel before update');
      });

      it('should notify about resize after the list was updated with new items', function() {
         var
            cfg = {
               listModel: new lists.ListViewModel({
                  items: [],
                  keyProperty: 'id'
               }),
               keyProperty: 'id'
            },
            listView = new lists.ListView(cfg);
         listView.saveOptions(cfg);
         listView._beforeMount(cfg);
         var stub = sandbox.stub(listView, '_notify').withArgs('controlResize', [], { bubbling: true });

         listView._listModel._notify('onListChange');
         assert.isFalse(stub.called);
         listView._beforeUpdate(cfg);
         assert.isFalse(stub.called);
         listView._afterUpdate();
         assert.isTrue(stub.calledOnce);
      });

      it('should notify about resize only once even if the list was changed multiple times during an update', function() {
         var
            cfg = {
               listModel: new lists.ListViewModel({
                  items: [],
                  keyProperty: 'id'
               }),
               keyProperty: 'id'
            },
            listView = new lists.ListView(cfg);
         listView.saveOptions(cfg);
         listView._beforeMount(cfg);
         var stub = sandbox.stub(listView, '_notify').withArgs('controlResize', [], { bubbling: true });

         listView._listModel._notify('onListChange');
         listView._listModel._notify('onListChange');
         listView._listModel._notify('onListChange');
         listView._beforeUpdate(cfg);
         listView._afterUpdate();
         assert.isTrue(stub.calledOnce);
      });

      it('should not notify about resize by hoveredItemChanged', function() {
         var
            cfg = {
               listModel: new lists.ListViewModel({
                  items: [],
                  keyProperty: 'id'
               }),
               keyProperty: 'id'
            },
            listView = new lists.ListView(cfg);
         listView.saveOptions(cfg);
         listView._beforeMount(cfg);
         var stubControlResize = sandbox.stub(listView, '_notify').withArgs('controlResize', [], { bubbling: true });

         listView._listModel._notify('onListChange', 'hoveredItemChanged');
         listView._beforeUpdate(cfg);
         listView._afterUpdate();
         assert.isTrue(stubControlResize.notCalled);
      });

      it('_onItemMouseEnter', function(done) {
         var
            fakeHTMLElement = {
               className: 'controls-ListView__itemV'
            },
            fakeEvent = {
               target: {
                  closest: function(selector) {
                     if (selector === '.controls-ListView__itemV') {
                        return fakeHTMLElement;
                     }
                  }
               }
            },
            fakeItemData = {
               item: {}
            },
            eventQueue = [],
            model = new lists.ListViewModel({
               items: data,
               keyProperty: 'id',
               markedKey: null
            }),
            cfg = {
               listModel: model,
               keyProperty: 'id'
            },
            lv = new lists.ListView(cfg);
         lv._notify = function(eventName, eventArgs, eventOptions) {
            eventQueue.push({
               eventName: eventName,
               eventArgs: eventArgs,
               eventOptions: eventOptions
            });
         };
         lv._onItemMouseEnter(fakeEvent, fakeItemData);
         assert.equal(eventQueue.length, 1);
         assert.equal(eventQueue[0].eventName, 'itemMouseEnter');
         assert.equal(eventQueue[0].eventArgs.length, 2);
         assert.equal(eventQueue[0].eventArgs[0], fakeItemData);
         assert.equal(eventQueue[0].eventArgs[1], fakeEvent);
         assert.isUndefined(eventQueue[0].eventOptions);
         setTimeout(function() {
            assert.equal(lv._hoveredItem, fakeItemData.item);
            assert.equal(eventQueue.length, 2);
            assert.equal(eventQueue[1].eventName, 'hoveredItemChanged');
            assert.equal(eventQueue[1].eventArgs.length, 2);
            assert.equal(eventQueue[1].eventArgs[0], fakeItemData.item);
            assert.equal(eventQueue[1].eventArgs[1], fakeHTMLElement);
            assert.isUndefined(eventQueue[1].eventOptions);
            done();
         }, 150); //150 === DEBOUNCE_HOVERED_ITEM_CHANGED
      });
      describe('_onItemContextMenu', function() {
         it('contextMenuVisibility: true', function() {
            var
               model = new lists.ListViewModel({
                  items: data,
                  keyProperty: 'id',
                  markedKey: null
               }),
               cfg = {
                  listModel: model,
                  keyProperty: 'id',
                  contextMenuVisibility: true
               },
               lv = new lists.ListView(cfg),
               fakeItemData = {},
               fakeNativeEvent = {};
            lv.saveOptions(cfg);
            lv._beforeMount(cfg);

            lv._notify = function(eventName, eventArgs, eventOptions) {
               assert.equal(eventName, 'itemContextMenu');
               assert.equal(eventArgs.length, 3);
               assert.equal(eventArgs[0], fakeItemData);
               assert.equal(eventArgs[1], fakeNativeEvent);
               assert.isTrue(eventArgs[2]);
               assert.isUndefined(eventOptions);
            };
            lv._onItemContextMenu(fakeNativeEvent, fakeItemData);
         });
         it('contextMenuVisibility: false', function() {
            var
               model = new lists.ListViewModel({
                  items: data,
                  keyProperty: 'id',
                  markedKey: null
               }),
               cfg = {
                  listModel: model,
                  keyProperty: 'id',
                  contextMenuVisibility: false
               },
               lv = new lists.ListView(cfg),
               fakeItemData = {},
               fakeNativeEvent = {};
            lv.saveOptions(cfg);
            lv._beforeMount(cfg);

            lv._notify = function() {
               throw new Error('itemContextMenu event shouldn\'t fire if contextMenuVisibility is false');
            };
            lv._onItemContextMenu(fakeNativeEvent, fakeItemData);
         });
         it('itemContextMenu event should fire if contextMenuVisibility: true and the list has no editing items', function() {
            var
               model = new lists.ListViewModel({
                  items: data,
                  keyProperty: 'id',
                  markedKey: null
               }),
               cfg = {
                  listModel: model,
                  keyProperty: 'id',
                  contextMenuVisibility: true
               },
               lv = new lists.ListView(cfg),
               notifyStub = sandbox.stub(lv, '_notify').withArgs('itemContextMenu', [{}, {}, true]);
            lv.saveOptions(cfg);
            lv._beforeMount(cfg);
            sandbox.stub(model, 'getEditingItemData').returns(null);

            lv._onItemContextMenu({}, {});
            assert.isTrue(notifyStub.calledOnce);
         });
         it('itemContextMenu event shouldn\'t fire during editing', function() {
            var
               model = new lists.ListViewModel({
                  items: data,
                  keyProperty: 'id',
                  markedKey: null
               }),
               cfg = {
                  listModel: model,
                  keyProperty: 'id',
                  contextMenuVisibility: true
               },
               lv = new lists.ListView(cfg);
            lv.saveOptions(cfg);
            lv._beforeMount(cfg);
            sandbox.stub(model, 'getEditingItemData').returns({});
            sandbox.stub(lv, '_notify').withArgs('itemContextMenu').throws('itemContextMenu event shouldn\'t fire during editing');

            lv._onItemContextMenu({}, {});
         });
      });

      describe('_afterMount', function() {
         it('should fire markedKeyChanged if _options.markerVisibility is \'visible\'', function() {
            var model = new lists.ListViewModel({
               items: new collection.RecordSet({
                  rawData: data,
                  idProperty: 'id'
               }),
               keyProperty: 'id',
               markerVisibility: 'visible'
            });
            var cfg = {
               listModel: model,
               keyProperty: 'id',
               markerVisibility: 'visible'
            };
            var lv = new lists.ListView(cfg);
            lv.saveOptions(cfg);
            lv._beforeMount(cfg);
            var stub = sandbox.stub(lv, '_notify').withArgs('markedKeyChanged', [1]);

            lv._afterMount();

            assert.isTrue(stub.calledOnce);
         });

         it('should not fire markedKeyChanged if _options.markerVisibility is \'visible\', but markedKey is not undefined', function() {
            var model = new lists.ListViewModel({
               items: new collection.RecordSet({
                  rawData: data,
                  idProperty: 'id'
               }),
               keyProperty: 'id',
               markerVisibility: 'visible'
            });
            var cfg = {
               listModel: model,
               keyProperty: 'id',
               markerVisibility: 'visible',
               markedKey: null
            };
            var lv = new lists.ListView(cfg);
            lv.saveOptions(cfg);
            lv._beforeMount(cfg);

            var notifyCalled = false;
            lv._notify = function(eventName) {
               if (eventName === 'markedKeyChanged') {
                  notifyCalled = true;
               }
            };

            lv._afterMount();
            assert.isFalse(notifyCalled);
         });

         it('should not fire markedKeyChanged if _options.markerVisibility is not \'visible\'', function() {
            var model = new lists.ListViewModel({
               items: new collection.RecordSet({
                  rawData: data,
                  idProperty: 'id'
               }),
               keyProperty: 'id'
            });
            var cfg = {
               listModel: model,
               keyProperty: 'id'
            };
            var lv = new lists.ListView(cfg);
            lv.saveOptions(cfg);
            lv._beforeMount(cfg);

            var notifyCalled = false;
            lv._notify = function(eventName) {
               if (eventName === 'markedKeyChanged') {
                  notifyCalled = true;
               }
            };

            lv._afterMount();
            assert.isFalse(notifyCalled);
         });
      });
   });
});
