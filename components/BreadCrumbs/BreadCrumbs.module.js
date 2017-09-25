define('js!SBIS3.CONTROLS.BreadCrumbs', [
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.ItemsControlMixin',
   'js!SBIS3.CONTROLS.PickerMixin',
   'js!SBIS3.CONTROLS.DecorableMixin',
   'tmpl!SBIS3.CONTROLS.BreadCrumbs',
   'tmpl!SBIS3.CONTROLS.BreadCrumbs/resources/itemContentTpl',
   'tmpl!SBIS3.CONTROLS.BreadCrumbs/resources/dotsTpl',
   'tmpl!SBIS3.CONTROLS.BreadCrumbs/resources/itemTpl',
   'tmpl!SBIS3.CONTROLS.BreadCrumbs/resources/menuItem',
   'Core/helpers/String/escapeHtml',
   'Core/helpers/String/escapeUnicode',
   "Core/IoC",
   'Core/helpers/Function/memoize',
   'css!SBIS3.CONTROLS.BreadCrumbs',
   'css!SBIS3.CONTROLS.Menu',
   'css!SBIS3.CONTROLS.MenuItem'
], function(CompoundControl, ItemsControlMixin, PickerMixin, DecorableMixin, dotTplFn, itemContentTpl, dotsTpl, itemTpl, menuItem, escapeHtml, escapeUnicode, IoC, memoize) {
   /**
    * Класс контрола "Хлебные крошки". Основное применение - <a href='https://wi.sbis.ru/doc/platform/patterns-and-practices/typical-list/'>иерархические реестры</a>.
    * @class SBIS3.CONTROLS.BreadCrumbs
    * @extends SBIS3.CORE.CompoundControl
    *
    * @author Герасимов Александр Максимович
    *
    * @mixes SBIS3.CONTROLS.ItemsControlMixin
    * @mixes SBIS3.CONTROLS.PickerMixin
    * @mixes SBIS3.CONTROLS.DecorableMixin
    *
    * @control
    * @public
    * @category Navigation
    * @initial
    * <component data-component='SBIS3.CONTROLS.BreadCrumbs'>
    * </component>
    */
   'use strict';
   var BREAD_CRUMB_MIN_WIDTH = 36;
   var BreadCrumbs = CompoundControl.extend([ItemsControlMixin, PickerMixin, DecorableMixin], /** @lends SBIS3.CONTROLS.BreadCrumbs.prototype */{
       /**
        * @event onItemClick Происходит при клике по хлебным крошкам (элементу коллекции).
        * @param {Number|String} idProperty Идентификатор элемента коллекции.
        */
      _dotTplFn: dotTplFn,
      $protected: {
         _resizeTimeout: null,
         _dropdownWidth: null,
         _homeIcon: undefined,
         _sizesInited: false,
         _arrowWidth: 0,
         _homeIconWidth: 0,
         _dotsWidth: 0,
         _paddings: undefined,
         _BCmargins: undefined,
         _options: {
            idProperty: 'id',
            displayField: '',
            displayProperty: 'title',
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
            itemTpl: itemTpl,
            itemContentTpl: itemContentTpl,
            _defaultItemContentTemplate: itemContentTpl,
            _defaultItemTemplate: itemTpl,
            pickerClassName: 'controls-Menu__Popup controls-BreadCrumbs '
         }
      },

      _modifyOptions: function(cfg) {
         var newCfg = BreadCrumbs.superclass._modifyOptions.apply(this, arguments);
         if (!cfg.items || cfg.length !== 0) {
            newCfg.visible = false;
         }

         if (cfg.keyField) {
            IoC.resolve('ILogger').log('BreadCrumbs', 'Опция keyField является устаревшей, используйте idProperty');
            cfg.idProperty = cfg.keyField;
         }
         if (cfg.displayField) {
            IoC.resolve('ILogger').log('BreadCrumbs', 'Опция displayField является устаревшей, используйте displayProperty');
            cfg.displayProperty = cfg.displayField;
         }
         return newCfg;
      },

      $constructor: function() {
         this._publish('onItemClick');
         this._homeIcon = $('.controls-BreadCrumbs__crumb-home', this._container);
         this.toggle(this.getItems() && this.getItems().getCount() === 0);
         this.getContainer().on('mousedown', this._onMousedownHandler);
      },

      _onMousedownHandler: function(event) {
         event.stopPropagation();
      },

      _onClickHandler: function(e, fromDropdown) {
         var
            crumbId, crumbPath, items, item, idx;
         if (this.isEnabled()){
            BreadCrumbs.superclass._onClickHandler.apply(this, arguments);
            var target = $(e.target),
               crumb = target.closest('.js-controls-BreadCrumbs__crumb');
            if (crumb.hasClass('controls-BreadCrumbs__dots')) {
               this._dotsClickHandler();
               e.stopPropagation();
            } else {
               if (crumb.length) {
                  crumbId = crumb.data('id');
                  crumbPath = [];
                  items = this.getItems();
                  idx = 0;
                  do {
                     item = items.at(idx)
                     crumbPath.push(item.getId());
                     idx ++;
                  } while (item.getId() != crumbId && idx < items.getCount());

                  this._notify('onItemClick', crumbId);
                  this.sendCommand('BreadCrumbsItemClick', crumbId, crumbPath);
                  e.stopPropagation();
               }
            }
            if (this._picker && this._picker.isVisible() && fromDropdown){
               this._picker.hide();
            }
         }
      },
      /**
       * Обработчик клика на многоточие
       * вынесен отдельно для того, что бы можно было переопределить
       */
      _dotsClickHandler: function(){
         if (this._picker) {
            this._picker.setTarget(this._dots);
         }
         this.togglePicker();
         if (this._picker && this._picker.isVisible()) {
            this._redrawDropdown();
         }
      },

      _toggleHomeIcon: function(state){
         if (this._homeIcon){
            this._homeIcon.toggleClass('ws-hidden', state);
         }
      },

      //Переопределяю метод getElementToFocus для того, чтобы не создавался fake focus div
      _getElementToFocus: function() {
         return this._container;
      },

      _setPickerConfig: function() {
         return {
            target: this._dots,
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
            self._onClickHandler(e, true);
         });
      },

      //TODO: переделать на компонент (TreeListView?)
      _redrawDropdown: function() {
         var self = this;
         if (this._picker) {
            var width = this._picker._container.width(),
               previousWrappersCount = 0,
               hier = [];
            this._picker.getContainer().empty();
            this.getItems().each(function(record) {
               if (record.get(self._options.idProperty)){
                  var tmplData = {
                     decorators: self._options._decorators,
                     colorField: self._options.colorField ? record.get(self._options.colorField) : '',
                     record: record,
                     idProperty: self._options.idProperty,
                     displayProperty: self._options.displayProperty,
                     wrappersCount: previousWrappersCount
                  };
                  hier.push(menuItem(tmplData));
                  previousWrappersCount++;
               }
            });
            this.getPicker().getContainer().append(hier.join(''));

            if (width !== this._dropdownWidth) {
               this._picker.recalcPosition(true);
               this._dropdownWidth = width;
            }
         }
      },

      _onResizeHandler: function(){
         var containerWidth = this._getContainerWidth()
         if (this._prewContainerWidth != containerWidth) {
            this.redraw();
            this._prewContainerWidth = containerWidth;
         }
      },

      _calculateSizes: function() {
         this._initNonTextElementSizes();
         this._paddings =  this._paddings === undefined ? this._container.innerWidth() - this._container.width() : this._paddings;
         this._BCmargins = this._BCmargins === undefined ? this._container.outerWidth(true)  - this._container.outerWidth(): this._BCmargins;

         // Уберем троеточие, что бы оно не мешало при расчете размеров
         // или создадим его, если его нет


         var targetContainer = this._getTargetContainer(),
             containerWidth =  this._getContainerWidth(),
             crumbs = $('.controls-BreadCrumbs__crumb', targetContainer),
             i = crumbs.length - 1;

         if (!crumbs.length || containerWidth == 0){
            return;
         }
         //Добавляем троеточие если пункты не убираются в контейнер
         if ((targetContainer.width() + this._homeIconWidth >= containerWidth) && crumbs.length > 2) {
            $(crumbs[i - 1]).before(this._dots);
            //скрываем пункты левее троеточия пока не уберемся в контейнер
            for (i; i > 1; i--) {
               if (targetContainer.width() + this._homeIconWidth < containerWidth || i == 1) {
                  break;
               }
               crumbs[i - 1].className += ' ws-hidden';
            }
         }

         //Если после всех манипуляций все еще не убираемся в контейнер, будем обрезать текст
         crumbs = $('.controls-BreadCrumbs__crumb', targetContainer).not('.ws-hidden').not('.controls-BreadCrumbs__dots');

         //Минимум остается первая и последняя хлебная крошка
         if (targetContainer.outerWidth(true) + this._homeIconWidth >= containerWidth) {
            //ширина декоротивных элементов -  блок с домиком, троеточие, стрелки
            var dotsWidth = $('.controls-BreadCrumbs__dots', this._container).outerWidth(true) || 0,
               width = this._homeIconWidth + dotsWidth + this._arrowWidth,
               halfWidth = Math.floor((containerWidth - width) / 2);
            //Если два элемента
            if (crumbs.length == 2){
               var first = crumbs.eq(0), 
                  firstWidth = first.width(),
                  last = crumbs.eq(1), 
                  lastWidth = last.width();

               if (firstWidth > halfWidth && lastWidth > halfWidth){
                  $('.controls-BreadCrumbs__title', crumbs).css('max-width', halfWidth);
               } else {
                  if (firstWidth > halfWidth) {
                     $('.controls-BreadCrumbs__title', first).css('max-width', containerWidth - width - lastWidth - this._getAdditionalCrumbWidth(first));
                  } else {
                     $('.controls-BreadCrumbs__title', last).css('max-width', containerWidth - width - firstWidth - this._getAdditionalCrumbWidth(last));
                  }
               }
            } else {
               $('.controls-BreadCrumbs__title', crumbs).css('max-width', containerWidth - width - this._getAdditionalCrumbWidth(crumbs));
            }
         }

         var hiddenCrumbs = $('.controls-BreadCrumbs__crumb.ws-hidden', targetContainer),
            firstHidden = hiddenCrumbs.first(),
            emptyWidth = containerWidth - targetContainer.outerWidth(true) - this._homeIconWidth - this._arrowWidth - 20;
         if (hiddenCrumbs.length && emptyWidth > BREAD_CRUMB_MIN_WIDTH){
            $('.controls-BreadCrumbs__title', firstHidden).css('max-width', emptyWidth);
            firstHidden.removeClass('ws-hidden');
            if (hiddenCrumbs.length > 1){
               this._dots.insertAfter(firstHidden);
            } else {
               this._dots.detach();
            }
         }
      },

      _getAdditionalCrumbWidth: function(crumb){
         return crumb.width() - $('.controls-BreadCrumbs__title', crumb).width(); 
      },

      redraw: function(){
         //Если датасета нет или он есть, но пустой, то скрываем home
         var isEmpty = (!this.getItems() || (this.getItems() && (this.getItems().getCount() === 0)));
         this._toggleHomeIcon(isEmpty);
         this.toggle(!isEmpty);
         //
         if (this._dots){
            this._dots.detach();
         } else {
            this._dots = $(dotsTpl());
         }
         
         BreadCrumbs.superclass.redraw.call(this);
         if (this.getItems() && this.getItems().getCount() && this.isVisible()){
            this._calculateSizes();
         }
      },

      _initNonTextElementSizes: function(){
         if (!this._homeIconWidth || !this._arrowWidth){
            this._homeIconWidth = $('.controls-BreadCrumbs__crumb-home', this._container).outerWidth(true);
            this._arrowWidth = $('.controls-BreadCrumbs__arrow', this._container).last(0).outerWidth(true);
         }
      },

      _buildTplArgs: function(item) {
         var args = BreadCrumbs.superclass._buildTplArgs.apply(this, arguments);
         args.decorators = this._options._decorators;
         args.escapeHtml = escapeHtml;
         args.escapeUnicode = escapeUnicode;
         return args;
      },
      
      _getContainerWidth: function () {
         var maxWidth = parseFloat(this._container.css('max-width')),
             boundingClientRect = this._container[0].getBoundingClientRect();
         
         return  maxWidth ? maxWidth : Math.ceil(Math.abs(boundingClientRect.left - boundingClientRect.right) - this._paddings - this._BCmargins);
      },

      _getItemsContainer: memoize(function() {
         return $('.controls-BreadCrumbs__itemsContainer', this._container);
      }, '_getItemsContainer'),

      destroy: function() {
         this.getContainer().off('mousedown', this._onMousedownHandler);
         BreadCrumbs.superclass.destroy.apply(this, arguments);
      }
   });

   return BreadCrumbs;
});
