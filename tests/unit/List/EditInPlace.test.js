define([
   'Controls/List/EditInPlace',
   'WS.Data/Collection/RecordSet',
   'WS.Data/Entity/Model',
   'Core/Deferred',
   'WS.Data/Source/Memory',
   'Controls/List/ListViewModel',
   'Controls/List/Tree/TreeViewModel',
   'Controls/EditableArea/Constants'
], function(
   EditInPlace,
   RecordSet,
   Model,
   Deferred,
   Memory,
   ListViewModel,
   TreeViewModel,
   EditConstants
) {
   describe('Controls.List.EditInPlace', function() {
      var eip, items, newItem, listModel, listModelWithGroups, data, treeData, treeModel;
      beforeEach(function() {
         data = [
            {
               id: 1,
               title: 'Первый',
               type: 'goods'
            },
            {
               id: 2,
               title: 'Второй',
               type: 'goods'
            },
            {
               id: 3,
               title: 'Третий',
               type: 'services'
            }
         ];
         treeData = [{
            id: 1,
            'parent': null,
            'parent@': true,
            title: 'Документы отделов'
         }, {
            id: 11,
            'parent': 1,
            'parent@': true,
            title: '1. Электронный документооборот'
         }, {
            id: 12,
            'parent': 1,
            'parent@': true,
            title: '2. Отчетность через интернет'
         }, {
            id: 13,
            'parent': 1,
            'parent@': null,
            title: 'Сравнение условий конкурентов по ЭДО.xlsx',
            isDocument: true
         }, {
            id: 111,
            'parent': 11,
            'parent@': true,
            title: 'Задачи'
         }, {
            id: 112,
            'parent': 11,
            'parent@': null,
            title: 'Сравнение систем по учету рабочего времени.xlsx',
            isDocument: true
         }, {
            id: 2,
            'parent': null,
            'parent@': true,
            title: 'Техническое задание'
         }, {
            id: 21,
            'parent': 2,
            'parent@': null,
            title: 'PandaDoc.docx',
            isDocument: true
         }, {
            id: 22,
            'parent': 2,
            'parent@': null,
            title: 'SignEasy.docx',
            isDocument: true
         }, {
            id: 3,
            'parent': null,
            'parent@': true,
            title: 'Анализ конкурентов'
         }, {
            id: 4,
            'parent': null,
            'parent@': null,
            title: 'Договор на поставку печатной продукции'
         }];
         items = new RecordSet({
            rawData: data,
            idProperty: 'id'
         });
         newItem = new Model({
            rawData: {
               id: 4,
               title: 'Четвёртый'
            },
            idProperty: 'id'
         });
         listModel = new ListViewModel({
            items: items.clone(),
            keyProperty: 'id',
            displayProperty: 'title'
         });
         treeModel = new TreeViewModel({
            items: new RecordSet({
               rawData: treeData,
               idProperty: 'id'
            }),
            keyProperty: 'id',
            parentProperty: 'parent',
            nodeProperty: 'parent@'
         });
         listModelWithGroups = new ListViewModel({
            items: items.clone(),
            keyProperty: 'id',
            displayProperty: 'title',
            groupMethod: function(item) {
               return item.get('type');
            }
         });
         eip = new EditInPlace();
         eip._children = {
            formController: {
               submit: function() {
                  return Deferred.success();
               }
            }
         };
      });

      afterEach(function() {
         eip.destroy();
         listModel.destroy();
         listModelWithGroups.destroy();
         eip = undefined;
         listModel = undefined;
         listModelWithGroups = undefined;
         newItem = undefined;
         items = undefined;
      });

      describe('_beforeMount', function() {
         it('Edit', function() {
            eip._beforeMount({
               listModel: listModel,
               editingConfig: {
                  item: listModel.at(0).getContents()
               }
            });
            assert.equal(listModel.at(0).getContents(), eip._editingItem);
            assert.equal(listModel.at(0).getContents(), eip._originalItem);
         });

         it('Add', function() {
            eip._beforeMount({
               listModel: listModel,
               editingConfig: {
                  item: newItem
               }
            });
            assert.equal(newItem, eip._editingItem);
            assert.isTrue(eip._isAdd);
         });
      });

      describe('beginEdit', function() {
         it('Cancel', function() {
            eip._notify = function(e) {
               if (e === 'beforeBeginEdit') {
                  return EditConstants.CANCEL;
               }
            };

            eip.saveOptions({
               listModel: listModel
            });

            var result = eip.beginEdit({
               item: listModel.at(0).getContents()
            });
            assert.isTrue(result.isSuccessful());
         });

         it('Without handler', function() {
            eip.saveOptions({
               listModel: listModel
            });

            eip.beginEdit({
               item: listModel.at(0).getContents()
            });
            assert.isTrue(listModel.at(0).getContents().isEqual(eip._editingItem));
            assert.equal(listModel.at(0).getContents(), eip._originalItem);
         });

         it('Deferred', function() {
            eip._notify = function(e) {
               if (e === 'beforeBeginEdit') {
                  return Deferred.success({
                     item: listModel.at(1).getContents()
                  });
               }
            };

            eip.saveOptions({
               listModel: listModel
            });

            eip.beginEdit({
               item: listModel.at(0).getContents()
            });
            assert.isTrue(listModel.at(1).getContents().isEqual(eip._editingItem));
            assert.equal(listModel.at(0).getContents(), eip._originalItem);
         });

         it('Record', function() {
            eip._notify = function(e) {
               if (e === 'beforeBeginEdit') {
                  return {
                     item: listModel.at(1).getContents()
                  };
               }
            };

            eip.saveOptions({
               listModel: listModel
            });

            eip.beginEdit({
               item: listModel.at(0).getContents()
            });
            assert.isTrue(listModel.at(1).getContents().isEqual(eip._editingItem));
            assert.equal(listModel.at(0).getContents(), eip._originalItem);
         });

         it('afterBeginEdit', function(done) {
            var source = new Memory({
               idProperty: 'id',
               data: items
            });

            eip.saveOptions({
               listModel: listModel,
               source: source
            });

            eip._notify = function(event, args) {
               if (event === 'afterBeginEdit') {
                  assert.equal(eip._editingItem, args[0]);
                  assert.isNotOk(args[1]);
                  done();
               }
            };

            eip.beginEdit({
               item: listModel.at(0).getContents()
            });
         });
      });

      describe('beginAdd', function() {
         it('Without handler', function(done) {
            var source = new Memory({
               idProperty: 'id',
               data: items
            });

            eip.saveOptions({
               listModel: listModel,
               source: source
            });

            eip.beginAdd().addCallback(function() {
               assert.instanceOf(eip._editingItem, Model);
               assert.isTrue(eip._isAdd);
               done();
            });
         });

         it('Empty list', function(done) {
            listModel.setItems(new RecordSet({
               rawData: [],
               idProperty: 'id'
            }));
            var source = new Memory({
               idProperty: 'id',
               data: listModel._items
            });

            eip.saveOptions({
               listModel: listModel,
               source: source
            });

            eip.beginAdd().addCallback(function() {
               assert.instanceOf(eip._editingItem, Model);
               assert.equal(eip._editingItemData.index, 0);
               assert.isTrue(eip._isAdd);
               done();
            });
         });

         it('Object without item', function(done) {
            var source = new Memory({
               idProperty: 'id',
               data: items
            });
            eip._notify = function(e) {
               if (e === 'beforeBeginEdit') {
                  return {
                     addPosition: 'bottom'
                  };
               }
            };

            eip.saveOptions({
               listModel: listModel,
               source: source
            });

            eip.beginAdd().addCallback(function() {
               assert.instanceOf(eip._editingItem, Model);
               assert.isTrue(eip._isAdd);
               done();
            });
         });

         it('afterBeginEdit', function(done) {
            var source = new Memory({
               idProperty: 'id',
               data: items
            });

            eip.saveOptions({
               listModel: listModel,
               source: source
            });

            eip._notify = function(event, args) {
               if (event === 'afterBeginEdit') {
                  assert.equal(eip._editingItem, args[0]);
                  assert.isTrue(args[1]);
                  done();
               }
            };

            eip.beginAdd({
               item: newItem
            });
         });

         it('add item to a folder', function(done) {
            var source = new Memory({
               idProperty: 'id',
               data: treeModel._items
            });

            eip.saveOptions({
               listModel: treeModel,
               source: source
            });
            treeModel.setExpandedItems([1]);

            source.create().addCallback(function(model) {
               model.set('parent', 1);
               model.set('parent@', false);
               eip.beginAdd({
                  item: model
               }).addCallback(function() {
                  assert.instanceOf(eip._editingItem, Model);
                  assert.isTrue(eip._isAdd);
                  assert.equal(2, eip._editingItemData.level);
                  done();
               });
            });
         });
      });

      describe('commitEdit', function() {
         it('Without editing item', function() {
            eip.saveOptions({
               listModel: listModel
            });

            var result = eip.commitEdit();
            assert.isTrue(result.isSuccessful());
         });

         it('Without handler', function() {
            eip.saveOptions({
               listModel: listModel
            });

            eip.beginEdit({
               item: listModel.at(0).getContents()
            });
            eip._editingItem.set('title', '1234');
            var result = eip.commitEdit();
            assert.isTrue(result.isSuccessful());
            assert.equal(listModel.at(0).getContents().get('title'), '1234');
         });

         it('Cancel', function() {
            eip._notify = function(e) {
               if (e === 'beforeEndEdit') {
                  return EditConstants.CANCEL;
               }
            };

            eip.saveOptions({
               listModel: listModel
            });

            eip.beginEdit({
               item: listModel.at(0).getContents()
            });
            var result = eip.commitEdit();

            assert.isTrue(result.isSuccessful());
         });

         it('Deferred', function() {
            eip._notify = function(e) {
               if (e === 'beforeEndEdit') {
                  return Deferred.success();
               }
            };
            eip.saveOptions({
               listModel: listModel
            });

            eip.beginEdit({
               item: listModel.at(0).getContents()
            });
            var result = eip.commitEdit();
            assert.isTrue(result.isSuccessful());
         });

         it('With source', function(done) {
            var source = new Memory({
               idProperty: 'id',
               data: data
            });
            eip.saveOptions({
               listModel: listModel,
               source: source
            });

            eip.beginEdit({
               item: listModel.at(0).getContents()
            });
            eip._editingItem.set('title', '1234');
            eip.commitEdit().addCallback(function() {
               assert.equal(listModel.at(0).getContents().get('title'), '1234');
               source.read(1).addCallback(function(result) {
                  assert.equal(result.get('title'), '1234');
                  done();
               });
            });
         });

         it('Add item', function(done) {
            var source = new Memory({
               idProperty: 'id',
               data: data
            });
            eip.saveOptions({
               listModel: listModel,
               source: source
            });

            eip.beginAdd({
               item: newItem
            });

            eip._editingItem.set('title', '1234');
            eip.commitEdit().addCallback(function() {
               assert.equal(listModel.at(3).getContents().get('title'), '1234');
               assert.equal(listModel.getCount(), 4);
               source.read(4).addCallback(function(result) {
                  assert.equal(result.get('title'), '1234');
                  done();
               }).addErrback(function(err) {
                  console.log(err);
               });
            });
         });

         it('Validation fail', function() {
            eip.saveOptions({
               listModel: listModel
            });

            eip.beginAdd({
               item: newItem
            });
            eip._children = {
               formController: {
                  submit: function() {
                     return Deferred.success({
                        0: [{
                           0: 'Поле обязательно для заполнения'
                        }]
                     });
                  }
               }
            };
            var result = eip.commitEdit();
            assert.isTrue(result.isSuccessful());
         });

         describe('afterEndEdit', function() {
            it('add item', function(done) {
               var source = new Memory({
                  idProperty: 'id',
                  data: data
               });
               eip.saveOptions({
                  listModel: listModel,
                  source: source
               });

               eip.beginAdd({
                  item: newItem
               });

               eip._editingItem.set('title', '1234');

               eip._notify = function(event, args) {
                  if (event === 'afterEndEdit') {
                     assert.equal(eip._editingItem, args[0]);
                     assert.isTrue(args[1]);
                     done();
                  }
               };
               eip.commitEdit();
            });

            it('edit item', function(done) {
               var source = new Memory({
                  idProperty: 'id',
                  data: data
               });
               eip.saveOptions({
                  listModel: listModel,
                  source: source
               });

               eip.beginEdit({
                  item: listModel.at(0).getContents()
               });

               eip._editingItem.set('title', '1234');

               eip._notify = function(event, args) {
                  if (event === 'afterEndEdit') {
                     assert.equal(listModel.at(0).getContents(), args[0]);
                     assert.isNotOk(args[1]);
                     done();
                  }
               };
               eip.commitEdit();
            });
         });
      });

      describe('cancelEdit', function() {
         it('Without editing item', function() {
            eip.saveOptions({
               listModel: listModel
            });

            var result = eip.cancelEdit();
            assert.isTrue(result.isSuccessful());
         });

         it('With item', function() {
            eip.saveOptions({
               listModel: listModel
            });

            eip.beginEdit({
               item: listModel.at(0).getContents()
            });
            eip._editingItem.set('title', '1234');
            var result = eip.cancelEdit();
            assert.isTrue(result.isSuccessful());
            assert.equal(listModel.at(0).getContents().get('title'), 'Первый');
         });
      });

      describe('_onKeyDown', function() {
         it('Enter', function() {
            eip.beginEdit = function(options) {
               assert.equal(options.item, listModel.at(1).getContents());
            };
            eip.saveOptions({
               listModel: listModel
            });
            eip._editingItem = listModel.at(0).getContents();
            eip._setEditingItemData(listModel.at(0).getContents(), eip._options.listModel);
            eip._onKeyDown({
               nativeEvent: {
                  keyCode: 13
               }
            });
         });

         it('Enter on last item', function(done) {
            eip.commitEdit = function() {
               done();
            };
            eip.beginEdit = function() {
               throw new Error('beginEdit shouldn\'t be called');
            };
            eip.beginAdd = function() {
               throw new Error('beginAdd shouldn\'t be called');
            };
            eip.saveOptions({
               listModel: listModel
            });
            eip._editingItem = listModel.at(2).getContents();
            eip._setEditingItemData(listModel.at(2).getContents(), eip._options.listModel);
            eip._onKeyDown({
               nativeEvent: {
                  keyCode: 13
               }
            });
         });

         it('Enter on last item, autoAdd', function(done) {
            eip.beginAdd = function() {
               done();
            };
            eip.saveOptions({
               listModel: listModel,
               editingConfig: {
                  autoAdd: true
               }
            });
            eip._sequentialEditing = true;
            eip._editingItem = listModel.at(2).getContents();
            eip._setEditingItemData(listModel.at(2).getContents(), eip._options.listModel);
            eip._onKeyDown({
               nativeEvent: {
                  keyCode: 13
               }
            });
         });

         it('Enter, sequentialEditing: false', function(done) {
            eip.commitEdit = function() {
               done();
            };
            eip.beginEdit = function() {
               throw new Error('beginEdit shouldn\'t be called');
            };
            eip.beginAdd = function() {
               throw new Error('beginAdd shouldn\'t be called');
            };
            eip.saveOptions({
               listModel: listModel,
               editingConfig: {
                  sequentialEditing: false
               }
            });
            eip._editingItem = listModel.at(0).getContents();
            eip._setEditingItemData(listModel.at(0).getContents(), eip._options.listModel);
            eip._onKeyDown({
               nativeEvent: {
                  keyCode: 13
               }
            });
         });

         it('Esc', function(done) {
            eip.cancelEdit = function() {
               done();
            };
            eip.saveOptions({
               listModel: listModel,
               editingConfig: {
                  sequentialEditing: false
               }
            });
            eip._editingItem = listModel.at(0).getContents();
            eip._setEditingItemData(listModel.at(0).getContents(), eip._options.listModel);
            eip._onKeyDown({
               nativeEvent: {
                  keyCode: 27
               }
            });
         });

         it('Tab', function(done) {
            eip.beginEdit = function(options) {
               assert.equal(options.item, listModel.at(1).getContents());
               done();
            };
            eip.saveOptions({
               listModel: listModel
            });
            eip._editingItem = listModel.at(0).getContents();
            eip._setEditingItemData(listModel.at(0).getContents(), eip._options.listModel);
            eip._onRowDeactivated({
               stopPropagation: function() {

               }
            }, {
               isTabPressed: true
            });
         });

         it('Tab but next item is a group', function(done) {
            eip.beginEdit = function(options) {
               assert.equal(options.item, listModelWithGroups.at(4).getContents());
               done();
            };
            eip.saveOptions({
               listModel: listModelWithGroups
            });
            eip._editingItem = listModelWithGroups.at(2).getContents();
            eip._setEditingItemData(listModelWithGroups.at(2).getContents(), eip._options.listModel);
            eip._onRowDeactivated({
               stopPropagation: function() {

               }
            }, {
               isTabPressed: true
            });
         });

         it('Tab on last item', function(done) {
            eip.commitEdit = function() {
               done();
            };
            eip.beginEdit = function() {
               throw new Error('beginEdit shouldn\'t be called');
            };
            eip.beginAdd = function() {
               throw new Error('beginAdd shouldn\'t be called');
            };
            eip.saveOptions({
               listModel: listModel
            });
            eip._editingItem = listModel.at(2).getContents();
            eip._setEditingItemData(listModel.at(2).getContents(), eip._options.listModel);
            eip._onRowDeactivated({
               stopPropagation: function() {

               }
            }, {
               isTabPressed: true
            });
         });

         it('Tab on third to last item but next two items are groups', function(done) {
            eip.commitEdit = function() {
               done();
            };
            eip.beginEdit = function() {
               throw new Error('beginEdit shouldn\'t be called');
            };
            eip.beginAdd = function() {
               throw new Error('beginAdd shouldn\'t be called');
            };
            eip.beginEdit = function() {
               throw new Error('beginEdit shouldn\'t be called.');
            };
            eip.beginAdd = function() {
               throw new Error('beginAdd shouldn\'t be called.');
            };
            eip.saveOptions({
               listModel: listModelWithGroups
            });
            listModelWithGroups.toggleGroup('services');
            listModelWithGroups.toggleGroup('whatever');
            eip._editingItem = listModelWithGroups.at(2).getContents();
            eip._setEditingItemData(listModelWithGroups.at(2).getContents(), eip._options.listModel);
            eip._onRowDeactivated({
               stopPropagation: function() {

               }
            }, {
               isTabPressed: true
            });
         });

         it('Tab on last item, autoAdd', function(done) {
            eip.beginAdd = function() {
               done();
            };
            eip.saveOptions({
               listModel: listModel,
               editingConfig: {
                  autoAdd: true
               }
            });
            eip._editingItem = listModel.at(2).getContents();
            eip._setEditingItemData(listModel.at(2).getContents(), eip._options.listModel);
            eip._onRowDeactivated({
               stopPropagation: function() {

               }
            }, {
               isTabPressed: true
            });
         });

         it('Tab on third to last item but next two items are groups, autoAdd: true', function(done) {
            eip.commitEdit = function() {
               throw new Error('commitEdit shouldn\'t be called.');
            };
            eip.beginEdit = function() {
               throw new Error('beginEdit shouldn\'t be called.');
            };
            eip.beginAdd = function() {
               done();
            };
            eip.saveOptions({
               listModel: listModelWithGroups,
               editingConfig: {
                  autoAdd: true
               }
            });
            listModelWithGroups.toggleGroup('services');
            listModelWithGroups.toggleGroup('whatever');
            eip._editingItem = listModelWithGroups.at(2).getContents();
            eip._setEditingItemData(listModelWithGroups.at(2).getContents(), eip._options.listModel);
            eip._onRowDeactivated({
               stopPropagation: function() {

               }
            }, {
               isTabPressed: true
            });
         });

         it('Shift+Tab', function(done) {
            eip.beginEdit = function(options) {
               assert.equal(options.item, eip._options.listModel.at(0).getContents());
               done();
            };
            eip.saveOptions({
               listModel: listModel
            });
            eip._editingItem = listModel.at(1).getContents();
            eip._setEditingItemData(listModel.at(1).getContents(), eip._options.listModel);
            eip._onRowDeactivated({
               stopPropagation: function() {

               }
            }, {
               isTabPressed: true,
               isShiftKey: true
            });
         });

         it('Shift+Tab but previous item is a group', function(done) {
            eip.beginEdit = function(options) {
               assert.equal(options.item, listModelWithGroups.at(2).getContents());
               done();
            };
            eip.saveOptions({
               listModel: listModelWithGroups
            });
            eip._editingItem = listModelWithGroups.at(4).getContents();
            eip._setEditingItemData(listModelWithGroups.at(4).getContents(), eip._options.listModel);
            eip._onRowDeactivated({
               stopPropagation: function() {

               }
            }, {
               isTabPressed: true,
               isShiftKey: true
            });
         });

         it('Shift+Tab on first item', function(done) {
            eip.commitEdit = function() {
               done();
            };
            eip.beginEdit = function() {
               throw new Error('beginEdit shouldn\'t be called.');
            };
            eip.saveOptions({
               listModel: listModel
            });
            eip._editingItem = listModel.at(0).getContents();
            eip._setEditingItemData(listModel.at(0).getContents(), eip._options.listModel);
            eip._onRowDeactivated({
               stopPropagation: function() {

               }
            }, {
               isTabPressed: true,
               isShiftKey: true
            });
         });

         it('Shift+Tab on third item, but first two items are groups', function(done) {
            eip.commitEdit = function() {
               done();
            };
            eip.beginEdit = function() {
               throw new Error('beginEdit shouldn\'t be called.');
            };
            eip.saveOptions({
               listModel: listModelWithGroups
            });
            listModelWithGroups.toggleGroup('goods');
            eip._editingItem = listModelWithGroups.at(2).getContents();
            eip._setEditingItemData(listModelWithGroups.at(2).getContents(), eip._options.listModel);
            eip._onRowDeactivated({
               stopPropagation: function() {

               }
            }, {
               isTabPressed: true,
               isShiftKey: true
            });
         });

         describe('Tree', function() {
            it('Enter inside a folder', function() {
               eip.beginEdit = function(options) {
                  assert.equal(options.item, treeModel.at(2).getContents());
               };
               eip.saveOptions({
                  listModel: treeModel
               });
               treeModel.setExpandedItems([1]);
               eip._editingItem = treeModel.at(1).getContents();
               eip._setEditingItemData(treeModel.at(1).getContents(), eip._options.listModel);
               eip._onKeyDown({
                  nativeEvent: {
                     keyCode: 13
                  }
               });
            });

            it('Enter inside a second folder', function() {
               eip.beginEdit = function(options) {
                  assert.equal(options.item, treeModel.at(6).getContents());
               };
               eip.commitEdit = function() {
                  throw new Error('commitEdit shouldn\'t be called.');
               };
               eip.saveOptions({
                  listModel: treeModel
               });
               treeModel.setExpandedItems([1, 2]);
               eip._editingItem = treeModel.at(5).getContents();
               eip._setEditingItemData(treeModel.at(5).getContents(), eip._options.listModel);
               eip._onKeyDown({
                  nativeEvent: {
                     keyCode: 13
                  }
               });
            });

            it('Enter on last item inside a folder', function(done) {
               eip.commitEdit = function() {
                  done();
               };
               eip.beginEdit = function() {
                  throw new Error('beginEdit shouldn\'t be called');
               };
               eip.beginAdd = function() {
                  throw new Error('beginAdd shouldn\'t be called');
               };
               eip.saveOptions({
                  listModel: treeModel
               });
               treeModel.setExpandedItems([1]);
               eip._editingItem = treeModel.at(3).getContents();
               eip._setEditingItemData(treeModel.at(3).getContents(), eip._options.listModel);
               eip._onKeyDown({
                  nativeEvent: {
                     keyCode: 13
                  }
               });
            });

            it('Enter on last item inside a folder, autoAdd', function(done) {
               eip.beginAdd = function() {
                  done();
               };
               eip.saveOptions({
                  listModel: treeModel,
                  editingConfig: {
                     autoAdd: true
                  }
               });
               treeModel.setExpandedItems([1]);
               eip._sequentialEditing = true;
               eip._editingItem = treeModel.at(3).getContents();
               eip._setEditingItemData(treeModel.at(3).getContents(), eip._options.listModel);
               eip._onKeyDown({
                  nativeEvent: {
                     keyCode: 13
                  }
               });
            });

            it('Enter inside a folder, sequentialEditing: false', function(done) {
               eip.commitEdit = function() {
                  done();
               };
               eip.beginEdit = function() {
                  throw new Error('beginEdit shouldn\'t be called');
               };
               eip.beginAdd = function() {
                  throw new Error('beginAdd shouldn\'t be called');
               };
               eip.saveOptions({
                  listModel: treeModel,
                  editingConfig: {
                     sequentialEditing: false
                  }
               });
               treeModel.setExpandedItems([1]);
               eip._editingItem = treeModel.at(1).getContents();
               eip._setEditingItemData(treeModel.at(1).getContents(), eip._options.listModel);
               eip._onKeyDown({
                  nativeEvent: {
                     keyCode: 13
                  }
               });
            });

            it('Tab inside a folder', function(done) {
               eip.beginEdit = function(options) {
                  assert.equal(options.item, treeModel.at(2).getContents());
                  done();
               };
               eip.saveOptions({
                  listModel: treeModel
               });
               treeModel.setExpandedItems([1]);
               eip._editingItem = treeModel.at(1).getContents();
               eip._setEditingItemData(treeModel.at(1).getContents(), eip._options.listModel);
               eip._onRowDeactivated({
                  stopPropagation: function() {

                  }
               }, {
                  isTabPressed: true
               });
            });

            it('Tab on last item inside a folder', function(done) {
               eip.commitEdit = function() {
                  done();
               };
               eip.beginEdit = function() {
                  throw new Error('beginEdit shouldn\'t be called');
               };
               eip.beginAdd = function() {
                  throw new Error('beginAdd shouldn\'t be called');
               };
               eip.saveOptions({
                  listModel: treeModel
               });
               treeModel.setExpandedItems([1]);
               eip._editingItem = treeModel.at(3).getContents();
               eip._setEditingItemData(treeModel.at(3).getContents(), eip._options.listModel);
               eip._onRowDeactivated({
                  stopPropagation: function() {

                  }
               }, {
                  isTabPressed: true
               });
            });

            it('Tab on last item inside a folder, autoAdd', function(done) {
               eip.beginAdd = function() {
                  done();
               };
               eip.saveOptions({
                  listModel: treeModel,
                  editingConfig: {
                     autoAdd: true
                  }
               });
               treeModel.setExpandedItems([1]);
               eip._editingItem = treeModel.at(3).getContents();
               eip._setEditingItemData(treeModel.at(3).getContents(), eip._options.listModel);
               eip._onRowDeactivated({
                  stopPropagation: function() {

                  }
               }, {
                  isTabPressed: true
               });
            });

            it('Shift+Tab inside a folder', function(done) {
               eip.beginEdit = function(options) {
                  assert.equal(options.item, eip._options.listModel.at(1).getContents());
                  done();
               };
               eip.saveOptions({
                  listModel: treeModel
               });
               treeModel.setExpandedItems([1]);
               eip._editingItem = treeModel.at(2).getContents();
               eip._setEditingItemData(treeModel.at(2).getContents(), eip._options.listModel);
               eip._onRowDeactivated({
                  stopPropagation: function() {

                  }
               }, {
                  isTabPressed: true,
                  isShiftKey: true
               });
            });
         });
      });

      describe('_onItemClick', function() {
         it('clickItemInfo', function() {
            eip.beginEdit = function() {};
            eip.saveOptions({
               editingConfig: {
                  editOnClick: true
               }
            });
            eip._onItemClick({}, newItem, {
               target: {
                  closest: function() {
                     return false;
                  }
               },
               nativeEvent: {
                  clientX: 10,
                  clientY: 20
               }
            });
            assert.equal(eip._clickItemInfo.item, newItem);
            assert.equal(eip._clickItemInfo.clientX, 10);
            assert.equal(eip._clickItemInfo.clientY, 20);
         });

         it('editOnClick: true, notEditable element', function(done) {
            eip.commitEdit = function() {
               done();
            };
            eip.saveOptions({
               editingConfig: {
                  editOnClick: true
               }
            });

            eip._onItemClick({}, newItem, {
               target: {
                  closest: function() {
                     return true;
                  }
               },
               nativeEvent: {
                  clientX: 0,
                  clientY: 0
               }
            });
         });

         it('editOnClick: true', function(done) {
            eip.beginEdit = function(options) {
               assert.equal(options.item, newItem);
               done();
            };
            eip.saveOptions({
               editingConfig: {
                  editOnClick: true
               }
            });

            eip._onItemClick({}, newItem, {
               target: {
                  closest: function() {
                     return false;
                  }
               },
               nativeEvent: {
                  clientX: 0,
                  clientY: 0
               }
            });
         });

         it('editOnClick: false', function() {
            eip.beginEdit = function() {
               throw new Error('beginEdit shouldn\'t be called if editOnClick is false');
            };
            eip._onItemClick({}, newItem);
         });

         it('readOnly, commitEdit', function() {
            eip.commitEdit = function() {
               throw new Error('commitEdit shouldn\'t be called if EditInPlace is readOnly');
            };
            eip.saveOptions({
               editingConfig: {
                  editOnClick: true
               },
               readOnly: true
            });

            eip._onItemClick({}, newItem, {
               target: {
                  closest: function() {
                     return true;
                  }
               },
               nativeEvent: {
                  clientX: 0,
                  clientY: 0
               }
            });
         });

         it('readOnly, beginEdit', function() {
            eip.beginEdit = function() {
               throw new Error('beginEdit shouldn\'t be called if EditInPlace is readOnly');
            };
            eip.saveOptions({
               editingConfig: {
                  editOnClick: true
               },
               readOnly: true
            });

            eip._onItemClick({}, newItem, {
               target: {
                  closest: function() {
                     return false;
                  }
               },
               nativeEvent: {
                  clientX: 0,
                  clientY: 0
               }
            });
         });
      });

      describe('_beforeUpdate', function() {
         it('editingConfig has sequential editing', function() {
            eip._beforeUpdate({
               editingConfig: {
                  sequentialEditing: false
               }
            });
            assert.isFalse(eip._sequentialEditing);
            eip._beforeUpdate({
               editingConfig: {
                  sequentialEditing: true
               }
            });
            assert.isTrue(eip._sequentialEditing);
         });

         it('editingConfig doesn\'t have sequential editing', function() {
            eip._beforeUpdate({
               editingConfig: {

               }
            });
            assert.isTrue(eip._sequentialEditing);
         });

         it('editing config doesn\'t exist', function() {
            eip._beforeUpdate({});
            assert.isTrue(eip._sequentialEditing);
         });
      });
   });
});
