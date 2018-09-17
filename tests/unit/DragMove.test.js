/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'SBIS3.CONTROLS/ListView/resources/DragMove/DragMove',
   'SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/List',
   'SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragObject',
   'SBIS3.CONTROLS/ListView',
   'WS.Data/Collection/RecordSet',
   'Core/core-instance',
   'WS.Data/Display/Tree',
   'Core/Deferred'
], function (DragMove, DragList, DragObject, ListView, RecordSet, cInstance, Tree, Deferred) {
   'use strict';
   describe('DragMove', function () {
      var list, element, view, dragMove, event, items;
      beforeEach(function () {
         if (typeof $ === 'undefined') {
            this.skip();
            return;
         }
         list = new DragList({});
         element = $(
            '<div class="view">' +
            '</div>'
         );
         items = new RecordSet({
            rawData: [
               {id: 1, parent: null, isnode: true},
               {id: 2, parent: 1, isnode: null},
               {id: 3, parent:null, isnode: null},
               {id: 4, parent:null, isnode: null}
            ],
            idProperty: 'id'
         });
         view = new ListView({
            element: element,
            items: items,
            multiselect: true,
            displayProperty: 'id',
            idProperty: 'id'
         });
         dragMove = view._getDragMove(true);
         event = {
            type: "mouseUp",
            target: view.getContainer().find('[data-id=1]'),
            pageX: 0,
            pageY: 0
         };
         DragObject._jsEvent = event;
         DragObject._targetsControl = view;
         DragObject.setOwner(view);
      });
      afterEach(function () {
         DragObject.reset();
      });
      describe('._checkHorisontalDragndrop', function () {
         it('should return true if target has display inline-block', function () {
            var target = $('<div style="display:inline-block; float:none">');
            assert.isTrue(DragMove.prototype._checkHorisontalDragndrop(target));
         });
         it('should return true if target is a float', function () {
            var target = $('<div style="float:left">');
            assert.isTrue(DragMove.prototype._checkHorisontalDragndrop(target));
         });
         it('should return true if parent targets has display flex', function () {
            var target = $('<div style="float:none">');
            parent = $('<div style="display: flex; flex-direction: row">');
            parent.html(target);
            assert.isTrue(DragMove.prototype._checkHorisontalDragndrop(target));
         });
         it('should return flase if target has display block', function () {
            var target = $('<div style="float:none; display: block">');
            assert.isFalse(DragMove.prototype._checkHorisontalDragndrop(target));
         });
         it('should return false if parent targets has display flex and flex-direction column', function () {
            var target = $('<div style="float:none">');
            parent = $('<div style="display: flex; flex-direction: column">');
            parent.html(target);
            assert.isFalse(DragMove.prototype._checkHorisontalDragndrop(target));
         });
      });
      describe('._isCorrectSource', function () {
         it('should return true when source is list', function () {
            var list = new DragList({});
            assert.isTrue(DragMove.prototype._isCorrectSource(list));
         });
         it('should return false when source is array', function () {
            assert.isFalse(DragMove.prototype._isCorrectSource([]));
         });
         it('should check source after begin drag', function () {
            dragMove.beginDrag();
            assert.isTrue(dragMove._isCorrectSource(DragObject.getSource()));
         });
      });
      describe('_getItemsProjection', function () {
         it('should return projection', function () {
            assert.equal(dragMove._getItemsProjection(), view._getItemsProjection());
         })
      });
      describe('setItemsProjection', function () {
         it('should set projection', function () {
            var projection = [];
            dragMove.setItemsProjection(projection);
            assert.equal(dragMove._getItemsProjection(), projection);
         })
      });
      describe('.beginDrag', function () {
         it('should not begin drag', function () {
            var dragMove = new DragMove({
                  view: new ListView({})
               });
            DragObject._jsEvent = {
               type: "mouseUp",
               target: $('<div/>'),
               pageX: 0,
               pageY: 0
            };
            assert.isFalse(dragMove.beginDrag());
         });
         it('should begin drag', function () {
            assert.isTrue(dragMove.beginDrag());
         });
         it('should set source 1 element', function () {
            dragMove.beginDrag();
            assert.equal(DragObject.getSource().getCount(), 1);
            var item = DragObject.getSource().at(0);
            assert.equal(item.getModel().getId(), 1);
            assert.equal(item.getDomElement()[0], DragObject._jsEvent.target[0]);
         });
         it('should set source 2 element', function () {
            view.setSelectedKeys([1,2]);
            dragMove.beginDrag();
            assert.equal(DragObject.getSource().getCount(), 2);
            assert.include([1, 2], DragObject.getSource().at(0).getModel().getId());
            assert.include([1, 2], DragObject.getSource().at(1).getModel().getId());
         });
         it('should create drag list', function () {
            dragMove.beginDrag();
            assert.isTrue(cInstance.instanceOfModule(DragObject.getSource(), 'SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/List'));
         });
         it('should be return the view from source owner', function () {
            view.setSelectedKeys([1,2]);
            dragMove.beginDrag();
            assert.equal(DragObject.getSource().at(0).getOwner(), view);
         });
         it('should set sourse dom elemet if listview has a editinplace', function () {
            var eip = $('<div class="controls-editInPlace controls-ListView__item js-controls-ListView__item"></div>');
            eip.data('hash', view._getItemsProjection().at(0).getHash());
            view.getContainer().find('[data-id=1]').after(eip);
            dragMove.beginDrag();
            assert.isFalse(DragObject.getSource().at(0).getDomElement().hasClass('controls-editInPlace'));
         });
      });
      describe('._getDragTarget', function () {
         it('should return drag target', function () {
            var target = dragMove._getDragTarget();
            assert.equal(target.item.getContents().getId(), 1);
            assert.equal(target.domElement.html(), 1);
         });
         it('should not return drag target when horisontal dragndrop', function () {
            event.target = $('<div/>');
            var target = dragMove._getDragTarget();
            assert.isTrue(!target.item);
         })
      });
      describe('.updateTarget', function () {
         beforeEach(function () {
            if (dragMove) {
               dragMove.beginDrag();
               dragMove._horisontalDragNDrop = false;
            }
         });
         it('should set target', function () {
            dragMove.updateTarget();
            var target = DragObject.getTarget();
            assert.isTrue(cInstance.instanceOfModule(target, 'SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/Row'));
            assert.equal(target.getModel().getId(), 1);
         });
         it('should not set target', function () {
            event.target = view.getContainer().find('[data-id=2]');
            dragMove._getDirectionOrderChange = function () {
               return 'before';
            };
            dragMove.updateTarget();
            assert.isUndefined(DragObject.getTarget());
         });
         it('should not set target when item outside', function () {
            event.target = $('body');
            dragMove.updateTarget();
            assert.isUndefined(DragObject.getTarget());
         });
         it('should not throw error when source is array', function () {
            DragObject.setSource([{mr:'trololo'}]);
            assert.doesNotThrow(function () {
               dragMove.updateTarget();
            });
         });
         it('should not throw error when source is undefined', function () {
            DragObject.setSource(undefined);
            assert.doesNotThrow(function () {
               dragMove.updateTarget();
            });
         });
         it('should be return the view from targets owner', function () {
            dragMove.updateTarget();
            var target = DragObject.getTarget();
            assert.equal(target.getOwner(), view);
         });
         it('should clear target if view cant found target and old targets owner this view', function () {
            dragMove.updateTarget();
            event.target = $('<div/>');
            dragMove.updateTarget();
            assert.isUndefined(DragObject.getTarget());
         });
         it('should not clear target if target is placeholder', function () {
            dragMove._options.useDragPlaceHolder = true;
            dragMove.updateTarget();
            var dTarget = DragObject.getTarget();
            event.target = $(event.target).clone().addClass('controls-DragNDrop__placeholder');
            dragMove.updateTarget();
            assert.equal(dTarget, DragObject.getTarget());
         });
      });
      describe('._canDragMove', function () {
         it('should return true', function () {
            dragMove.beginDrag();
            dragMove.updateTarget();
            assert.isTrue(dragMove._canDragMove());
         });
         it('should return false when source is not correct', function () {
            dragMove.beginDrag();
            dragMove.updateTarget();
            DragObject.setSource([]);
            assert.isFalse(dragMove._canDragMove());
         });
         it('should return false when targets control is not equal source', function () {
            dragMove.beginDrag();
            dragMove.updateTarget();
            DragObject._targetsControl = {};
            assert.isFalse(dragMove._canDragMove());
         });
         it('should return false when source list is empty', function () {
            dragMove.beginDrag();
            dragMove.updateTarget();
            DragObject.setSource(new DragList({}));
            assert.isFalse(dragMove._canDragMove());
         });
         it('should return false when source not exist Row', function () {
            dragMove.beginDrag();
            dragMove.updateTarget();
            DragObject.setSource(new DragList({
               items: [{mr:'Trololo'}]
            }));
            assert.isFalse(dragMove._canDragMove());
         });
         it('should addclass when it use placehoder', function () {
            view.getContainer().find('[data-id=1]').css('display', 'inline-block');
            dragMove.beginDrag();
            assert.isTrue(dragMove._horisontalDragNDrop);
         });
         context('move to another control', function () {
            var ownerElement, ownerItems, owner;
            beforeEach(function () {
               if (dragMove) {
                  ownerElement = $(
                     '<div class="view">' +
                     '</div>'
                  );
                  ownerItems = new RecordSet({
                     rawData: [
                        {id: 1, parent: null, isnode: true},
                        {id: 2, parent: 1, isnode: null},
                        {id: 3, parent: null, isnode: null},
                        {id: 4, parent: null, isnode: null}
                     ],
                     idProperty: 'id'
                  });
                  owner = new ListView({
                     element: ownerElement,
                     items: ownerItems,
                     multiselect: true,
                     displayProperty: 'id',
                     idProperty: 'id'
                  });
                  event = {
                     type: "mouseUp",
                     target: owner.getContainer().find('[data-id=1]'),
                     pageX: 0,
                     pageY: 0
                  };
                  DragObject._jsEvent = event;
                  DragObject._targetsControl = view;
                  owner._getDragMove(true).beginDrag();
                  DragObject.setOwner(owner);
                  event.target = view.getContainer().find('[data-id=3]');
                  dragMove.updateTarget();
               }
            });
            it('should return true wnen contracts is equals', function () {
               var getDataSource = function () {
                  return {
                     getEndpoint: function () {
                        return {'contract': '1'};
                     }
                  }
               };
               owner.getDataSource = getDataSource;
               view.getDataSource = getDataSource;
               assert.isTrue(dragMove._canDragMove());
            });
            it('should return false wnen contracts is equals', function () {
               owner.getDataSource = function () {
                  return {
                     getEndpoint: function () {
                        return {'contract': '1'};
                     }
                  }
               };
               view.getDataSource = function () {
                  return {
                     getEndpoint: function () {
                        return {'contract': '2'};
                     }
                  }
               };
               assert.isFalse(dragMove._canDragMove());
            });
            it('should not raise error when lists hasnt data sourse ', function () {
               owner.getDataSource = function () {
                  return undefined
               };
               view.getDataSource = function () {
                  return undefined
               };
               assert.doesNotThrow(function() {
                  dragMove._canDragMove();
               });
            });
            it('should not raise error when data sourse have no edpoint', function () {
               owner.getDataSource = function () {
                  return {}
               };
               view.getDataSource = function () {
                  return {}
               };
               assert.doesNotThrow(function() {
                  dragMove._canDragMove();
               });
            });
         });
      });
      describe('._findItemByElement', function () {
         it('should return item', function () {
            var item = dragMove._findItemByElement(view.getContainer().find('[data-id=1]'));
            assert.equal(item.data('id'), 1);
         });
         it('should return item when target inside item', function () {
            var target = $('<div/>');
            view.getContainer().find('[data-id=1]').html(target);
            var item = dragMove._findItemByElement(target);
            assert.equal(item.data('id'), 1);
         });
         it('should not return item if target ', function () {
            var item = dragMove._findItemByElement($('<div/>'));
            assert.equal(item.length, 0);
         });
         it('should return item if target inside listview item inside another listview item ', function () {
            var target = $('<div/>'),
               anotherItem = $('<div class="js-controls-ListView__item" data-id="1555" data-hash="55582"></div>').html(target),
               item = view.getContainer().find('[data-id=1]').html(anotherItem);
            assert.equal(item.data('id'), 1);
         });
      });
      describe('.getContainer', function () {
         it('should return container', function () {
            assert.equal(dragMove.getContainer(), view.getContainer());
         });
      });
      describe('.drag', function () {
         it('should add hilight', function () {
            dragMove.beginDrag();
            dragMove.updateTarget();
            dragMove.drag();
            assert.isTrue(DragObject.getTarget().getDomElement().hasClass('controls-DragNDrop__insertAfter'));
         });
      });
      describe('.endDrag', function () {
         it('should call move', function (done) {
            dragMove.beginDrag();
            event.target = view.getContainer().find('[data-id=3]');
            dragMove.updateTarget();
            view.move = function (moved, target) {
               assert.equal(moved[0].getId(), 1);
               assert.equal(target.getId(), 3);
               done();
            };
            dragMove.endDrag();
         });
         it('should move outside', function (done) {
            dragMove.beginDrag();
            event.target = view.getContainer().find('[data-id=3]');
            dragMove.updateTarget();
            var view1 = new ListView({
               element: element,
               items: new RecordSet({
                  rawData: [{id: 1}, {id: 2}, {id: 3}, {id: 4}],
                  idProperty: 'id'
               }),
               multiselect: true,
               displayProperty: 'id',
               idProperty: 'id'
            });
            DragObject.setOwner(view1);
            view._getMover().moveFromOutside = function (dragSource, target, ownerItems, move) {
               assert.equal(DragObject.getSource(), dragSource);
               assert.equal(DragObject.getTarget(), target);
               assert.equal(view1.getItems(), ownerItems);
               assert.equal(move, false);
               done();
            };
            dragMove.endDrag();
         });
         it('should not throw error when source is array', function () {
            dragMove.beginDrag();
            event.target = view.getContainer().find('[data-id=3]');
            dragMove.updateTarget();
            DragObject.setSource([{mr:'trololo'}]);
            DragObject.setOwner({});
            assert.doesNotThrow(function () {
               dragMove.endDrag();
            });
         });
         it('should reset selections from the items', function () {
            dragMove.beginDrag();
            event.target = view.getContainer().find('[data-id=3]');
            dragMove.updateTarget();
            var view1 = new ListView({
               element: element,
               items: new RecordSet({
                  rawData: [{id: 1}, {id: 2}, {id: 3}, {id: 4}],
                  idProperty: 'id'
               }),
               multiselect: true,
               displayProperty: 'id',
               idProperty: 'id'
            });
            view1.setSelectedKeys([1,2]);
            DragObject.setOwner(view1);
            view._getMover().moveFromOutside = function (dragSource, target, ownerItems, move) {
               return Deferred.success(true);
            };
            dragMove.endDrag();
            assert.equal(view1.getSelectedKeys().length, 0);
         });
      });
      describe('.createAvatar', function () {
         it('should create avatar', function () {
            dragMove.beginDrag();
            assert.isTrue(dragMove.createAvatar().length > 0);
         });
         it('should set counter in avatar', function () {
            view.setSelectedKeys([1,2]);
            dragMove.beginDrag();
            assert.equal(dragMove.createAvatar().find('.controls-DragNDrop__draggedCount').html(), 2);
         });
      });
      describe('.setItemsDragNDrop', function () {
         it('should set itemsDragnDrop', function () {
            dragMove.setItemsDragNDrop('allow');
            assert.equal(dragMove.getItemsDragNDrop(), 'allow');
         });
      });
      describe('.getItemsDragNDrop', function () {
         it('should return itemsDragnDrop', function () {
            new DragMove({
               itemsDragNDrop: 'allow'
            });
            assert.equal(dragMove.getItemsDragNDrop(), 'allow');
         });
      });
      describe('._drawDragHighlight', function () {
         var dragTarget;
         beforeEach(function () {
            if (dragMove) {
               dragMove.beginDrag();
               dragMove.updateTarget();
               dragTarget = DragObject.getTarget();
            }
         });
         it('should add class insertBefore', function () {
            dragTarget.setPosition('before');
            dragMove._drawDragHighlight(dragTarget);
            assert.isTrue(dragTarget.getDomElement().hasClass('controls-DragNDrop__insertBefore'));
         });
         it('should add class insertAfter', function () {
            dragTarget.setPosition('after');
            dragMove._drawDragHighlight(dragTarget);
            assert.isTrue(dragTarget.getDomElement().hasClass('controls-DragNDrop__insertAfter'));
         });
         it('should not add any class', function () {
            dragTarget.setPosition('before');
            dragMove._options.useDragPlaceHolder;
            dragMove._drawDragHighlight(dragTarget);
            assert.isFalse(dragTarget.getDomElement().hasClass('controls-DragNDrop__insertAfter'));
            assert.isFalse(dragTarget.getDomElement().hasClass('controls-DragNDrop__insertAfter'));
         });
      });
      describe('._makeDragplaceHolder', function () {
         beforeEach(function () {
            if (dragMove) {
               dragMove.beginDrag();
               dragMove._options.useDragPlaceHolder = true;
            }
         });
         it('should make placeholder', function () {
            dragMove._makeDragPlaceHolder();
            assert.equal(view.getContainer().find('.controls-DragNDrop__placeholder').length, 1);
         });
         it('should clear data tags', function () {
            dragMove._makeDragPlaceHolder();
            assert.isUndefined(dragMove._dragPlaceHolder.data('id'));
            assert.isUndefined(dragMove._dragPlaceHolder.data('hash'));
         });
      });
      describe('DragPositioner', function () {
         var dragPositioner, domElement, targetLeaf, targetNode;
         beforeEach(function () {
            if (dragMove) {
               var tree = new Tree({
                  collection: items,
                  idProperty: 'id',
                  parentProperty: 'parent',
                  nodeProperty: 'isnode',
                  root: {
                     id: null,
                     title: 'Root'
                  }
               });
               dragMove._options.nodeProperty = 'isnode';
               dragMove.setItemsProjection(tree);
               var row = dragMove._makeDragEntity({
                  owner: view,
                  model: tree.at(3).getContents(),
                  projectionItem: tree.at(3)
               });
               DragObject.setSource(
                  dragMove._makeDragEntityList({
                     items: [row]
                  })
               );
               dragMove._horisontalDragNDrop = false;

               dragPositioner = dragMove._getDragPositioner();
               domElement = {
                  offset: function () {
                     return {left: 0, top: 0};
                  },
                  width: function () {
                     return 50;
                  },
                  height: function () {
                     return 100;
                  }
               };
               targetLeaf = tree.at(1);
               targetNode = dragMove._getItemsProjection().at(0);
            }
         });
         context('flat list', function () {
            beforeEach(function () {
               if (dragMove) {
                  dragPositioner._isTree = false;
               }
            });
            it('should return before', function () {
               assert.equal(dragPositioner.get(domElement), 'before');
            });
            it('should return after', function () {
               event.pageY = 51;
               assert.equal(dragPositioner.get(domElement), 'after');
            });
            it('should return before for horizontal', function () {
               dragPositioner._horisontalDragNDrop = true;
               dragPositioner._isTree = false;
               assert.equal(dragPositioner.get(domElement), 'before');
            });
            it('should return after for horizonta', function () {
               dragPositioner._horisontalDragNDrop = true;
               dragPositioner._isTree = false;
               event.pageX = 26;
               assert.equal(dragPositioner.get(domElement), 'after');
            });
            it('should save source items', function () {
               dragMove.setItemsProjection(view._getItemsProjection());
               dragMove._dragPositioner = null;
               assert.equal(dragPositioner._sourseItems.length, 1);
            });
         });
         context('tree', function () {
            it('should return before', function () {
               assert.equal(dragPositioner.get(domElement), 'before');
            });
            it('should return on', function () {
               event.pageY = 51;
               assert.equal(dragPositioner.get(domElement), 'on');
            });
            it('should return after', function () {
               event.pageY = 91;
               assert.equal(dragPositioner.get(domElement), 'after');
            });
            it('should return before for horizontal list', function () {
               dragPositioner._horisontalDragNDrop = true;
               assert.equal(dragPositioner.get(domElement), 'before');
            });
            it('should return on for horizontal list', function () {
               dragPositioner._horisontalDragNDrop = true;
               event.pageX = 26;
               assert.equal(dragPositioner.get(domElement), 'on');
            });
            it('should return after for horizontal list', function () {
               dragPositioner._horisontalDragNDrop = true;
               event.pageX = 46;
               assert.equal(dragPositioner.get(domElement), 'after');
            });
            it('should return on when the itemsdragndrop onlychangeparent', function () {
               dragPositioner._itemsDragNDrop = 'onlyChangeParent';
               event.pageX = 26;
               assert.equal(dragPositioner.get(domElement), 'on');
            });
            it('should return on when the itemsdragndrop separateParent and target is folder', function () {
               dragPositioner._itemsDragNDrop = 'separateParent';
               event.pageY = 26;
               assert.equal(dragPositioner.get(domElement, targetNode), 'on');
            });
            it('should return on when the itemsdragndrop separateParent and target is targetLeaf', function () {
               dragPositioner._itemsDragNDrop = 'separateParent';
               event.pageY = 26;
               assert.equal(dragPositioner.get(domElement, targetLeaf), 'before');
            });
            it('should save source items', function () {
               assert.equal(dragPositioner._sourseItems.length, 1);
            });
            it('should not throw error when source is an array', function () {
               DragObject.setSource([{mr:'trololo'}]);
               dragMove._dragPositioner = null;
               assert.doesNotThrow(function(){
                  dragMove._getDragPositioner();
               });
            })
         });
      });
   });
});