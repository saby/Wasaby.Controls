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
    * @author Крайнов Дмитрий Олегович
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
   //TODO: Переписать все к чертям 
   var BreadCrumbs = CompoundControl.extend([DSMixin, PickerMixin, DecorableMixin], {
      $protected: {
         _dotTplFn: dotTpl,
         _resizeTimeout: null,
         _dropdownWidth: null,
         _homeIcon: undefined,
         _sizesInited: false,
         _arrowWidth: 0,
         _homeIconWidth: 0,
         _dotsWidth: 0,
         _options: {
            keyField: 'id',
            displayField: 'title',
            /**
             * @cfg {String} Устанавливает шаблон отображения каждого элемента коллекции.
             * @remark
             * Шаблон - это пользовательская вёрстка элемента коллекции.
             * Для доступа к полям элемента коллекции в шаблоне подразумевается использование конструкций шаблонизатора.
             * Подробнее о шаблонизаторе вы можете прочитать в разделе {@link https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/core/component/xhtml/template/ Шаблонизация вёрстки компонента}.
             *
             * Шаблон может быть создан в отдельном XHTML-файле, когда вёрстка большая или требуется использовать его в разных компонентах.
             * Шаблон создают в директории компонента в подпапке resources согласно правилам, описанным в разделе {@link https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/core/component/file-structure/ Файловая структура компонента}.
             * Чтобы такой шаблон можно было использовать, нужно:
             * 1. Подключить шаблон в массив зависимостей компонента и импортировать его в переменную:
             *       <pre>
             *          define('js!SBIS3.MyArea.MyComponent',
             *             [
             *                ...
             *                'html!SBIS3.MyArea.MyComponent/resources/item_template'
             *             ],
             *             function(..., myItemTpl) {
                *             ...
                *          });
             *       </pre>
             * 2. Установить шаблон:
             *       <pre>
             *          <option name="itemTemplate">html!SBIS3.MyArea.MyComponent/resources/item_template</option>
             *       </pre>
             * Пример содержимого шаблона элемента коллекции вы можете найти в разделе "Примеры".
             *
             * @example
             * Далее приведён шаблон, который отображает значение поля title:
             * <pre>
             *     <div class="listViewItem" style="height: 30px;">
             *        {{=it.item.get("title")}}
             *     </div>
             * </pre>
             * @editor CloudFileChooser
             * @editorConfig extFilter xhtml
             *
             *
             */
            itemTemplate: pointTpl,
            pickerClassName: 'controls-Menu__Popup controls-BreadCrumbs'
         }
      },

      $constructor: function() {
         this._publish('onItemClick');
         this._homeIcon = $('.controls-BreadCrumbs__crumb-home', this._container);
         this._container.toggleClass('ws-hidden', (this._options.items && this._options.items.length == 0));
         this._homeIcon.data('id', null); //клик по домику ведет в корень TODO: придрочено под null
         this.getContainer().on('mousedown', this._onMousedownHandler);
         //инициализируем dataSet
         this.reload();
      },

      _onMousedownHandler: function(event) {
         event.stopPropagation();
      },

      _onClickHandler: function(e) {
         if (this.isEnabled()){
            BreadCrumbs.superclass._onClickHandler.apply(this, arguments);
            var target = $(e.target),
               crumb = target.closest('.js-controls-BreadCrumbs__crumb');
            if (crumb.hasClass('controls-BreadCrumbs__dots')) {
               this._dotsClickHandler(crumb)
            } else if (crumb.length) {
               this._notify('onItemClick', crumb.data(this._options.keyField));
            }
            if (this._picker.isVisible()){
               this._picker.hide();
            }
         }
      },
      /**
       * Обработчик клика на многоточие
       * вынесен отдельно для того, что бы можно было переопределить
       */
      _dotsClickHandler: function(crumb){
         if (this._picker) {
            this._picker.setTarget(crumb);
         }
         this.togglePicker();
         if (this._picker.isVisible()) {
            this._redrawDropdown();
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
      },

      //Переопределяю метод getElementToFocus для того, чтобы не создавался fake focus div
      _getElementToFocus: function() {
         return this._container;
      },

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
         this._initNonTextElementSizes();
         // Уберем троеточие, что бы оно не мешало при расчете размеров
         // или создадим его, если его нет
         var dots = $('.controls-BreadCrumbs__dots', this._container);
         if (dots.length){
            dots.detach();
         } else {
            dots = $(pointTpl({
                  item: {
                     title: '...',
                     dots: true,
                     get: function(field) {return this[field];}
                  },
                  decorators: this._decorators,
                  displayField: this._options.displayField
               }));
         }

         var targetContainer = this._getTargetContainer(),
            containerWidth = this._container.width(),
            points = $('.controls-BreadCrumbs__crumb', targetContainer),
            i = points.length - 1;

         if (points.length){
            //Добавляем троеточие если пункты не убираются в контейнер
            if ((targetContainer.width() + this._homeIconWidth >= containerWidth) && points.length > 2) {
               $(points[i - 1]).before(dots);
               //скрываем пункты левее троеточия пока не уберемся в контейнер
               for (i; i > 1; i--) {
                  if (targetContainer.width() + this._homeIconWidth < containerWidth || i == 1) {
                     break;
                  }
                  points[i - 1].className += ' ws-hidden';
               }
            }
            
            //Если после всех манипуляций все еще не убираемся в контейнер, будем обрезать текст
            points = $('.controls-BreadCrumbs__crumb:not(.ws-hidden)', targetContainer);

            //Минимум остается первая и последняя хлебная крошка
            if (targetContainer.width() + this._homeIconWidth >= containerWidth) {
               //ширина декоротивных элементов -  блок с домиком, троеточие, стрелки 
               var dotsWidth = $('.controls-BreadCrumbs__dots', this._container).outerWidth(true) || 0;
               var width = this._homeIconWidth + dotsWidth + this._arrowWidth * 2;
               var halfWidth = Math.floor((containerWidth - width) / 2);
               if (points.length >= 2){
                  $('.controls-BreadCrumbs__title', points).css('max-width', halfWidth);
               } else {
                  $('.controls-BreadCrumbs__title', points).css('max-width', containerWidth - width);
               }
            }
         }
      },

      _redraw: function(){
         //Если датасета нет или он есть, но пустой, то скрываем home
         var isEmpty = (!this._dataSet || (this._dataSet && (this._dataSet.getCount() == 0)));
         this._toggleHomeIcon(isEmpty);
         this._container.toggleClass('ws-hidden', isEmpty);
         BreadCrumbs.superclass._redraw.call(this);
         this._calculateSizes();
      },

      _initNonTextElementSizes: function(){
         if (!this._homeIconWidth || !this._arrowWidth){
            this._homeIconWidth = $('.controls-BreadCrumbs__crumb-home', this._container).outerWidth(true);
            this._arrowWidth = $('.controls-BreadCrumbs__arrow', this._container).outerWidth(true);
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
         this.getContainer().off('mousedown', this._onMousedownHandler);
         BreadCrumbs.superclass.destroy.apply(this, arguments);
      }
   });

   return BreadCrumbs;
});
