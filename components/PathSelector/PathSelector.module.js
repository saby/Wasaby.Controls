define('js!SBIS3.CONTROLS.PathSelector', [
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.DSMixin',
   'js!SBIS3.CONTROLS.PickerMixin',
   'js!SBIS3.CONTROLS.DecorableMixin',
   'html!SBIS3.CONTROLS.PathSelector',
   'html!SBIS3.CONTROLS.PathSelector/resources/pointTpl'
], function (CompoundControl, DSMixin, PickerMixin, DecorableMixin, dotTpl, pointTpl) {
   'use strict';

   if (typeof window !== 'undefined') {
      var eventsChannel = $ws.single.EventBus.channel('PathSelectorChannel');

      $(window).bind('resize', function () {
         eventsChannel.notify('onWindowResize');
      });
   }

   var PathSelector = CompoundControl.extend([DSMixin, PickerMixin, DecorableMixin], {
      $protected: {
         _dotTplFn: dotTpl,
         _resizeTimeout: null,
         _rootHandler: undefined,
         _dropdownWidth: null,
         _options: {
            linkedView: null,
            keyField: 'id',
            displayField: 'title',
            dirField: 'parentId',
            pickerClassName: 'controls-Menu__Popup controls-PathSelector'
         }
      },

      $constructor: function () {
         this._publish('onPointClick');
         if (this._options.linkedView) {
            this._subscribeOnSetRoot();
         }

         $ws.single.EventBus.channel('WindowChangeChannel').subscribe('onWindowResize', this._resizeHandler, this);
         //инициализируем dataSet
         this.setItems(this._options.items || []);
      },

      _resizeHandler: function () {
         clearTimeout(this._resizeTimeout);
         var self = this;
         this._resizeTimeout = setTimeout(function() {
            self._redraw();
         }, 100);
      },

      _onClickHandler: function (e) {
         PathSelector.superclass._onClickHandler.apply(this, arguments);

         var target = $(e.target),
             point = target.closest('.js-controls-PathSelector__point');
         if (point.hasClass('controls-PathSelector__dots')) {
            if (this._picker) {
               this._picker.setTarget(point);
            }
            this.togglePicker();
            if (this._picker.isVisible()) {
               this._redrawDropdown();
            }
         } else if (point.length) {
            this._onPointClick(point.data(this._options.dirField));
         }
      },

      //придрот что бы фэйковый див не ломал :first-child стили
      _moveFocusToFakeDiv: function () {

      },

      _subscribeOnSetRoot: function () {
         var self = this;
         this._rootHandler = function (event, dataSet, id) {
            self._rootChangeHandler(dataSet, id);
         };
         this._options.linkedView.subscribe('onSetRoot', this._rootHandler, this);
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
         this._picker._container.bind('mouseup', function (e) {
            self._onClickHandler(e);
         });
      },

      setLinkedView: function (view) {
         if (this._options.linkedView) {
            this._options.linkedView.unsubscribe('onSetRoot', this._rootHandler);
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
            if (this._options.colorField) {
               point[this._options.colorField] = record ? record.get(this._options.colorField) : '';
            }
            if (!this._dataSet.getRecordByKey(point[this._options.keyField])) {
               this._dataSet.push(point);
            }
         }
         this._redraw();
      },

      _redrawDropdown: function () {
         var self = this;
         if (this._picker) {
            var width = this._picker._container.width();
            this._picker._container.empty();
            this._dataSet.each(function (record) {
               var point = $('<div class="controls-MenuItem js-controls-PathSelector__point"></div>')
                  .html(
                     self._decorators.apply(
                        record.get(self._options.displayField)
                     )
                  )
                  .attr('style', self._decorators.apply(
                     self._options.colorField ? record.get(self._options.colorField) : '',
                     'color'
                  ))
                  .data(self._options.dirField, record.get(self._options.dirField));
               self._picker._container.append(point);
               var previousContainer = point.prev('.js-controls-PathSelector__point', self._picker._container),
                  previousWrappersCount = $('.controls-PathSelector__hierWrapper', previousContainer).length;
               if (previousContainer.length) {
                  for (var i = 0; i <= previousWrappersCount; i++) {
                     point.prepend('<div class="controls-PathSelector__hierWrapper"></div>');
                  }
               }
            });
            if (width !== this._dropdownWidth) {
               this._picker.recalcPosition(true);
               this._dropdownWidth = width;
            }
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
               dots: 'true',
               decorators: this._decorators
            }));
            points.last().before(dots);
         }
         if (this._picker) {
            this.hidePicker();
         }
         //скрываем пункты левее троеточия пока не уберемся в контейнер
         for (i; i > 1; i--) {
            if (targetContainer.width() < this._container.width() || i == 1) {
               break;
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
         container.data(this._options.dirField, item.get(this._options.dirField));
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
         this._notify('onPointClick');
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
      },

      destroy: function(){
      	PathSelector.superclass.destroy.call(this);
         if (this._options.linkedView) {
      	   this._options.linkedView.unsubscribe('onSetRoot', this._rootHandler);
         }
      	$ws.single.EventBus.channel('WindowChangeChannel').unsubscribe('onWindowResize', this._resizeHandler, this);
      }
   });

   return PathSelector;
});