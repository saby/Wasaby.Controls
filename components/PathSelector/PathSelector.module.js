define('js!SBIS3.CONTROLS.PathSelector', [
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.DSMixin',
   'js!SBIS3.CONTROLS.PickerMixin',
   'html!SBIS3.CONTROLS.PathSelector',
   'html!SBIS3.CONTROLS.PathSelector/resources/pointTpl',
], function (CompoundControl, DSMixin, PickerMixin, dotTpl, pointTpl) {
   'use strict';

   if (typeof window !== 'undefined') {
      var eventsChannel = $ws.single.EventBus.channel('PathSelectorChannel');

      $(window).bind('resize', function () {
         eventsChannel.notify('onWindowResize');
      });
   }

   var PathSelector = CompoundControl.extend([DSMixin, PickerMixin], {
      $protected: {
         _dotTplFn: dotTpl,
         _options: {
            linkedView: null,
            keyField: 'id',
            displayField: 'title',
            dirField: 'parentId',
            pickerClassName: 'controls-Menu__Popup controls-PathSelector'
         }
      },

      $constructor: function () {
         var self = this;
         if (this._options.linkedView) {
            this._subscribeOnSetRoot();
         }

         $ws.single.EventBus.channel('WindowChangeChannel').subscribe('onWindowResize', this._resizeHandler, this);

         //TODO: сделано на mousedown так как контрол херит клик
         this._container.bind('mousedown', function (e) {
            self._clickHandler(e);
         });
         //инициализируем dataSet
         this.setItems(this._options.items);
      },

      _resizeHandler: function () {
         var points = $('.controls-PathSelector__point', this._container),
            targetContainer = this._getTargetContainer();
         if (targetContainer.width() < this._container.width()) {
            points.first('ws-hidden').removeClass('ws-hidden');
         }
      },

      _clickHandler: function (e) {
         if (e.which == 1) {
            var target = $(e.target),
               point = target.closest('.js-controls-PathSelector__point');
            if (point.hasClass('controls-PathSelector__dots', this._container)) {
               if (this._picker) {
                  this._picker.setTarget(point)
               }
               this.togglePicker();
               this._redrawDropdown();
            } else if (point.length) {
               this._onPointClick(point.data(this._options.dirField));
            }
         }
      },

      //придрот что бы фэйковый див не ломал :first-child стили
      _moveFocusToFakeDiv: function () {

      },

      _subscribeOnSetRoot: function () {
         var self = this;
         this._options.linkedView.subscribe('onSetRoot', function (event, dataSet, id) {
            self._rootChangeHandler(dataSet, id);
         }, this);
      },

      _setPickerConfig: function () {
         return {
            target: $('.controls-PathSelector__dots', this._container),
            corner: 'bl',
            verticalAlign: {
               side: 'top'
            },
            horizontalAlign: {
               side: 'left'
            },
            closeByExternalClick: true,
            targetPart: true
         };
      },

      _setPickerContent: function () {
         var self = this;
         this._redrawDropdown();
         this._picker._container.bind('mousedown', function (e) {
            self._clickHandler(e);
         })
      },

      setLinkedView: function (view) {
         var self = this;
         if (this._options.linkedView) {
            this._options.linkedView.unsubscribe('onSetRoot', this._rootChangeHandler);
         }
         this._options.linkedView = view;
         this._subscribeOnSetRoot();
      },

      _rootChangeHandler: function (dataSet, key) {
         //для корневой папки может придти null
         if (key) {
            var displayField = this._options.linkedView._options.displayField, //Как то не очень
               hierField = this._options.linkedView._options.hierField, //И это не очень
               record = dataSet.getRecordByKey(key),
               parentId = record ? dataSet.getParentKey(record, hierField) : null,
               title = record ? record.get(displayField) : '',
               point = {};

            point[this._options.displayField] = title;
            point[this._options.dirField] = parentId;
            point[this._options.keyField] = key;
            if (!this._dataSet.getRecordByKey(point[this._options.keyField])) {
               this._dataSet.push(point);
            }
         }
         this._redraw();
      },

      _redrawDropdown: function () {
         var self = this;
         if (this._picker) {
            this._picker._container.empty();
            this._dataSet.each(function (record) {
               var point = $('<div class="controls-MenuItem js-controls-PathSelector__point"></div>').html(record.get(self._options.displayField))
                  .data(self._options.dirField, record.get(self._options.dirField));
               self._picker._container.append(point);
               var previousContainer = point.prev('.js-controls-PathSelector__point', self._picker._container),
                  previousWrappersCount = $('.controls-PathSelector__hierWrapper', previousContainer).length;
               if (previousContainer.length) {
                  for (var i = 0; i <= previousWrappersCount; i++) {
                     point.prepend('<div class="controls-PathSelector__hierWrapper"></div>');
                  }
               }
            })
         }
      },

      _redraw: function () {
         PathSelector.superclass._redraw.call(this);
         $('.controls-PathSelector__dots', this._container).remove();
         var points = $('.controls-PathSelector__point', this._container),
            i = points.length - 1,
            targetContainer = this._getTargetContainer();
         //30px - ширина блока с троеточием
         //Добавляем троеточие если пункты не убираются в контейнер
         if (targetContainer.width() + 30 >= this._container.width()) {
            var dots = $(pointTpl({
               title: '...',
               dots: 'true'
            }));
            points.last().before(dots);
         }
         if (this._picker) {
            this.hidePicker();
         }
         //скрываем пункты левее троеточия пока не уберемся в контейнер
         for (i; i > 1; i--) {
            if (targetContainer.width() < this._container.width() || i == 1) {
               break
            }
            points[i - 1].className += ' ws-hidden';
         }
      },

      _getItemTemplate: function () {
         return pointTpl;
      },

      _getTargetContainer: function () {
         return $('.controls-PathSelector__itemsContainer', this._container);
      },

      _addItemAttributes: function (container, item) {
         container.data(this._options.dirField, item.get(this._options.dirField))
         PathSelector.superclass._addItemAttributes.apply(this, arguments);
      },

      _appendItemTemplate: function (item, targetContainer, itemBuildedTpl) {
         targetContainer.prepend(itemBuildedTpl);
      },

      /**
       * Обработчик клика на пункт пути
       * id - id по которому нужно перейти
       * удаляет пункт на который кликнули и все до него (глубже по иерархии)
       */
      _onPointClick: function (id) {
         var last = this._dataSet.getCount() - 1,
            record = this._dataSet.at(last);
         while (true) {
            this._dataSet.removeRecord(record.getKey());
            record = this._dataSet.at(last);
            //TODO: следующие четыре строчки выпилить когда будет нормальный sync в StaticSource
            delete this._dataSet._byId[record.getKey()];
            delete this._dataSet._byId[record._cid];
            this._dataSet._rawData.splice(last, 1);
            this._dataSet._indexId.splice(last, 1);
            last--;
            //TODO непонятно как будет работать с XML форматом
            if (record.get(this._options.dirField) == id) break;
            record = this._dataSet.at(last);
         }
         this._options.linkedView.setCurrentRoot(id);
      }
   });

   return PathSelector;
});