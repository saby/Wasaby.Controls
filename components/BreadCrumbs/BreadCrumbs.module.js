define('js!SBIS3.CONTROLS.BreadCrumbs', [
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.DSMixin',
   'js!SBIS3.CONTROLS.PickerMixin',
   'js!SBIS3.CONTROLS.DecorableMixin',
   'html!SBIS3.CONTROLS.BreadCrumbs',
   'html!SBIS3.CONTROLS.BreadCrumbs/resources/pointTpl'
], function(CompoundControl, DSMixin, PickerMixin, DecorableMixin, dotTpl, pointTpl) {
   /**
    * Контрол рисующий "Хлебные крошки"
    * Пример использования - иерархические реестры
    * @class SBIS3.CONTROLS.BreadCrumbs
    * @extends $ws.proto.CompoundControl
    * @control
    * @public
    * @initial
    * <component data-component='SBIS3.CONTROLS.BreadCrumbs'>
    * </component>
    * @mixes SBIS3.CONTROLS.DSMixin
    * @mixes SBIS3.CONTROLS.PickerMixin
    * @mixes SBIS3.CONTROLS.DecorableMixin
    */
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
         $ws.single.EventBus.channel('BreadCrumbsChannel').subscribe('onWindowResize', this._resizeHandler, this);
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
            this._notify('onItemClick', point.data(this._options.keyField));
         }
      },

      _toggleHomeIcon: function(state){
         if (this._homeIcon){
            this._homeIcon.toggleClass('ws-hidden', state);
         }
      },

      setItems: function(items){
         BreadCrumbs.superclass.setItems.call(this, items);
         this._dataSet._keyField = this._options.keyField; 
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

      //TODO: переделать на компонент (TreeListView?)
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

      _onResizeHandler: function(){
         this._redraw();
      },

      _calculateSizes: function() {
         var dots = $('.controls-BreadCrumbs__dots', this._container).detach();
         var targetContainer = this._getTargetContainer(),
            containerWidth = this._container.width(),
            points = $('.controls-BreadCrumbs__crumb', targetContainer),
            i = points.length - 1;

         if (!dots.length)
            dots = $(pointTpl({
               item: {
                  title: '...',
                  dots: true,
                  get: function(field) {
                     return this[field];
                  }
               },
               decorators: this._decorators,
               displayField: this._options.displayField
            }));

         if (points.length) {
            //20px - ширина блока с домиком
            //Добавляем троеточие если пункты не убираются в контейнер
            if ((targetContainer.width() + 20 >= containerWidth) && points.length > 2) {
               $(points[i - 1]).before(dots);
               //скрываем пункты левее троеточия пока не уберемся в контейнер
               for (i; i > 1; i--) {
                  if (targetContainer.width() + 20 < containerWidth || i == 1) {
                     break;
                  }
                  points[i - 1].className += ' ws-hidden';
               }
            }

            //Если после всех манипуляций все еще не убираемся в контейнер, будем обрезать текст
            points = $('.controls-BreadCrumbs__crumb:not(.ws-hidden)', targetContainer);

            //Минимум остается первая и последняя хлебная крошка
            //20px - ширина блока с домиком
            //78px - блок с домиком + стрелка + троеточие
            if ((targetContainer.width() + 20 >= containerWidth)) {
               var halfWidth = (containerWidth - 78) / 2;
               if (points.length >= 2) {
                  $('.controls-BreadCrumbs__title', points).css('max-width', halfWidth);
               } else {
                  $('.controls-BreadCrumbs__title', points).css('max-width', containerWidth - 60);
               }
            }
         }
      },

      _redraw: function() {
         BreadCrumbs.superclass._redraw.call(this);
         this._calculateSizes();
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