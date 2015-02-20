/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 22.04.13
 * Time: 10:42
 * To change this template use File | Settings | File Templates.
 */
define('js!SBIS3.CORE.Tabs', ['js!SBIS3.CORE.AreaAbstract', 'js!SBIS3.CORE.FieldEditAtPlace', 'js!SBIS3.CORE.TabTemplatedArea', 'css!SBIS3.CORE.Tabs'],
   function( AreaAbstract, FEditAtPlace, TabTemplatedArea ) {

   'use strict';

   $ws._const.Tabs = {
      animationSpeed : 4,//Каждый шаг анимации уменьшает разницу между нужным значением и текущим в animationSpeed/(animationSpeed - 1) раз
      //К примеру, если 2, то за первый раз оно "съест" половину разницы, за второй - половину от оставшегося и т. д.
      animationTimer : 30,//Раз в это число милисекунд будет обновляться отступ
      animationLimit : 4,//При разнице значений текущего отступа и нужного, меньшего этой величины, анимация закончится
      scrollButtonsVerticalTextHeight : 36,//Высота кнопок скролла при вертикальном скролле (сумма высот обеих кнопок)
      scrollButtonsWidth : 52,//Ширина кнопок влево-вправо
      tabScrollButtonsHeight : 18, //высота кнопок скролла
      tabSheetBorder : 2, // border
      firstHorizontalScrollButtonPadding : 0, //при горизонтальном расположении табов отступ ближайшей кнопки к краю
      secondHorizontalScrollButtonPadding : 26, //при горизонтальном расположении табов отступ дальней кнопки к краю
      iconPadding : 18, //левый отступ у ярлыков, которые имеют иконку
      verticalTextFirstScrollPadding : 0,//Отступ у кнопки "вниз"
      scrollDisabledOpacity : 0.5,//Прозрачность иконок выключенного скролла
      scrollEnabledOpacity : 1,//Прозрачность иконок включённого скролла
      scrollButtonsBonusWidth: 10//Сумма горизонтальных отступов и границ у кнопок-скроллеров
   };
   var TabEditAtPlace = FEditAtPlace.extend({
      canAcceptFocus: function () {
         return TabEditAtPlace.superclass.canAcceptFocus.apply(this, arguments) && (this._container.parents('.ws-tabs-button-inactive').length === 0);
      }
   });
   /**
    * Класс-контрол табов.
    * Ярлыки для табов могут располагаться только сверху.
    * Можно установить размеры всего контрола, и есть возможность установить высоту auto.
    * Если ярлыки слева или справа, то:
    *    - можно установить отображение вертикального текста (с учётом решений для css3 в InternetExplorer)
    *    - иначе ширина всех ярлыков будет растягиваться до максимальной ширины из всех ярлыков, но не больше 50%
    * Можно убирать ярлыки вкладок, по умолчанию выключено.
    * Можно убрать скролл, тогда если не хватит ширины, то ярлыки будут в несколько строк и будут растягиваться
    * до максимальной ширины.
    * Для ярлыков вкладок можно устанавливать иконки.
    * Для ярлыков вкладок можно устанавливать ширину, при этом:
    *    - если ширина больше, то текст будет обрезаться;
    *    - если ярлыки вкладок конфигурировать слева или справа, то ширина будет не больше установленного размера, но, в
    *    то же время, всё ещё не больше 50% контрола;
    *    - если скролл выключен, то ярлыки вкладок всё равно будут растягиваться, но ширина каждой будет не меньше,
    *      чем установленное значение;
    * При переключении вкладок происходит автоматическое прокручивание до ярлыка выбранной вкладки.
    * При скролле ярлыков вкладок не может появляться пустое место справа или слева от них.
    * При изменении размера внешнего контейнера ярлыки могут скроллиться (пред. пункт).
    * При изменении размера идёт перерасчёт ширины ярлыков, если они слева или справа, но не при вертикальном тексте.
    */
   /**
    * Закладки
    * @class $ws.proto.Tabs
    * @extends $ws.proto.AreaAbstract
    * @category Containers
    * @initial
    * <component data-component='SBIS3.CORE.Tabs'>
    *    <options name='tabs' type='array'>
    *       <options>
    *          <option name='title' value='Вкладка 1'></option>
    *       </options>
    *       <options>
    *          <option name='title' value='Вкладка 2'></option>
    *       </options>
    *       <options>
    *          <option name='title' value='Вкладка 3'></option>
    *       </options>
    *    </options>
    * </component>
    * @icon tabsIcon.png
    */
   $ws.proto.Tabs = AreaAbstract.extend(/** @lends $ws.proto.Tabs.prototype */{
      /**
       * @event onBeforeShowFirstTab До показа первой вкладки
       * Событие наступает перед показом закладок. В обработчик события в качестве агрумента придёт идентификатор первой
       * вкладки.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} id идентификатор вкладки
       * @return {String} Можно заменить пришедший в аргумент идентификатор на другой, и первой станет нужная вкладка,
       * соответствующая установленному идентификатору.
       * @example
       * <pre>
       *     var doc = this.getDocument();
       *     tabs.subscribe('onBeforeShowFirstTab', function(event) {
       *        if (doc.hasRecords()) {
       *           event.setResult('recordList');
       *        } else {
       *           event.setResult('people');
       *        }
       *     });
       * </pre>
       */
      /**
        * @event onTabChange При клике на блок с закладками
        * @param {$ws.proto.EventObject} eventObject Дескриптор события.
        * @param {String} id Идентификатор закладки.
        * @example
        * <pre>
        *     tabs.subscribe('onTabChange', function(event, tabId) {
        *        if (tabId === 'recordList') {
        *           label.setText('Количество записей: ' + this.getRecordCount());
        *        } else {
        *           label.setText('Количество людей: ' + this.getPeopleCount());
        *        }
        *     }.bind(this));
        * </pre>
        */
      /**
        * @event onTabLoaded После загрузки шаблона вкладки
        * @param {$ws.proto.EventObject} eventObject Дескриптор события.
        * @param {String} id идентификатор вкладки
        * @example
        * <pre>
        *     tabs.subscribe('onTabLoaded', function(event, tabId) {
        *        if (tabId === 'people') {
        *           this.getTab(tabId).find('.button').click(function() {
        *              this.setCurrentTab('recordList');
        *           }.bind(this));
        *        }
        *     });
        * </pre>
        */

      $protected: {
         _options: {
            /**
             * @typedef {object} TabElement
             * @property {string} title     имя таба, которое отображается на кнопке
             * @property {string} id        айди для внутреннего использования - к этой вкладке можно обращаться по нему
             * @property {string} text      текст для отображения внутри вкладки
             * @property {string} template  путь к шаблону, который загрузится
             * @property {string} icon      путь к иконке
             *
             * @translatable title text
             */
            /**
             * @cfg {TabElement[]} Массив с табами
             * <wiTag group="Данные">
             * В описании каждой закладки могут быть следующие параметры:
             * <ol>
             *    <li>id - уникальный идентификатор, по нему можно обратиться к закладке;</li>
             *    <li>title - имя, отображается в корешке;</li>
             *    <li>icon - иконка вида 'sprite:icon-16 icon-DocumentTerm icon-primary';</li>
             *    <li>template - шаблон для листа;</li>
             *    <li>text - текст для листа;</li>
             *    <li>align - выравнивание корешка (left/right).</li>
             * </ol>
             * @example
             * <pre>
             *    tabs: [
             *       //порядковый номер этой закладки 0
             *       {
             *          title: 'Один таб',   //имя таба, которое отображается на ярлыке вкладки
             *          id: 'someId',        //идентификатор для внутреннего использования, по нему можно обратиться к этой вкладке
             *          text: 'some text',          // текст для отображения внутри вкладки
             *          template: 'somepath',       // путь к шаблону, который загрузится
             *          align: 'left'               // корешок закладки слева
             *       },
             *       {
             *          title: 'Другой таб', //имя таба, которое отображается на кнопке ярлыке вкладки
             *          id: 'anotherId',     //идентификатор для внутреннего использования, по нему можно обратиться к этой вкладке
             *          text: 'some text',          // текст для отображения внутри вкладки
             *          template: 'somepath',       // путь к шаблону, который загрузится
             *          icon: 'sprite:icon-16 icon-Fire icon-primary',       // указываем иконку
             *          align: 'right'              //корешок закладки справа
             *       }
             *    ]
             * </pre>
             * @see defaultTab
             * @see hasBorder
             */
            tabs : [],
            /**
             * @cfg {Boolean} В одну ли строчку все ярлыки
             * <wiTag group="Отображение" noShow>
             * @deprecated Опция не поддерживается с 3.6.
             * @see align
             */
            scrollable : true,
            /**
             * @cfg {String} Позиция ярлыков
             *    -  bottom
             *    -  left
             *    -  right
             *    -  top
             * <wiTag group="Управление" noShow>
             * @deprecated Опция не поддерживается с 3.6. Закладки только сверху.
             */
            position : 'top',
            /**
             * @cfg {Number|String} Ширина всего вместе
             * Или 'auto' - автоматически.
             * <wiTag group="Управление">
             */
            width : 'auto',
            /**
             * @cfg {Number|String} Высота всего вместе
             * <wiTag group="Управление">
             */
            height: '120px',
            /**
             * @cfg {Boolean} Подгружать шаблоны при создании
             * <wiTag group="Управление">
             * Подгружать шаблоны для всех закладок при создании, или же при клике по ним.
             * Возможные значения:
             * <ol>
             *    <li>true  - шаблоны для закладок подрузятся при создании всех табов;</li>
             *    <li>false - шаблоны для закладок подгрузятся при клике по табам.</li>
             * </ol>
             *
             */
            instantLoad : false,
            /**
             * @cfg {Boolean} Показывать ли корешки закладок
             * <wiTag group="Отображение">
             * Без корешков закладки можно будет переключать только кодом.
             * Возможные значения:
             * <ol>
             *    <li>true - показывать корешки закладок;</li>
             *    <li>false - не показывать корешки.</li>
             * </ol>
             * @see labelsWidth
             * @see align
             */
            showLabels : true,
            /**
             * @cfg {Boolean} Вертикальный текст для left и right позиций ярлыков.
             * <wiTag group="Отображение" noShow>
             * @deprecated Опция не поддерживается с 3.6.
             */
            verticalText : false,
            /**
             * @cfg {Number|String} Ширина ярлыков для вкладок
             * <wiTag group="Отображение">
             * Данное свойство задаёт ширину ярлыков вкладок.
             * Или 'auto' - автоматически.
             */
            labelsWidth : 'auto',
            /**
             * @cfg {Boolean} Есть ли граница у вкладок
             * <wiTag group="Отображение">
             * Возможные значения:
             * <ol>
             *    <li>true - будет наприсована граница у вкладок;</li>
             *    <li>false - без границы.</li>
             * </ol>
             * @see tabs
             */
            hasBorder : true,
            /**
             * @cfg {String} Вкладка по умолчанию
             * <wiTag group="Данные">
             * Данной опцией задаётся закладка, с которой откроется контрол.
             * Необходимо указать порядковый номер закладки среди описанных в {@link tabs}. Нумерация с начинается 0.
             * @see tabs
             */
            defaultTab: '',
            /**
             * @cfg {String} Выравнивание ярлыков табов
             * <wiTag noShow>
             * @see scrollable
             * @deprecated Опция не поддерживается с 3.6. Используйте align в описании конкретной закладки.
             */
            align: 'left',
            cssClassName: 'ws-tabs-container'
         },
         _tabEditors: {},                 //Редакторы по месту во вкладках
         _tabsSheets : {},                //Листы вкладок
         _tabsLabels : {},                //Ярлыки вкладок
         _loaded : {},                    //Загружен ли темплейт для указанной вкладки, флаги
         _templates : {},                 //Шаблоны для вкладок
         _block : undefined,              //Общий блок, в котором всё
         _header : undefined,             //Блок с ярлыками вкладок
         _body : undefined,               //Блок с листами вкладок
         _fullWidth : 0,                  //Суммарная ширина/высота всех ярлыков вкладок, нужна для расчёта показа кнопок <>
         _minWidth: 0,
         _previousLabelsWidths : {},      //Массив расстояний от начала первой вкладки, до правой границы вкладки с идентификатором равным ключу
         _labelsWidths : {},              //Ширины ярлыков вкладок
         _labelsIconPosition : 'left',    //С какой стороны считать отступ. Для ие при вертикальном тексте - сверху
         _scrollButtons : {},             // Блоки для перемещения влево-вправо
         _isScrollButtonsShowed : false,  // Флаг, показываются ли кнопки <>
         _scrollButtonsDisabled : {left : true, right : false}, //Задизейблены ли кнопки <>
         _controls : {},                  //При наличии шаблонов помнит TemplatedArea для указанной вкладки
         _currentId : undefined,          //Идентификатор текущей вкладки
         _scrollWidth : 'outerWidth',     //Имя метода для вычисления размера ярлыка вкладки (при вертикальном расположении ярлыков
                                          //будет иметь значение 'height')
         _scrollMargin : 'marginLeft',    //Аналогично для левого/верхнего отступа
         _isScrollVertical : false,       //Флаг, вертикальные ярлыки или нет
         _scrollButtonsWidth : 35,        //Ширина/высота кнопок для скролла влево-вправо
         _scrollShadows : {},             //Тени около кнопок скролла
         _currentMargin : 0,              //Текущее значние отступа для анимации
         _isScrollAnimation : false,      //Работает ли сейчас анимация
         _scrollToMargin : 0,             //Значение, которое будет достигнуто в результате анимации
         _bodyPadding : undefined,        //Элемент с отступом от ярлыков
         _tabsLabelOuterH: undefined,     //Горизонтальный padding у ярлыков
         _tabsLabelOuterV: undefined,     //Вертикальный padding у ярлыков
         _spacing: undefined,             //Отступ между ярлыками, берётся из css
         _hiddenTabs: {},                 //Идентификаторы скрытых вкладок
         _disabledTabs: {},               //Идентификаторы выключенных вкладок
         _firstTabReady: null,            //Деферред готовности первой вкладки
         _allLabelsShowed: true,          //Помещаются ли все ярлыки на экране. Если помещаются и стало меньше места, то в случае align === 'right' мы скроллим так, чтобы помещался крайний левый ярлык
         _prevWidth: 0,                   //Предыдущая ширина табов, используется для пересчёта отступа в случае align === 'right'
         _builded: false,                 //Флаг того, что ярлыки вкладок построены и выбрана дефолтная вкладка
         _defaultTab: 0,                  //Вкладка по умолчанию. Её мы можем поменять с помощью setCurrentTab до построения табов
                                          //Это число - индекс в options.tabs
         _scrollBarWidth: 0,              //Размер скроллбара в текущем браузере
         _headerScrolled: false,          //Был ли проскроллен заголовок. Если да, то анимируем при изменении размера
         _ready: undefined,               //Деферред готовности всех табов: требуется загрузка первого таба и общая обработка
         _animationDisabled: false,
         _rightsHiddenTabs : {},
         _button_active_classes: 'ws-tabs-button-active'
      },
      $constructor: function() {
         this._firstTabReady = new $ws.proto.Deferred();
         this._ready = new $ws.proto.Deferred();
         this._publish('onTabChange', 'onTabLoaded', 'onBeforeShowFirstTab');
         this._scrollBarWidth = $ws.helpers.getScrollWidth();
         if ($ws._const.browser.isMobileSafari) this._button_active_classes += ' ws-tabs-button-active-ios-bg-hack';
         // Если stretch выравнивание, то установить auto
         this._block = $('<div class="ws-tabs"></div>')
                        .width(this._horizontalAlignment === 'Stretch'? 'auto': this._options.width)
                        .height(this._verticalAlignment === 'Stretch'? 'auto': this._options.height);

         if (this._options.showLabels) {
            if (this._options.position !== 'top' && !this._options.scrollable) {
               this._options.scrollable = true;//Когда вкладки не сверху, скроллируемость есть всегда. Другого поведения не задано!
            }
            if ((this._options.position !== 'top' && this._options.position !== 'bottom') || !this._options.scrollable) {
               this._options.align = 'left';
            }
            this._header = $('<div class="ws-tabs-header' + (this._options.scrollable ? ' scrollable' : '') + '"><div class="ws-tabs-header-border"></div></div>');
         }
         this._defaultTab = parseInt(this._options.defaultTab, 10) || 0;

         this.once('onInit', this._loadDescendentsAfterInit);
      },

      _getControlsToBuild: function(template, parentId) {
         var ctrls = $ws.proto.Tabs.superclass._getControlsToBuild.apply(this, arguments);
         var defTab = this._notify('onBeforeShowFirstTab', this._options.defaultTab );
         if(defTab && typeof(defTab) === 'string' ){
            // FIXME Костыль... Вкладка должна определяться только по ID
            for(var i = 0; i < this._options.tabs.length; ++i){
               if( this._options.tabs[i].title === defTab ){
                  defTab = i;
                  break;
               }
            }
            // FIXME Вот правильное определение
            for(i = 0; i < this._options.tabs.length; ++i){
               if( this._options.tabs[i].id === defTab ){
                  defTab = i;
                  break;
               }
            }
         }
         //учтем, что defTab может быть 0, так у нас ситуации: defTab либо не вернули и он undefined, либо нашли и он от 0 до n, либо вернули текст/id, но мы такого не нашли
         //нас интересует вариант только когда мы нашли закладку, а это значит, что мы нашли ее номер, а он число
         this._defaultTab = parseInt( (typeof(defTab) === 'number' ? defTab : this._options.defaultTab), 10) || 0;
         // Если instantLoad - строим все
         if(this._options.instantLoad) {
            return ctrls;
         } else {
            // Если нет - только тот таб, который надо
            if(ctrls && ctrls.length && this._defaultTab >= 0) {
               // Есть контролы. Узнаем есть ли для нужной вкладки дети в текущей верстке
               var childToBuild = this._container.children(':not(.r)').eq(this._defaultTab);
               if(childToBuild.attr('wsControl')) {
                  // если найден контрол - поищем его среди детей в конфиге
                  return $ws.helpers.filter(ctrls, function(v){ return v.id == childToBuild.attr('id'); });
               } else {
                  return [];
               }
            } else {
               return [];
            }
         }
      },

      //глушим _loadDescendents, чтобы метод init не загружал контролы до включения событий
      _loadDescendents: function() { },

      //Глушим _childrenLoadCallback, чтобы родительский init не загружал контролы до включения событий, и код готовности контролов
      //(_childrenLoadCallback) не вызывал
      _childrenLoadCallback: function(){ },

      /**
       * То же, что и _loadDescendents в классе $ws.proto.AreaAbstract, но вызывается в обработчике onInit, после включения событий.
       * Базовый _loadDescendents мы глушим, потому что на момент загрузки табов нужно вызывать события.
       * @returns {Deferred}
       * @private
       */
      _loadDescendentsAfterInit: function() {
         return this._runInBatchUpdate('Tabs.loadTabsControlsAfterInit - ' + this._id, function() {
            //Загружаем закладки после включения событий, чтоб можно было получить закладку по умолчанию через событие onBeforeShowFirstTab
            var parentLoadDescendents = $ws.proto.Tabs.superclass._loadDescendents;
            
            return parentLoadDescendents.call(this).addCallback(this._childrenLoadCallbackAfterInit.bind(this)).
               addErrback(function(err) {
                  if (!this._ready.isReady()) {
                     this._ready.errback(err);
                  }
                  return err;
               }.bind(this));
         });
      },

      /**
       * Строит табы после готовности дочерних контролов (они тут грузятся после включения событий)
       * @private
       */
      _childrenLoadCallbackAfterInit: function(){
         return this._runInBatchUpdate('Tabs._childrenLoadCallback ' + this._id, function() {
            var self = this;

            this._block.get(0).onscroll = function() { self._block.scrollTop(0).scrollLeft(0); };
            this._container.get(0).onscroll = function() { self._container.scrollTop(0).scrollLeft(0); };

            this._initBody();
            this._initPosition();
            this._build();
            this._initResizers();
            this._addEventListeners();

            this._calculateFullWidth();
            this._prevWidth = this._block.width();

            $ws.single.ControlStorage.waitChildByName(this.getName()).addCallback(function(){
               self._notify("onStateChanged");
               self.subscribe('onTabChange', function(e, id, changeState){
                  self._notify("onStateChanged", id, !changeState);
               });
            });

            this._notifyOnSizeChanged(this, this, true);
            this._container.scrollTop(0);
            this._container.scrollLeft(0);

            this._notify('onReady');
            this._notify('onBeforeShow');

            return this._firstTabReady.createDependent().addBoth(function() {
               self._isReady = true;
               self._showControls();
               self._notifyBatchDelayed('onAfterShow');
               self._ready.callback();
            });
         });
      },
      /**
       * Инициализирует тело вкладок
       * Проходится по всем дочерним DOM-элементам, исключая ресайзер.
       * Инициализирует переменные _tabSheets, _loaded для всех вкладок;
       * _controls - для вкладки, которая должна быть отображена первой.
       * @private
       */
      _initBody: function(){
         this._body = $('<div class="ws-tabs-body"></div>');
         var self = this;

         this._container.children(':not(.r)').each(function(idx) {
            var container = $(this);
            if (container.attr('wsControl') !== undefined) {
               container.addClass('ws-hidden');
               var tabConfig = self._options.tabs[idx],
                   name = tabConfig.id || idx;

               self._tabsSheets[name] = container;
               try {
                  self._controls[name] = self.getChildControlById(container.attr('id'));
                  self._loaded[name] = true; // Контрол для вкладки готов
               } catch (e) {
                  // контрол не загружен (например потому, что грузится не первым)
                  self._loaded[name] = false;
               }

               container.addClass('ws-tabs-div').appendTo(self._body);
               if (self._defaultTab === idx || self._options.instantLoad) {
                  self._notifyBatchDelayedNoMerge('onTabLoaded', name + '');
               } else if (!container.attr("hasMarkup")) {
                  container.empty();
               }
            }
         });

         if (!this._options.hasBorder) {
            this._body.css('border', 'none');
         }
         else if (this._options.isRelative && !this._options.autoWidth)
            this._body.find('.ws-tabs-div').addClass('ws-tabs-div-relative');

         this._bodyPadding = $('<div></div>').addClass('ws-tabs-body-pad');
         if (this._verticalAlignment != 'Stretch'){
            this._container.addClass('ws-control-relative');
         }
      },
      /**
       * Переопределённый метод обработки готовности вложенных контролов
       * Ничего не делает - у табов всё делается в _childrenLoadCallback
       * @private
       */
      _templateInnerCallback: function() {
      },

      /**
       * <wiTag group="Управление">
       * Возвращает деферред готовности табов (на самом деле хотя бы одна вкладка должна быть готова)
       * @return {$ws.proto.Deferred}
       * @example
       * <pre>
       *     control.getReadyDeferred();
       * </pre>
       */
      getReadyDeferred: function() {
         return this._ready;
      },
      applyState : function(id){
         this.setCurrentTab(id, undefined, true);
      },
      _updateResizer: function() {
         var currentArea = this.getCurrentTabArea();
         if (currentArea && this._resizer) {
            var size = currentArea.getMinSize(),
                hScroll = (size.minWidth > this._container.width()) ? this._scrollBarWidth : 0,
                vScroll = (size.minHeight > this._container.height()) ? this._scrollBarWidth: 0;

            if (this._horizontalAlignment === "Stretch" && !this._options.autoWidth) {
                size.minWidth=0;
                size.minHeight+=hScroll;
            }

            if (this._verticalAlignment === "Stretch" && !this._options.autoHeight) {
                size.minHeight=0;
                size.minWidth+=vScroll;
            }

            if (this._options.showLabels) {
               if(this._options.position === 'left' || this._options.position === 'right') {
                  size.minWidth += this._header.height() + 1;//здесь надо добавлять тоже высоту, потому что заголовок будет развёрнут, и его высота будет на самом деле шириной
               }  else{
                  size.minHeight += this._header.height() + 1;

                  size.minWidth = Math.max(size.minWidth, this._minWidth  + 1);
               }
            }
            if (size.minWidth < this._options.minWidth) {
               size.minWidth = this._options.minWidth;
            }
            if (size.minHeight < this._options.minHeight) {
               size.minHeight = this._options.minHeight;
            }
            $ws.helpers.setElementCachedSize(this._resizer, {
               width: size.minWidth,
               height: size.minHeight
            });
         }
      },
      /**
       * Метод для установок из-за позиции ярлыков
       */
      _initPosition : function(){
         if (this._options.showLabels && this._options.position !== 'bottom') {
            this._header.appendTo(this._block);
         }

         this._bodyPadding.appendTo(this._block);
         this._body.appendTo(this._bodyPadding);
         if (this._options.position === 'bottom' && this._options.showLabels) {
            this._header.appendTo(this._block);
         }

         if (!this._options.showLabels) {
            this._bodyPadding.css('padding', 0);
         }
         else {
            this._header.addClass((this._options.position == 'left' || this._options.position == 'right') ?
                                   'vertical' : 'horizontal');

            if ((this._options.position === 'top' || this._options.position === 'bottom') && this._options.scrollable) {
               this._header.addClass(this._options.align);
               this._scrollMargin = 'margin' + (this._options.align === 'left' ? 'Left' : 'Right');
            }
         }

         this._block.appendTo(this._container);

         if (this._options.showLabels) {
            if (this._options.position === 'left' || this._options.position === 'right') {
               if (!this._options.verticalText || $ws._const.browser.isIE) {
                  this._scrollWidth = 'outerHeight';
               }
               this._header.addClass(this._options.position);
               if (this._options.verticalText) {
                  this._header.css({'padding-top': 0});

                  //здесь надо добавлять тоже высоту, потому что заголовок будет развёрнут, и его высоты будет на самом деле шириной
                  this._bodyPadding.css('padding-' + this._options.position, this._header.height())
                                   .css({'position': 'relative', 'top': '0px'});
               }
               this._scrollMargin = 'marginTop';

               this._isScrollVertical = true;
            } else {
               this._body.addClass(this._options.position);
               this._header.addClass(this._options.position);
               this._options.verticalText = false;//Вертикальный текст только при ярлыках/слева-справа
            }
            this._scrollButtonsWidth = this._isScrollVertical ?
                                          (this._options.verticalText ?
                                          $ws._const.Tabs.scrollButtonsVerticalTextHeight :
                                          $ws._const.Tabs.tabScrollButtonsHeight) :
                                       $ws._const.Tabs.scrollButtonsWidth;
         }

         this._body.height(this._bodyPadding.height());

         this._block.addClass(this._isScrollVertical ? 'vertical' : 'horizontal')
                    .addClass(this._options.verticalText ? 'verticalText' : 'horizontalText');

         if (!this._isScrollVertical) {
            this._bodyPadding.css('padding-' + this._options.position,
                                  (this._options.showLabels ? this._header.outerHeight() : 0) + 'px');
         }
      },
      /**
       * Возвращает максимальный размер (ширину/высоту) для хёдера
       * @returns {Number}
       */
      _getHeaderLimit : function(){
         if(!this._isScrollVertical){
            return this._block.width() - this._getScrollButtonsWidth();
         }
         var blockHeight = this._block.height(),
             scrollButtonsHeight = this._isScrollButtonsShowed ?
                                    (this._scrollButtonsWidth  +
                                       ((this._isScrollVertical && !this._options.verticalText && blockHeight < this._fullWidth) ?
                                        $ws._const.Tabs.tabScrollButtonsHeight : 0)) :
                                    0;

         return blockHeight - scrollButtonsHeight;
      },
      /**
       * Возвращает ширину кнопок скролла, если они показаны, иначе - 0
       * @return {Number}
       * @private
       */
      _getScrollButtonsWidth: function(){
         return (this._isScrollButtonsShowed ? this._scrollButtonsWidth : 0);
      },
      /**
       * Возвращает true, если места в контейнере не хватает для отображения всех заголовков
       * @returns {Boolean}
       */
      _isOverflow: function(){
         if(!this._isScrollVertical){
            return this._fullWidth > this._block.width();
         }
         return this._fullWidth > this._block.height();
      },
      /**
       * Считает суммарную ширину блоков-кнопок, если она не посчитана
       */
      _calculateFullWidth : function(){
         this._fullWidth = 0;
         if(!this._options.showLabels || !this._body.get(0).offsetWidth){//Хотим считать невидимые объекты
            return;
         }
         var prevId = null,
             headerWidth = this._header.width(),
             visibleCnt, firstId;

         this._header.scrollTop(0);
         // В результате выполнения firstId будет ID первой видимой вкладки
         // Здесь учитываются и выключенные (disabled) табы т.к. они занимают место
         visibleCnt = this._forEachVisibleTabLabels(function(i, cnt) {
            if (firstId === undefined) {
               firstId = i;
            }

            this._tabsLabels[i].width(this._options.labelsWidth);
            this._labelsWidths[i] = this._tabsLabels[i].outerWidth();
            if(this._tabsLabelOuterH === undefined){
               this._tabsLabelOuterH = this._labelsWidths[i] - this._tabsLabels[i].width();
            }
            if(this._tabsLabelOuterV === undefined){
               this._tabsLabelOuterV = this._tabsLabels[i].outerHeight() - this._tabsLabels[i].height();
            }
            if(this._options.verticalText && !$ws._const.browser.isIE){//Правим сглаживание шрифтов из-за нечётной ширины
               if(this._labelsWidths[i] % 2 !== 0){
                  this._tabsLabels[i].width(this._labelsWidths[i] + 1 - this._tabsLabelOuterH);
                  ++this._labelsWidths[i];
               }
            }
            var orientedWidth = this._tabsLabels[i][this._scrollWidth](true);
            this._previousLabelsWidths[i] = (prevId ? this._previousLabelsWidths[prevId] : 0) + orientedWidth + this._spacing;
            if(this._options.verticalText){
               if($ws._const.browser.isIE){
                  this._tabsLabels[i].width('auto');
                  this._tabsLabels[i].css({'top' : (this._previousLabelsWidths[i] - orientedWidth) + 'px', 'left' : '0px'})
                                     .width(orientedWidth - this._tabsLabelOuterH)   //size fix
                                     .height(orientedWidth)                          //hover fix
                                     .css('margin-' + (this._options.position === 'left' ? 'right' : 'left'),   //fix for hover fix for ie 8 and position === 'right'
                                          (- orientedWidth + headerWidth - this._tabsLabelOuterV) + 'px');
               }
               else{
                  if(this._options.position === 'left'){
                     this._tabsLabels[i].css({
                        'top': this._previousLabelsWidths[i] + 'px',
                        'left': '0'});
                  }
                  else{
                     this._tabsLabels[i].css({
                        'top': (this._previousLabelsWidths[i] - this._labelsWidths[i] - this._tabsLabels[i].outerHeight()) + 'px',
                        'left': '0'});
                  }
               }
            }
            if(prevId){
               this._fullWidth += this._spacing; //Учитываем маргины между ярлыками
            }
            prevId = i;
            return cnt + 1;
         }, 0);

         this._fullWidth = this._previousLabelsWidths[prevId];
         this._calculateMinWidth(visibleCnt, firstId);
      },

      _forEachVisibleTabLabels: function(callback, val) {
         return $ws.helpers.reduce(this._tabsLabels, function(memo, label, id) {
            return this._isTabHidden(id) ? memo : callback.call(this, id, memo);
         }, val, this);
      },

      _calculateMinWidth: function(visibleCnt, firstId) {
         this._minWidth = 0;

         if (this._fullWidth === 0 || !this._options.showLabels)
            return;

         // Здесь возможно повторим вычисление кол-ва видимых и первой видимой вкладки
         if (visibleCnt === undefined || firstId === undefined) {
            visibleCnt = this._forEachVisibleTabLabels(function(id, cnt) {
               if (firstId === undefined) {
                  firstId = id;
               }
               return cnt + 1;
            }, 0);
         }

         //Если нет текущего таба или он скрыт, возьмем первый видимый (не скрытый)
         var tabId = this._currentId;
         if (!this._hasTab(tabId) || this._isTabHidden(tabId)) {
            tabId = firstId;
         }

         if (visibleCnt > 0 && this._labelsWidths[tabId]) {
            this._minWidth = this._labelsWidths[tabId];
            if (visibleCnt > 1 && this._options.scrollable) {
               this._minWidth += this._scrollButtonsWidth;
            }
         }
      },

      /**
       * Функция, анимирующая скролл. Он идёт только по чётным пикселям. (привет, Firefox)
       * @param {Number} marginValue
       */
      _animateHeader : function(marginValue){
         var self = this,
             update = function(){
                if(Math.abs(self._scrollToMargin - self._currentMargin) <= $ws._const.Tabs.animationLimit){
                   self._currentMargin = self._scrollToMargin;
                   self._isScrollAnimation = false;
                }
                else{
                   self._currentMargin += Math.ceil((self._scrollToMargin - self._currentMargin) /
                         $ws._const.Tabs.animationSpeed);
                   if(self._currentMargin % 2 !== 0){
                      --self._currentMargin;
                   }
                   setTimeout(update, $ws._const.Tabs.animationTimer);
                }
                self._header.css(self._scrollMargin, self._currentMargin + 'px');
             };
         this._scrollToMargin = marginValue;
         if(this._headerScrolled && !this._animationDisabled){
            if(!this._isScrollAnimation){
               this._isScrollAnimation = true;
               update();
            }
         }
         else{
            this._header.css(this._scrollMargin, this._currentMargin = marginValue);
         }
      },
      /**
       * Функция для растягивания ярлыков сверху на всю ширину хёдера (при scrollable = false)
       */
      _growTopLabels : function(){
         var
               maxWidth,
               i,
               sumWidth = 0,
               prevTabs = [],
               prevTabsCount = 0,
               firstTabBonusWidth = 0,
               isFirst = true,//Для первого ряда ярлыков вкладок скругляем углы, для остальных - нет
               self = this,
               growSelectedLabels = function(){
                  firstTabBonusWidth = prevTabsCount * (((maxWidth - sumWidth) / prevTabsCount) -
                        Math.floor((maxWidth - sumWidth) / prevTabsCount));
                  for(var j = 0; j < prevTabsCount; ++j){
                     var tab = prevTabs[j];
                     self._tabsLabels[tab].width(self._labelsWidths[tab] +
                           Math.floor((maxWidth - sumWidth) / prevTabsCount) - self._tabsLabelOuterH +
                           firstTabBonusWidth - self._spacing + (j + 1 == prevTabsCount ? self._spacing : 0));
                     if(isFirst){
                        self._tabsLabels[tab].addClass(self._options.position);
                     }
                     else{
                        self._tabsLabels[tab].removeClass(self._options.position);
                     }
                     if(j + 1 == prevTabsCount){
                        self._tabsLabels[tab].css('margin', '0');
                     }
                     else{
                        self._setTabMargin(tab);
                     }
                     firstTabBonusWidth = 0;
                  }
                  isFirst = false;
                  prevTabs = [];
                  prevTabsCount = 0;
                  sumWidth = 0;
         };
         maxWidth = this._block.width() - (this._header.outerWidth() - this._header.width());
         for(i in this._tabsLabels){
            if(i in this._hiddenTabs){
               continue;
            }
            if(!this._tabsLabels.hasOwnProperty(i)){
               continue;
            }
            var tabWidth = this._labelsWidths[i];
            if(sumWidth + tabWidth > maxWidth){
               growSelectedLabels();
            }
            prevTabs.push(i);
            sumWidth += this._labelsWidths[i];
            ++prevTabsCount;
         }
         growSelectedLabels();

         this._header.width(maxWidth);
      },
      /**
       * Устанавливает ширину ярлыков при их расположении справа или слева, verticalText = false
       */
      _setSideLabelsWidth : function(){
         var
               maxWidth = 0,
               i,
               limit = this._block.width() / 2;
         for(i in this._labelsWidths){
            if(!this._labelsWidths.hasOwnProperty(i)){
               continue;
            }
            if(this._labelsWidths[i] > maxWidth){
               maxWidth = this._labelsWidths[i];
            }
         }
         if(maxWidth > limit){
            maxWidth = limit;
         }
         for(i in this._tabsLabels){
            if(!this._tabsLabels.hasOwnProperty(i)){
               continue;
            }
            this._tabsLabels[i].width(maxWidth - this._tabsLabelOuterH);
         }
         for(i in this._scrollButtons){
            if(!this._scrollButtons.hasOwnProperty(i)){
               continue;
            }
            this._scrollButtons[i].width(maxWidth - $ws._const.Tabs.scrollButtonsBonusWidth);
         }
         for(i in this._scrollShadows){
            if(!this._scrollShadows.hasOwnProperty(i)){
               continue;
            }
            this._scrollShadows[i].width(maxWidth);
         }
         this._header.width(maxWidth);
         this._bodyPadding.css('padding-' + this._options.position, this._header.outerWidth() + 'px');
      },

      _resizeHeaderAndBodyForContainer: function() {
         if (!this._fullWidth) {
            this._calculateFullWidth();
         }

         var i = null, width = 0;
         if (this._options.showLabels) {
            if (!this._options.scrollable) {
               this._growTopLabels();
            }
            if(this._isScrollVertical && !this._options.verticalText){
               this._setSideLabelsWidth();
            }
            if(this._options.align === 'right'){
               width = this._block.width();
               this._currentMargin += width - this._prevWidth;
               this._header.css(this._scrollMargin, this._currentMargin + 'px');
            }
            if(this._isOverflow()){//HeaderLimit нужен, так как ширина при ресайзе обычно меняется
               if(this._options.scrollable){
                  // Маргин после ресайза выходит за пределы?
                  var margin = parseInt(this._header.css(this._scrollMargin), 10);
                  if(isNaN(margin)){
                     margin = 0;
                  }
                  if(this._options.align === 'right'){
                     if(this._allLabelsShowed){
                        this._header.css(this._scrollMargin, this._currentMargin =
                           (this._getHeaderLimit() - this._fullWidth + this._getScrollButtonsWidth()));
                     }
                     else{
                        var maxMargin = this._getScrollButtonsWidth();
                        if(margin > maxMargin){
                           this._animateHeader(maxMargin);
                        }
                     }
                  }
                  else{
                     var minMargin = this._getHeaderLimit() - this._fullWidth;
                     if(margin < minMargin){
                        this._animateHeader(minMargin);
                     }
                  }
                  if(this._options.align === 'right'){
                     this._checkDisabled(this._currentMargin);
                  }
                  else{
                     this._checkDisabled(Math.max(minMargin, margin));
                  }
               }
            }
            else{
               this._allLabelsShowed = true;
               this._header.css(this._scrollMargin, this._currentMargin = 0);
            }
            if(this._options.align === 'right'){
               this._prevWidth = width;
            }
         }
         var headerHeight = this._options.showLabels ? this._header.outerHeight() : 0,
            blockHeight = this._block.outerHeight(),
            bodyHeight = Math.max(0, blockHeight - (!this._isScrollVertical ? headerHeight : 0));
         if (this._options.position === 'top' && !this._options.scrollable) {
            this._bodyPadding.css('padding-top', headerHeight + 'px');
         }
         // установка размеров внутренних элементов
         this._bodyPadding.height(bodyHeight);
         this._body.height(bodyHeight);
         if (this._options.showLabels) {
            this._header.css('padding-top', (this._isScrollVertical &&
               !this._options.verticalText && blockHeight < this._fullWidth) ?
               $ws._const.Tabs.tabScrollButtonsHeight : 0);

            if (this._currentId !== null) {
               this._animationDisabled = true;
               //Мог измениться размер, и текущий заголовок мог пропасть...
               this.scrollToTab(this._currentId);
               this._animationDisabled = false;
            }
         }
      },

      /**
       * Функция, вызываемая при изменении размеров родителя
       */
      _onResizeHandler : function() {
         if (!this._isReady) {
            return;
         }

         var self = this;
         this._forEachVisibleTabLabels(function (i) {
            if (self._tabEditors[i]) {
               self._tabEditors[i]._onResizeHandler();
            }
         });

         this._resizeHeaderAndBodyForContainer();

         var currentArea = this.getCurrentTabArea();
         if (currentArea)
            currentArea._onResizeHandler();

         this._calcStretchPosition();
      },

      /**
       * Возвращает полное айди блока по короткому
       * @param {String} id
       * @returns {String}
       */
      _getBlockId : function(id){
         return 'ws-tabs-' + this.getId() + '-' + id;
      },
      /**
       * <wiTag group="Отображение">
       * Функция скроллит до закладки с нужным id.
       * @param {String} id Идентификатор закладки.
       * @example
       * <pre>
       *     control.scrollToTab('Идентификатор Закладки');
       * </pre>
       */
      scrollToTab : function(id){
         // FIXME Это хотфикс. Метод некорректно работает в текущих реалиях. Отключают т.к. сейчас кроллинг табов в принципе не работает
         //noinspection UnnecessaryReturnStatementJS
         return;
      },

      _fireFirstTabReady: function(ok, errResult) {
         if (!this._firstTabReady.isReady()) {
            if (ok) {
               this._firstTabReady.callback();
            } else {
               this._firstTabReady.errback(errResult);
            }
         }
      },

      /**
       * <wiTag group="Управление">
       * Установка текущей закладки по id.
       * @param {String} id Идентификатор закладки.
       * @param {Boolean} [noActivate] Активировать или нет контрол на установленной вкладке. По умолчанию активируется.
       * @returns {$ws.proto.Deferred}
       * @example
       * <pre>
       *     control.setCurrentTab('Идентификатор закладки');
       * </pre>
       * @see getCurrentId
       */
      setCurrentTab : function(id, noActivate, changeState){
         var self = this;

         return this._runInBatchUpdate('Tabs.setCurrentTab - ' + this._id, function() {
            function applyActiveTab() {
               // Если нас просят не активировать вкладку...
               // Проверим текущее активное окно. Если оно внутри нашего контрола - все же придется делать setActive
               if(noActivate) {
                  var currentActiveWnd = $ws.single.WindowManager.getActiveWindow();
                  while(currentActiveWnd && currentActiveWnd.getParent) {
                     if(currentActiveWnd.getId() !== this.getId()) {
                        currentActiveWnd = currentActiveWnd.getParent();
                     } else {
                        noActivate = false;
                        break;
                     }
                  }
               }
               if(!noActivate){
                  var activeWindow = $ws.single.WindowManager.getActiveWindow(),
                     activeControl = activeWindow && activeWindow.getActiveChildControl(),
                     focusFound = false;
                  if(activeControl){
                     while(activeControl){
                        if(activeControl === self){
                           focusFound = true;
                           break;
                        }
                        activeControl = activeControl.getParent();
                     }
                  }
                  else{
                     focusFound = true;
                  }
                  if(focusFound){
                     this.setActive(true, false);
                  }
               }
            }

            noActivate = noActivate || false;

            if(!this._builded){
               for(var i = 0, ln = this._options.tabs.length; i < ln; ++i){
                  if(this._options.tabs[i].id === id || i == id){
                     this._defaultTab = i;
                     break;
                  }
               }
            }
            if(this._currentId == id || this._tabsSheets[id] === undefined || this._disabledTabs[id]){
               applyActiveTab.apply(this);

               this._fireFirstTabReady(true);

               return new $ws.proto.Deferred().callback();
            }
            this._body.scrollTop(0).scrollLeft(0);

            var currentArea = this.getCurrentTabArea(),
                currentTabSheet = this.getCurrentTab();

            if (currentArea)
               currentArea.hide();

            if (currentTabSheet)
               currentTabSheet.addClass('ws-hidden');

            this._tabsSheets[id].removeClass('ws-hidden');
            if(this._options.showLabels){
               if(this._tabsLabels[this._currentId]){
                  this._tabsLabels[this._currentId].toggleClass('ws-tabs-button-inactive', true)
                                                   .toggleClass(this._button_active_classes, false);
                  this._tabsLabels[this._currentId].find('.ws-tabs-button-overlay').toggleClass('ws-hidden', false);
               }
               this._tabsLabels[id].toggleClass(this._button_active_classes, true)
                                   .toggleClass('ws-tabs-button-inactive', false);
               this._tabsLabels[id].find('.ws-tabs-button-overlay').toggleClass('ws-hidden', true);

            }

            this._currentId = id;

            var deferred = this._loadContent(id).addCallback(function(r){
               if(id !== self._currentId) {
                  return r;
               }
               var tabArea = self.getTabArea(id);
               if (tabArea) {
                  tabArea.show();
                  tabArea._checkDelayedRecalk();
               }

               self._notifyOnSizeChanged(self, self, true);

               self._runBatchDelayedFunc('setCurrentTab.active', function() {
                  if (self.isActive() && !noActivate) {
                     self.setActive(true, false);
                  }
                  self._body.scrollTop(0).scrollLeft(0);
               });

               if (self._options.showLabels && self._options.scrollable){
                  self.scrollToTab(id);
               }

               self._calculateMinWidth();
               self._notifyBatchDelayed('onTabChange', "" + id, changeState);
               return r;
            });

            applyActiveTab.apply(this);
            return deferred;
         });
      },

      /**
       * Аттачит темплейт для вкладки, если есть
       * @param {String} id Идентификатор вкладки
       * @returns {$ws.proto.Deferred}
       */
      _loadContent : function(id) {
         return this._runInBatchUpdate('Tabs._loadContent - ' + this._id, function() {
            var self = this,
                result = null,
                area;

            if(!this._loaded[id]){ // Контент вкладки не загружен (иначе вкладка была загружена ранее)
               this._loaded[id] = true;
               if(this._templates[id] !== undefined){ // Для вкладки задан шаблон (иначе нет шаблона, нечего грузить. вкладка готова сразу.
                  area = new TabTemplatedArea({
                     autoHeight: true,
                     autoWidth: true,
                     element : this._tabsSheets[id],
                     tabindex : 1,
                     parent: this,
                     keepSize: false,
                     name : 'mytabarea' + id,
                     context : new $ws.proto.Context().setPrevious(this.getLinkedContext()),
                     owner: this.makeOwnerName()
                  });

                  this._controls[id] = area;
                  if (!this._options.enabled) {
                     area.setEnabled(false);
                  }

                  //Нужно грузить методом setTemplate, чтоб не потерять ошибку, которая может возникнуть при загрузке шаблона
                  //Если передаём template в конструктор, то не можем поймать эту ошибку, и засигналить результат метода _loadContent,
                  // тогда его пакет не завершится, и интерфейс зависнет
                  result = area.setTemplate(this._templates[id]).addCallback(function(){
                     self._notifyBatchDelayedNoMerge('onTabLoaded', id + '');
                  });
               }
            }

            if (!result) {
               result = new $ws.proto.Deferred().callback();
            }

            result.addCallback(function() {
               self._fireFirstTabReady(true);
            }).addErrback(function(err) {
               self._fireFirstTabReady(false, err);
               return err;
            });

            return result;
         });
      },

      _onSizeChangedBatch: function(controls) {
         var currentArea = this.getCurrentTabArea(),
             current = $ws.helpers.find(controls, function(control) { return control === currentArea; }, this),
             result = !!current;
         if (result && this._haveAutoSize()) {
            this._updateResizer();
            this._resizeHeaderAndBodyForContainer();
         }
         return result;
      },

      /**
       * Устанавливает отступы для вкладки, учитывая её расположение
       * @param {String} name    Идентификатор вкладки
       */
      _setTabMargin: function(name){
         if(this._spacing){
            this._tabsLabels[name].css('margin', '0 ' + (this._isScrollVertical ? '0 ' : '1px ')
                                                   + (this._isScrollVertical ? '1px ' : '0 ') + '0');
         }
      },
      /**
       * Создаёт все кнопки, вкладки, вешает на них события и т. д.
       */
      _build : function() {
         var tabs = this._options.tabs,
             ln = tabs.length,
             separatedTabs, i;

         separatedTabs = $ws.helpers.reduce(tabs, function(memo, tab, idx) {
            var direction = tab.align || this._options.align;
            if (!('id' in tab)) {
               tab.id = idx;
            }
            memo[direction][direction == 'left' ? 'push' : 'unshift'](tab);
            return memo;
         }, { left: [], right: [] }, this);

         $ws.helpers.forEach([ 'left', 'right' ], function(placement){
            $ws.helpers.forEach(separatedTabs[placement], function(tab, idx, array) {
               this._buildTab(tab, idx);
            }, this);
         }, this);

         if (this._options.showLabels) {
            this._buildScrollButtons();
         }

         this._builded = true;
         var tab = tabs[this._defaultTab];
         //если активная по умолчанию вкладка не доступна
         if (tab && tab.visible === false){
            for (i = 1; i <= ln; i++){
               tab = tabs[(this._defaultTab + i) % ln];
               if (tab.visible !== false){
                  break;
               }
            }
         }
         // если есть что применять, то не устанавливаем активную вкладку
         var state = $ws.single.NavigationController.getStateByName(this.getName());
         if (!state || state["applied"]) {
            this.setCurrentTab((tab && tab.id) || this._defaultTab, true, true);
         } else {
            //В эту ветку мы попадаем, когда состояние у контрола есть, но ещё не применено.
            //Оно применится в методе _childrenLoadCallbackAfterInit, после вызова _build
            //Поскольку там NavigationController обязательно получит событие "onStateChanged",
            //setCurrentTab обязательно вызовется, и _firstTabReady засигналит готовность табов (ту, которая отдаётся из метода getReadyDeferred())
            //Ради паранойи можно было бы здесь засигналить _firstTabReady, но это неправильно, потому что тогда стрельнут события
            //onAfterLoad и т.п., а таба загруженного ещё не будет...
            //В общем, здесь мы надеемся на то, что NavigationController обязательно вызовет метод applyState, который вызовет setCurrentTab,
            //и готовность табов (getReadyDeferred) гарантированно засигналится.
         }
      },
      /**
       * Вешает обработчикик событий на заголовок табов
       * @private
       */
      _addEventListeners: function() {
         var self = this;
         if (this._header) {
            $('.ws-tabs-button', this._header.get(0)).live('click mouseenter mouseleave', function(event) {
               var tabButton = $(this);
               var name = tabButton.data('name');
               switch(event.type) {
                  case 'click':
                     self._isControlActive = true;
                     self.setCurrentTab(name, undefined, true);
                     return false;
                  case 'mouseenter':
                     //мы не должны подсвечивать неактивную закладку
                     if(!tabButton.hasClass('ws-tabs-button-disabled')){
                        tabButton.addClass('hover');
                     }
                     /*
                     // FIXME отключаем эт от функционал.
                     // FIXME Это хотфикс, потому что сейчас совершенно непонятно как жить с контролами, размещенными во вкладке
                     // FIXME Нет способа кроме _calculateFullWidth()
                     if(self._labelsWidths[name] > self._tabsLabels[name].width() + self._tabsLabelOuterH) {
                        tabButton.children().animate({
                           'margin-left' : (self._tabsLabels[name].width() + self._tabsLabelOuterH - self._labelsWidths[name]) + 'px'
                        }, 5000);
                     }
                     */
                     break;
                  case 'mouseleave':
                     if(!tabButton.hasClass('ws-tabs-button-disabled')){
                        tabButton.removeClass('hover');
                     }
                     /*
                     // FIXME см. выше
                     tabButton.children().stop().css('margin-left', '0px');
                     */
                     break;
                  default:
               }
            });
         }
      },
      /**
       * Строит один таб
       * @param {Object}   tab      Информация об одной вкладке: {title: '', id: '', text: '', template: '', icon: ''}
       * @param {Number}   index    Номер вкладки
       * @returns {String} Идентификатор получившейся вкладки
       */
      _buildTab: function(tab, index){
         var
            name = (tab.id !== undefined) ? tab.id : index,
            headerBorderBlock, inside, iconBlock, classList,
            self = this;

         if (this._options.showLabels) {
            headerBorderBlock = this._header.find('.ws-tabs-header-border');
            classList = [
               'ws-tabs-button',
               'ws-tabs-button-inactive',
               'ws-tabs-button-enabled',
               ('ws-tabs-align-' + (tab.align || this._options.align)),
               tab.editable ? 'ws-tab__underline' : '',
               (this._options.verticalText ? 'top' : this._options.position),
               tab.cssClass
            ];
            this._tabsLabels[name] = $(
               '<div data-name="' + name + '" ' +
                     'class="' + classList.join(' ') + '">' +
                  '<div class="ws-tabs-button-left"></div>' +
                  '<div class="ws-tabs-button-inside">' +
                  (tab.editable ? '<div class="ws-tabs-button-editor"></div>' :
                     '<span class="ws-tabs-button-title">' + tab.title + '</span>') +
                  '</div>' +
                  '<div class="ws-tabs-button-right"></div>' +
                  '<div class="ws-tabs-button-overlay"></div>' +
               '</div>')
                  .insertBefore(headerBorderBlock)
                  .width(this._options.labelsWidth);

            if (this._spacing === undefined) {
               this._spacing = parseInt(this._tabsLabels[name].css('margin-right'), 10);
            }

            if (tab.icon && typeof tab.icon == 'string') {
               inside = this._tabsLabels[name].find('.ws-tabs-button-inside');
               if(tab.icon.substr(0, 7) == 'sprite:') {
                  // Это спрайт
                  iconBlock = $('<span></span>', {
                     'class': [ 'ws-tabs-button-icon', tab.icon.replace('sprite:', '') ].join(' ')
                  });
               } else {
                  // Это путь
                  iconBlock = $('<img />', {
                     'class': 'ws-tabs-button-icon',
                     'src':  $ws.helpers.processImagePath(tab.icon)
                  });
               }
               inside.prepend(iconBlock);
            }
            if (this._options.verticalText) {
               this._tabsLabels[name].addClass('ws-tabs-button-rotate ws-rotate-' + this._options.position);
            }
            if (tab.editable) {
               self._processEditableTabButton(tab);
            }
         }
         this._createTabSheet(name, tab);
         this._templates[name] = tab.template;
         if (tab.visible === false){
            this._rightsHiddenTabs[name] = 1;
            this.hideTab(name);
         }
         return name;
      },
      /**
       * Обработка заголовка закладки в режиме редактирования по месту
       * @param tab {Object} Конфигурация заголовка закладки
       * @private
       */
      _processEditableTabButton: function (tab) {
         var self = this,
            tabButton = this.getTabButton(tab.id);
         self._tabEditors[tab.id] = new TabEditAtPlace({
            name: self._options.name + '_edit' + (tab.id),
            element: tabButton.find('.ws-tabs-button-editor'),
            content: tab.content,
            context: self._context,
            isTabEditor: true,
            inPlaceEditMode: true,
            parent: self,
            handlers: $ws.core.clone(tab.handlers)
         });
      },
      /**
       * Создаёт блок вкладки
       * @param {String} name Заголовок
       * @param {Object} tab Объект конфигурации вкладки
       * @private
       */
      _createTabSheet: function(name, tab) {
         if(!(name in this._tabsSheets)){
            // ws-tabs-generated - динамически добавленная вкладка
            this._tabsSheets[name] =
               $('<div class="ws-tabs-div ws-tabs-generated ws-hidden" id="' + this._getBlockId(name) + '">' + ((tab.text !== undefined) ? tab.text : '') + '</div>')
                  .appendTo(this._body);
         }
      },
      /**
       * Обработчик нажатия на кнопки скролла
       * @param {jQuery} event
       * <pre>
       * event.data:
       * {
       *    'self' : this, //текущий объект
       *    'side' : 'left' | 'right' //тип кнопки: влево или вправо
       * }
       * </pre>
       */
      _onClickScrollButtons : function(event){
         var self = event.data.self;
         if(self._scrollButtonsDisabled[event.data.side]){
            return;
         }
         var marginLeft = self._currentMargin,
             prevId = undefined,
             width = self._block.width(),
             height = self._block.height();
         if(isNaN(marginLeft)){
            marginLeft = 0;
         }
         if(self._options.align === 'right'){
            marginLeft = width - self._fullWidth - marginLeft;
         }
         for(var j in self._previousLabelsWidths){
            if(!self._previousLabelsWidths.hasOwnProperty(j)){
               continue;
            }
            //Если ярлыки расположены слева и вертикальный текст, то конец ярлыка находится ближе к началу хёдера,
            //чем начало. Скролл инвертирован. Для всех остальных случаев не инвертированно, так как начало ярлыка
            //находится ближе к началу хёдера, чем конец
            if(self._options.position == 'left' && self._options.verticalText){
               if(event.data.side == 'right'){
                  if(-marginLeft + height - self._scrollButtonsWidth < self._previousLabelsWidths[j]){
                     prevId = j;
                     break;
                  }
               }
               else{
                  if(-marginLeft + height - self._scrollButtonsWidth > self._previousLabelsWidths[j]){
                     prevId = j;
                  }
               }
            }
            else{
               if(-marginLeft < self._previousLabelsWidths[j] || (event.data.side === 'left' && (-marginLeft == self._previousLabelsWidths[j]) )){
                  if(event.data.side === 'right')
                     prevId = j;
                  break;
               }
               if(event.data.side === 'left')
                  prevId = j;
            }
         }
         var limit = self._getHeaderLimit() - self._fullWidth;
         if(self._options.position == 'left' && self._options.verticalText){
            marginLeft = Math.min(0, Math.max(limit, -(prevId !== undefined ? self._previousLabelsWidths[prevId] - height + self._scrollButtonsWidth : 0)));
         }
         else{
            marginLeft = Math.min(0, Math.max(limit, -(prevId !== undefined ? self._previousLabelsWidths[prevId] : 0)));
         }
         if(self._options.align === 'right'){
            marginLeft = width - (self._fullWidth + marginLeft);
         }
         self._headerScrolled = true;
         self._animateHeader(marginLeft);
         self._checkDisabled(marginLeft);
         return false;
      },
      /**
       * Создаёт кнопки влево-вправо
       */
      _buildScrollButtons : function(){
         if(this._options.scrollable){
            //Создаём кнопки влево-вправо, по-умолчанию скрытые
            var side = (this._options.position == 'left') ? 'left' : 'right';
            for(var i in this._scrollButtonsDisabled){
               if(!this._scrollButtonsDisabled.hasOwnProperty(i)){
                  continue;
               }
               this._scrollButtons[i] = $('<div class="ws-hidden ws-tabs-scroll' + (this._scrollButtonsDisabled[i] ? '-disabled' : '') + ' ' + i + '"></div>')
                  .appendTo(this._block)
                  .css(side, ((this._options.verticalText) ?
                     ($ws._const.Tabs.verticalTextFirstScrollPadding) :
                     ((this._isScrollVertical && !this._options.verticalText) ? 0 :
                     (('right' == i) ? $ws._const.Tabs.firstHorizontalScrollButtonPadding :
                     $ws._const.Tabs.secondHorizontalScrollButtonPadding))))
                  .append($('<div class="ws-tabs-scroll-image ' + ((this._isScrollVertical) ?
                     (i === 'left' ? 'top' : 'bottom') :
                     i) + '"></div>')
                     .css('opacity', (this._scrollButtonsDisabled[i] ?
                        $ws._const.Tabs.scrollDisabledOpacity : $ws._const.Tabs.scrollEnabledOpacity)))
                  .bind('click', {'side' : i, 'self' : this}, this._onClickScrollButtons);
               if(!this._isScrollVertical){
                  this._scrollButtons[i].addClass('horizontal');
               }
            }
            var posLeft = (this._options.position == 'bottom' || this._options.verticalText ? 'bottom' : 'top'),
                posRight = (this._options.verticalText || this._options.position != 'top' ? 'bottom' : 'top');
            this._scrollButtons['left'].css(posLeft, (this._options.verticalText ? $ws._const.Tabs.tabScrollButtonsHeight : 0) + 'px');
            this._scrollButtons['right'].css(posRight, '0px');
            if(!$ws._const.browser.isIE){
               if(this._isScrollVertical && !this._options.verticalText){
                  this._scrollShadows['left'] =  $('<div class="ws-tabs-shadow-v top ' + this._options.position + '"></div>')
                        .appendTo(this._block)
                        .css('visibility', 'hidden');
               }
               this._scrollShadows['right'] =  $('<div class="ws-tabs-shadow-' + (this._isScrollVertical ? 'v' : 'h') + ' ' +
                     (this._isScrollVertical ? 'bottom' : 'right') + ' ' + this._options.position + '"></div>')
                     .appendTo(this._block);
               if(this._isScrollVertical && this._options.verticalText){
                  this._scrollShadows['right'].css('bottom', '36px');
               }
            }
         }
      },
      /**
       * <wiTag group="Управление">
       * Валидация контролов в табах. Внимание! Если контрол на i-ой вкладке невалидный,
       * то идет переключение на эту вкладку!
       * @return {Boolean}
       */
      validate: function(){
         var tabsList = this._options.tabs,
             result = true,
             childArea,
             tabEdit,
             isTab = false,
             invalidTabNum, tabId;
         for(var i = 0, l = tabsList.length; i < l; i++){
            tabId = tabsList[i].id || i;
            if (this._hiddenTabs[tabId]=== true) //Вкладку скрыли руками, не валидируем.
               continue;
            tabEdit = this._tabEditors[tabId];
            if (tabEdit && tabEdit.validate(false, true) === false) {
               invalidTabNum = tabId;
               result = false;
               isTab = true;
               break;
            }
            childArea = this.getTabArea(tabId);
            if (childArea && childArea.validate(false, true) === false){
               invalidTabNum = tabId;
               result = false;
               break;
            }
         }
         if (invalidTabNum !== undefined){
            var self = this;
            this.setCurrentTab(invalidTabNum, undefined, true).addCallback(function(){
               if (isTab) {
                  tabEdit._moveFailValidatedToFocus();
               } else {
                  self._moveFailValidatedToFocus();
               }
            });
         }
         return result;
      },
      /**
       * <wiTag group="Данные">
       * Возвращает id текущей закладки.
       * @returns {String} id Идентификатор закладки.
       * @example
       * <pre>
       *     control.getCurrentId();
       * </pre>
       */
      getCurrentId : function(){
         return "" + this._currentId;
      },
      /**
       * <wiTag group="Данные">
       * Возвращает jQuery-элемент, который содержит в себе все листы вкладок.
       * @returns {jQuery} body
       * @example
       * <pre>
       *     control.getBody();
       * </pre>
       */
      getBody : function(){
         return this._body;
      },
      /**
       * <wiTag group="Отображение">
       * Возвращает страницу текущей вкладки
       * @returns {jQuery} object
       * @example
       * <pre>
       *     control.getCurrentTab();
       * </pre>
       */
      getCurrentTab : function(){
         return this._tabsSheets[this._currentId];
      },
      /**
       * Возвращает контрол, представляющий контент заголовка закладки
       * @returns {Object} контрол
       * @private
       */
      _getCurrentTabButton: function () {
         return this._tabEditors[this._currentId];
      },
      _getCurrentChildControls: function () {
         var result = [],
            tabButton = this._getCurrentTabButton(),
            tabArea = this.getCurrentTabArea();
         if (tabButton) {
            result.push(tabButton);
         }
         if (tabArea) {
            result.push(tabArea);
         }
         return result;
      },

      /**
        * <wiTag group="Данные">
        * Возвращает текущую шаблонную область, соответствующую выбранной вкладке.
        * @returns {$ws.proto.TemplatedArea}
       * @example
       * <pre>
        *    control.getCurrentTabArea();
       * </pre>
       */
      getCurrentTabArea: function() {
         return this._controls[this._currentId];
      },
      setActive: function(active, isShiftKey) {
         this._isControlActive = active;
         if (this._currentId !== undefined) {
            var childControls = this._getCurrentChildControls();
            if (active && !this.detectNextActiveChildControl(isShiftKey, isShiftKey ? childControls.length : -1)) {
               this._moveFocusToSelf();
            }
         }
      },
      /**
       * <wiTag group="Управление">
       * <wiTag class="GroupCheckBox" noShow>
       * Находит следующий активный контрол в зависимости от того как нажат таб
       * @param isShiftKey
       * @param searchFrom tabindex контрола, с которого следует искать следующий активный
       * @returns {boolean}
       */
      detectNextActiveChildControl: function(isShiftKey, searchFrom){
         var act = searchFrom,
            childControls = this._getCurrentChildControls(),
            controlCount = childControls.length,
            curr,
            res = true,
            delta = isShiftKey ? -1 : 1;
         if(act === undefined) {
            for (var n = 0; n < controlCount; n++) {
               if (childControls[n] && childControls[n].getTabindex() == this._activeChildControl) {
                  act = n;
                  break;
               }
            }
         }
         if (act === undefined) {
            act = isShiftKey ? childControls.length : -1;
         }
         curr = act + delta;
         while (curr >= 0 && curr < controlCount) {
            if(childControls[curr] && childControls[curr].canAcceptFocus()){
               break;
            }
            curr += delta;
         }
         if (curr >= 0 && curr < controlCount) {
            childControls[curr].setActive(true, isShiftKey);
         } else {
            res = false;
         }
         return res;
      },
      /**
       * <wiTag group="Данные">
       * Получает блок закладки по id.
       * @param {String} id Идентификатор закладки.
       * @returns {jQuery} object
       * @example
       * <pre>
       *     control.getTab('Идентификатор');
       * </pre>
       */
      getTab : function(id){
         return this._tabsSheets[id];
      },
      /**
       * <wiTag group="Данные">
       * Возвращает контролы, которые находятся внутри какой-то закладки.
       * @param {Number} id Идентификатор закладки.
       * @example
       * <pre>
       *     control.getTabChilds('Идентификатор закладки');
       * </pre>
       */
      getTabChilds : function(id){
         var area = this.getTabArea(id);
         return area ? area.getChildControls() : undefined;
      },
      /**
       * <wiTag group="Управление">
       * Установка innerHTML для блока с нужным id.
       * @param {String} id
       * @param {String} html
       * @example
       * <pre>
       *     control.setContent(id, html);
       * </pre>
       */
      setContent : function(id, html) {
         var tabSheet = this._tabsSheets[id];
         if (tabSheet)
            tabSheet.html(html);//TODO: notifySizeChanged для текущего
         else
            throw new Error('Нет такого таба: ' + id);
      },
      /**
       * Функция обновляет статус кнопок скролла вкладок (<>)
       * @param {Number} marginLeft - margin-left/top, который будет у хёдера после анимации
       */
      _checkDisabled : function(marginLeft){
         var scrollLimits;
         if(this._options.align === 'right'){
            var width = this._block.width();
            scrollLimits = {
               right : this._getScrollButtonsWidth(),
               left : width - this._fullWidth
            }
         }
         else{
            scrollLimits = {
               right : this._getHeaderLimit() - this._fullWidth,
               left : 0
            }
         }

         for(var i in scrollLimits){
            if(!scrollLimits.hasOwnProperty(i)){
               continue;
            }
            if(this._scrollButtonsDisabled[i] !== (marginLeft === scrollLimits[i])){
               this._scrollButtons[i].toggleClass('ws-tabs-scroll-disabled ' + i)
                                     .toggleClass('ws-tabs-scroll ' + i);
               if(this._scrollShadows[i]){
                  this._scrollShadows[i].css('visibility', (this._scrollShadows[i].css('visibility') == 'hidden' ?
                        'visible' : 'hidden'));
               }
               this._scrollButtonsDisabled[i] = !this._scrollButtonsDisabled[i];
               this._scrollButtons[i].children().css('opacity', (this._scrollButtonsDisabled[i]) ?
                     $ws._const.Tabs.scrollDisabledOpacity : $ws._const.Tabs.scrollEnabledOpacity);
            }
         }
         if(this._options.align === 'right'){
            this._allLabelsShowed = this._scrollButtonsDisabled['left'];
         }
      },
      _isTabHidden: function(id) {
         return id in this._hiddenTabs
      },
      _isTabDisabled: function(id) {
         return id in this._disabledTabs;
      },
      _hasTab: function(id) {
         return id in this._tabsSheets;
      },
      _isTabSelectable: function(id) {
         return id !== null && this._hasTab(id) && !this._isTabDisabled(id) && !this._isTabHidden(id);
      },
      /**
       * Обновляет текущую вкладку - её могли удалить, скрыть, и т. д.
       */
      _updateCurrentTab: function() {
         // Если текущей вкладки либо нет, либо она скрыта, либо задизаблена
         if (!this._isTabSelectable(this._currentId)) {
            // Найдем первый не скрытый и не задизабленый таб
            var tabToActivate = $ws.helpers.find(Object.keys(this._tabsSheets), this._isTabSelectable.bind(this));
            if (tabToActivate) {
               this.setCurrentTab(tabToActivate, undefined, true);
            } else {
               // Если таб не нашли - выберем никакой
               this.setCurrentTab(undefined, undefined, true);
            }
         }
      },
      /**
       * Пересчитывает данные вкладок
       */
      _updateTabs: function(){
         this._fullWidth = 0;
         this._updateCurrentTab();
         this._onResizeHandler();
      },

      /**
       * <wiTag group="Данные">
       * Получает area закладки по id.
       * @param {String} id Идентификатор закладки.
       * @returns {$ws.proto.AreaAbstract}
       * @example
       * <pre>
       *     control.getTabArea('Идентификатор закладки');
       * </pre>
       */
      getTabArea: function(id){
         return this._controls[id];
      },
      /**
       * <wiTag group="Данные">
       * Возвращает объект корешка вкладки по ID
       * @param {String} id ID желаемого корешка вкладки
       * @returns {jQuery} Объект корешка вкладки
       */
      getTabButton: function(id) {
         return this._tabsLabels[id] || $();
      },
      /**
       * <wiTag group="Отображение">
       * Меняет выравнивание вкладки
       * @param {String} id ID вкладки
       * @param {String} align Желаемое выравнивание. 'left' или 'right' - слева или справа расположить ярлыки вкладок.
       */
      setTabAlignment: function(id, align) {
         var
            alignClass = 'ws-tabs-align-' + align,
            contrAlign = {
               left: 'ws-tabs-align-right',
               right: 'ws-tabs-align-left'
            },
            tabBtn, contrClass;

         if (align in contrAlign) {
            tabBtn = this.getTabButton(id);
            contrClass = contrAlign[align];

            if (tabBtn.hasClass(contrClass)) {
               tabBtn.removeClass(contrClass).addClass(alignClass);
            }
         }
      },
      /**
       * <wiTag group="Управление">
       * Добавляет вкладку
       * @param {Object} tab Информация о вкладке: {title: '', id: '', text: '', template: '', icon: ''}.
       * @returns {String} Идентификатор получившейся вкладки.
       * @example
       * <pre>
       *     control.addTab(object);
       * </pre>
       */
      addTab: function(tab){
         var id = this._buildTab(tab, Math.random());
         // этот код должен выполниться только для этого метода, все остальные служат для создания и вызываются много раз из разных мест
         this._options.tabs.push($ws.core.merge({
            align: 'right',
            title: tab.id,
            id: id
         }, tab));

         this._updateTabs();

         return id;
      },
      /**
       * <wiTag group="Управление">
       * Убирает вкладку
       * @param {String} id Идентификатор удаляемой вкладки.
       * @example
       * <pre>
       *     control.removeTab(id);
       * </pre>
       */
      removeTab: function(id){
         var self = this;
         this._ready.addCallback(function(){
            if(self._tabsSheets[id]){
               if(self._tabsLabels[id]){
                  self._tabsLabels[id].empty().remove();
               }
               if(self._controls[id]){
                  self._controls[id].destroy();
               }
               if(self._tabEditors[id]) {
                  self._tabEditors[id].destroy();
                  delete self._tabEditors[id];
               }
               self._tabsSheets[id].empty().remove();
               delete self._loaded[id];
               delete self._templates[id];
               delete self._controls[id];
               delete self._tabsLabels[id];
               delete self._tabsSheets[id];
               //TODO: тут был код, который удалял вкладку из tabs, нужно сделать аккуратно в 3.6.2.30 или 3.6.3, доверив потом проверку тестировщикам, для 3.6.2.20 это пока опасно

               self._updateTabs();
            }
         });
      },
      /**
       * <wiTag group="Отображение">
       * Скрыть закладку.
       * @param {String} id Идентификатор нужной вкладки.
       * @example
       * <pre>
       *     control.hideTab(id);
       * </pre>
       */
      hideTab: function(id){
         var self = this;
         this._ready.addCallback(function(){
            if(id in self._tabsLabels){
               self._hiddenTabs[id] = true;
               delete self._labelsWidths[id];
               self._tabsLabels[id].addClass('ws-hidden');
               self._tabsSheets[id].addClass('ws-hidden');
               // FIXME?
               self._calculateFullWidth();
               self._updateTabs();
            }
         });
      },
      /**
       * <wiTag group="Отображение">
       * Показывает закладку.
       * @param {String} id Идентификатор нужной вкладки.
       * @example
       * <pre>
       *     control.showTab(id);
       * </pre>
       */
      showTab: function(id){
         if (this._rightsHiddenTabs[id]) {
            return;
         }
         var self = this;
         this._ready.addCallback(function(){
            if(id in self._tabsLabels){
               delete self._hiddenTabs[id];
               self._tabsLabels[id].removeClass('ws-hidden');
               self._calculateFullWidth();

               self._updateTabs();
            }
         });
      },
      /**
       * <wiTag group="Отображение">
       * Переименовать закладку.
       * Изменить текст ярлыка вкладки на новый.
       * @param {String} id Идентификатор закладки, подлежащей переименованию.
       * @param {String} title Новый заголовок закладки.
       * @example
       * <pre>
       *     control.renameTab(id, title);
       * </pre>
       */
      renameTab: function(id, title){
         if(this._ready.isReady()){
            this._tabsLabels[id].find('.ws-tabs-button-title').text(title);
            this._updateTabs();
         }
         else{
            for(var i = 0; i < this._options.tabs.length; ++i){
               if(this._options.tabs[i].id === id){
                  this._options.tabs[i].title = title;
                  break;
               }
            }
         }
      },
      /**
       * <wiTag group="Управление">
       * Включить закладку.
       * Сделать закладку доступной для взаимодействия.
       * @param {String} id Идентификатор закладки.
       * @example
       * <pre>
       *     control.enableTab(id);
       * </pre>
       */
      enableTab: function(id){
         var self = this;
         this._ready.addCallback(function(){
            if(id in self._tabsLabels){
               delete self._disabledTabs[id];
               self._tabsLabels[id].addClass('ws-tabs-button-enabled')
                  .removeClass('ws-tabs-button-disabled');
               self._updateTabs();
            }
         });
      },
      /**
       * <wiTag group="Управление">
       * Выключить закладку.
       * Сделать закладку недоступной для взаимодействия.
       * @param {String} id Идентификатор закладки.
       * @example
       * <pre>
       *     control.disableTab(id);
       * </pre>
       */
      disableTab: function(id){
         var self = this;
         this._ready.addCallback(function(){
            if(id in self._tabsLabels){
               self._disabledTabs[id] = true;
               self._tabsLabels[id].addClass('ws-tabs-button-disabled')
                  .removeClass('ws-tabs-button-enabled')
                  .addClass('ws-tabs-button-inactive')
                  .removeClass(self._button_active_classes);
               self._tabsSheets[id].addClass('ws-hidden');

               self._updateTabs();
            }
         });
      },
      _setEnabled: function(enabled){
         $ws.proto.Tabs.superclass._setEnabled.apply(this, arguments);
         $ws.helpers.forEach(this._controls, function(control) { control.setEnabled(enabled); }, this);
      },
      /**
       * <wiTag group="Данные">
       * Возвращает идентификатор вкладки по контролу, который лежит внутри неё. Если не найдёт - undefined.
       * @param {$ws.proto.Control} control Дочерний контрол.
       * @return {String|undefined} Идентификатор вкладки.
       * @example
       * <pre>
       *     control.getTabIdControl(control);
       * </pre>
       */
      getTabIdByControl: function(control){
         var self = this,
            index,
            tab = control.findParent(function(parent){
               return parent.getParent() === self;
            });
         if(tab){
            for(var i in this._controls){
               if(this._controls.hasOwnProperty(i)){
                  if(this._controls[i] === tab){
                     index = i;
                     break;
                  }
               }
            }
            return index;
         }
      },
      destroy: function () {
         for (var id in this._tabEditors) {
            if (this._tabEditors.hasOwnProperty(id)) {
               this._tabEditors[id].destroy();
               delete this._tabEditors[id];
            }
         }
         $ws.proto.Tabs.superclass.destroy.call(this);
      }
   });

   return $ws.proto.Tabs;

});
