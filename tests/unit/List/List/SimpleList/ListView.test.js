/**
 * Created by kraynovdo on 23.10.2017.
 */
define([
   'Controls/List/ListView',
   'Controls/List/ListViewModel',
   'WS.Data/Collection/RecordSet'
], function(
   ListView,
   ListViewModel,
   RecordSet
) {
   describe('Controls.List.ListView', function() {
      var data, data2, display;
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

      });

      it('Item click', function () {
         var model = new ListViewModel({
            items: data,
            keyProperty: 'id'
         });
         var cfg = {
            listModel: model,
            keyProperty: 'id',
            markedKey: 2
         };
         var lv = new ListView(cfg);
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
         var model = new ListViewModel({
            items: data,
            keyProperty: 'id'
         });
         var cfg = {
            listModel: model,
            keyProperty: 'id',
            markedKey: 2
         };
         var lv = new ListView(cfg);
         lv.saveOptions(cfg);
         lv._beforeMount(cfg);
      
      
         model = new ListViewModel({
            items: data2,
            keyProperty: 'id'
         });
      
         cfg = {
            listModel: model,
            keyProperty: 'id',
            markedKey: 2
         };
      
         lv._beforeUpdate(cfg);
         assert.equal(model, lv._listModel, 'Incorrect listModel before update');
      });
   
      it('_private.resizeNotifyOnListChanged', function () {
         var listView = new ListView(),
             eventNotifyed = false;
   
         listView._notify = function(event) {
            if (event === 'controlResize') {
               eventNotifyed = true;
            }
         };
         
         listView._listChanged = false;
         ListView._private.resizeNotifyOnListChanged(listView);
         
         assert.isFalse(eventNotifyed);
   
         listView._listChanged = true;
         ListView._private.resizeNotifyOnListChanged(listView);
   
         assert.isTrue(eventNotifyed);
      });
      it('ListView updating queue', function () {
         var
            cfg = {
               listModel: new ListViewModel({
                  items: [],
                  keyProperty: 'id'
               }),
               keyProperty: 'id'
            },
            listView = new ListView(cfg);
         listView.saveOptions(cfg);
         listView._beforeMount(cfg);
         assert.isFalse(listView._lockForUpdate, 'Incorrect initial "_lockForUpdate" value.');
         assert.deepEqual([], listView._queue, 'Incorrect initial "_queue" value.');
         listView._beforeUpdate(cfg);
         assert.isTrue(listView._lockForUpdate, 'Incorrect value "_lockForUpdate" after call "beforeUpdate".');
         listView._listModel._notify('onListChange');
         listView._listModel._notify('onListChange');
         assert.equal(listView._queue.length, 2, 'Incorrect length "_queue" after two "onListChange".');
         assert.isTrue(listView._lockForUpdate, 'Incorrect "_lockForUpdate" value after two "onListChange".');
         listView._afterUpdate();
         assert.isFalse(listView._lockForUpdate, 'Incorrect "_lockForUpdate" value after call "afterUpdate".');
         assert.deepEqual([], listView._queue, 'Incorrect initial "_queue" value after call "afterUpdate".');
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
            model = new ListViewModel({
               items: data,
               keyProperty: 'id'
            }),
            cfg = {
               listModel: model,
               keyProperty: 'id'
            },
            lv = new ListView(cfg);
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
         it('contextMenuEnabled: true', function() {
            var
               model = new ListViewModel({
                  items: data,
                  keyProperty: 'id'
               }),
               cfg = {
                  listModel: model,
                  keyProperty: 'id',
                  contextMenuEnabled: true
               },
               lv = new ListView(cfg),
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
         it('contextMenuEnabled: false', function() {
            var
               model = new ListViewModel({
                  items: data,
                  keyProperty: 'id'
               }),
               cfg = {
                  listModel: model,
                  keyProperty: 'id',
                  contextMenuEnabled: false
               },
               lv = new ListView(cfg),
               fakeItemData = {},
               fakeNativeEvent = {};
            lv.saveOptions(cfg);
            lv._beforeMount(cfg);

            lv._notify = function() {
               throw new Error('itemContextMenu event shouldn\'t fire if contextMenuEnabled is false');
            };
            lv._onItemContextMenu(fakeNativeEvent, fakeItemData);
         });
      });

      describe('_afterMount', function() {
         it('should fire markedKeyChanged if _options.markerVisibility is \'always\'', function() {
            var model = new ListViewModel({
               items: new RecordSet({
                  rawData: data,
                  idProperty: 'id'
               }),
               keyProperty: 'id',
               markerVisibility: 'always'
            });
            var cfg = {
               listModel: model,
               keyProperty: 'id',
               markerVisibility: 'always'
            };
            var lv = new ListView(cfg);
            lv.saveOptions(cfg);
            lv._beforeMount(cfg);

            lv._notify = function(eventName, eventArgs, eventOpts) {
               assert.equal(eventName, 'markedKeyChanged');
               assert.equal(eventArgs.length, 1);
               assert.equal(eventArgs[0], 1);
               assert.isUndefined(eventOpts);
            };

            lv._afterMount();
         });

         it('should not fire markedKeyChanged if _options.markerVisibility is \'always\', but markedKey is not undefined', function() {
            var model = new ListViewModel({
               items: new RecordSet({
                  rawData: data,
                  idProperty: 'id'
               }),
               keyProperty: 'id',
               markerVisibility: 'always'
            });
            var cfg = {
               listModel: model,
               keyProperty: 'id',
               markerVisibility: 'always',
               markedKey: null
            };
            var lv = new ListView(cfg);
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

         it('should not fire markedKeyChanged if _options.markerVisibility is not \'always\'', function() {
            var model = new ListViewModel({
               items: new RecordSet({
                  rawData: data,
                  idProperty: 'id'
               }),
               keyProperty: 'id'
            });
            var cfg = {
               listModel: model,
               keyProperty: 'id'
            };
            var lv = new ListView(cfg);
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
