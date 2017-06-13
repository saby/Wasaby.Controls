/**
 * Created by ganshinyao on 01.06.2017.
 */
define('js!SBIS3.CONTROLS.ListView.DragMove', [
   "Core/Abstract",
   "js!SBIS3.CONTROLS.DragObject",
   'js!WS.Data/Di',
   'js!SBIS3.CONTROLS.DragEntity.Row',
   'js!SBIS3.CONTROLS.DragEntity.List'

], function (Abstract, DragObject, Di) {
   /**
    * Реализация перемещения dragndrop'ом у списочных контролов
    * @class SBIS3.CONTROLS.ListView.DragMove
    * @author Крайнов Дмитрий Олегович
    */
   var DRAG_META_INSERT = {
      on: 'on',
      after: 'after',
      before: 'before'
   };
   var DragMove = Abstract.extend(/**@lends SBIS3.CONTROLS.ListView.Mover.prototype*/{
      _$protected: {
         options: {
            /**
             * @cfg {WS.Data/Display/Display} Проекция элементов.
             */
            projection: null,
            /**
             * @cfg {SBIS3.CONTROLS.ListView} связанное представление данных
             */
            view: null,
            /**
             * @cfg {String|Function(DragEntityOptions):SBIS3.CONTROLS.DragEntity.Entity} Конструктор перемещаемой сущности, должен вернуть элемент наследник класса {@link SBIS3.CONTROLS.DragEntity.Row}
             * @see DragEntityOptions
             * @see SBIS3.CONTROLS.DragEntity.Row
             */
            dragEntity: 'dragentity.row',
            /**
             * @cfg {String|Function(DragEntityOptions):SBIS3.CONTROLS.DragEntity.Entity} Конструктор перемещаемой сущности, должен вернуть элемент наследник класса {@link SBIS3.CONTROLS.DragEntity.Row}
             * @see DragEntityListOptions
             * @see SBIS3.CONTROLS.DragEntity.List
             */
            dragEntityList: 'dragentity.list',
            /**
             * @cfg {SBIS3.CONTROLS.ListView.Mover} перемещатор от view
             */
            mover: null,
            /**
             * @cfg{Boolean} использовать плейсходер
             */
            useDragPlaceHolder: false,
            /**
             * @cfg {Object} Конфиг декорированной ссылки
             */
            linkTemplateConfig: null
         },
         _dragPlaceHolder: null
      },
      $constructor: function () {
         this._getView().subscribe('onBeginDrag', this._beginDragHandler.bind(this));
         this._getView().subscribe('onDragMove', this._onDragHandler.bind(this));
         this._getView().subscribe('onEndDrag', this._endDragHandler.bind(this));
      },

      /**
       * Получить текущую конфигурацию перемещения элементов с помощью DragNDrop.
       * @see itemsDragNDrop
       * @see setItemsDragNDrop
       */
      getItemsDragNDrop: function() {
         return this._options.itemsDragNDrop;
      },
      _findDragDropContainer: function() {
         return this._getItemsContainer();
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

      _beginDragHandler: function(buse, drag, e) {
         //TODO: данный метод выполняется по селектору '.js-controls-ListView__item', но не всегда если запись есть в вёрстке
         //она есть в _items(например при добавлении или фейковый корень). Метод _findItemByElement в данном случае вернёт
         //пустой массив. В .150 править этот метод опасно, потому что он много где используется. В .200 переписать метод
         //_findItemByElement, без завязки на _items.
         var target = this._findItemByElement(DragObject.getTargetsDomElemet());
         if (target.length) {
            if (target.hasClass('controls-DragNDropMixin__notDraggable')) {
               return false;
            }
            var  selectedItems = this._getView().getSelectedItems(),
               targetsItem = this._getItemsProjection().getByHash(target.data('hash')).getContents(),
               items = this._getDragItems(targetsItem, selectedItems),
               source = [];
            items.forEach(function (item) {
               var projItem = this._getItemsProjection().getItemBySourceItem(item);
               source.push(this._makeDragEntity({
                  owner: this,
                  model: item,
                  domElement: projItem ? $('.js-controls-ListView__item[data-hash="'+projItem.getHash()+'"]') : undefined
               }));
            }.bind(this));

            DragObject.setSource(
               this._makeDragEntityList({
                  items: source
               })
            );
            if (this._options.useDragPlaceHolder) {
               this._makeDragPlaceHolder();
               this._toggleDragItems(false)
            }
            if (this._checkHorisontalDragndrop(target)) {
               this._horisontalDragNDrop = true;
               this.getContainer().addClass('controls-ListView__horisontalDragNDrop');
               this.getContainer().removeClass('controls-ListView__verticalDragNDrop');
            } else {
               this._horisontalDragNDrop = false;
               this.getContainer().removeClass('controls-ListView__horisontalDragNDrop');
               this.getContainer().addClass('controls-ListView__verticalDragNDrop');
            }
            this._updateDragTarget(e);
            DragObject.setAvatar(this._createAvatar());
            return true;
         }
         return false;
      },
      /**
       * Определяет направление элементов в списке
       * @param target
       * @returns {boolean}
       * @private
       */
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
      _onDragHandler: function(buse, drag, e) {
         this._updateDragTarget(e);
         this._clearDragHighlight();
         if (this._canDragMove()) {
            var
               target = DragObject.getTarget(),
               targetsModel = target.getModel(),
               source = DragObject.getSource(),
               sourceModels = [];
            if (targetsModel) {
               source.each(function (item) {
                  sourceModels.push(item.getModel());
               });

               //this._drawDragHighlight(target);
               if (this._options.useDragPlaceHolder) {
                  var placeholder = this._getDragPlaceHolder(DragObject);
                  placeholder.show();
                  var item = this._getItemsProjection().getItemBySourceItem(targetsModel);
                  if (target.getPosition() == 'before') {
                     placeholder.insertBefore(target.getDomElement());
                  } else {
                     placeholder.insertAfter(target.getDomElement());
                  }
               } else {
                  if (DragObject.getOwner() !== this._getView() || sourceModels.indexOf(targetsModel) < 0) {
                     this._drawDragHighlight(target);
                  }
               }
            }
         }
         if (DragObject.getTargetsControl() !== this && this._dragPlaceHolder) {
            this._dragPlaceHolder.hide();
         } else if (this._dragPlaceHolder) {
            this._dragPlaceHolder.show();
         }
      },

      _canDragMove: function() {
         var source = DragObject.getSource();
         return DragObject.getTarget() &&
            source &&
            source.getCount() > 0 &&
            DragObject.getTargetsControl() === this &&
            cInstance.instanceOfModule(source.at(0), 'SBIS3.CONTROLS.DragEntity.Row');
      },

      _getDragTarget: function(e) {
         var
            item,
            projection = this._getItemsProjection(),
            target = this._findItemByElement(DragObject.getTargetsDomElemet());

         if(this._options.useDragPlaceHolder) {
            var item;
            if (target.length > 0) {
               item = projection.getByHash(target.data('hash'));
            }
         } else {
            if (target.length > 0) {
               item = projection.getByHash(target.data('hash'));
            } else if (this._horisontalDragNDrop) {
               var elements = document.elementsFromPoint(e.pageX + 5, e.pageY + 5);
               target = this._findItemByElement($(elements[1]));
               if (target.length > 0) {
                  item = projection.getByHash(target.data('hash'));
               } else {
                  item = projection.at(projection.getCount() - 1);
               }
            }

         }
         return {
            item: item ? item.getContents() : undefined,
            domElement: target
         };
      },

      _updateDragTarget: function(e) {
         var dragTarget = this._getDragTarget(e),
            target;
         if (DragObject.getSource() && dragTarget.item && !dragTarget.domElement.hasClass('controls-DragNDrop__placeholder')) {
            var position = this._getDirectionOrderChange(e, dragTarget.domElement) || DRAG_META_INSERT.on,
               sourceIds = [],
               movedItems = [];
            DragObject.getSource().each(function (item) {
               sourceIds.push(item.getModel().getId());
               movedItems.push(item.getModel());
            });
            var projItem = this._getItemsProjection().getItemBySourceItem(dragTarget.item);
            if (this._getMover()._checkRecordForMove(movedItems, dragTarget.item, position)) {
               target = this._makeDragEntity({
                  owner: this,
                  domElement: dragTarget.domElement,
                  model: dragTarget.item,
                  position: position
               });
               DragObject.setTarget(target);
            } else if (this._options.useDragPlaceHolder && position == 'on' ) {
               if (this._horisontalDragNDrop) {
                  position = (e.offsetX > dragTarget.domElement.height()/2) ? 'before' : 'after';
               } else {
                  position = (e.offsetY > dragTarget.domElement.width()/2) ? 'before' : 'after';
               }
               target = this._makeDragEntity({
                  owner: this,
                  domElement: dragTarget.domElement,
                  model: dragTarget.item,
                  position: position
               });
               DragObject.setTarget(target);
            } else if (!this._options.useDragPlaceHolder) {
               DragObject.setTarget(undefined);
            }
         }
      },

      _clearDragHighlight: function() {
         this.getContainer()
            .find('.controls-DragNDrop__insertBefore, .controls-DragNDrop__insertAfter')
            .removeClass('controls-DragNDrop__insertBefore controls-DragNDrop__insertAfter');
      },
      _drawDragHighlight: function(target) {
         var domelement = target.getDomElement();
         domelement.toggleClass('controls-DragNDrop__insertAfter', target.getPosition() === DRAG_META_INSERT.after);
         domelement.toggleClass('controls-DragNDrop__insertBefore', target.getPosition() === DRAG_META_INSERT.before);
      },
      _getDirectionOrderChange: function(e, target) {
         if (this._options.useDragPlaceHolder) {
            var position = this._getOrderPosition(e.pageY - (target.offset() ? target.offset().top : 0), target.height(), 10);
            if (position == 'on') {
               position = this._getOrderPosition(e.pageX - (target.offset() ? target.offset().left : 0), target.width(), 20)
            }
            return position;
         } else {
            if (this._horisontalDragNDrop) {
               return this._getOrderPosition(e.pageX - (target.offset() ? target.offset().left : 0), target.width(), 20);
            } else {
               return this._getOrderPosition(e.pageY - (target.offset() ? target.offset().top : 0), target.height(), 10);
            }
         }
      },
      _getOrderPosition: function(offset, metric, orderOffset) {
         if (this._options.useDragPlaceHolder) {
            return offset < orderOffset ? DRAG_META_INSERT.after : offset > metric - orderOffset ? DRAG_META_INSERT.before : DRAG_META_INSERT.on;
         } else {
            return offset < orderOffset ? DRAG_META_INSERT.before : offset > metric - orderOffset ? DRAG_META_INSERT.after : DRAG_META_INSERT.on;
         }
      },

      _createAvatar: function() {
         if (!this._options.linkTemplateConfig) {
            var count = DragObject.getSource().getCount();
            return $('<div class="controls-DragNDrop__draggedItem"><span class="controls-DragNDrop__draggedCount">' + count + '</span></div>');
         } else {
            var model = DragObject.getSource().at(0).getModel();
            return $(
               '<div class="controls-dragNDrop-avatar controls-DragNDrop__draggedItem">' +
               '<div class="controls-dragNDrop-avatar__img-wrapper">' +
               '<img src="' + model.get(this._options.linkTemplateConfig.image) + '">' +
               '</div>' +
               '<div class="controls-dragNDrop-avatar__text-wrapper">' +
               '<div class="controls-dragNDrop-avatar__title">' + (model.get(this._options.linkTemplateConfig.title)||'') + '</div>' +
               '<div class="controls-dragNDrop-avatar__description">' + (model.get(this._options.linkTemplateConfig.description)||'') + '</div>' +
               '</div>' +
               '</div>'
            );
         }
      },

      _endDragHandler: function(buse, drag, e) {
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
            if (DragObject.getOwner() === this._getView()) {
               var position = target.getPosition(),
                  domItems = [];

               DragObject.getSource().each(function (item) {
                  domItems.push(item.getDomElement());
               });
               var isMove = this._getMover().checkRecordsForMove(models, target.getModel(), position);
               this._getView().move(models, target.getModel(), position).addCallback(function(result){
                  if (result) {
                     this.removeItemsSelectionAll();
                  }
                  if (this._options.useDragPlaceHolder && isMove) {
                     this._getView().once('onDrawItems', function () {
                        //это нужно что бы изменения верстки произошли в одном "потоке", что бы не прыгали элементы
                        //когда удалется плейсходер и переносится реальный элемент
                        //здесь поможет виртуалдом
                        this._clearDragHighlight();
                        domItems.forEach(function (elem) {
                           elem.removeClass('ws-hidden');
                        });
                        this._removeDragPlaceHolder();
                     }.bind(this));
                  } else {
                     this._removeDragPlaceHolder();
                  }
               }.bind(this)).addErrback(function () {
                  this._removeDragPlaceHolder();
               }.bind(this));
            } else {
               var currentDataSource = this._getView().getDataSource(),
                  dragOwner = DragObject.getOwner(),
                  ownersDataSource = dragOwner.getDataSource(),
                  useDefaultMove = false;
               if (currentDataSource && dragOwner &&
                  currentDataSource.getEndpoint().contract == ownersDataSource.getEndpoint().contract
               ) { //включаем перенос по умолчанию только если  контракты у источников данных равны
                  useDefaultMove = true;
               }
               this._getMover().moveFromOutside(DragObject.getSource(), DragObject.getTarget(), dragOwner.getItems(), useDefaultMove);
            }
         }
         this._clearDragHighlight();
      },
      _getDragPlaceHolder: function() {
         if (!this._dragPlaceHolder) {
            this._makeDragPlaceHolder()
         }
         return this._dragPlaceHolder;
      },

      _makeDragPlaceHolder: function() {
         if (this._options.useDragPlaceHolder) {
            var item = DragObject.getSource().at(0);
            this._dragPlaceHolder = item.getDomElement().clone().removeAttr('data-hash').addClass('controls-DragNDrop__placeholder');
            item.getDomElement().after(this._dragPlaceHolder);
         }
      },

      _toggleDragItems: function (show) {
         DragObject.getSource().each(function (item) {
            item.getDomElement().toggleClass('ws-hidden', !show);
         });
      },

      _removeDragPlaceHolder: function () {
         if (this._dragPlaceHolder) {
            this._dragPlaceHolder.remove();
            this._dragPlaceHolder = null;
         }
      },

      _findItemByElement: function(target){
         if(!target.length) {
            return [];
         }
         var domElem;
         if (target.hasClass('.js-controls-ListView__item')) {
            domElem = target;
         } else {
            domElem = target.closest('.js-controls-ListView__item', this.getContainer()[0]);
         }
         return domElem;
      },

      _getItemsProjection: function () {
         return this._options.projection;
      },

      _getView: function () {
         return this._options.view;
      },

      getContainer: function () {
         return this._getView().getContainer();
      },

      /**
       * Создает сущность перемещения.
       * @param {Object} options Объект с опциями которые будут переданы в конструктор сущности.
       * @returns {SBIS3.CONTROLS.DragEntity.Entity}
       * @see SBIS3.CONTROLS.DragEntity.Entity
       */
      _makeDragEntity: function(options) {
         return  Di.resolve(this._options.dragEntity, options);
      },
      /**
       *
       * @param options
       * @returns {*|Object|Array}
       * @private
       */
      _makeDragEntityList: function(options) {
         return Di.resolve(this._options.dragEntityList, options)
      },
      _getMover: function () {
         return this._options.mover;
      }

   });
   return DragMove;
});