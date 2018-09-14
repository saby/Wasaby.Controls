/**
 * Created by ganshinyao on 01.06.2017.
 */
define('SBIS3.CONTROLS/ListView/resources/DragMove/DragMove', [
   "Core/Abstract",
   "SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragObject",
   'WS.Data/Di',
   'Core/core-instance',
   'SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/Row',
   'SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/List',
   'css!SBIS3.CONTROLS/ListView/resources/DragMove/DragMove'
], function (Abstract, DragObject, Di, cInstance) {
   /**
    * Реализация перемещения dragndrop'ом у списочных контролов
    * @class SBIS3.CONTROLS/ListView/resources/DragMove/DragMove
    * @author Крайнов Д.О.
    */
   var DRAG_META_INSERT = {
      on: 'on',
      after: 'after',
      before: 'before'
   };
   var DragMove = Abstract.extend(/**@lends SBIS3.CONTROLS/ListView/resources/Mover.prototype*/{
      $protected: {
         _options: {
            /**
             * @cfg {WS.Data/Display/Display} Проекция элементов.
             */
            projection: null,
            /**
             * @cfg {SBIS3.CONTROLS/ListView} связанное представление данных
             */
            view: null,
            /**
             * @cfg {String|Function(DragEntityOptions):SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/Entity} Конструктор перемещаемой сущности, должен вернуть элемент наследник класса {@link SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/Row}
             * @see DragEntityOptions
             * @see SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/Row
             */
            dragEntity: 'dragentity.row',
            /**
             * @cfg {String|Function(DragEntityOptions):SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/Entity} Конструктор перемещаемой сущности, должен вернуть элемент наследник класса {@link SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/Row}
             * @see DragEntityListOptions
             * @see SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/List
             */
            dragEntityList: 'dragentity.list',
            /**
             * @cfg {SBIS3.CONTROLS/ListView/resources/Mover} перемещатор от view
             */
            mover: null,
            /**
             * @cfg{Boolean} использовать плейсходер
             */
            useDragPlaceHolder: false,
            /**
             * @cfg {Object} Конфиг декорированной ссылки
             */
            linkTemplateConfig: null,
            /**
             * @cfg {String|Boolean} Устанавливает возможность перемещения элементов с помощью курсора мыши.
             */
            itemsDragNDrop: true,
            /**
             * @cfg {String} Устанавливает поле в котором хранится признак типа записи в иерархии
             * @remark
             * null - лист, false - скрытый узел, true - узел
             */
            nodeProperty: null
         },
         _dragPlaceHolder: null,
         _dragPositioner: null
      },
      //region public
      /**
       * Получить текущую конфигурацию перемещения элементов с помощью DragNDrop.
       * @see itemsDragNDrop
       * @see setItemsDragNDrop
       */
      getItemsDragNDrop: function() {
         return this._options.itemsDragNDrop;
      },

      setItemsDragNDrop: function (itemsDragNDrop) {
         this._options.itemsDragNDrop = itemsDragNDrop;
      },

      beginDrag: function() {
         var target = this._findItemByElement(DragObject.getTargetsDomElemet());
         if (target.length) {
            var  selectedItems = this._getView().getSelectedItems(),
               targetsItem = this._getItemsProjection().getByHash(target.data('hash')).getContents(),
               items = this._getDragItems(targetsItem, selectedItems),
               source = [];
            items.forEach(function (item) {
               var projItem = this._getItemsProjection().getItemBySourceItem(item);
               source.push(this._makeDragEntity({
                  owner: this._getView(),
                  model: item,
                  domElement: projItem ? $('.js-controls-ListView__item[data-hash="'+projItem.getHash()+'"]:not(.controls-editInPlace)', this.getContainer()) : undefined,
                  projectionItem: projItem
               }));
            }.bind(this));

            DragObject.setSource(
               this._makeDragEntityList({
                  items: source
               })
            );
            this._addClassDragndrop(target);
            if (this._options.useDragPlaceHolder) {
               this._makeDragPlaceHolder();
               this._toggleDragItems(false)
            }
            return true;
         }
         return false;
      },

      drag: function () {
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
               if (DragObject.getOwner() !== this._getView()) {
                  this._addClassDragndrop(target.getDomElement());
               }
               this._drawDragHighlight(target);
               if (this._options.useDragPlaceHolder) {
                  var placeholder = this._getDragPlaceHolder(DragObject);
                  placeholder.show();
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
         if (DragObject.getTargetsControl() !== this._getView() && this._dragPlaceHolder) {
            this._dragPlaceHolder.hide();
         } else if (this._dragPlaceHolder) {
            this._dragPlaceHolder.show();
         }
      },

      updateTarget: function() {
         var dragTarget = this._getDragTarget(),
            oldTarget = DragObject.getTarget(),
            target;

         if (this._isCorrectSource(DragObject.getSource()) && dragTarget.item  && !dragTarget.isPlaceholder) {
            var position,
               sourceIds = [],
               movedItems = [],
               targetsModel = dragTarget.item.getContents();
            DragObject.getSource().each(function (item) {
               sourceIds.push(item.getModel().getId());
               movedItems.push(item.getModel());
            });
            position = this._getDirectionOrderChange(dragTarget);
            if (this._options.useDragPlaceHolder || this._getMover().checkRecordsForMove(movedItems, targetsModel, position)) {
               target = this._makeDragEntity({
                  owner: this._getView(),
                  domElement: dragTarget.domElement,
                  model: targetsModel,
                  position: position,
                  projectionItem: this._getItemsProjection().getItemBySourceItem(targetsModel)
               });
               DragObject.setTarget(target);
            } else  {
               DragObject.setTarget(undefined);
            }
         } else if(oldTarget && oldTarget.getOwner &&  oldTarget.getOwner()  == this._getView() && !dragTarget.isPlaceholder) {
            DragObject.setTarget(undefined); //если не смогли найти таргет и устанавливали с этого контрола то надо стереть
         }
      },

      endDrag: function () {
         var
            target = DragObject.getTarget(),
            models = [],
            dropBySelf = false,
            source = DragObject.getSource(),
            isMove = false;

         if (target && this._isCorrectSource(source)) {
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
               isMove = this._getMover().checkRecordsForMove(models, target.getModel(), position);
               if (isMove) {
                  //определять будет перемещение или нет нужно только для того что бы синхронно скрыть плейсхолдер
                  this._getView().move(models, target.getModel(), position).addCallback(function (result) {
                     if (result !== false) {
                        this._getView().removeItemsSelectionAll();
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
               }
            } else {
               var currentDataSource = this._getView().getDataSource(),
                  dragOwner = DragObject.getOwner(),
                  ownersDataSource = dragOwner.getDataSource ? dragOwner.getDataSource() : undefined,
                  useDefaultMove = false;
               if (currentDataSource && dragOwner && ownersDataSource &&
                  currentDataSource.getEndpoint().contract == ownersDataSource.getEndpoint().contract
               ) { //включаем перенос по умолчанию только если  контракты у источников данных равны
                  useDefaultMove = true;
               }
               this._getMover().moveFromOutside(DragObject.getSource(),
                  DragObject.getTarget(),
                  dragOwner.getItems(),
                  useDefaultMove
               ).addCallback(function (result) {
                  if (result !== false && cInstance.instanceOfMixin(dragOwner, 'SBIS3.CONTROLS/Mixins/MultiSelectable')) {
                     dragOwner.removeItemsSelectionAll();//сбросим выделение у контрола с которого перемещаются элементы
                  }
               })
            }
         }
         if (!isMove) {
            this._toggleDragItems(DragObject, true);
            this._removeDragPlaceHolder();
         }
         this._dragPositioner = null;
         this._clearDragHighlight();
      },
      /**
       * создает аватар
       * @return {*|jQuery|HTMLElement}
       * @private
       */
      createAvatar: function() {
         if (!this._options.linkTemplateConfig) {
            var count = DragObject.getSource().getCount();
            return $('<div class="controls-DragNDrop__draggedItem"><span class="controls-DragNDrop__draggedCount">' + count + '</span></div>');
         } else {
            var model = DragObject.getSource().at(0).getModel();
            return $(
               '<div class="controls-dragNDrop-avatar">' +
               '<div class="controls-dragNDrop-avatar__img-wrapper">' +
               '<img class="controls-dragNDrop-avatar__img" src="' + model.get(this._options.linkTemplateConfig.image) + '">' +
               '</div>' +
               '<div class="controls-dragNDrop-avatar__text-wrapper">' +
               '<div class="controls-dragNDrop-avatar__title">' + (model.get(this._options.linkTemplateConfig.title)||'') + '</div>' +
               '<div class="controls-dragNDrop-avatar__description">' + (model.get(this._options.linkTemplateConfig.description)||'') + '</div>' +
               '</div>' +
               '</div>'
            );
         }
      },
      /**
       * возвращает контейнер контрола
       * @return {*|Element|jQuery}
       */
      getContainer: function () {
         return this._getView().getContainer();
      },

      //endregion public
      //region private
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

      _isCorrectSource: function (source) {
         return source && cInstance.instanceOfModule(source, 'SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/List');
      },
      /**
       * Проверяет можно ли перемещать
       * @return {boolean}
       * @private
       */
      _canDragMove: function() {
         var source = DragObject.getSource();
         return DragObject.getTarget() &&
            this._isCorrectSource(source) &&
            source.getCount() > 0 &&
            DragObject.getTargetsControl() === this._getView() &&
            cInstance.instanceOfModule(source.at(0), 'SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/Row') &&
            this._isEqualDataSource()
      },
      /**
       * возвращает Dom элемент и рекорд элемента над которым находится курсор
       * @return {{item: undefined, domElement: *}}
       * @private
       */
      _getDragTarget: function() {
         var
            item,
            projection = this._getItemsProjection(),
            target = this._findItemByElement(DragObject.getTargetsDomElemet()),
            isPlaceholder = false;

         if(this._options.useDragPlaceHolder) {
            if (target.length > 0) {
               item = projection.getByHash(target.data('hash'));
               isPlaceholder = target.hasClass('controls-DragNDrop__placeholder');
            }
         } else {
            if (target.length > 0) {
               item = projection.getByHash(target.data('hash'));
            } else if (this._horisontalDragNDrop) {
               var event  = DragObject.getEvent(),
                  elements = document.elementsFromPoint(event.pageX + 5, event.pageY + 5);
               target = this._findItemByElement($(elements[1]));
               if (target.length > 0) {
                  item = projection.getByHash(target.data('hash'));
               }
            }
         }
         return {
            item: item,
            domElement: target,
            isPlaceholder: isPlaceholder
         };
      },
      _isEqualDataSource: function () {
         if (this._getView() !== DragObject.getOwner()) {
            var targetDataSource = this._getView().getDataSource(),
               owner = DragObject.getOwner(),
               ownerDataSource = typeof owner.getDataSource == 'function' ? owner.getDataSource() : undefined;
            if (ownerDataSource
               && targetDataSource
               && ownerDataSource.getEndpoint
               && targetDataSource.getEndpoint
               && ownerDataSource.getEndpoint().contract === targetDataSource.getEndpoint().contract
            ) {
               return true;
            }
            return false;
         }
         else {
            return true;
         }
      },
      /**
       * очищает подсвечивание драгндропа
       * @private
       */
      _clearDragHighlight: function() {
         this.getContainer()
            .find('.controls-DragNDrop__insertBefore, .controls-DragNDrop__insertAfter')
            .removeClass('controls-DragNDrop__insertBefore controls-DragNDrop__insertAfter');
      },
      /**
       * рисует подстветку драгндропа
       * @param target
       * @private
       */
      _drawDragHighlight: function(target) {
         if (!this._options.useDragPlaceHolder) {
            var domelement = target.getDomElement();
            domelement.toggleClass('controls-DragNDrop__insertAfter', target.getPosition() === DRAG_META_INSERT.after);
            domelement.toggleClass('controls-DragNDrop__insertBefore', target.getPosition() === DRAG_META_INSERT.before);
         }
      },
      /**
       * определяет направление перемещения
       * @param target
       * @return {*}
       * @private
       */
      _getDirectionOrderChange: function(target) {
         var offset, size,
            domElement = target.domElement,
            event = DragObject.getEvent();

         return this._getDragPositioner().get(target.domElement, target.item);
      },

      _getDragPositioner: function() {
         if (!this._dragPositioner) {
            this._dragPositioner = new DragPositioner({
               itemsDragNDrop: this._options.itemsDragNDrop,
               projection: this._getItemsProjection(),
               mover: this._getMover(),
               horisontalDragNDrop: this._horisontalDragNDrop,
               useDragPlaceHolder: this._options.useDragPlaceHolder,
               nodeProperty: this._options.nodeProperty
            });
         }
         return this._dragPositioner;
      },
      /**
       * возвращает плейсхолдер
       * @return {null|*}
       * @private
       */
      _getDragPlaceHolder: function() {
         if (!this._dragPlaceHolder) {
            this._makeDragPlaceHolder()
         }
         return this._dragPlaceHolder;
      },
      /**
       * создает плейсхолдер
       * @private
       */
      _makeDragPlaceHolder: function() {
         if (this._options.useDragPlaceHolder) {
            var item = DragObject.getSource().at(0);
            //надо удалять хеш и id что бы вью не считало плейсхолдер за элемент
            this._dragPlaceHolder = item.getDomElement().clone().removeAttr('data-hash').removeAttr('data-id').addClass('controls-DragNDrop__placeholder');
            item.getDomElement().after(this._dragPlaceHolder);
         }
      },
      /**
       * скрывает перемещаемые элементы
       * @param show
       * @private
       */
      _toggleDragItems: function (show) {
         var source = DragObject.getSource();
         if (this._isCorrectSource(source)) {
            source.each(function (item) {
               if (item.getDomElement()) { //если элемент находится внутри закрытой папки для него не будет dom'а
                  item.getDomElement().toggleClass('ws-hidden', !show);
               }
            });
         }
      },
      /**
       * Удаляет плейсхолдер
       * @private
       */
      _removeDragPlaceHolder: function () {
         if (this._dragPlaceHolder) {
            this._dragPlaceHolder.remove();
            this._dragPlaceHolder = null;
         }
      },
      /**
       * Находи строку к которой принадлежит элемент
       * @param target
       * @return {*}
       * @private
       */
      _findItemByElement: function(target){
         if(!target.length) {
            return [];
         }
         var domElem,
            projection = this._getItemsProjection();
         if (target.hasClass('.js-controls-ListView__item')) {
            domElem = target;
         } else {
            domElem = target.closest('.js-controls-ListView__item', this.getContainer()[0]);
         }
         if (domElem.data('hash') && projection && !projection.getByHash(domElem.data('hash'))) {
            return this._findItemByElement(domElem.parent());
         }
         return domElem;
      },
      /**
       * Возвращает проэкцию
       * @private
       */
      _getItemsProjection: function () {
         return this._options.projection;
      },
      /**
       * Устанавливает проекцию
       * @param projection
       */
      setItemsProjection: function (projection) {
         this._options.projection = projection;
      },
      /**
       * Возвращает котрол
       * @private
       */
      _getView: function () {
         return this._options.view;
      },
      /**
       * Создает сущность перемещения.
       * @param {Object} options Объект с опциями которые будут переданы в конструктор сущности.
       * @returns {SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/Entity}
       * @see SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/Entity
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
      /**
       * возвращает перемещатор
       * @private
       */
      _getMover: function () {
         return this._options.mover;
      },
      /**
       * Вешает класс горизонтального - обыный список или вертикального - плитка
       * @param target
       * @private
       */
      _addClassDragndrop: function (target) {
         if (this._checkHorisontalDragndrop(target)) {
            this._horisontalDragNDrop = true;
            this.getContainer().addClass('controls-ListView__horisontalDragNDrop');
            this.getContainer().removeClass('controls-ListView__verticalDragNDrop');
         } else {
            this._horisontalDragNDrop = false;
            this.getContainer().removeClass('controls-ListView__horisontalDragNDrop');
            this.getContainer().addClass('controls-ListView__verticalDragNDrop');
         }
      }
      //endregion private
   });
   /**
    * Опеределяет позицию перемещения в зависимости от типа драгнгдропа itemsDragNDrop и вида связанного отображения плоский список/дерево
    */
   var DragPositioner = function (cfg) {
      this._projection = cfg.projection;
      this._sourceExistNode = false;
      this._sourseItems = [];
      this._mover = cfg.mover;
      this._itemsDragNDrop = cfg.itemsDragNDrop;
      this._useDragPlaceHolder = cfg.useDragPlaceHolder;
      this._horisontalDragNDrop = cfg.horisontalDragNDrop;
      this._nodeProperty = cfg.nodeProperty;
      this._isTree = cInstance.instanceOfModule(this._projection, 'WS.Data/Display/Tree');
      if (this._isTree) {
         var source = DragObject.getSource();
         if (source && cInstance.instanceOfModule(source, 'SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/List') && this._nodeProperty) {
            source.forEach(function (item) {
               if (cInstance.instanceOfModule(item, 'SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/Row')) {
                  var item = item.getModel();
                  if (item.get(this._nodeProperty) !== null) {
                     this._sourceExistNode = true
                  }
                  this._sourseItems.push(item);
               }
            }.bind(this));
         }
      }
   };
   DragPositioner.prototype.get = function (domElement, target) {
      var offset,
         size,
         event = DragObject.getEvent();
      if (this._horisontalDragNDrop) {
         offset = event.pageX - (domElement.offset() ? domElement.offset().left : 0);
         size =  domElement.width();
      } else {
         offset = event.pageY - (domElement.offset() ? domElement.offset().top : 0);
         size = domElement.height();
      }
      switch (this._itemsDragNDrop) {
         case 'onlyChangeOrder':
            return this._onlyChangeOrder(offset, size);
         case  'onlyChangeParent':
            return this._onlyChangeParent();
         case 'separateParent':
            return this._separateParent(offset, size, target);
         case 'allow':
         default:
            if (this._isTree) {
               return this._allow(offset, size, target);
            } else if (this._useDragPlaceHolder) {
               return this._withDragPlaceHolder(offset, size, domElement, event);
            } else {
               return this._onlyChangeOrder(offset, size);
            }
      }
   };
   DragPositioner.prototype._onlyChangeOrder = function (offset, size) {
      return (size/2 - offset > 0) ? DRAG_META_INSERT.before : DRAG_META_INSERT.after;
   };
   DragPositioner.prototype._onlyChangeParent = function () {
      return DRAG_META_INSERT.on;
   };
   DragPositioner.prototype._separateParent = function (offset, size, target) {
      if (target.isNode() && !this._sourceExistNode) {
         return DRAG_META_INSERT.on;
      } else if(!target.isNode() && this._sourceExistNode) {
         return DRAG_META_INSERT.on;
      }
      return this._allow(offset, size, target);
   };
   DragPositioner.prototype._default = function (offset, size) {
      return offset < 10 ? DRAG_META_INSERT.before : offset > size - 10 ? DRAG_META_INSERT.after : DRAG_META_INSERT.on;
   };
   DragPositioner.prototype._allow = function (offset, size, target) {
      var position = this._default(offset, size);
      if (target && position == DRAG_META_INSERT.on && !this._mover.checkRecordsForMove(this._sourseItems, target.getContents(), position)) {
         position = this._onlyChangeOrder(offset, size)
      }
      return position;
   };
   DragPositioner.prototype._withDragPlaceHolder = function (offset, size, domElement, event) {
      var position;
      if (this._horisontalDragNDrop) {
         var  offsetY = event.pageY - (domElement.offset() ? domElement.offset().top : 0),
            sizeY = domElement.height();
         position = this._default(offsetY, sizeY);
      }
      if (!position || position == DRAG_META_INSERT.on) {
         position =  this._onlyChangeOrder(offset, size);
      }
      return  position == DRAG_META_INSERT.before ? DRAG_META_INSERT.after : DRAG_META_INSERT.before;
   };
   return DragMove;
});