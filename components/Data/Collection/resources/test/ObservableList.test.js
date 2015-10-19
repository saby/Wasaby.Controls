/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'js!SBIS3.CONTROLS.Data.Collection.ObservableList',
   'js!SBIS3.CONTROLS.Data.Collection.List',
   'js!SBIS3.CONTROLS.Data.Bind.ICollection',
   'js!SBIS3.CONTROLS.Data.Factory',
   'js!SBIS3.CONTROLS.Data.Model',
   'js!SBIS3.CONTROLS.Data.Adapter.Json'
], function (ObservableList, List, IBindCollection, Factory, Model, JsonAdapter) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Collection.ObservableList', function() {
         var items,
            checkEvent = function(
               action, newItems, newItemsIndex, oldItems, oldItemsIndex,
               actionOriginal, newItemsOriginal, newItemsIndexOriginal, oldItemsOriginal, oldItemsIndexOriginal
            ) {
               var i;

               if (action !== actionOriginal) {
                  throw new Error('Invalid action');
               }

               for (i = 0; i < newItems.length; i++) {
                  if (newItems[i].getContents() !== newItemsOriginal[i]) {
                     throw new Error('Invalid newItems');
                  }
               }
               if (newItemsIndex !== newItemsIndexOriginal) {
                  throw new Error('Invalid newItemsIndex');
               }

               for (i = 0; i < oldItems.length; i++) {
                  if (oldItems[i].getContents() !== oldItemsOriginal[i]) {
                     throw new Error('Invalid oldItems');
                  }
               }
               if (oldItemsIndex !== oldItemsIndexOriginal) {
                  throw new Error('Invalid oldItemsIndex');
               }
            };

         beforeEach(function() {
            items = [{
               'Ид': 1,
               'Фамилия': 'Иванов'
            }, {
               'Ид': 2,
               'Фамилия': 'Петров'
            }, {
               'Ид': 3,
               'Фамилия': 'Сидоров'
            }, {
               'Ид': 4,
               'Фамилия': 'Пухов'
            }, {
               'Ид': 5,
               'Фамилия': 'Молодцов'
            }, {
               'Ид': 6,
               'Фамилия': 'Годолцов'
            }, {
               'Ид': 7,
               'Фамилия': 'Арбузнов'
            }];
         });

         afterEach(function() {
            items = undefined;
         });

         describe('.concat()', function() {
            context('when append', function() {
               it('should trigger an event with valid arguments', function(done) {
                  var list = new ObservableList({
                        items: items.slice()
                     }),
                     concatItems = [1, 2, 3],
                     handler = function(event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
                        try {
                           checkEvent(
                              action, newItems, newItemsIndex, oldItems, oldItemsIndex,
                              IBindCollection.ACTION_ADD, concatItems, items.length, [], 0
                           );
                           done();
                        } catch (err) {
                           done(err);
                        }
                     };
                  list.subscribe('onCollectionChange', handler);

                  list.concat(new List({
                     items: concatItems
                  }));

                  list.unsubscribe('onCollectionChange', handler);
               });
            });

            context('when prepend', function() {
               it('should trigger an event with valid arguments', function(done) {
                  var list = new ObservableList({
                        items: items.slice()
                     }),
                     concatItems = [4, 5, 6],
                     handler = function(event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
                        try {
                           checkEvent(
                              action, newItems, newItemsIndex, oldItems, oldItemsIndex,
                              IBindCollection.ACTION_ADD, concatItems, 0, [], 0
                           );
                           done();
                        } catch (err) {
                           done(err);
                        }
                     };

                  list.subscribe('onCollectionChange', handler);

                  list.concat(new List({
                     items: concatItems
                  }), true);

                  list.unsubscribe('onCollectionChange', handler);
               });
            });
         });

         describe('.fill()', function() {
            context('when has instead', function() {
               it('should trigger an event with valid arguments', function(done) {
                  var list = new ObservableList({
                        items: items.slice()
                     }),
                     fillItems = ['a', 'b'],
                     handler = function(event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
                        try {
                           checkEvent(
                              action, newItems, newItemsIndex, oldItems, oldItemsIndex,
                              IBindCollection.ACTION_RESET, fillItems, 0, items, 0
                           );
                           done();
                        } catch (err) {
                           done(err);
                        }
                     };

                  list.subscribe('onCollectionChange', handler);

                  list.fill(new List({
                     items: fillItems
                  }));

                  list.unsubscribe('onCollectionChange', handler);
               });
            });

            context('when only clear', function() {
               it('should trigger an event with valid arguments', function(done) {
                  var list = new ObservableList({
                        items: items.slice()
                     }),
                     handler = function(event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
                        try {
                           checkEvent(
                              action, newItems, newItemsIndex, oldItems, oldItemsIndex,
                              IBindCollection.ACTION_RESET, [], 0, items, 0
                           );
                           done();
                        } catch (err) {
                           done(err);
                        }
                     };

                  list.subscribe('onCollectionChange', handler);

                  list.fill();

                  list.unsubscribe('onCollectionChange', handler);
               });
            });
         });

         describe('.add()', function() {
            context('when append', function() {
               it('should trigger an event with valid arguments', function(done) {
                  var list = new ObservableList({
                        items: items.slice()
                     }),
                     andDone = false,
                     addIndex = items.length,
                     addItem,
                     handler = function(event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
                        try {
                           checkEvent(
                              action, newItems, newItemsIndex, oldItems, oldItemsIndex,
                              IBindCollection.ACTION_ADD, [addItem], addIndex, [], 0
                           );
                           if (andDone) {
                              done();
                           }
                        } catch (err) {
                           done(err);
                        }
                     };

                  list.subscribe('onCollectionChange', handler);

                  addItem = {'a': 1};
                  list.add(addItem);

                  addItem = {'a': 2};
                  addIndex++;
                  list.add(addItem);

                  andDone = true;
                  addItem = {'a': 3};
                  addIndex++;
                  list.add(addItem);

                  list.unsubscribe('onCollectionChange', handler);
               });
            });

            context('when prepend', function() {
               it('should trigger an event with valid arguments', function(done) {
                  var list = new ObservableList({
                        items: items.slice()
                     }),
                     andDone = false,
                     addItem,
                     handler = function(event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
                        try {
                           checkEvent(
                              action, newItems, newItemsIndex, oldItems, oldItemsIndex,
                              IBindCollection.ACTION_ADD, [addItem], 0, [], 0
                           );
                           if (andDone) {
                              done();
                           }
                        } catch (err) {
                           done(err);
                        }
                     };

                  list.subscribe('onCollectionChange', handler);

                  addItem = {'b': 1};
                  list.add(addItem, 0);

                  addItem = {'b': 2};
                  list.add(addItem, 0);

                  andDone = true;
                  addItem = {'b': 3};
                  list.add(addItem, 0);

                  list.unsubscribe('onCollectionChange', handler);
               });
            });

            context('when insert', function() {
               it('should trigger an event with valid arguments', function(done) {
                  var list = new ObservableList({
                        items: items.slice()
                     }),
                     andDone = false,
                     addItem,
                     at,
                     handler = function(event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
                        try {
                           checkEvent(
                              action, newItems, newItemsIndex, oldItems, oldItemsIndex,
                              IBindCollection.ACTION_ADD, [addItem], at, [], 0
                           );
                           if (andDone) {
                              done();
                           }
                        } catch (err) {
                           done(err);
                        }
                     };

                  list.subscribe('onCollectionChange', handler);

                  addItem = {'c': 1};
                  at = 5;
                  list.add(addItem, at);
                  list.add(addItem, at);

                  addItem = {'c': 2};
                  at = 4;
                  list.add(addItem, at);

                  andDone = true;
                  addItem = {'c': 3};
                  at = 1;
                  list.add(addItem, at);


                  list.unsubscribe('onCollectionChange', handler);
               });
            });

            it('should trigger an event with changed item', function(done) {
               var list = new ObservableList({
                     items: []
                  }),
                  addItem,
                  handler = function(event, item, index, property) {
                     try {
                        if (addItem !== item.getContents()) {
                           throw new Error('Invalid changed item');
                        }
                        if (index !== 0) {
                           throw new Error('Invalid changed item index');
                        }
                        if (property !== 'contents') {
                           throw new Error('Invalid changed item property');
                        }
                        done();
                     } catch (err) {
                        done(err);
                     }
                  };
               var addItem = new Model({
                  data: {test: 'fail'},
                  adapter: new JsonAdapter()
               });
               list.add(addItem);
               list.subscribe('onCollectionItemChange', handler);
               addItem.set('test', 'ok');
               list.unsubscribe('onCollectionItemChange', handler);
            });


         });

         describe('.removeAt()', function() {
            it('should trigger an event with valid arguments', function(done) {
               var list = new ObservableList({
                     items: items
                  }),
                  andDone = false,
                  oldItem,
                  at,
                  handler = function(event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
                     try {
                        checkEvent(
                           action, newItems, newItemsIndex, oldItems, oldItemsIndex,
                           IBindCollection.ACTION_REMOVE, [], 0, [oldItem], at
                        );
                        if (andDone) {
                           done();
                        }
                     } catch (err) {
                        done(err);
                     }
                  };

               list.subscribe('onCollectionChange', handler);

               at = 1;
               oldItem = list.at(at);
               list.removeAt(at);

               at = 1;
               oldItem = list.at(at);
               list.removeAt(at);

               andDone = true;
               at = 3;
               oldItem = list.at(at);
               list.removeAt(at);

               list.unsubscribe('onCollectionChange', handler);
            });

            it("shouldn't trigger an event with change item",function(done){
               var list = new ObservableList({
                     items: []
                  }),
                  addItem,
                  handler = function(event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
                     done(err);
                  };
               var addItem = new Model({
                  data: {test: 'fail'},
                  adapter: new JsonAdapter()
               });
               list.add(addItem);
               list.removeAt(0);
               list.subscribe('onCollectionChange', handler);
               addItem.set('test','ok');
               list.unsubscribe('onCollectionChange', handler);
               done();
            });
         });

         describe('.replace()', function() {
            it('should trigger an event with valid arguments', function(done) {
               var list = new ObservableList({
                     items: items.slice()
                  }),
                  andDone = false,
                  oldItem,
                  newItem,
                  at,
                  handler = function(event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
                     try {
                        checkEvent(
                           action, newItems, newItemsIndex, oldItems, oldItemsIndex,
                           IBindCollection.ACTION_REPLACE, [newItem], at, [oldItem], at
                        );
                        if (andDone) {
                           done();
                        }
                     } catch (err) {
                        done(err);
                     }
                  };

               list.subscribe('onCollectionChange', handler);

               at = 1;
               oldItem = list.at(at);
               newItem = {'d': 1};
               list.replace(newItem, at);

               at = 5;
               oldItem = list.at(at);
               newItem = {'d': 2};
               list.replace(newItem, at);

               andDone = true;
               at = 3;
               oldItem = list.at(at);
               newItem = {'d': 3};
               list.replace(newItem, at);

               list.unsubscribe('onCollectionChange', handler);
            });
         });
      });
   }
);
