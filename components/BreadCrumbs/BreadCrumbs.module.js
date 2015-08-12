define('js!SBIS3.CONTROLS.BreadCrumbs', [
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.DSMixin',
   'js!SBIS3.CONTROLS.PickerMixin',
   'js!SBIS3.CONTROLS.DecorableMixin',
   'html!SBIS3.CONTROLS.BreadCrumbs',
   'html!SBIS3.CONTROLS.BreadCrumbs/resources/pointTpl'
], function(CompoundControl, DSMixin, PickerMixin, DecorableMixin, dotTpl, pointTpl) {
   'use strict';

   if (typeof window !== 'undefined') {
      var eventsChannel = $ws.single.EventBus.channel('BreadCrumbsChannel');

      $(window).bind('resize', function() {
         eventsChannel.notify('onWindowResize');
      });
   }
   //TODO: Переписать все к чертям 
   var BreadCrumbs = CompoundControl.extend([DSMixin, PickerMixin, DecorableMixin], {
      $protected: {
         _dotTplFn: dotTpl,
         _resizeTimeout: null,
         _dropdownWidth: null,
         _homeIcon: undefined,
         _options: {
            keyField: 'id',
            displayField: 'title',
            itemTemplate: pointTpl,
            pickerClassName: 'controls-Menu__Popup controls-BreadCrumbs'
         }
      },

      $constructor: function() {
         this._publish('onItemClick');
         $ws.single.EventBus.channel('WindowChangeChannel').subscribe('onWindowResize', this._resizeHandler, this);
         this._homeIcon = $('.controls-BreadCrumbs__crumb-home', this._container);
         this._homeIcon.data('id', null); //клик по домику ведет в корень TODO: придрочено под null
         //инициализируем dataSet
         this.setItems(this._options.items || []);
      },

      _resizeHandler: function() {
         clearTimeout(this._resizeTimeout);
         var self = this;
         this._resizeTimeout = setTimeout(function() {
            self._redraw();
         }, 100);
      },

      _onClickHandler: function(e) {
         BreadCrumbs.superclass._onClickHandler.apply(this, arguments);
         var target = $(e.target),
            point = target.closest('.js-controls-BreadCrumbs__crumb');
         if (point.hasClass('controls-BreadCrumbs__dots')) {
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
            last = this._dataSet.at(length - 1);
         //Нажатие на последний пункт должно вести туда же куда не предпоследний
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
         this._notify('onItemClick', id);
      },

      _toggleHomeIcon: function(state){
         if (this._homeIcon){
            this._homeIcon.toggleClass('ws-hidden', state);
         }
      },

      setItems: function(items){
         BreadCrumbs.superclass.setItems.call(this, items);
         this._toggleHomeIcon(items.length <= 0);
      },

      //TODO: придрот что бы фэйковый див не ломал :first-child стили
      _moveFocusToFakeDiv: function() {},

      _setPickerConfig: function() {
         return {
            target: $('.controls-BreadCrumbs__dots', this._container),
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

      _redrawDropdown: function() {
         var self = this;
         if (this._picker) {
            var width = this._picker._container.width();
            this._picker._container.empty();
            this._dataSet.each(function(record) {
               if (record.get(self._options.keyField)){
                  var point = $('<div class="controls-MenuItem js-controls-BreadCrumbs__crumb"></div>');
                     point.html(self._decorators.apply(
                           $ws.helpers.escapeHtml(record.get(self._options.displayField))
                     ))
                     .attr('style', self._decorators.apply(
                        self._options.colorField ? record.get(self._options.colorField) : '', 'color'
                     ));
                     point.data(self._options.keyField, record.get(self._options.keyField));
                  self._picker._container.append(point);
                  var previousContainer = point.prev('.js-controls-BreadCrumbs__crumb', self._picker._container),
                     previousWrappersCount = $('.controls-BreadCrumbs__hierWrapper', previousContainer).length;
                  if (previousContainer.length) {
                     for (var i = 0; i <= previousWrappersCount; i++) {
                        point.prepend('<div class="controls-BreadCrumbs__hierWrapper"></div>');
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
         BreadCrumbs.superclass._redraw.call(this);
         $('.controls-BreadCrumbs__dots', this._container).remove();
         var targetContainer = this._getTargetContainer(),
            containerWidth = this._container.width(),
            points = $('.controls-BreadCrumbs__crumb', targetContainer),
            i = points.length - 1;
         if (points.length){
            points[i].className += ' ws-hidden';
            //36px - ширина блока с домиком
            //Добавляем троеточие если пункты не убираются в контейнер
            if ((targetContainer.width() + 58 >= containerWidth) && points.length > 2) {
               var dots = $(pointTpl({
                  item: {
                     title: '...',
                     dots: true,
                     get: function(field) {return this[field];}
                  },
                  decorators: this._decorators,
                  displayField: this._options.displayField
               }));
               $(points[i - 1]).before(dots);
               //скрываем пункты левее троеточия пока не уберемся в контейнер
               for (i; i > 2; i--) {
                  if (targetContainer.width() + 20 < containerWidth || i == 1) {
                     break;
                  }
                  points[i - 2].className += ' ws-hidden';
               }
            }
            
            //Если после всех манипуляций все еще не убираемся в контейнер, будем обрезать текст
            if ((targetContainer.width() + 30 > containerWidth)) {
               var third = (containerWidth - 60) / 3;
               if (points.length > 2){
                  $('.controls-BreadCrumbs__title', points[0]).css('max-width', third * 2 - 20);
                  $('.controls-BreadCrumbs__title', points[points.length - 2]).css('max-width', third - 60);
               } else {
                  $('.controls-BreadCrumbs__title', points[0]).css('max-width', containerWidth - 60);
               }
            }
         }

         if (this._picker) {
            this.hidePicker();
         }
      },

      _getItemTemplate: function() {
         return this._options.itemTemplate;
      },

      _buildTplArgs: function(item) {
         return {
            item: item,
            displayField: this._options.displayField,
            decorators: this._decorators
         };
      },

      _getTargetContainer: function() {
         return $('.controls-BreadCrumbs__itemsContainer', this._container);
      },

      _addItemAttributes: function(container, item) {
         container.data(this._options.keyField, item.get(this._options.keyField));
         BreadCrumbs.superclass._addItemAttributes.apply(this, arguments);
      },

      _appendItemTemplate: function(item, targetContainer, itemBuildedTpl) {
         targetContainer.append(itemBuildedTpl);
      },

      destroy: function() {
         BreadCrumbs.superclass.destroy.call(this);
         $ws.single.EventBus.channel('WindowChangeChannel').unsubscribe('onWindowResize', this._resizeHandler, this);
      }
   });

   return BreadCrumbs;
});