define('js!SBIS3.CONTROLS.HighCharts', [
   "js!WS.Data/Source/SbisService",
   "js!WS.Data/Query/Query",
   "Core/helpers/helpers",
   "Core/core-functions",
   "Core/constants",
   "Core/Deferred",
   "js!SBIS3.CORE.Control",
   "html!SBIS3.CONTROLS.HighCharts",
   "Core/helpers/functional-helpers",
   "Core/helpers/dom&controls-helpers",
   "browser!/cdn/highcharts/4.2.3/highcharts-more-min.js",
   "css!SBIS3.CONTROLS.HighCharts",
   "i18n!SBIS3.CONTROLS.HighCharts"
],
function( SbisService, Query, cHelpers, cFunctions, constants, Deferred,BaseControl, dotTpl, fHelpers, dcHelpers){
   'use strict';

   function ctxOnFieldChange(e, field, value, init) {
      var changedFilter = this._ctxBind[field];
      if (changedFilter && (init !== this) && (this._filters[changedFilter] !== value)) {
         this._filters[changedFilter] = value;
         this._reloadDebounce();
      }
   }
   function onDataBind() {
      var ctx = this.getLinkedContext();
      for (var j in this._ctxBind) {
         if (this._ctxBind.hasOwnProperty(j)) {
            var
               changedFilter = this._ctxBind[j],
               value = ctx.getValue(j),
               refresh = false;
            if (this._filters[changedFilter] !== value) {
               this._filters[changedFilter] = value;
               refresh = true;
            }
            if (refresh) this._reloadDebounce();
         }
      }
   }
   /**
    * Диаграмма HighCharts. Демо-примеры диаграмм вы можете найти на сайте <a href='http://www.highcharts.com/demo'>www.highcharts.com</a>.
    * @class SBIS3.CONTROLS.HighCharts
    * @extends SBIS3.CORE.Control
    * @control
    * @public
    *
    * @author Крайнов Дмитрий Олегович
    * @category Table
    * @designTime actions /design/design
    *
    * @initial
    * <component data-component='SBIS3.CONTROLS.HighCharts'>
    * </component>
    */
   var HighCharts = BaseControl.Control.extend(/** @lends SBIS3.CONTROLS.HighCharts.prototype */{
      /**
       * @event onBeforeReload перед перерисовкой диаграммы
       * может использоваться для задания специфических опций при отрисовке диаграммы, например, когда надо сделать подпись в зависимости от условий
       * <wiTag group='Управление">
       * @param {Object} eventObject описание в классе SBIS3.CORE.Abstract
       * @param {Object} highChartOptions Объект опций который будет передан в HighChart
       * @param {Object} объект HighChart
       * @param {Array} данные по которым отрисуется диаграмма
       */
      /**
       * @event onFilterChange при смене фильтра
       * можно обработать фильтры, которые уйдут на БЛ
       * <wiTag group="Управление">
       * @param {Object} changedFilters измененные фильтры
       * @param {Object} filters все фильтры которые отправляются на БЛ
       *
       */
      _dotTplFn : dotTpl,
      $protected : {
         _dataSource: null,
         _ctxBind : {},
         _filters : {},
         _loadedFilters : {},
         _chartObj : null,
         _sourceData : {},
         _isRefresh : false,
         _wsSeries : [],
         _wsAxis : [],
         _ctxFieldChangeHandler : null,
         _ctxDataBindHandler : null,
         _series : [],
         _xAxis : [],
         _yAxis : [],
         _options: {
            /**
             * @typedef {Object} typeDiagr
             * @variant line График
             * @variant spline Сглаженный график
             * @variant pie Круговая диаграмма
             * @variant column Столбчатая диаграмма
             * @variant bar Столбчатая горизонтальная
             * @variant area График с областью под ним
             * @variant areaspline Сглаженный график с областью под ним
             * @variant scatter Точки
             * @variant arearange Область - интервал значений
             * @variant areasplinerange Сглаженная область - интервал значений
             */
            /**
             * @typedef {Object} wsSerie
             * @property {typeDiagr} [type=line] тип графика
             * @property {string} name Имя графика
             * @property {string} sourceFieldX Поле источника данных для координаты x (Круговые диаграммы - для подписи сектора)
             * @property {string} sourceFieldY Поле источника данных для координаты y (Круговые диаграммы - для значения сектора)
             * @property {string} sourceField_3 Поле источника данных для интервала значений (Круговые диаграммы - для цвета сектора)
             * @property {string} color Цвет
             * @property {Number} xAxis Номер связанной оси X
             * @property {Number} yAxis Номер связанной оси Y
             */
            /**
             * @cfg {wsSerie[]} Набор графиков
             */
            wsSeries : [],
            /**
             * @typedef {Object} typeAxis
             * @variant xAxis Горизонтальная
             * @variant yAxis Вертикальная
             */
            /**
             * @typedef {Object} wsAxis
             * @property {typeAxis} [type=xAxis] Тип оси
             * @property {String} sourceField Поле источника данных
             * @property {String} title Заголовок
             * @property {Number} [gridLineWidth=0] Толщина линий сетки
             * @property {function} labelsFormatter Функция рендеринга меток
             * @property {Number} [staggerLines=0] Количество строк при выводе меток
             * @property {Number} [step=0] Шаг подписи меток
             * @property {Number} [lineWidth=1] Толщина оси
             * @property {Boolean} [allowDecimals=true] Разрешить дробные значения
             * @property {Number} min Минимальное значение
             * @property {Number} max Максимальное значение
             * @property {Boolean} opposite Располагать ось напротив стандартного расположения
             * @property {Number} linkedTo Номер связанной оси
             * @translatable title
             */
            /**
             * @cfg {wsAxis[]} Набор осей координат
             */
            wsAxis : [],
            /**
             * @cfg {Object} Устанавливает источник данных.
             * @group
             */
            sourceData : {
               /**
                * @typedef {Object} dataGet
                * @variant standartBL Метод бизнес-логики
                * @variant custom Пользовательский
                */
               /**
                * @cfg {dataGet} Получение данных
                */
               getDataType : 'standartBL',
               /**
                * @cfg {String} Метод бизнес логики
                * @editor MethodBLChooser
                */
               methodBL : '',
               /**
                * @cfg {Boolean} Запрашивать данные при инициализации
                */
               firstRequest : true,
               /**
                * @cfg {function} Метод для пользовательского получения данных
                */
               userGetData : null,
               /**
                * @typedef {Object} rsType
                * @variant recordSet Стандартный рекордсет
                * @variant custom Пользовательский
                */
               /**
                * @cfg {rsType} Тип преобразования данных
                */
               prepareDataType : 'recordSet',
               /**
                * @cfg {function} Метод для пользовательского преобразования данных
                */
               userPrepareData : null,
               /**
                * @cfg {rsType} Тип получения данных для осей данных
                */
               prepareAxisType : 'recordSet',
               /**
                * @cfg {function} Метод для пользовательского получения данных для осей данных
                */
               userPrepareAxis : null
            },
            /**
             * @typedef {Object} FromCtx
             * @variant ctx из контекста
             * @variant fix значение
             */
            /**
             * @typedef {Object} filterField
             * @property {String} name имя фильтра
             * @property {FromCtx} type
             * @property {String} value значение фильтра или поле из контекста
             * @property {Boolean} refresh автоматическое обновление
             */
            /**
             * @cfg {filterField[]} Поля фильтрации
             */
            filterFields : [],
            /**
             * @cfg {Object} Устанавливает конфигурацию диаграммы.
             */
            highChartOptions : {
               /**
                * @cfg {Object} Устанавливает конфигурацию области построения диаграммы.
                * @group
                */
               chart : {
                  /**
                   * @typedef {String} typeDiagr
                   * @variant line Линейная диаграмма.
                   * @variant spline Линейная сглаженная диаграмма.
                   * @variant pie Круговая диаграмма.
                   * @variant column Столбчатая диаграмма.
                   * @variant bar Столбчатая горизонтальная диаграмма.
                   * @variant area График с областью под ним.
                   * @variant areaspline Сглаженный график с областью под ним
                   * @variant scatter Точки.
                   * @variant arearange Область - интервал значений.
                   * @variant areasplinerange Сглаженная область - интервал значений.
                   */
                  /**
                   * @cfg {typeDiagr} Устанавливает тип диаграммы.
                   */
                  type : 'line',
                  /**
                   * @cfg {Number} Устанавливает верхний внутренний отступ диаграммы. Значение в px.
                   */
                  marginTop : null,
                  /**
                   * @cfg {Number} Устанавливает правый внутренний отступ диаграммы. Значение в px.
                   */
                  marginRight : null,
                  /**
                   * @cfg {Number} Устанавливает нижний внутренний отступ диаграммы. Значение в px.
                   */
                  marginBottom : null,
                  /**
                   * @cfg {Number} Устанавливает левый внутренний отступ диаграммы. Значение в px.
                   */
                  marginLeft : null,
                  /**
                   * @cfg {Number} Устанавливает верхний внешний отступ диаграммы. Значение в px.
                   */
                  spacingTop : null,
                  /**
                   * @cfg {Number} Устанавливает правый внешний отступ диаграммы. Значение в px.
                   */
                  spacingRight : null,
                  /**
                   * @cfg {Number} Устанавливает нижний внешний отступ диаграммы. Значение в px.
                   */
                  spacingBottom : null,
                  /**
                   * @cfg {Number} Устанавливает левый внешний отступ диаграммы. Значение в px.
                   */
                  spacingLeft : null,
                  /**
                   * @cfg {String} Устанавливает цвет фона диаграммы.
                   */
                  backgroundColor: "#FFFFFF"
               },
               /**
                * @cfg {string[]} Устанавливает набор цветов, которыми будут раскрышены графики на диаграмме.
                */
               colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1'],
               /**
                * @cfg {Object} Устанавливает конфигурацию метки "Highcharts.com" в правом нижнем углу.
                * @editor PropertyEditorStandardPopupObject
                */
               credits : {
                  /**
                   * @cfg {Boolean} Устанавливает отображение метки.
                   */
                  enabled : false
               },
               /**
                * @cfg {Object} Устанавливает конфигурацию легенды диаграммы.
                * @group
                */
               legend : {
                  /**
                   * @cfg {Boolean} Устанавливает отображение легенды.
                   */
                  enabled: true,
                  /**
                   * @cfg {Object.<String, Number|String>} Устанавливает CSS-стиль, который будет применён к элементу легенды при наведении курсора.
                   * @remark
                   * Подробнее читайте <a href='http://api.highcharts.com/highcharts/legend.itemHoverStyle'>здесь</a>.
                   */
                  itemHoverStyle: {"color": "#000"},
                  /**
                   * @cfg {Number} Устанавливает ширину легенды. Значение в px.
                   */
                  width: undefined,
                  /**
                   * @cfg {Number} Устанавливает высоту легенды. Значение в px.
                   */
                  height: undefined,
                  /**
                   * @cfg {Number} Устанавливает горизонтальное смещение легенды. Значение в px.
                   */
                  x: 0,
                  /**
                   * @cfg {Number} Устанавливает вертикальное смещение легенды. Значение в px.
                   */
                  y: 0,
                  /**
                   * @cfg {Function} Устанавливает функцию рендеринга подписи легенды (см. <a href='http://api.highcharts.com/highcharts/legend.labelFormatter'>labelFormatter</a>.).
                   */
                  labelFormatter: undefined,
                  /**
                   * @cfg {String} Устанавливает горизонтальное выравнивание html-контейнера легенды.
                   * @remark
                   * Возможные значения:
                   * <ul>
                   *     <li>center - выравнивание по центру;</li>
                   *     <li>left - выравнивание слева;</li>
                   *     <li>right - выравнивание справа;</li>
                   * </ul>
                   */
                  align: 'center',
                  /**
                   * @cfg {String} Устанавливает вертикальное выравнивание html-контейнера легенды.
                   * @remark
                   * Возможные значения:
                   * <ul>
                   *     <li>bottom - выравнивание снизу;</li>
                   *     <li>top - выравнивание сверху;</li>
                   *     <li>middle - выравнивание по центру;</li>
                   * </ul>
                   */
                  verticalAlign : 'bottom',
                  /**
                   * @cfg {String} Устанавливает выравнивание элементов внутри html-контейнера легенды.
                   * @remark
                   * Возможные значения:
                   * <ul>
                   *     <li>horizontal - горизонтальное выравнивание;</li>
                   *     <li>vertical - вертикальное выравнивание;</li>
                   * </ul>
                   */
                  layout : 'horizontal',
                  /**
                   * @cfg {Boolean} Устанавливает расположение легенды поверх графика.
                   */
                  floating : false,
                  /**
                   * @cfg {Number} Устанавливает отступ между графиком и легендой.
                   * @remark
                   * Значение устанавливается в px.
                   * Опция актуальна, когда {@link floating}=false.
                   */
                  margin : 15,
                  /**
                   * @cfg {Number} Устанавливает внутренний отступ легенды.
                   * @remark
                   * Значение устанавливается в px.
                   */
                  padding : 8,
                  /**
                   * @cfg {Number} Устанавливает ширину границы легенды.
                   * @remark
                   * Значение устанавливается в px.
                   */
                  borderWidth : 0,
                  /**
                   * @cfg {Object.<string, number|string>} Устанавливает CSS-стили для каждого элемента легенды.
                   */
                  itemStyle : {
                      "color": "#333333",
                      "cursor": "pointer",
                      "fontSize": "12px",
                      "fontWeight": "bold"
                  }
               },
               /**
                * @cfg {Object} Устанавливает конфигурацию для построения диаграмм разного типа. Тип диаграммы устанавливается в опции {@link type}.
                */
               plotOptions : {
                  /**
                   * @cfg {Object} Устанавливает конфигурацию для столбчатой диаграммы (см. {@link type}).
                   * @group plotOptions.column
                   */
                  column : {
                     /**
                      * @cfg {Object} Устанавливает конфигурацию для подписей точек диаграммы.
                      * @editor PropertyEditorStandardPopupObject
                      */
                     dataLabels : {
                        /**
                         * @cfg {Boolean} Устанавливает отображение подписей для точек диаграммы.
                         */
                        enabled : true,
                        /**
                         * @cfg {String} Устанавливает цвет подписи значения.
                         */
                        color : null,
                        /**
                         * @cfg {String} Устанавливает формат подписи (см. <a href='http://api.highcharts.com/highcharts/plotOptions.column.dataLabels.format'>format</a>).
                         */
                        format : '',
                        /**
                         * @cfg {Function} Устанавливает функцию рендеринга (см. <a href='http://api.highcharts.com/highcharts/plotOptions.column.dataLabels.formatter'>formatter</a>).
                         */
                        formatter : undefined
                     },
                     /**
                      * @cfg {Object} Устанавливает конфигурацию для точек диаграммы.
                      * @editor PropertyEditorStandardPopupObject
                      */
                     point : {
                        /**
                         * @cfg {Object} Устанавливает обработчики событий для точек диаграммы.
                         * @editor PropertyEditorStandardPopupObject
                         */

                        events : {
                           /**
                            * @cfg {Function} Устанавливает функцию, которая будет выполнена при клике на точку диаграммы.
                            */
                           click : undefined
                        }
                     },
                     /**
                      * @typedef {Object} typeStacking
                      * @variant null отсутствует
                      * @variant normal по значению
                      */
                     /**
                      * @cfg {typeStacking} (см. <a href='http://api.highcharts.com/highcharts/plotOptions.column.stacking'>stacking</a>).
                      */
                     stacking : null,
                     /**
                      * @cfg {Number} (см. <a href='http://api.highcharts.com/highcharts/plotOptions.column.borderWidth'>borderWidth</a>).
                      */
                     borderWidth : 0
                  },
                  /**
                   * @cfg {Object} Устанавливает конфигурацию линейной диаграммы (см. {@link type}).
                   * @group plotOptions.line
                   */
                  line : {
                     /**
                      * @cfg {Object} Устанавливает конфигурацию для подписей точек диаграммы.
                      * @editor PropertyEditorStandardPopupObject
                      */
                     dataLabels : {
                        /**
                         * @cfg {Boolean} ПУстанавливает отображение подписей для точек диаграммы.
                         */
                        enabled : true,
                        /**
                         * @cfg {String} Устанавливает цвет подписи значения.
                         */
                        color : null,
                        /**
                         * @cfg {String} (см. <a href='http://api.highcharts.com/highcharts/plotOptions.column.dataLabels.format'>format</a>).
                         */
                        format : '',
                        /**
                         * @cfg {Function} (см. <a href='http://api.highcharts.com/highcharts/plotOptions.column.dataLabels.formatter'>formatter</a>).
                         */
                        formatter : undefined
                     },
                     /**
                      * @cfg {Object} (см. <a href='http://api.highcharts.com/highcharts/plotOptions.line.marker'>marker</a>).
                      * @editor PropertyEditorStandardPopupObject
                      */
                     marker: {
                        /**
                         * @cfg {Boolean} (см. <a href='http://api.highcharts.com/highcharts/plotOptions.line.marker.enabled'>enabled</a>).
                         */
                        enabled: true,
                        /**
                         * @cfg {Number} Устанавливает радиус точки диаграммы.
                         */
                        radius : 4
                     },
                     /**
                      * @cfg {Object} Устанавливает конфигурацию для точек диаграммы.
                      * @editor PropertyEditorStandardPopupObject
                      */
                     point : {
                        /**
                         * @cfg {Object} Устанавливает обработчики событий для точек диаграммы.
                         * @editor PropertyEditorStandardPopupObject
                         */
                        events : {
                           /**
                            * @cfg {Function} Устанавливает функцию, которая будет выполнена при клике на точку диаграммы.
                            */
                           click : undefined
                        }
                     },
                     /**
                      * @cfg {Number} Устанавливает интервал значений для оси X. Опция актуальна, когда значения X не заданы.
                      */
                     pointInterval : 1,
                     /**
                      * @cfg {Boolean} Устанавливает соединение конца и начала диаграммы. Опция актуальна только для полярных диаграмм.
                      */
                     connectEnds : true,
                     /**
                      * @cfg {Boolean} Устанавливает отображение на диаграмме точек со значением null.
                      */
                     connectNulls : false
                  },
                  /**
                   * @cfg {Object} Устанавливает конфигурацию круговой диаграммы (см. {@link type}).
                   * @group plotOptions.pie
                   */
                  pie : {
                     /**
                      * @cfg {String} Устанавливает цвет границ сектора.
                      */
                     borderColor: "#FFFFFF",
                     /**
                      * @cfg {Boolean} Устанавливает выделение сектора по клику.
                      */
                     allowPointSelect : false,
                     /**
                      * @cfg {Object} Устанавливает конфигурацию подписей для каждого сектора.
                      * @editor PropertyEditorStandardPopupObject
                      */
                     dataLabels : {
                        /**
                         * @cfg {Number} Устанавливает расстояние от диаграммы до подписей. Значение в px.
                         */
                        distance : 30,
                        /**
                         * @cfg {Boolean} Устанавливает отображение подписей.
                         */
                        enabled : true,
                        /**
                         * @cfg {String} Устанавливает цвет подписей.
                         */
                        color : null,
                        /**
                         * @cfg {String} (см. <a href='http://api.highcharts.com/highcharts/plotOptions.column.dataLabels.format'>format</a>).
                         */
                        format : '',
                        /**
                         * @cfg {Function} (см. <a href='http://api.highcharts.com/highcharts/plotOptions.column.dataLabels.formatter'>formatter</a>).
                         */
                        formatter : undefined
                     },
                     /**
                      * @cfg {Boolean} Устанавливает отображение легенды.
                      */
                     showInLegend : false
                  },
                  /**
                   * @cfg {Object} Устанавливает общую конфигурацию для всех типов диаграмм.
                   * @group plotOptions.series
                   */
                  series : {
                     /**
                      * @cfg {Boolean} Устанавливает поведение, при котором график будет появляться с анимацией.
                      */
                     animation : true,
                     /**
                      * @cfg {String} Устанавливает тип курсора, который будет использован при наведении на диаграмму.
                      */
                     cursor : 'default',
                     /**
                      * @cfg {Object} Устанавливает конфигурацию подписей данных для диаграммы.
                      * @editor PropertyEditorStandardPopupObject
                      */
                     dataLabels : {
                        /**
                         * @cfg {Boolean} Устанавливает отображение подписей.
                         */
                        enabled : true,
                        /**
                         * @cfg {String} Устанавливает цвет подписей.
                         */
                        color : null,
                        /**
                         * @cfg {String} (см. <a href='http://api.highcharts.com/highcharts/plotOptions.column.dataLabels.format'>format</a>).
                         */
                        format : '',
                        /**
                         * @cfg {Function} (см. <a href='http://api.highcharts.com/highcharts/plotOptions.column.dataLabels.formatter'>formatter</a>).
                         */
                        formatter : undefined
                     },
                     /**
                      * @cfg {Object} Устанавливает конфигурацию для точек диаграммы.
                      * @editor PropertyEditorStandardPopupObject
                      */
                     point : {
                         /**
                          * @cfg {Object} Устанавливает обработчики событий для точек диаграммы.
                          * @editor PropertyEditorStandardPopupObject
                          */
                        events : {
                           /**
                            * @cfg {Function} Устанавливает функцию, которая будет выполнена при клике на точку диаграммы.
                            */
                           click : undefined
                        }
                     }
                  }
               },
               /**
                * @cfg {Object} Устанавливает конфигурацию заголовка диаграммы.
                * @group
                */
               title : {
                  /**
                   * @cfg {String} Устанавливает горизонтальное выравнивание заголовка.
                   */
                  align: 'center',
                  /**
                   * @cfg {Boolean} Устанавливает расположение заголовка поверх графика.
                   */
                  floating : false,
                  /**
                   * @cfg {Number} Устанавливает отступ заголовка от области построения диаграммы.
                   * @remark
                   * Значение устанавливается в px.
                   */
                  margin : 15,
                  /**
                   * @cfg {String} Устанавливает текст заголовка диаграммы.
                   * @translatable
                   */
                  text : '',
                  /**
                   * @cfg {Object.<String, Number|String>} Устанавливает пользовательские CSS-стили отображения заголовка.
                   */
                  style : {
                      /**
                       * @cfg {String} Устанавливает цвет заголовка.
                       */
                      "color": "#333333",
                      /**
                       * @cfg {String} Устанавливает размер шрифта заголовка.
                       */
                      "fontSize": "18px"
                  }
               },
               /**
                * @cfg {Object} Устанавливает конфигурацию всплывающих подсказок, которые появляются при наведении на график или точку.
                */
               tooltip : {
                  /**
                   * @cfg {Boolean} Устанавливает отображение всплывающих подсказок.
                   * @group tooltip
                   */
                  enabled : true,
                  /**
                   * @cfg {Boolean} Устанавливает отображение общей подсказки.
                   * @remark
                   * Все точки с одним значением X выделяются вместе.
                   * @group tooltip
                   */
                  shared : false,
                  /**
                   * @cfg {function} (см. <a href='http://api.highcharts.com/highcharts/tooltip.formatter'>tooltip.formatter</a>).
                   * @group tooltip
                   */
                  formatter : undefined,
                  /**
                   * @cfg {Boolean} (см. <a href='http://api.highcharts.com/highcharts/tooltip.useHTML'>tooltip.useHTML</a>).
                   * @group tooltip
                   */
                  useHTML : true
               }
            }
         }
      },
      $constructor : function() {
         Highcharts.setOptions({
            lang: {
               numericSymbols: ['', '', '', '', '', ''],
               months : constants.Date.longMonths,
               shortMonths : constants.Date.months,
               weekdays: constants.Date.longDays,
               thousandsSep : ' '
            }
         });

         this._ctxFieldChangeHandler = ctxOnFieldChange.bind(this);
         this._ctxDataBindHandler = onDataBind.bind(this);
         this._reloadDebounce = this.reload.debounce(150);

         this._publish('onBeforeReload', 'onFilterChange');


         if (this._options.wsSeries && this._options.wsSeries.length > 0) {
            this._wsSeries = this._options.wsSeries;
         }
         if (this._options.wsAxis && this._options.wsAxis.length > 0) {
            this._wsAxis = this._options.wsAxis;
         }

         if (this._options.sourceData) {
            this._sourceData = this._options.sourceData;
         }


         //TODO баги в джине
         var opt = this._options.highChartOptions.plotOptions.line.marker.radius;
         if (opt) {
            opt = parseInt(opt, 10);
            this._options.highChartOptions.plotOptions.line.marker.radius = opt;
         }

         opt = this._options.highChartOptions.legend.padding;
         if (opt) {
            opt = parseInt(opt, 10);
            this._options.highChartOptions.legend.padding = opt;
         }

         opt = this._options.highChartOptions.legend.margin;
         if (opt) {
            opt = parseInt(opt, 10);
            this._options.highChartOptions.legend.margin = opt;
         }

         opt = this._options.highChartOptions.legend.width;
         if (opt) {
            opt = parseInt(opt, 10);
            this._options.highChartOptions.legend.width = opt;
         }

         opt = this._options.highChartOptions.legend.height;
         if (opt) {
            opt = parseInt(opt, 10);
            this._options.highChartOptions.legend.height = opt;
         }


         //TODO и еще один баг в джине, который все ломает
         if (this._options.highChartOptions.marginTop === 0) {
            this._options.highChartOptions.marginTop = null;
         }
         if (this._options.highChartOptions.marginRight === 0) {
            this._options.highChartOptions.marginRight = null;
         }
         if (this._options.highChartOptions.marginBottom === 0) {
            this._options.highChartOptions.marginBottom = null;
         }
         if (this._options.highChartOptions.marginLeft === 0) {
            this._options.highChartOptions.marginLeft = null;
         }


         /*исправляю нелогичность HighChart с format и formatter*/
         if (!(this._options.highChartOptions.plotOptions.line.dataLabels.formatter) && !(this._options.highChartOptions.plotOptions.line.dataLabels.format)) {
            this._options.highChartOptions.plotOptions.line.dataLabels.format = '{y}';
         }
         if (!(this._options.highChartOptions.plotOptions.pie.dataLabels.formatter) && !(this._options.highChartOptions.plotOptions.pie.dataLabels.format)) {
            this._options.highChartOptions.plotOptions.pie.dataLabels.format = '{y}';
         }

         //TODO прописываем опции для spline теже что и line
         this._options.highChartOptions.plotOptions.spline = cFunctions.clone(this._options.highChartOptions.plotOptions.line);
      },

      init : function() {
         HighCharts.superclass.init.call(this);

         this._loadingIndicator = $('.ws-HighCharts__loadingIndicator', this._container.get(0));
         var self = this;
         //читаем фильтры из контекста
         if (this._options.filterFields.length) {
            for (var i = 0, len = this._options.filterFields.length; i < len; i++) {
               var filter = this._options.filterFields[i];
               if (filter.type == 'fix') {
                  self._filters[filter.name] = filter.value;
               }
               else {
                  var filterVal = filter.name;
                  if (filter.value) {
                     filterVal = filter.value;
                  }
                  self._ctxBind[filterVal] = filter.name;
                  self._filters[filter.name] = self.getLinkedContext().getValue(filterVal);


                  /*если стоит автообновление из контекста*/
                  if (filter.refresh) {
                     this._isRefresh = true;
                     /* Первое на смену поля в контексте. Второе на смену рекорда во всплывающей панели
                     *  из-за WS приходится делать два разных события*/
                     self.getLinkedContext().subscribe('onFieldChange', self._ctxFieldChangeHandler);
                     self.getLinkedContext().subscribe('onDataBind', self._ctxDataBindHandler);
                  }
               }
            }
         }

         if (this._sourceData.firstRequest !== false) {
            this.reload();
         }

         //перерисовываем график, если он стал видимым. без этого график не занимает всю ширину контейнера, если был скрыт
         var trg = dcHelpers.trackElement(this._container, true);
         trg.subscribe('onVisible', function (event, visible) {
            if (self._chartObj && visible) {
               self._chartObj.reflow();
            }
         });
      },

      canAcceptFocus : function() {
        return false;
      },

      _updateFiltersFromContext : function() {
         for (var i = 0, len = this._options.filterFields.length; i < len; i++) {
            var filter = this._options.filterFields[i];
            if (filter.type == 'ctx') {
               this._filters[filter.name] = this.getLinkedContext().getValue(filter.value);
            }
         }
      },

      _drawHighChart : function() {
         var plotCont = $('.ws-HighCharts__plot', this.getContainer().get(0));
         if (this._chartObj) {
            this._chartObj.destroy();
         }
         plotCont.highcharts(this._options.highChartOptions);
         this._chartObj = plotCont.highcharts();
      },

      _recordSetParse : function() {
         var
            seriesOpts = this._wsSeries,
            rs = this._sourceData.data,
            arr = [];


         rs.each(function(rec){

            for (var i = 0; i < seriesOpts.length; i++) {
               if (!arr[i]) {
                  arr[i] = {
                     'data' : [],
                     'type' : seriesOpts[i].type,
                     'name' : seriesOpts[i].name ? seriesOpts[i].name : 'График' + i
                  }
               }
               if (seriesOpts[i].color) {
                  arr[i].color = seriesOpts[i].color
               }
               if (seriesOpts[i].xAxis !== undefined) {
                  arr[i].xAxis = parseInt(seriesOpts[i].xAxis, 10)
               }
               if (seriesOpts[i].yAxis !== undefined) {
                  arr[i].yAxis = parseInt(seriesOpts[i].yAxis, 10)
               }

               if (seriesOpts[i].sourceFieldY) {
                  if (seriesOpts[i].sourceFieldX) {
                     arr[i].data.push([
                        rec.get(seriesOpts[i].sourceFieldX),
                        rec.get(seriesOpts[i].sourceFieldY)
                     ]);
                  }
                  else {
                     arr[i].data.push([rec.get(seriesOpts[i]).sourceFieldY]);
                  }
               }

               if (seriesOpts[i].type == 'pie') {
                  if (seriesOpts[i].sourceField_3) {
                     arr[i].color = rec.get(seriesOpts[i].sourceField_3);
                  }
               }

               if ((seriesOpts[i].type == 'areasplinerange') || (seriesOpts[i].type == 'arearange')) {
                  var lastDataElement = arr[i].data[arr[i].data.length - 1];
                  if (seriesOpts[i].sourceField_3 && lastDataElement.length == 2) {
                     Array.insert(lastDataElement, 2, rec.get(seriesOpts[i]).sourceField_3);
                  }
                  else {
                     throw new Error (rk('Для графика-области надо определить 3 поля данных (ws-series.sourceField)'));
                  }
               }

            }
         });
         return arr.length ? arr : null;
      },

      _parseAxisCommon : function() {
         var
            axisOpts = this._wsAxis,
            axisArr = [],
            xAxisArr = [],
            yAxisArr = [];


         for (var i = 0; i < axisOpts.length; i++) {
            axisArr[i] = {};
            /*прокидываем все опции*/
            if (axisOpts[i].title !== undefined) {
               axisArr[i].title = axisArr[i].title || {};
               axisArr[i].title.text = axisOpts[i].title;
            }
            else {
               axisArr[i].title = axisArr[i].title || {};
               axisArr[i].title.text = '';
            }
            if (axisOpts[i].gridLineWidth !== undefined) {
               axisArr[i].gridLineWidth = axisOpts[i].gridLineWidth;
            }
            if (axisOpts[i].labelsFormatter !== undefined) {
               axisArr[i].labels = axisArr[i].labels || {};
               axisArr[i].labels.formatter = axisOpts[i].labelsFormatter;
            }
            if (axisOpts[i].staggerLines !== undefined) {
               axisArr[i].labels = axisArr[i].labels || {};
               axisArr[i].labels.staggerLines = parseInt(axisOpts[i].staggerLines, 10);
            }
            if (axisOpts[i].step !== undefined) {
               axisArr[i].labels = axisArr[i].labels || {};
               axisArr[i].labels.step = parseInt(axisOpts[i].step, 10);
            }
            if (axisOpts[i].lineWidth !== undefined) {
               axisArr[i].lineWidth = parseInt(axisOpts[i].lineWidth, 10);
            }
            if (axisOpts[i].allowDecimals !== undefined) {
               axisArr[i].allowDecimals = axisOpts[i].allowDecimals;
            }
            if (axisOpts[i].min !== undefined) {
               axisArr[i].min = parseInt(axisOpts[i].min, 10);
            }
            if (axisOpts[i].max !== undefined) {
               axisArr[i].max = parseInt(axisOpts[i].max, 10);
            }
            if (axisOpts[i].linkedTo !== undefined) {
               axisArr[i].linkedTo = parseInt(axisOpts[i].linkedTo, 10)
            }
            if (axisOpts[i].opposite) {
               axisArr[i].opposite = true;
            }

            if (axisOpts[i].sourceField !== undefined) {
               axisArr[i].sourceField = axisOpts[i].sourceField;
            }

            /*прописываем тип, чтоб потом разделить на два массива*/
            if (axisOpts[i].type == 'yAxis') {
               axisArr[i].type = 'yAxis';
            }
            else {
               axisArr[i].type = 'xAxis';
            }

            /*опции которые задаем по умолчанию всегда*/
            axisArr[i].tickmarkPlacement = 'on';
         }


         /*разделяем массив осей на x и y*/
         for (i = 0; i < axisArr.length; i++) {
            if (axisArr[i].type == 'yAxis') {
               yAxisArr.push(axisArr[i]);
            }
            else {
               xAxisArr.push(axisArr[i]);
            }
            delete axisArr[i].type;
         }

         this._xAxis = xAxisArr.length ? xAxisArr : null;
         this._yAxis = yAxisArr.length ? yAxisArr : null
      },

      _recordSetParseAxis : function() {
         var
            xAxis = this._xAxis,
            yAxis = this._yAxis,
            rs = this._sourceData.data;

         var iterate = function(axis, rec) {
			if (axis) {
				for (var i = 0; i < axis.length; i++) {
				   if (axis[i].sourceField) {
					  if (!axis[i].categories) {
						 axis[i].categories = [];
					  }
					  axis[i].categories.push(rec.get(axis[i].sourceField));
				   }
				}
			}
         };
         rs.each(function(rec){
            iterate(xAxis, rec);
            iterate(yAxis, rec);
         });

         return {
            xAxis : xAxis,
            yAxis : yAxis
         }
      },

      _getDataSource: function(endpoint, query) {
         if (!this._dataSource) {
            this._dataSource = new SbisService({
               endpoint: endpoint,
               binding: {
                  query: query
               }
            })
         }
         return this._dataSource;
      },

      _getData : function() {
         var
            self = this,
            resultDef = new Deferred();

         resultDef.addErrback(function (e) {
            return e;
         });

         /*Метод бизнес логики*/
         if (this._sourceData.getDataType == 'standartBL') {
            /*если задан метод БЛ, дергаем его*/
            var BL = this._options.sourceData.methodBL.split(".");
            if (BL.length > 1) {
               // запускаем запрос на получение данных
               var source = this._getDataSource(BL[0], BL[1]);
               var query = new Query();
               query.where(this._filters);
               source.query(query).addCallback(fHelpers.forAliveOnly(function (ds) {
                  var rs = ds.getAll();
                  /*результат метода пишем в data*/
                  self._sourceData.data = rs;
                  resultDef.callback();
               }, self)).addErrback(fHelpers.forAliveOnly(function (err) {
                  self.hide();
                  resultDef.errback(err);
               }, self));
            }
            else {
               resultDef.errback(rk('Ошибка в параметрах метода БЛ'))
            }
         }
         else {
            /*проверяем что задан пользовательский обработчик и он является функцией*/
            if (this._sourceData.userGetData && this._sourceData.userGetData instanceof Function) {
               var tempResult = this._sourceData.userGetData(this._filters);

               /*если он асинхронный, то ждем результат и его считаем данными*/
               if (tempResult instanceof Deferred) {
                  tempResult.addCallback(function(res){
                     self._sourceData.data = res;
                     resultDef.callback()
                  })
               }
               /*иначе данные - это то, что вернули*/
               else {
                  self._sourceData.data = tempResult;
                  resultDef.callback();
               }
            }
            else {
               resultDef.errback(rk('Пользовательский обработчик получения данных не является функцией'))
            }
         }
         return resultDef;
      },


      /*преобразование данных в формат highCharts*/
      _prepareData : function() {
         var
            parseFnc,
            data = this._sourceData.data;

         if (data) {
            if (this._sourceData.prepareDataType != 'custom') {
               parseFnc = this._recordSetParse.bind(this);
            }
            else {
               parseFnc = this._sourceData.userPrepareData.bind(this);
            }
            this._series = parseFnc();

            this._parseAxisCommon();

            if (this._sourceData.prepareAxisType != 'custom') {
               parseFnc = this._recordSetParseAxis.bind(this);
            }
            else {
               parseFnc = this._sourceData.userPrepareAxis.bind(this);
            }
            var parseAxis = parseFnc();

            this._xAxis = parseAxis.xAxis;
            this._yAxis = parseAxis.yAxis;
         }
         else {
            throw new Error (rk('Данные не загружены'));
         }
      },

      _updateLoadedFilters : function() {
         this._loadedFilters = {};
         for (var i in this._filters) {
            if (this._filters.hasOwnProperty(i)) {
               this._loadedFilters[i] = this._filters[i];
            }
         }
      },

      reload : function(noUpdateFromCtx) {
         this._loadingIndicator.removeClass('ws-hidden');
         var
            def = new Deferred(),
            self = this;
         /*смотрим на изменение фильтра в контексте*/
         if (!noUpdateFromCtx) {
            this._updateFiltersFromContext();
         }

         /*найдем фильтры которые изменились*/
         var changedFilters = {};
         for (var i in this._filters) {
            if (this._filters.hasOwnProperty(i) && this._filters[i] !== this._loadedFilters[i]) {
               changedFilters[i] = this._filters[i];
            }
         }
         this._notify("onFilterChange", changedFilters, this._filters);

         this._getData().addCallback(fHelpers.forAliveOnly(function(){
            /*обновим текущие примененные фильтры*/
            self._updateLoadedFilters();

            /*получаем окончательный конфиг для графиков*/
            self._prepareData();

            self._options.highChartOptions.series = self._series;
            self._options.highChartOptions.xAxis = self._xAxis;
            self._options.highChartOptions.yAxis = self._yAxis;


            //готовим оси
            self._notify('onBeforeReload', self._options.highChartOptions, self._chartObj, self._series);
            self._loadingIndicator.addClass('ws-hidden');
            self._drawHighChart();
            def.callback();
         }, self)).addErrback(fHelpers.forAliveOnly(function(){
            throw new Error(rk('Ошибка получения данных для диаграммы'));
         }, self));

         return def;
      },

      setQuery : function (obj) {
         if (cHelpers.type(obj) == 'object') {
            this._filters = {};
            for (var i in obj) {
               if (obj.hasOwnProperty(i)) {
                  this._filters[i] = obj[i]
               }
            }
            this.reload(true);
         }
      },

      getQuery : function() {
         return this._filters;
      },

      destroy : function(){
         if (this._isRefresh) {
            this.getLinkedContext().unsubscribe('onFieldChange', this._ctxFieldChangeHandler);
            this.getLinkedContext().unsubscribe('onDataBind', this._ctxDataBindHandler);
         }
         if (this._chartObj) {
            this._chartObj.destroy();
         }
         if (this._dataSource) {
            this._dataSource.destroy();
         }
         dcHelpers.trackElement(this._container, false);
         HighCharts.superclass.destroy.call(this);
      }

   });
   return HighCharts;
});