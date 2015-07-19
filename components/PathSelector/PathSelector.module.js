define('js!SBIS3.CONTROLS.PathSelector', [
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.DSMixin',
   'js!SBIS3.CONTROLS.PickerMixin',
   'js!SBIS3.CONTROLS.DecorableMixin',
   'html!SBIS3.CONTROLS.PathSelector',
   'html!SBIS3.CONTROLS.PathSelector/resources/pointTpl'
], function(CompoundControl, DSMixin, PickerMixin, DecorableMixin, dotTpl, pointTpl) {
   'use strict';

   if (typeof window !== 'undefined') {
      var eventsChannel = $ws.single.EventBus.channel('PathSelectorChannel');

      $(window).bind('resize', function() {
         eventsChannel.notify('onWindowResize');
      });
   }
   //TODO: Переписать все к чертям 
   var PathSelector = CompoundControl.extend([DSMixin, PickerMixin, DecorableMixin], {
      $protected: {
         _dotTplFn: dotTpl,
         _resizeTimeout: null,
         _rootHandler: undefined,
         _dropdownWidth: null,
         _homeIcon: undefined,
         _options: {
            linkedView: null,
            keyField: 'id',
            displayField: 'title',
            pickerClassName: 'controls-Menu__Popup controls-PathSelector'
         }
      },

      $constructor: function() {
         this._publish('onPointClick');
         if (this._options.linkedView) {
            this._subscribeOnSetRoot();
         }
         $ws.single.EventBus.channel('WindowChangeChannel').subscribe('onWindowResize', this._resizeHandler, this);
         //инициализируем dataSet
         this.setItems(this._options.items || []);
         this._homeIcon = $('.controls-PathSelector__point-home', this._container);
         this._homeIcon.data('data-id', null); //клик по домику ведет в корень TODO: придрочено под null
      },

      _resizeHandler: function() {
         clearTimeout(this._resizeTimeout);
         var self = this;
         this._resizeTimeout = setTimeout(function() {
            self._redraw();
         }, 100);
      },

      _onClickHandler: function(e) {
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
            this._onPointClick(point.data(this._options.keyField));
         }
      },

      /**
       * Обработчик клика на пункт пути
       * id - id по которому нужно перейти
       * Удалет все пункты до того на который кликнули
       * Если кликнули на первый пункт то удаляем его и переходим на уровень выше
       */
      _onPointClick: function(id) {
         var length = this._dataSet.getCount(),
            last = this._dataSet.at(length - 1), newId = id,
            result;
         //Нажатие на последний пункт должно вести туда же куда не предпоследний
         if (id == last.get(this._options.keyField)) {
            newId = length > 1 ? this._dataSet.at(length - 2).get(this._options.keyField) : null;
         }
         for (var i = length - 1; i >= 0; i--) {
            var record = this._dataSet.at(i);
            if (record.getKey() !== last.getKey() && record.getKey() == id) break;
            this._dataSet.removeRecord(record.getKey());
            //TODO: убрать следующие 4 строчки когда будет нормальное удаление рекордов при sync'е StaticSource'а
            delete this._dataSet._byId[record.getKey()];
            delete this._dataSet._byId[record._cid];
            this._dataSet._rawData.splice(i, 1);
            this._dataSet._indexId.splice(i, 1);
            if (record.getKey() == id) break;
         }
         result = this._notify('onPointClick', id);
         if (result !== false){
            this._options.linkedView.setCurrentRoot(newId);
         }
      },

      _toggleHomeIcon: function(state){
         this._homeIcon.toggleClass('ws-hidden', state);
      },

      setItems: function(items){
         if (items.length) { items.unshift(this._getHomeIcon()); }
         PathSelector.superclass.setItems.call(this, items);
      },

      _rootChangeHandler: function(keys) {
         for (var i = keys.length - 1; i >= 0; i--) {
            var key = keys[i];
            if (key){
               var point = {};
               point[this._options.displayField] = $ws.helpers.escapeHtml(key.title);
               point[this._options.keyField] = key.key;
               point[this._options.colorField] = key.color;
               this._dataSet.push(point);
            }
         }
         this._toggleHomeIcon(this._dataSet.getCount() <= 0);
         this._redraw();
      },

      //TODO: придрот что бы фэйковый див не ломал :first-child стили
      _moveFocusToFakeDiv: function() {},

      _subscribeOnSetRoot: function() {
         var self = this;
         this._rootHandler = function(event, keys) {
            self._rootChangeHandler(keys);
         };
         this._options.linkedView.subscribe('onSetRoot', this._rootHandler, this);
      },

      _setPickerConfig: function() {
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

      _setPickerContent: function() {
         var self = this;
         this._redrawDropdown();
         this._picker._container.bind('mouseup', function(e) {
            self._onClickHandler(e);
         });
      },

      setLinkedView: function(view) {
         if (this._options.linkedView) {
            this._options.linkedView.unsubscribe('onSetRoot', this._rootHandler);
         }
         this._options.linkedView = view;
         this._subscribeOnSetRoot();
      },

      _redrawDropdown: function() {
         var self = this;
         if (this._picker) {
            var width = this._picker._container.width();
            this._picker._container.empty();
            this._dataSet.each(function(record) {
               if (record.get(self._options.keyField)){
                  var point = $('<div class="controls-MenuItem js-controls-PathSelector__point"></div>');
                     point.html(self._decorators.apply(
                           $ws.helpers.escapeHtml(record.get(self._options.displayField))
                     ))
                     .attr('style', self._decorators.apply(
                        self._options.colorField ? record.get(self._options.colorField) : '', 'color'
                     ));
                     point.data(self._options.keyField, record.get(self._options.keyField));
                  self._picker._container.append(point);
                  var previousContainer = point.prev('.js-controls-PathSelector__point', self._picker._container),
                     previousWrappersCount = $('.controls-PathSelector__hierWrapper', previousContainer).length;
                  if (previousContainer.length) {
                     for (var i = 0; i <= previousWrappersCount; i++) {
                        point.prepend('<div class="controls-PathSelector__hierWrapper"></div>');
                     }
                  }
               }
            });
            if (width !== this._dropdownWidth) {
               this._picker.recalcPosition(true);
               this._dropdownWidth = width;
            }
         }
      },

      _redraw: function() {
         PathSelector.superclass._redraw.call(this);
         $('.controls-PathSelector__dots', this._container).remove();
         var points = $('.controls-PathSelector__point', this._container),
            i = points.length - 2,
            targetContainer = this._getTargetContainer();
         //30px - ширина блока с троеточием
         //Добавляем троеточие если пункты не убираются в контейнер
         if (targetContainer.width() + 30 >= this._container.width()) {
            var dots = $(pointTpl({
               item: { 
                  title: '...',
                  dots: true,
                  get: function(field) {return this[field];}
               },
               decorators: this._decorators,
               displayField: this._options.displayField
            }));
            $(points[i]).before(dots);
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

      _getItemTemplate: function() {
         return pointTpl;
      },

      _buildTplArgs: function(item) {
         return {
            item: item,
            displayField: this._options.displayField,
            decorators: this._decorators
         };
      },

      _getTargetContainer: function() {
         return $('.controls-PathSelector__itemsContainer', this._container);
      },

      _addItemAttributes: function(container, item) {
         container.data(this._options.keyField, item.get(this._options.keyField));
         PathSelector.superclass._addItemAttributes.apply(this, arguments);
      },

      _appendItemTemplate: function(item, targetContainer, itemBuildedTpl) {
         targetContainer.prepend(itemBuildedTpl);
      },

      destroy: function() {
         PathSelector.superclass.destroy.call(this);
         if (this._options.linkedView) {
            this._options.linkedView.unsubscribe('onSetRoot', this._rootHandler);
         }
         $ws.single.EventBus.channel('WindowChangeChannel').unsubscribe('onWindowResize', this._resizeHandler, this);
      }
   });

   return PathSelector;
});