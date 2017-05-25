define('js!SBIS3.CONTROLS.ListView.Drag', [
   'Core/Abstract',
   'js!SBIS3.CONTROLS.DragObject',
   'Core/core-instance'
], function (Abstract, DragObject, cInstance) {
   var  DRAG_META_INSERT = {
      on: 'on',
      after: 'after',
      before: 'before'
   };
   var ListViewDrag = Abstract.extend({
      _$itemsDragNDrop: false,
      _$listView: null,
      _$mover: null,
      _$projection: null,
      _mouse: {
         target: null,
         x: 0,
         iter: 0,
         level: 0
      },
      onDrag: function (e) {
         if (this._canDragMove(DragObject)) {
            var
               target = DragObject.getTarget(),
               targetsModel = target.getModel(),
               source = DragObject.getSource(),
               sourceModels = [];
            this._hideDragHilight(DragObject);
            if (targetsModel) {
               source.each(function (item) {
                  sourceModels.push(item.getModel());
               });
               //this._drawDragHighlight(target);
               var placeholder = this._getDragPlaceHolder();
               if (target.getPosition() !== 'on') {
                  placeholder.show();
                  var item = this._$projection.getItemBySourceItem(targetsModel);
                  if (target.getPosition() == 'before') {
                     placeholder.insertBefore(target.getDomElement());
                  } else {
                     placeholder.insertAfter(target.getDomElement());
                  }
                  var level = item.getLevel()+this._mouse.level;
                  if (item.isNode() && item.isExpanded() && target.getPosition() == 'after') {
                     level += 1;
                  }
                  var offset = 22*(level-1)+8;
                  placeholder.find('.controls-DataGridView__firstContentCell ').css('padding-left', offset+'px')
               } else {
                  placeholder.hide();
                  target.getDomElement().addClass('controls-DragNDrop__hierarchy_move');
               }
            }
         }
      },
      beginDrag: function (e, target) {
         if (target.length) {
            if (target.hasClass('controls-DragNDropMixin__notDraggable')) {
               return false;
            }
            var  selectedItems = this._$listView.getSelectedItems(),
               targetsItem = this._$projection.getByHash(target.data('hash')).getContents(),
               items = this._getDragItems(targetsItem, selectedItems),
               source = [];
            items.forEach(function (item) {
               var projItem = this._$projection.getItemBySourceItem(item),
                  domElement = $('.js-controls-ListView__item[data-hash="'+projItem.getHash()+'"]');
               source.push(this._$listView._makeDragEntity({
                  owner: this,
                  model: item,
                  domElement: domElement
               }));
            }.bind(this));

            DragObject.setSource(
               this._$listView._makeDragEntityList({
                  items: source
               })
            );
            this._getDragPlaceHolder();
            if (this._checkHorisontalDragndrop(target)) {
               this._horisontalDragNDrop = true;
            } else {
               this._horisontalDragNDrop = false;
            }
            this._toggleDragItems(false);
            return true;
         }
         return false;
      },
      updateDragTarget: function (e, domElement) {
         var model = this._getDragTarget(domElement, e),
            target;
         if (model) {
            var position = this._getDirectionOrderChange(e, domElement) || DRAG_META_INSERT.on;
            if (!domElement.hasClass('controls-DragNDrop__placeholder')) {
               var   sourceIds = [],
                  movedItems = [];
               DragObject.getSource().each(function (item) {
                  sourceIds.push(item.getModel().getId());
                  movedItems.push(item.getModel());
               });
               var projItem = this._$projection.getItemBySourceItem(model);
               if (this._$mover._checkRecordsForMove(movedItems, model, position != 'on')) {
                  target = this._$listView._makeDragEntity({
                     owner: this,
                     domElement: domElement,
                     model: model,
                     position: position
                  });
                  DragObject.setTarget(target);
               } else if (position == 'on' && !projItem.isNode()) {
                  if (this._horisontalDragNDrop) {
                     position = (e.offsetY > domElement.height()/2) ? 'before' : 'after';
                  } else {
                     position = (e.offsetx > domElement.width()/2) ? 'before' : 'after';
                  }
                  target = this._$listView._makeDragEntity({
                     owner: this,
                     domElement: domElement,
                     model: model,
                     position: position
                  });
                  DragObject.setTarget(target);
               }
            }
         } else {
            DragObject.setTarget(undefined);
         }
      },
      endDrag: function(droppable, e) {
         this._toggleDragItems(true);
         this._dragPlaceHolder.remove();
         this._dragPlaceHolder = null;
         if (droppable) {
            var
               target = DragObject.getTarget(),
               models = [],
               dropBySelf = false,
               source = DragObject.getSource();

            if (target && source) {
               var  targetsModel = target.getModel();
               source.each(function(item) {
                  var model = item.getModel();
                  models.push(model);
                  if (targetsModel == model) {
                     dropBySelf = true;
                  }
               });
               if (dropBySelf) {//TODO придрот для того, чтобы если перетащить элемент сам на себя не отработал его обработчик клика
                  var clickHandler = this._elemClickHandler;
                  this._elemClickHandler = function () {
                     this._elemClickHandler = clickHandler;
                  };
               }
               if (DragObject.getOwner() === this._$listView) {
                  var position = target.getPosition();
                  this._$listView.move(models, target.getModel(), position).addCallback(function(result){
                     if (result) {
                        this.removeItemsSelectionAll();
                     }
                  }.bind(this));
               } else {
                  var currentDataSource = this._$listView.getDataSource(),
                     dragOwner = DragObject.getOwner(),
                     ownersDataSource = dragOwner.getDataSource(),
                     useDefaultMove = false;
                  if (currentDataSource && dragOwner &&
                     currentDataSource.getEndpoint().contract == ownersDataSource.getEndpoint().contract
                  ) { //включаем перенос по умолчанию только если  контракты у источников данных равны
                     useDefaultMove = true;
                  }
                  this._$mover.moveFromOutside(DragObject.getSource(), DragObject.getTarget(), dragOwner.getItems(), useDefaultMove);
               }
            }
         }
      },
      _canDragMove: function() {
         var source = DragObject.getSource();
         return DragObject.getTarget() &&
            source &&
            source.getCount() > 0 &&
            DragObject.getTargetsControl() === this._$listView &&
            cInstance.instanceOfModule(source.at(0), 'SBIS3.CONTROLS.DragEntity.Row');
      },
      _getDragTarget: function(htmlItem, e) {
         var item;
         if (htmlItem.length > 0) {
            item = this._$projection.getByHash(htmlItem.data('hash'));
         }
         if (htmlItem.hasClass('controls-DragNDrop__placeholder') && this._mouse.level !== 0) {
            this._updateMouseObject(item, e);
         }

         return item ? item.getContents() : undefined;
      },

      _getDragPlaceHolder: function() {
         if (!this._dragPlaceHolder) {
            var item = DragObject.getSource().at(0);
            this._dragPlaceHolder = item.getDomElement().clone().addClass('controls-DragNDrop__placeholder');
            item.getDomElement().after(this._dragPlaceHolder);
         }
         return this._dragPlaceHolder;
      },

      _checkHorisontalDragndrop: function (target) {
         if (target.css('display') == 'inline-block' || target.css('float') != 'none') {
            return true;
         }
         var parent = target.parent();
         if (parent.css('display') == 'flex' && parent.css('flex-direction') == 'row') {
            return true;
         }
         return false;
      },

      _getDragItems: function(dragItem, selectedItems) {
         if (selectedItems) {
            var array = [];
            if (selectedItems.getIndex(dragItem) < 0) {
               array.push(dragItem);
            }
            selectedItems.each(function(item) {
               array.push(item);
            });
            return array;
         }
         return [dragItem];
      },
      _toggleDragItems: function (show) {
         DragObject.getSource().each(function (item) {
            item.getDomElement().toggleClass('ws-hidden', !show);
         });
      },
      _getDirectionOrderChange: function(e, target) {
         if (this._horisontalDragNDrop) {
            return this._getOrderPosition(e.pageX - (target.offset() ? target.offset().left : 0), target.width(), 20);
         } else {
            return this._getOrderPosition(e.pageY - (target.offset() ? target.offset().top : 0), target.height(), 10);
         }
      },
      _getOrderPosition: function(offset, metric, orderOffset) {
         return offset < orderOffset ? DRAG_META_INSERT.before : offset > metric - orderOffset ? DRAG_META_INSERT.after : DRAG_META_INSERT.on;
      },
      _hideDragHilight: function (DragObject) {
         this._getDragPlaceHolder(DragObject).hide();
         $('.controls-DragNDrop__hierarchy_move').removeClass('controls-DragNDrop__hierarchy_move');
      },
      _updateMouseObject: function (target, e) {
         if (target !== this._mouse.target) {
            this._mouse = {
               target: target,
               iter: 0,
               x: e.pageX,
               level:0
            };
         } else {
            var level = this._mouse.level;
            if (this._mouse.iter%3 ==0) {
               level = this._mouse.iter / 3;
            }
            if(this._mouse.x > e.pageX ) {
               this._mouse.iter--;
            } else if(this._mouse.x < e.pageX ) {
               this._mouse.iter++;
            }

            this._mouse.level = level;
         }
         console.log(this._mouse.level);
         this._mouse.x = e.pageX;
      }
   });
   return ListViewDrag;
});
