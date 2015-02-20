/**
 * Created by ad.Chistyakova on 05.11.13.
 */
/**
 * Модуль "Компонент Хлебный фильтр".
 * Стандартная настройка работы фильтрации:
 * <ol>
 *    <li>нажатием на кнопку фильтрации (треугольник), при этом не происходит перехода в другую папку, вместо этого
 * открывается всплывающая панель, модальное окно выбора или выпадающий список, в которых можно выбрать интересующие
 * директории, параметры выбора. Как только нужные значения выбраны, в хлебном фильтре прописываются их названия,
 * содержимое страницы фильтруется в соответствие с выбором. Очистка фильтра происходит нажатием на крестик очистки.</li>
 *    <li>кликом на саму папку, при этом происходит проваливание на уровень ниже (синее подчеркивание передвигается вправо),
 * в хлебном фильтре прописывается название выбранной папки, выбранного параметра, содержимое страницы фильтруется по
 * выбранной папке, параметру. Сброс фильтра аналогично п.1.</li>
 * </ol>
 * @description
 */
define('js!SBIS3.CORE.PathFilter', ['js!SBIS3.CORE.PathSelector', 'js!SBIS3.CORE.Button', 'html!SBIS3.CORE.PathFilter',
   'js!SBIS3.CORE.FieldDropdown', 'html!SBIS3.CORE.PathSelector', 'css!SBIS3.CORE.PathFilter', 'css!SBIS3.CORE.LinkButton' ],
      function( PathSelector, Button, dotTplFn, DropDown ) {

   'use strict';

   var CROSS_WIDTH = 16,               //ширина контейнера с крестиком
       HOME_WIDTH = 16,                //ширина контейнера с домиком
       ARROW_WIDTH = 16,               //ширина контейнера стрелки
       PADDING_POINT = 4,              //отсупы у поинта, характерные для режима обычный хлебный фильтр
       MODERN_IE_WIDTH = 1;            //дополнительная ширина на поинты для ie версии 9+, проблема с округляющимися дробными пикселями и появления троеточия

   $ws.single.DependencyResolver.register('SBIS3.CORE.PathFilter', function(config){
      var deps = {};

      if(config) {
         if(config.mode === 'hover') {
            config.fast = true;
            deps['js!SBIS3.CORE.FieldDropdown'] = 1;
         }
      }

      return Object.keys(deps);
   }, 'SBIS3.CORE.PathSelector');

   /**
    * <wiTag page=3>
    * Для описания событий и методов можно посмотреть FloatArea
    *
    * @class $ws.proto.PathFilter
    * @extends $ws.proto.PathSelector
    * @ignoreOptions dataSource
    * @control
    * @initial
    * <component data-component='SBIS3.CORE.PathFilter'>
    * <option name='fast' value='false'></option>
    * <options name='filters'>
    *    <option name='Регион' value='76'></option>
    *    <option name='Категория' value='Гостиницы и рестораны'></option>
    * </options>
    * </component>
    */
   $ws.proto.PathFilter = PathSelector.extend(/** @lends $ws.proto.PathFilter.prototype */{
      /**
       * @event onFilterChange При смене фильтра
       * Событие происходит при смене значения фильтра.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Object} query Параметры фильтрации контрола.
       * @param {String} filterName Имя фильтра, значение которого изменилось.
       * @example
       * Если значение фильтра изменяется в undefined, то проверить параметры фильтрации хлебного фильтра (pathFilter).
       * Если остальные фильтры также установлены в undefined, то скрыть кнопку (btn).
       * <pre>
       *    pathFilter.subscribe('onFilterChange', function(eventObject, object, filterName) {
       *       var flag;
       *       if (object[filterName] === undefined) {
       *          $ws.helpers.forEach(object, function(element, key) {
       *             if (object[key] !== undefined) {
       *                flag = true;
       *             }
       *          });
       *          btn.setEnabled(!flag);
       *       }
       *    });
       * </pre>
       * @see setQuery
       * @see getQuery
       * @see setFilter
       * @see filters
       */
      /**
       * @event onResetFilter При сбросе фильтра
       * Событие происходит при нажатии на крестик "Сбросить на значение по умолчанию".
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} filterName Имя фильтра, значение которого было сброшено.
       * @example
       * При сбросе фильтра проверить параметры фильтрации хлебного фильтра (pathFilter).
       * Если все фильтры установлены в undefined, то скрыть кнопку (btn).
       * <pre>
       *    pathFilter.subscribe('onResetFilter', function() {
       *       var flag,
       *           object = this.getQuery();
       *       $ws.helpers.forEach(object, function(element, key) {
       *          if (object[key] !== undefined) {
       *             flag = true;
       *          }
       *       });
       *       btn.setEnabled(!flag);
       *    });
       * </pre>
       * @see filters
       */
      /**
       * @event onPointClick При клике по элементу фильтра
       * <wiTag page=1>
       * Событие происходит в режиме быстрого доступа к фильтру при клике по имени параметра фильтрации.
       *
       * В режиме быстрого доступа к фильтру нельзя настроить отдельно действия при клике на треугольник фильтрации и по
       * имени параметра фильтрации, так как они представляют собой единый объект.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {jQuery} arrow Контейнер треугольника фильтрации.
       * @param {String} title Имя фильтра.
       * @example
       * Задать действие при клике наимя фильтра.
       * При клике на фильтр "В наличии" отобрать только с условием "Наличие" = true.
       * <pre>
       *    $ws.single.ControlStorage.getByName("Хлебный фильтр").subscribe("onPointClick", function(event, title){
       *       var list = $ws.single.ControlStorage.getByName('Табличное представление 1');
       *       if(title == 'В наличии'){
       *          query = list.getQuery();
       *          query['Наличие'] = true;
       *          list.setQuery(query);
       *       }
       *    });
       * </pre>
       * @see filters
       */
      /**
       * @event onArrowClick При клике на стрелку выбора фильтра
       * Событие происходит при клике на стрелку, расположенную возле параметра фильтрации. Например, раскрывается
       * выпадающий список или выезжает всплывающая панель для выбора фильтра.
       * <wiTag page=0>
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} title Имя фильтра.
       * @param {jQuery} arrow Контейнер треугольника фильтрации.
       * @return Результат обработчика события.
       * Если вернуть $ws.proto.Deferred, то PathFilter будет считать, что в callback этого deferred придёт массив с
       * описанием строк, которые нужно показать в меню.
       * @example
       * При клике на треугольник фильтрации, привязанный к параметру "Наименование", открыть всплывающую панель со
       * списком выбора фильтра.
       * <pre>
       *    $ws.single.ControlStorage.getByName("Хлебный фильтр").subscribe('onArrowClick', function(event, title){
       *       if(title == 'Наименование'){
       *          var self = this;
       *          $ws.core.attachInstance('Control/FloatAreaSelector', {
       *          template: 'Наименование',
       *          handlers: {
       *             'onChange': function(event, record){
       *                self.setFilter('Наименование', record.get('Наименование'));
       *                self.setActiveFilter('Наименование');
       *             }
       *          }
       *       });
       *    }
       * </pre>
       * @see filters
       */
      /**
       * @event onDrawPoint При визуализации фильтра
       * Событие при отрисовке элементов фильтра.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Object} pathPoint Объект с описанием текущего узла.
       * @param {Boolean} last Является ли этот узел последним.
       * @return Можно вернуть jQuery-объект, который будет использоваться в качестве узла.
       * @example
       * При нажатии на имя параметра фильтрации "Тип" или "Год" открывать соответствующий выпадающий список с фильтрами.
       * <pre>
       *    $ws.single.ControlStorage.getByName("Хлебный фильтр").subscribe("onDrawPoint", function(event, pointOptions){
       *       if(pointOptions.title == 'Тип' || pointOptions.title == 'Год'){
       *          //"ws-PathSelector__point ws-PathSelector__pointText" нужны для отрисовки по стандарту
       *          var point = $('<div class="my-dropdown ws-PathSelector__point ws-PathSelector__pointText" />');
       *             keys = [],
       *             values = [];
       *          if(pointOptions.title == 'Тип') {
       *             keys = values = ['Книга', 'Словарь', 'Учебник'],
       *          } else {
       *             keys = values = ['2012', '2013', '2014'];
       *          }
       *          $ws.core.attachInstance('Control/FieldDropdown', {
       *             element: point,
       *             renderStyle: 'simple',
       *             showSelectedInList: false,
       *             data: {
       *                keys:  keys,
       *                values: values
       *             },
       *             handlers: {
       *                'onChange': function(event, value){
       *                   var list = $ws.single.ControlStorage.getByName('Табличное представление 1'),
       *                      pathFilter = $ws.single.ControlStorage.getByName('Хлебный фильтр');
       *                   pathFilter.setFilter(pointOptions.title, value);
       *                   pathFilter.setActiveFilter(pointOptions.title);
       *                }
       *             }
       *          });
       *          event.setResult(point);
       *       }
       *    }
       * </pre>
       * @see filters
       */
      /**
       * @event onPathChange При выборе фильтра
       * Событие происходит при клике по параметру фильтрации.
       * <wiTag page=0>
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} title Имя фильтра.
       * @example
       * При клике по элементу фильтра переключать содержимое.
       * <pre>
       *    $ws.single.ControlStorage.getByName("Хлебный фильтр").subscribe("onPathChange" : function(event, title) {
	   * 	   var
	   *	      area = this.getTopParent(),
	   *		  tabs = area.getChildControlByName('Закладки для хлебного фильтра');
	   * 	   switch(id) {
	   *	      case 'Регион' : tabs.setCurrentTab('Регион'); break;
	   *	      case 'Все категории торга' : tabs.setCurrentTab('Категории'); break;
	   *	      case 'Все торг.площадки' : tabs.setCurrentTab('Площадки'); break;
	   *	      case 'Все торги' : tabs.setCurrentTab('Торги'); break;
	   *	   }
	   *    }
       * </pre>
       * @see filters
       */
      /**
       * @event onVisualizeFilter При отрисовке фильтра
       * Событие происходит при смене значения фильтра. Здесь можно изменить только внешнее текстовое отображение
       * Никакого влияния на фильтр не происходит
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} filterName Имя фильтра, значение которого изменилось.
       * @param {String} currentValue Текущее текстовое значение фильтра.
       * @example
       * Если в фильтр пришло значение "Москва", поменяем его на более красивое и развернутое
       * <pre>
       *    pathFilter.subscribe('onVisualizeFilter', function(eventObject, filterName, currentValue) {
       *       if (filterName === 'Регион') {
       *             eventObject.setResult('Москва - столица нашей Родины!')
       *       };
       *
       *    });
       * </pre>
       * @see setQuery
       * @see getQuery
       * @see setFilter
       * @see filters
       */
      /**
       * @event onCreatePoint При создании выпадающего списка
       * <wiTag page=2>
       * Событие происходит при создании элемента фильтра.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Object} pathPoint {title, defaultValue, value } Настройки текущего фильтра.
       * В результате ожидается объект вида:
       * <pre>
       * //для статических данных
       *  {
       *    data: {}
       *    altName: 'mySuperDropDownName' //необазательный параметр, дает возможность задавать свое имя для выпадающих списков
       *    render: function()
       *  }
       * //для подгрузки данных из рекордсета
       * {
       *    dataSource: {}
       *    displayColumn : {String} //колонка записи, используемая при отображении
       *    render: function()
       *  }
       * </pre>
       * @example
       * Если текущий фильтр 'Регион', то в выпадающем списке придут значения из списочного метода,
       * который мы передаём в dataSource, иначе - отдаём статичные данные.
       * <pre>
       *    pathFilter.subscribe('onCreatePoint', function(event, pathPoint) {
       *       var obj = {};
       *
       *  if (pathPoint.title === 'Регион') {
       *     obj = {
       *        dataSource: {
       *           filterParams: {},
       *           firstRequest: true,
       *           //задаём количество записей для вывода
       *           rowsPerPage: "10",
       *           usePages: "full",
       *           readerParams: {
       *              queryName: "СписокРегионов",
       *              linkedObject: 'Регион',
       *              createMethodName: 'Создать',
       *              readMethodName: 'Прочитать',
       *              updateMethodName: 'Записать',
       *              destroyMethodName: 'Удалить'
       *           }
       *        //указываем колонку записи для отображения
       *        displayColumn: 'Регион',
       *        //указываем колонку записи с ключами
       *        itemValueColumn: '@Регион'
       *        },
       *        //рендер делает в списке выбора региона каждый пункт ссылкой
       *        render: function(record, value){
       *           var   text = record instanceof $ws.proto.Record ? record.get('Регион') : value,
       *                 $div = $('<div class="asLink">' + text+ '</div>');
       *           //если выведенны не все записи, то в конце списка появляется "Ещё..."
       *           if (text === 'Еще...') {
       *              $div.addClass('align-right');
       *           }
       *           return $div;
       *        }
       *     };
       *  } else {
       *     obj = {
       *        altName: 'mySuperDropDown' //Если передать этот параметр, то выпадющий список будет создан с этим именем
       *        data: {
       *           keys: [1, 2, 3, 'hasMore'],
       *           values: [ pathpoint.title , 'testtext', 1, 'Еще...']
       *        }
       *     };
       *  }
       *  event.setResult(obj);
       *    });
       * </pre>
       * @see setQuery
       * @see getQuery
       * @see setFilter
       * @see filters
       * @see mode
       * @see fast
       * @see isFast
       * @see onClickMore
       */
      /**
       * @event onClickMore При клике по "Еще..."
       * Событие происходит при клике по системной опции 'hasMore' (текст "Еще...") выпадающего списка.
       * <wiTag page=2>
       * Опция не устанвливается в качестве выбранного фильтра. Прикладной разработчик может организовать работу опции,
       * например открытие всплывающей панели.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Object} pathPoint {title, defaultValue, value } Настройки текущего фильтра.
       * @example
       * <pre>
       *     pathFilter.subscribe('onClickMore', function(e, pathPoint){
       *        if (pathPoint.title === 'Сотрудники' && pathPoint.value === 'Фреймворк') {
       *           floatArea.show();
       *        }
       *     });
       * </pre>
       * @see fast
       * @see isFast
       * @see mode
       * @see onCreatePoint
       */
      /**
       * @event onSelectValue При выборе элемента из списка
       * <wiTag page=2>
       * Событие клика по выпадающему списку.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} key  Ключ значения в выпадающем списке.
       * @param {String} value  Текущее текстовое значение фильтра.
       * @param {Object} pathPoint {title, defaultValue, value, showTooltip } Настройки текущего фильтра.
       * @example
       * <pre>
       *     pathFilter.subscribe('onSelectValue', function(e, key, value, pathPoint){
       *        if (pathPoint.title === 'Год' && value === '2014') {
       *           pathFilter.append({
       *              id: 'Наличие',
       *              title: 'Наличие'
       *           });
       *        }
       *     });
       * </pre>
       */
      $protected: {
         _options: {
            /**
             * @typedef {Object} Filter
             * @property {string} defaultValue значение фильтра по умолчанию
             * @property {string} value начальное значение
             */
            /**
             * @cfg {Object.<string, Filter>} Параметры фильтрации
             * Объект, в котором находятся текущие параметры фильтрации контрола.
             * В этом объекте каждое свойство - фильтр, применяемый к соответствующей папке.
             * Если значение фильтра установлено в undefined, то фильтрация по директории не происходит.
             * <wiTag group="Данные">
             * @example
             * Структура объекта с параметрами фильтрации.
             * <pre>
             *    filters: {
             *       'Тип' : {},
             *       'years' : {
             *          defaultValue: 'Год'
             *       },
             *       'Регион': {
             *          defaultValue: 'Ярославль',
             *          value: 'Москва'
             *       }
             *    }
             * </pre>
             * @see setFilter
             * @see setQuery
             * @see getQuery
             * @see setActiveFilter
             * @see setDefaultValues
             * @see onFilterChange
             * @see onResetFilter
             * @see textAlign
             */
	         filters: {},
            /**
             * @cfg {boolean} Способ отображения
             * <wiTag group="Управление" page=0>
             * <wiTag group="Управление" page=1>
             * Возможные значения:
             * <ol>
             *    <li>true - быстрый доступ к фильтру.</li>
             *    <li>false - хлебный фильтр.</li>
             * </ol>
             * @see isFast
             * @see setActiveFilter
             * @see mode
             */
	         fast: true,
            /**
             * @typeDef {string} DisplayMode
             * @variant standart стандартный
             * @variant hover    выпадающий список
             */
            /**
             * @cfg {DisplayMode} Вид режима быстрого доступа к фильтру
             * <wiTag group="Данные" page=2>
             * <wiTag page=0 noShow>
             * <wiTag page=1 noShow>
             * Возможные значения:
             * <ol>
             *    <li>standart - фильтрация настраивается разработчиком;</li>
             *    <li>hover - фильтрация задаётся с помощью выпадающего списка.</li>
             * </ol>
             * @see fast
             * @see isFast
             */
            mode: 'standart',//'hover'
            /**
             * @typeDef {string} TextAlignment
             * @variant left  по левому краю
             * @variant right по правому краю
             */
            /**
             * @cfg {TextAlignment} Выравнивание набора параметров фильтрации
             * <wiTag group="Отображение">
             * Выравнивание осуществляется внутри контейнера контрола.
             * Возможные значения:
             * <ol>
             *    <li>left - по левому краю контейнера;</li>
             *    <li>right - по правому краю.</li>
             * </ol>
             * @see filters
             */
	         textAlign: 'left'
         },
         _filtersFullWidth: [],
         _filtersMaxWidth: [],
         _resultWidth: 0,
         _fullWidth: 0,
         _dropDowns: {}
      },
      _dotTplFn : dotTplFn,
      $constructor: function(){
         this._publish('onFilterChange', 'onResetFilter', 'onVisualizeFilter', 'onCreatePoint', 'onClickMore', 'onSelectValue');
         this._container.addClass('ws-PathFilter' + ' ws-PathFilter__textAlign-' + this._options.textAlign);
      },
      pop: function(){
         var count = this._points.length,
             dropDownName,
             index;
         if (count > 0) {
            if (this.isHoverMode()) {
               index = count - 1;
               dropDownName = this.getName() + '-' + index;
               this._points[index][0].remove();
               this._dropDowns[dropDownName].destroy();
               delete this._dropDowns[dropDownName];
               this._points.pop();
               this._path.pop();
               if(count >= 2){
                  this._points[count - 2][0].removeClass('ws-PathSelector__pointNotLast').addClass('ws-PathSelector__pointLast');
               }
               this._onResizeHandler();
            } else {
               $ws.proto.PathFilter.superclass.pop.call(this);
            }
         }
      },
      /**
       * <wiTag group="Управление" page=2>
       * Установить новые данные для выпадающего списка.
       * Возможна установка статических данных или рекордсета.
       * @param {string} filterName Имя фильтра.
       * @param {Object|$ws.proto.RecordSet} data Возможны три формата данных:
       * <ol>
       *   <li>{ key1 : value1, key2 : value2 ...}</li>
       *   <li>{ keys: [..], values: [..] }</li>
       *   <li>$ws.proto.RecordSet</li>
       * </ol>
       * @example
       * <pre>
       *     if (pathFilter.isHoverMode() && pathFilter.getQuery()['Тип'] === 'Газета') {
       *        pathFilter.setData('Год', {keys: [1, 2], values: ['2013', '2014']});
       *     }
       * </pre>
       * @see mode
       * @see isHoverMode
       * @see fast
       * @see isFast
       * @see onCreatePoint
       */
      setData: function(filterName, data){
         if (this.isHoverMode() && filterName) {
            var dropDown = this._dropDowns[this.getName() + '-' + this._findPathIndex(filterName)];
            if (dropDown) {
               dropDown.setData(data);
            }
         }
      },
      _initConfig: function(){
         $ws.proto.PathFilter.superclass._initConfig.apply(this, arguments);
         //Убираем лишний домик
         if (this.isHoverMode()) {
            this._options.fast = true;
         }
         //Отображение иконки домика
         if (!this.isFast()) {
            this._options.rootNodeView = 'icon';
         }
      },
      _initPath: function(){
         //Для совместимости с джином и старой версией опции
         if (this._options.isFast !== undefined) {
            this._options.fast = this._options.isFast;
         }
         this._path = this._preparePath(this._options.filters);
         if (!this.isFast()){
            this._path.unshift({
               'title': '',
               'id': this._options.rootNodeId
            });
         }
      },
      _initEvents: function(){
         var parent = this._block.get(0),
               className = 'ws-mousedown',
               self = this,
               dataIndex,
               arrow,
               removeMouseDown = function(point){
                  if (dataIndex) {
                     point.removeClass(className);
                     if (arrow && arrow.length) {
                        arrow.removeClass(className);
                        arrow = undefined;
                     }
                  }
               };
         $ws.proto.PathFilter.superclass._initEvents.apply(this, arguments);
         $('.ws-PathSelector__arrow', parent).live('mouseup', this._onMouseUp.bind(this));
         $('.ws-PathSelector__point', parent).live({
            'mouseenter': function () {
               self._hoverPoint($(this), true);
            },
            'mouseleave': function () {
               self._hoverPoint($(this));
            }
         });
         $('.ws-PathFilter__clearContainer', parent).live({
            'mouseenter': function () {
               self._hoverPoint($(this).closest('.ws-PathSelector__point'), true, true);
            },
            'mouseleave': function () {
               self._hoverPoint($(this).closest('.ws-PathSelector__point'), false, true);
            }
         });
         if (!this.isFast()) {
            self._block.addClass('ws-PathFilter__notFast');
            $('.ws-PathSelector__point', parent).live({
               'mousedown': function () {
                  var point = $(this);
                  if (!point.hasClass('ws-PathFilter__point__activated')) {
                     dataIndex = point.attr('data-index');
                     if (dataIndex > 0) {
                        arrow = self._block.find('.ws-PathSelector__arrow[data-index='+ (dataIndex-1) +']');
                        point.addClass(className);
                        if (arrow.length) {
                           arrow.addClass(className);
                        }
                     }
                  }
               },
               'mouseup': function () {
                  removeMouseDown($(this));
               },
               'mouseleave': function() {
                  removeMouseDown($(this));
               }
            });
            $('.ws-PathSelector__arrow', parent).live({
               'mousedown': function () {
                  $(this).addClass(className);
               },
               'mouseup': function () {
                  $(this).removeClass(className);
               },
               'mouseleave': function () {
                  $(this).removeClass(className);
               }
            });
         } else {
            $('.ws-PathSelector__arrow', parent).live({
               'mouseenter': function () {
                  self._block.find('.ws-PathSelector__pointText[data-index='+ $(this).attr('data-index') +'] .ws-PathFilter__text').addClass('ws-PathFilter__hover');
               },
               'mouseleave': function () {
                  self._block.find('.ws-PathSelector__pointText[data-index='+ $(this).attr('data-index') +'] .ws-PathFilter__text').removeClass('ws-PathFilter__hover');
               }
            });
         }
      },
      _hoverPoint: function(element, isIn, isClearContainer){
         var dataIndex = element.attr('data-index'),
               isFast = this.isFast(),
               arrow;
         if (dataIndex > 0 || isFast) {
            if (!isFast) {
               dataIndex--;
            }
            arrow = this._block.find('.ws-PathSelector__arrow[data-index='+ dataIndex +']');
            if (isClearContainer) {
               element.toggleClass('ws-PathFilter__noHover', isIn);
            }
            if (arrow.length) {
               arrow.toggleClass(isClearContainer ? 'ws-PathFilter__noHover' : 'ws-PathFilter__hover', !!isIn);
            }
         }
      },
      _preparePath: function(way){
         var path = [],
             idOption = null,
             value,
             point;
         for (var i in way){
            if (way.hasOwnProperty(i)) {
               point = way[i];
               value = typeof(point.value) === 'object' && point.value.fieldName ?
                     this.getLinkedContext().getValue(point.value.fieldName) :
                     point.value;
               if (typeof (value) === 'function') {
                  value = value.apply(this, [point.title]);
               }
               path.push({
                  title : i,
                  id : i,
                  value : this._checkValue(value),
                  defaultValue: point.defaultValue,
                  showTooltip: !!point.showTooltip
               });
               idOption = i;
            }
         }
         return path;
      },
      _setPathValues: function(filter, resetUnknown){
         if (filter === undefined){
            return;
         }
         for (var i = 0, len = this._path.length; i < len; i++){
            //Иногда число приходит строкой и все ломается... Поэтому !==
            if (resetUnknown && !filter[this._path[i].title]){
               this._path[i].value = undefined;
            } else {
               this._path[i].value = ((filter[this._path[i].title] != this._path[i].defaultValue) ?
                     this._checkValue(filter[this._path[i].title]) : undefined);
            }
         }
      },
      _getPathContainer: function() {
         return this.getContainer().find('.ws-PathFilter__block');
      },
      /**
       * <wiTag group="Управление" noShow>
       * Метод установки текущего фильтра
       * @param {String} filterName имя фильтра, который необходимо установить активным
       */
      setFilterPath: function(filterName){

      },
      /**
       * <wiTag group="Управление">
       * Установить значение фильтра.
       * @param {String} filterName Имя фильтра.
       * @param {String} value Значение фильтра. Если передать undefined, то фильтр сбросится к значению по умолчанию.
       * @example
       * Установить значение фильтра в соответствии с регионом проживания пользователя.
       * <pre>
       *    pathFilter.subscribe('onReady', function() {
       *       //login активного пользователя
       *       var userlogin,
       *           //регион, который указал пользователь
       *           region,
       *           //объект бизнес-логики
       *           bl = new $ws.proto.BLObject('Пользователи');
       *       bl.call('ПолучитьСписокПользователей', {'Логин': login}, $ws.proto.BLObject.RETURN_TYPE_RECORD)
       *       .addCallback(function(record) {
       *          //получаем значение поля записи
       *          region = record.get('Регион');
       *          //устанавливаем фильтр
       *          this.setFilter('Регион', region != '' ? region : undefined);
       *       });
       *    });
       *
       * </pre>
       * @see setFilterPath
       */
      setFilter: function(filterName, value, noNotify){
         var index = this._findPathIndex(filterName);
         if (index !== -1) {
            this._path[index].value = this._path[index].defaultValue === value ? undefined : this._checkValue(value);
            this._setValueForFilter(index);
            if (!noNotify) {
               this._notify('onFilterChange' , this.getQuery(), filterName);
            }
            this._setWidth();
         }
      },
       /**
        * <wiTag group="Управление">
        * Установить параметры фильтрации.
        * @param {Object} filters Объект с параметрами фильтрации.
        * @param {Boolean} [noNotify = false] Не извещать о смене значения фильтра.
        * При noNotify = true событие {@link onFilterChange} не сработает.
        * @param {Boolean} [resetUnknown = false] Сбросить фильтры, которые не заданы в объекты с параметрами фильтрации.
        * @example
        * При клике на кнопку (btn) сбросить фильтр (pathFilter) к начальным настройкам.
        * <pre>
        *    btn.subscribe('onClick', function() {
        *       //получаем параметры фильтрации
        *       var object = pathFilter.getQuery();
        *       //формируем объект с параметрами фильтрации
        *       $ws.helpers.forEach(object, function(element, key) {
        *          //каждый фильтр будет сброшен к значению по умолчанию
        *          object[key] = undefined;
        *       });
        *       //устанавливаем новые параметры фильтрации
        *       pathFilter.setQuery(object);
        *       //делаем активным верхний фильтр (иконка домика)
        *       pathFilter.setActiveFilter('');
        *    });
        * </pre>
        * @see filters
        * @see getQuery
        * @see onFilterChange
        */
      setQuery: function(filters, noNotify, resetUnknown){
         this._setPathValues(filters, resetUnknown);
         this._setFiltersValues(noNotify);
      },
       /**
        * <wiTag group="Управление">
        * Установить активность кнопки фильтрации.
        * @param {String} filterName Имя фильтра.
        * @param {Boolean} enable Признак: активна (true) или неактивна (false).
        * @example
        * Активность кнопки фильтрации зависит от значения флага (fieldCheckbox).
        * <pre>
        *    fieldCheckbox.subscribe('onChange', function(eventObject, value) {
        *       pathFilter.setEnabledArrow('Регион' ,value);
        *    });
        * </pre>
        */
      setEnabledArrow: function(filterName, enable){
         if (filterName) {
            enable = !!enable;
            for (var i = 0, l = this._path.length; i < l; i++) {
               if (this._path[i].title === filterName) {
                  var arrow = this._block.find('.ws-PathSelector__arrow[data-index='+ (i - 1) +']');
                  if (arrow.length) {
                     arrow.toggleClass('ws-disable', !enable);
                  }
               }
            }
         }
      },
       /**
        * <wiTag group="Данные">
        * Получить параметры фильтрации.
        * @returns {Object} Объект с параметрами фильтрации.
        * @example
        * При клике на кнопку (btn) сбросить фильтр (pathFilter) к начальным настройкам.
        * <pre>
        *    btn.subscribe('onClick', function() {
        *       //получаем параметры фильтрации
        *       var object = pathFilter.getQuery();
        *       //формируем объект с параметрами фильтрации
        *       $ws.helpers.forEach(object, function(element, key) {
        *          //каждый фильтр будет сброшен к значению по умолчанию
        *          object[key] = undefined;
        *       });
        *       //устанавливаем новые параметры фильтрации
        *       pathFilter.setQuery(object);
        *       //делаем активным верхний фильтр (иконка домика)
        *       pathFilter.setActiveFilter('');
        *    });
        * </pre>
        * @see filters
        * @see setQuery
        */
      getQuery: function(){
         return this._getQueryFromPath();
      },
      _getQueryFromPath: function(){
         var query = {};
         for (var i = 0, len = this._path.length; i < len; i++){
            if (this._path[i].title) {
               query[this._path[i].title] = this._checkValue(this._path[i].value) !== undefined ? this._path[i].value : this._path[i].defaultValue;
            }
         }
         return query;
      },
      _checkValue : function(value) {
         return (!value && value !== 0) ? undefined : value;
      },
       /**
        *<wiTag group="Управление">
        * Задать фильтры и отрисовать их.
        * При наличии defaultValue в хлебном фильтре поставится это значение, иначе поставится имя параметра фильтрации.
        * @param {Object} path Объект с параметрами фильтрации.
        * Задать хлебному фильтру  параметры фильтрации: "Тип" и "years", причём, выводить "years" как "Год".
        * @example
        * <pre>
        *    //Результатом данного примера будут два отображаемых фильтра с текстами "Тип" и "Год".
        *    pathFilter.setPath({
        *       'Тип' : {},
        *       'years' : {defaultValue: 'Год'}
        *    })
        * </pre>
        * @see onDrawPoint
        * @see filters
        * @see setDefaultValues
        */
      setPath: function(path){
        //$ws.proto.PathFilter.superclass.setPath.apply(this,  [this._preparePath(path)]);
         this._options.filters = path;
         this._destroyFieldDropDowns();
         this._initPath();
         this._build(true);
      },
      _destroyFieldDropDowns: function(){
         if (this.isHoverMode()) {
            for (var i in this._dropDowns) {
               if (this._dropDowns.hasOwnProperty(i) && !this._dropDowns[i].isDestroyed()) {
                  //Обязательно удаляем значение из контекста
                  this.getLinkedContext().removeValue(i);
                  this._dropDowns[i].destroy();
               }
            }
            this._dropDowns = {};
         }
      },
      _build: function(notFirstBuild){
         $ws.proto.PathFilter.superclass._build.apply(this, arguments);
         notFirstBuild = typeof notFirstBuild === 'boolean' ? notFirstBuild :  undefined;
         this._container.find('.ws-PathSelector__rootIcon').removeAttr('title').addClass('ws-PathFilter__point__activated');
         this._setFiltersValues(false);
         if (!notFirstBuild) {
            this._notify('onReady');
         }
      },
      /**
       * <wiTag group="Данные">
       * Получить текущую ширину хлебного фильтра.
       * @returns {number} Возвращает текущую ширину.
       * @see getFullWidth
       * @see updateWidth
       */
      getResultWidth: function () {
         return this._resultWidth;
      },
      /**
       * <wiTag group="Данные">
       * Получить ширину хлебного фильтра, необходимую для полного представления всего пути.
       * @returns {Number} Возвращает необходимую ширину.
       * @see getResultWidth
       * @see updateWidth
       */
      getFullWidth: function () {
         return this._fullWidth;
      },
      /**
       * <wiTag group="Управление">
       * Пересчитать ширину хлебного фильтра.
       * @see getResultWidth
       * @see getFullWidth
       */
      updateWidth: function(){
         this._setWidth();
      },
      _setWidth: function(){
         var isHoverMode = this.isHoverMode(),
             points = this._block.find(isHoverMode ? '.ws-field-dropdown-hover' : '.ws-PathSelector__pointText'),
             isVisible = points.is(':visible'),
             l = points.length,
             isFast = this.isFast(),
             addWidth = isHoverMode ? 0 : (l * ARROW_WIDTH + (isFast ? 0 : HOME_WIDTH + l + l * PADDING_POINT)),
             sumWidths = 0,
             dataIndex, hiddenElement, width,
             needReCalc,
             fddMaxWidth;
         this._resultWidth = 0;
         this._fullWidth = 0;
         if (!isVisible) {
            hiddenElement = points.closest('.ws-hidden:not(.ws-PathSelector__pointText)');
            hiddenElement.addClass('ws-displayed-notVisible');
         }
         this._block.addClass('ws-hidden');
         width = this._container.width() - addWidth;
         this._block.removeClass('ws-hidden');
         for (var i = 0; i < l; i++) {
            $(points[i]).css('max-width', '').find('.ws-PathFilter__text').css('max-width', '');
            this._filtersFullWidth.push($(points[i]).width() +
                  ($ws._const.browser.isModernIE ? MODERN_IE_WIDTH : 0));
            sumWidths += this._filtersFullWidth[i];
         }
         this._fullWidth = sumWidths + addWidth;
         needReCalc = sumWidths > width;
         for (i = 0; i < l; i++) {
            var maxPointWidth;
            if (needReCalc) {
               maxPointWidth = i === l - 1 ? width - this._resultWidth : width * (this._filtersFullWidth[i]/sumWidths);
            } else {
               maxPointWidth = this._filtersFullWidth[i];
            }
            this._resultWidth += maxPointWidth;
            this._filtersMaxWidth.push(maxPointWidth);
         }
         if (needReCalc) {
            this._reCalculateWidth(this._resultWidth);
         }
         this._resultWidth += addWidth;
         for (i = 0; i < l; i++) {
            dataIndex = $(points[i]).attr('data-index');
            $(points[i]).css('max-width', this._filtersMaxWidth[i]);
            $(points[i]).find('.ws-PathFilter__text').css('max-width', this._filtersMaxWidth[i] -
                  ($(points[i]).hasClass('ws-PathFilter__value') ? CROSS_WIDTH : 0));
         }
         if (isHoverMode) {
            i = 0;
            fddMaxWidth = width;
            for (var j in this._dropDowns) {
               if (this._dropDowns.hasOwnProperty(j)) {
                  this._dropDowns[j].setMaxWidthForHoverStyle(fddMaxWidth);
                  fddMaxWidth -= this._filtersMaxWidth[i];
                  i++;
               }
            }
         }
         if (!isVisible) {
            hiddenElement.removeClass('ws-displayed-notVisible');
         }
         this._filtersFullWidth = [];
         this._filtersMaxWidth = [];
      },
      _reCalculateWidth: function(width){
         var proportion = width/this._filtersMaxWidth.length,  //одна доля от доступной ширины
             sl = 0,      //минимальная недостающая ширина для фильтров, ширину которых следует увеличить
             bl = 0,      //минимальная недостающая ширина фильтров, за счет которых будет увеличиваться ширина
             stuff = 0,   //доступная ширина
             sf = [],     //фильтры, ширину которых следует увеличить
             bf = [],     //фильтры, за счет которых будет увеличиваться ширина
             filter,      //опции фильтра
             cw,          //рассчитаная ранее максимальная ширина
             fw;          //необходимая ширина

         //получим набор фильтров, которые необходимо расширить и за счет которых это будет делаться
         for (var i = 0, l = this._filtersMaxWidth.length; i < l; i++) {
            cw = this._filtersMaxWidth[i];
            fw = this._filtersFullWidth[i];
            filter = {
               'index': i,
               'currentWidth': cw
            };
            if (cw < proportion) {
               filter.lack = (fw >= proportion ? proportion : fw) - cw; //недостающая ширина
               if (sf.length === 0 || filter.lack < sl) {
                  sl = filter.lack;
               }
               sf.push(filter);
            } else if (cw > proportion) {
               filter.lack = cw - proportion;
               if (bf.length === 0 || filter.lack < bl) {
                  bl = filter.lack;
               }
               bf.push(filter);
            }
         }
         //Если есть фильтры за счет которых можно было бы расшириться
         if ((l = bf.length) > 0) {
            //то приведем ширину фильтров к равным долям из доступной ширины, либо же меньшей, если ширины достаточно
            for (i = 0; i < l; i++) {
               //соберем всю имеющуюся доступную ширину
               var piece = bf[i].currentWidth - proportion;
               stuff += piece;
               this._filtersMaxWidth[bf[i].index] -= piece;
            }
            //теперь самое время ее раскидать
            stuff = this._distributeWidth(sf, stuff, sl);
            //Если после распределения осталась ширина
            if (stuff > 0) {
               var filters = [],
                   minLack = 0,
                   lack;
               //отберем фильтры, которые отображаются не в полную ширину
               for (i = 0, l = this._filtersMaxWidth.length; i < l; i++) {
                  cw = this._filtersMaxWidth[i];
                  fw = this._filtersFullWidth[i];
                  if (cw !== fw) {
                     lack = fw - cw;
                     if (filters.length === 0 || lack < minLack) {
                        minLack = lack;
                     }
                     filters.push({
                        'index': i,
                        'currentWidth': cw,
                        'lack': lack
                     });
                  }
               }
               //и если такие есть, попробуем снова перераспределить ширину
               if (filters.length > 0) {
                  this._distributeWidth(filters, stuff, minLack);
               }
            }
         }
      },
      _distributeWidth: function(filters, stuff, minLack){
         var l = filters.length,
             value = stuff/l,//значение ширины для одного фильтра
             df = [],        //массив индексов фильтров, которые можно убрать из распределения
             cf,             //текущий фильтр
             i;
         if (minLack * l <= stuff) {
            //Распределим поровну минимально недостующую ширину на все фильтры, которым это надо
            for (i = 0; i < l; i++) {
               cf = filters[i];
               this._filtersMaxWidth[cf.index] += minLack;
               cf.currentWidth += this._filtersMaxWidth[cf.index];
               stuff -= minLack;
               if (cf.lack === minLack) {
                  //запомним индекс фильтра
                  df.push(i);
               }
               cf.lack -= minLack;
            }
            //уберем те фильтры, которым ширина уже не нужна
            filters = $.grep(filters, function(n, i) {
               return $.inArray(i, df) == -1;
            });
            //Если еще остались фильтры, которым не хватает ширины
            if ((l = filters.length) > 0) {
               //вычислим новое значение минимально недостающей ширины
               minLack = filters[0].lack;
               if (l > 1) {
                  for (i = 1; i < l; i++) {
                     cf = filters[i];
                     if (cf.lack < minLack) {
                        minLack = cf.lack;
                     }
                  }
               }
               stuff = this._distributeWidth(filters, stuff, minLack);
            }
         } else {
            for (i = 0; i < l; i++) {
               cf = filters[i];
               this._filtersMaxWidth[cf.index] += value;
               cf.currentWidth = this._filtersMaxWidth[cf.index];
            }
            stuff = 0;
         }
         return stuff;
      },
      /**
       * @deprecated Не использовать.
       * @param minWidth
       */
      setMinPointWidth: function (minWidth) {
      },
      /**
       * @deprecated Не использовать.
       * @returns {*}
       */
      getMinPointWidth: function ( ) {
         return this._options.minPointWidth;
      },
      _onResizeHandler: function(){
         this._setWidth();
      },
      _removeArrow: function(count) {
         if(!this.isFast()) {
            this._points[count - 2][1].addClass('ws-hidden');
         }
      },
      _setFiltersValues: function(noNotify){
         for (var i = 0, l = this._path.length; i < l; i++){
            this._setValueForFilter(i);
         }
         //TODO отдавать что-нибудь по-лучше
         if (!noNotify) {
            this._notify('onFilterChange', this.getQuery());
         }
          this._setWidth();
      },
      _findPathIndex : function(filterName){
         for  (var i = 0, len = this._path.length; i < len; i++ ){
            if (this._path[i].title === filterName) {
               return i;
            }
         }
         return -1;
      },
      _setValueForFilter: function(index){
         var pathPoint = this._path[index],
             point = this._block.find('.ws-PathSelector__point[data-index="' + index + '"]'),
             clearContainer = point.find('.ws-PathFilter__clearContainer'),
             textContainer = point.find('.ws-PathFilter__text'),
             checkValue = this._checkValue(pathPoint.value),
             tooltip = '',
             fdd,
             recSet;
         if (this.isHoverMode() && index >= 0) {
            fdd = this._dropDowns[this.getName() + '-' + index];
            recSet = fdd.getRecordSet();
            if (recSet === null || recSet.isLoaded()) {
               fdd.setValue(this._getValueForFieldDropDown(pathPoint, fdd));
            }
         } else if ((this.isFast() || index !== 0) && point.length) {
            point.toggleClass('ws-PathFilter__value', checkValue !== undefined);
            tooltip = this._setValueToTextContainer(textContainer, pathPoint);
            if (pathPoint.showTooltip) {
               point.attr('title', tooltip);
            }
            clearContainer.toggleClass('ws-hidden', checkValue === undefined);
         }
      },
      _getValueForFieldDropDown: function(pathPoint, fdd){
         var value = this._checkValue(pathPoint.value),
             key;
         //Если есть value, то пытаемся найти ключ по нему, иначе сначала ищем по defaultValue, а после по title
         if (value === undefined) {
            key = fdd.getKeyByValue(pathPoint.defaultValue);
            return (key === undefined ? fdd.getKeyByValue(pathPoint.title) : key);
         }
         //Проблема в том, что джинн конвертит ключи как числа когда захочет. Поэтому вычитываем возможные строковые значения.
         return fdd.getKeyByValue(value) || fdd.getKeyByValue(value + '');
      },
      /**
       * Получить связанный выпадающий список по имени фильтра
       * @param {String} filterName - имя фильтра (title)
       * @returns {$ws.proto.FieldDropDown} выпадающий список, относящийся к данному фильтру
       */
      getDropDownByFilterName: function(filterName){
         var index = this._findPathIndex(filterName);
         return this._dropDowns[this.getName() + '-' + index];
      },
      /**
       * Перед установкой текста в элемент фильтра стреляем событием, чтобы пользователь мог поставить свой текст
       * На фильтр это не влияет
       * @param textContainer - jQuery
       * @param pathPoint - {title, defaultValue, value}
       * @returns {String} текст, который будет поставлен
       * @private
       */
      _setValueToTextContainer: function(textContainer, pathPoint){
         var checkValue = this._checkValue(pathPoint.value),
             text = checkValue !== undefined ? checkValue + '' : (pathPoint.defaultValue || pathPoint.title),
             result = this._notify('onVisualizeFilter', pathPoint.title, text);
         text = (result && (typeof result === 'string')) ? result : text;

         textContainer.text(text);

         return text;
      },
      append: function() {
         $ws.proto.PathFilter.superclass.append.apply(this, arguments);
         if (!this.isHoverMode()) {
            var count = this._points.length;
            if (count >= 2) {
               this._points[count - 2][1].removeClass('ws-hidden');
            }
         }
         this._setValueForFilter(this._path.length-1);
         //добавляем поинт, пересчитываем размеры, а если у поинта был value, то пересчитывать размеры нужно после проставления значения
         //пока не придумал другого решения
         this._setWidth();
      },
      _getTextPoint: function(index){
         return $ws.helpers.escapeHtml(this._path[index].defaultValue || this._path[index].title);
      },
      _initRecordSet: function(){

      },
      /**
       * Обрабатывает клик по элементу пути
       * @param {Object} event jQuery-событие
       */
//      _onMouseClick: function(event){
//      },
      _checkBeforePointCLick: function(index){
         return true;
      },
      /**
       * Обработчик нажатия на заголовок элемента
       * @param {Number} index   номер элемента
       * @param {String} id      идентфикатор узла
       * @param {String} title   заголовок узла
       * @param {jQuery} event   jQuery event click
       */
      _onPointClick: function(index, id, title, event){
         var arrow;
         if (index !== undefined) {
            arrow = this._setActivePoint(index);
            //Ну вероятно потом что-нить получше будем возвращать
            this._notifyClick(title, arrow, event, index);
         }
      },
      _setActivePoint: function(index){
         if (!this.isFast()) {
            var point = this._block.find('.ws-PathSelector__point[data-index='+ index +']'),
                  arrow = this._block.find('.ws-PathSelector__arrow[data-index='+ (index - 1) +']'),
                  className = 'ws-PathFilter__point__activated',
                  activatedPoint, activatedArrow;
            if (!point.hasClass(className)) {
               activatedPoint = this._block.find('.ws-PathSelector__point.' + className);
               if (activatedPoint.length) {
                  activatedPoint.removeClass(className);
                  activatedArrow = this._block.find('.ws-PathSelector__arrow[data-index='+ (activatedPoint.attr('data-index')-1) +']');
                  if (activatedArrow.length) {
                     activatedArrow.removeClass(className);
                  }
               }
               point.addClass(className);
               if (arrow.length && !arrow.hasClass('ws-disable')) {
                  arrow.addClass(className);
               }
            }
         }
         return this.isFast() ? this._block.find('.ws-PathSelector__arrow[data-index='+ index +']') : undefined;
      },
       /**
        * <wiTag group="Управление">
        * Установить активный фильтр.
        * Если режим отображения - хлебный фильтр, то для активации папки с изображением домика необходимо передать пустую строку.
        * @param {String} title Имя фильтра.
        * @example
        * При клике на кнопку (btn) сбросить фильтр (pathFilter) к начальным настройкам.
        * <pre>
        *    btn.subscribe('onClick', function() {
        *       //получаем параметры фильтрации
        *       var object = pathFilter.getQuery();
        *       //формируем объект с параметрами фильтрации
        *       $ws.helpers.forEach(object, function(element, key) {
        *          //каждый фильтр будет сброшен к значению по умолчанию
        *          object[key] = undefined;
        *       });
        *       //устанавливаем новые параметры фильтрации
        *       pathFilter.setQuery(object);
        *       //проверяем, что режим не быстрого доступа к фильтру
        *       if !pathFilter.isFast() {
        *          //делаем активным верхний фильтр (иконка домика)
        *          pathFilter.setActiveFilter('');
        *       }
        *    });
        * </pre>
        * @see isFast
        * @see filters
        */
      setActiveFilter: function(title){
         var index = this._findPathIndex(title);
         if (index !== -1) {
            this._onPointClick(index, this._path[index].id, title);
         }
      },
      /**
       * Рисует один элемент пути
       * @param {Object}   index элемент пути
       * @param {Boolean}  last  является ли элемент последним
       * @returns {jQuery}
       */
      _drawPoint: function(index, last){
         var point = this.isHoverMode() ?
                     $('<span class="">' + this._getTextPoint(index) + '</span>') :
                     this._drawText(index, last),
               arrow = $('<span class="ws-PathSelector__arrow"></span>'),
               text = point.text(),
               isFast = this.isFast(),
               self = this;
         arrow.attr('data-index', index);
         if (!point.hasClass('ws-PathSelector-onDrawPoint')) {
            point.html('<div class="ws-PathFilter__text">'+ text +'</div>');
         }
         if (this.isHoverMode()) {
            /*point =*/ this._createDropDownForHoverMode(point, index, last);
            this._block.append(point);
            this._points.push([point, undefined]);
         } else {
            if (isFast){
               this._block.append(arrow, point);

            } else {
               if(last){
                  arrow.addClass('ws-hidden');
               }
               this._block.append(point, arrow);
            }
            this._points.push([point, arrow]);
            point.append('<span class="ws-PathFilter__clearContainer">' +
                  '<div class="ws-PathFilter__clear"></div></span>');
         }
         new Button({
            element: point.find('.ws-PathFilter__clear'),
            renderStyle: 'asLink',
            img: 'sprite:ico16-Close-primary',
            tooltip: 'Сбросить на значение по умолчанию',
            handlers: {
               'onActivated': function () {
                  self._notify('onResetFilter', self._path[index].title);
                  var dataIndex = index,
                        pointContainer = this.getContainer().closest('.ws-PathSelector__point'),
                        textContainer = pointContainer.find('.ws-PathFilter__text');
                  if (!isFast) {
                     dataIndex--;
                  }
                  $(this).closest('.ws-PathFilter__clearContainer').addClass('ws-hidden');
                  pointContainer.removeClass('ws-PathFilter__value ws-PathFilter__noHover')
                        .attr('title', self._path[index].defaultValue || self._path[index].title);
                  self._block.find('.ws-PathSelector__arrow[data-index='+ dataIndex +']').removeClass('ws-PathFilter__noHover');
                  self._path[index].value = undefined;
                  self._setValueToTextContainer(textContainer, self._path[index]);
                  self._notify('onFilterChange', self.getQuery(), self._path[index].title);
                  self._setWidth();
               }
            }
         });
         return point;
      },
      /**
       *  Создание DropDown.
       * @param point
       * @param index
       * @param last
       * @private
       */
      _createDropDownForHoverMode: function(point, index, last) {
         var result = this._notify('onCreatePoint', this._path[index]),
             self = this,
             nameFDD = this.getName() + '-' + index,
             isStaticData;
         try {
            isStaticData = result.hasOwnProperty('data');
            self._dropDowns[nameFDD] = new DropDown({
               element: point,
               renderStyle: 'hover',
               dataSource: isStaticData ? undefined : result.dataSource,
               data: isStaticData ? result.data : [],
               displayColumn: isStaticData ? '' : result.displayColumn || this._path[index].title,
               wordWrap: false,
               showSelectedInList: true,
               name: result.altName || nameFDD,
               showTooltip : !!this._path[index].showTooltip,
               titleRender: function () {
                  //Я не знаю, как еще передать имя DropDown
                  //Беда в том, что рендер срабатывает даже дял не готового FDD
                  //А это значит, что иногда this = undefined
                  //При этом результат одинаковый нужно отдавать всегда!
                  var args = Array.prototype.slice.call(arguments); //Convert to array
                  args.push(nameFDD);
                  return self._fddTitleRender.apply(self, args);
               },
               valueRender: result.render,
               handlers: {
                  onAfterLoad: function () {
                     var pathPoint = self._path[index],
                           dropd = this;
                     //Раньше было в onReady, но если перезагружают рекордсет, опции нужно обновить. здесь правильней все это делать
                     if (!isStaticData && this.getRecordSet().getRecords().length) {
                        this.insertOption('default', self._path[index].title, true);
                        this.getValueDeferred().addCallback(function () {
                           //Может value нужно как ключ отдавать?
                           dropd.setValue(self._getValueForFieldDropDown(pathPoint, dropd));
                        });
                     }
                  },
                  onChange: function (event, key) {
                     var pathPoint = self._getPathPointByFDDName(this.getName()),
                     //Мало того, что в документации говорят, что отдают value, на самом деле там key. Но!
                     //МНЕ ПРИСЛАЛИ key = int, а сами записали его у себя как string. ЭТО СУПЕР WIN!!!!!
                           value = self._helpSetValue(pathPoint.title, this.getValueByKey(key) || this.getValueByKey(key + ''));

                     self._notify('onSelectValue', key, value, pathPoint);
                     self.setFilter(pathPoint.title, value);
                  },
                  onClickMore: function (event) {
                     var pathPoint = self._getPathPointByFDDName(this.getName());
                     event.setResult(self._notify('onClickMore', pathPoint));
                  }
               }
            });
         } catch(e) {
            $ws.single.ioc.resolve('ILogger').log('Быстрый доступ к фильтру "' + self.getName() + '"', 'Ошибка обработки результатов события onCreatePoint.' +
            ' Необходимо вернуть правильные данные из обработчика для фильтра "' +  self._path[index].title + '".' );
         }
      },
      _getPathPointByFDDName: function(name){
         var split = name.split('-'),
             index = parseInt(split[split.length - 1], 10);
         if (index >= 0) {
            return this._path[index];
         }
         //Если было задано альтернативное имя для выпадающего списка, найти его будет чуть трудней
         for (var i in this._dropDowns) {
            if (this._dropDowns.hasOwnProperty(i) && this._dropDowns[i].getName() === name) {
               return this._getPathPointByFDDName(i);
            }
         }
      },
      /**
       * Если имеем дело с dataSource, то параметров меньше
       * @param {$ws.proto.Record|String} key
       * @param value
       * @param name
       * @returns {*|jQuery|HTMLElement}
       * @private
       */
      _fddTitleRender: function(key, value, name){
         var  blockContainer = $('<div class="ws-PathFilter_blockText"></div>'),
               textContainer = $('<div class="ws-PathFilter_headText asLink ws-PathFilter__block"></div>'),
               pathPoint = this._getPathPointByFDDName(name || value),
               self = this,
               $close;
         textContainer.append(blockContainer);
         this._setValueToTextContainer(blockContainer, pathPoint);
         if (this._checkValue(pathPoint.value)) {
            textContainer.append($close = $('<div class="ws-button-image ico16-Close-primary"></div>'));
            textContainer.addClass('ws-PathFilter_valueSelected');
            $close.bind('click', function(event){
               self._notify('onResetFilter', pathPoint.title);
               self._dropDowns[name || value].hideMenu();
               self.setFilter(pathPoint.title, undefined);
            });
         }
         return textContainer;//$('<div class="ws-PathFilter_headText asLink">'+ value + '</div>');
      },
      _fddBodyRender: function(){

      },
      _helpSetValue: function(title, value) {
         return value === title ? undefined : value;
      },
      /**
       * Обработчик нажатия клавиши мыши
       * @param {Object} event параметры события
       */

//      _onMouseDown: function(event){
//      },
      _onMouseUp: function(event) {
         this._clearPressedArrow();
      },
      _processMenu: function(id, arrow, isBack, event) {
         if (!arrow.hasClass('ws-disable')) {
            event.stopPropagation();
            var index = arrow.data('index');
            this._notifyClick( this.isFast() ? this._path[index].id : this._path[index + 1].id, arrow, event, index);
         }
      },
      /**
       * Обработчик наведения мыши
       * @param {Object} event параметры события
       */
      _onMouseOver: function(event) {

      },
       /**
        * <wiTag group="Данные" page=0>
        * <wiTag group="Данные" page=1>
        * Получить способ отображения.
        * Получить признак способа отображения, заданного в свойстве {@link isFast}.
        * @returns {Boolean} Возможные значения:
        * <ol>
        *    <li>true - быстрый доступ к фильтру (без домика);</li>
        *    <li>false - хлебный фильтр (с домиком).</li>
        * </ol>
        * @example
        * При клике на кнопку (btn) сбросить фильтр (pathFilter) к начальным настройкам.
        * <pre>
        *    btn.subscribe('onClick', function() {
        *       //получаем параметры фильтрации
        *       var object = pathFilter.getQuery();
        *       //формируем объект с параметрами фильтрации
        *       $ws.helpers.forEach(object, function(element, key) {
        *          //каждый фильтр будет сброшен к значению по умолчанию
        *          object[key] = undefined;
        *       });
        *       //устанавливаем новые параметры фильтрации
        *       pathFilter.setQuery(object);
        *       //проверяем, что режим не быстрого доступа к фильтру
        *       if !pathFilter.isFast() {
        *          //делаем активным верхний фильтр (иконка домика)
        *          pathFilter.setActiveFilter('');
        *       }
        *    });
        * </pre>
        * @see fast
        * @see setActiveFilter
        */
      isFast: function() {
         return this._options.fast;
      },
      /**
       * <wiTag group="Управление">
       * Задать значения фильтра по умолчанию.
       * Начальные значения фильтра задаются опцией {@link filters}.
       * Заданные этим методом значения приоритетнее. То есть, если заданы и начальные значения, и значения фильтра по
       * умолчанию, то фильтрация пойдёт по последним значениям. Если же значения по умолчанию будут сброшены, то
       * фильтрация пойдёт по начальным значениям.
       * @param {Object} objectValues - {filterName: defaultValue}
       * @example
       * При клике на кнопку (btn) задать начальные значения фильтра
       * <pre>
       *    btn.subscribe('onClick', function() {
       *       pathFilter.setDefaultValue({
       *          'Регион': 'Центральный',
       *          'Предмет торга': 'Сельское хозяйство',
       *          'Площадки': 'Международные'
       *       });
       *    });
       * </pre>
       * @see filters
       */
      setDefaultValues : function(objectValues) {
         for (var i = 0, len = this._path.length; i < len; i++) {
            if (objectValues.hasOwnProperty(this._path[i].title)) {
               this._path[i].defaultValue = objectValues[this._path[i].title];
            }
         }
         this._setFiltersValues(true);
      },
      _notifyClick: function(title, arrow, event, index){
         //Теперь будем передавать jQuery event во все события
         //Янис Батура попросил передавать id title - отдаем в последнем аргументе
         this._notify(this.isFast() ? 'onPointClick' : (arrow ? 'onArrowClick' : 'onPathChange'), title,
               arrow, event, index);
      },
       /**
        * <wiTag group="Данные" page=2>
        * Признак режима отображения "выпадающий список" быстрого доступа к фильтру.
        * @returns {Boolean} Возможные возвращаемые значения:
        * <ol>
        *    <li>true - отображение "выпадающий список";</li>
        *    <li>false - обычный быстрый доступ к фильтру.</li>
        * </ol>
        * @example
        * <pre>
        *     if (pathFilter.isHoverMode() && pathFilter.getQuery()['Тип'] === 'Газета') {
        *        pathFilter.setData('Год', {keys: [1, 2], values: ['2013', '2014']});
        *     }
        * </pre>
        * @see mode
        * @see fast
        * @see isFast
        */
      isHoverMode: function(){
         return this._options.mode === 'hover';
      },
      destroy: function() {
         this._destroyFieldDropDowns();
         $ws.proto.PathFilter.superclass.destroy.call(this);
      },
      /**
       * <wiTag noShow>
       */
      setRootNode: function(id) {
      //Это функция из PathSelector и тут совсем присовсем не нужна.
      }
   });

   return $ws.proto.PathFilter;

});
