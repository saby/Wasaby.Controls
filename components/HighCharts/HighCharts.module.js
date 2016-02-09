define('js!SBIS3.CONTROLS.HighCharts', [
   'js!SBIS3.CORE.Control',
   'html!SBIS3.CONTROLS.HighCharts',
   'browser!cdn!/highcharts/4.0.3/highcharts-more-min.js',
   'css!SBIS3.CONTROLS.HighCharts'
],
function(BaseControl, dotTpl){
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
    * Диаграмма HighCharts
    * @class HighCharts
    * @extends $ws.proto.Control
    * @control
    * @public
    * @author Крайнов Дмитрий Олегович
    * @category Table
    * @designTime actions /design/design
    * @initial
    * <component data-component='SBIS3.CONTROLS.HighCharts'>
    * </component>
    */
   var HighCharts = BaseControl.Control.extend(/** @lends HighCharts.prototype */{
      /**
       * @event onBeforeReload перед перерисовкой диаграммы
       * может использоваться для задания специфических опций при отрисовке диаграммы, например, когда надо сделать подпись в зависимости от условий
       * <wiTag group='Управление">
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
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
             */
            /**
             * @cfg {wsAxis[]} Набор осей координат
             */
            wsAxis : [],
            /**
             * @cfg {Object} тут описание
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
             * @cfg {Object} Опции для highChart
             */
            highChartOptions : {
               /**
                * @cfg {Object} тут описание
                * @group
                */
               chart : {
                  /**
                   * @typedef {Object} typeDiagr
                   * @variant line Линейная
                   * @variant spline Линейная сглаженная
                   * @variant pie Круговая
                   * @variant column Столбчатая
                   * @variant bar Столбчатая горизонтальная
                   * @variant area График с областью под ним
                   * @variant areaspline Сглаженный график с областью под ним
                   * @variant scatter Точки
                   * @variant arearange Область - интервал значений
                   * @variant areasplinerange Сглаженная область - интервал значений
                   */
                  /**
                   * @cfg {typeDiagr} Тип диаграммы для всех графиков сразу
                   */
                  type : 'line',
                  /**
                   * @cfg {Number} Верхний внутренний отступ
                   */
                  marginTop : null,
                  /**
                   * @cfg {Number} Правый внутренний отступ
                   */
                  marginRight : null,
                  /**
                   * @cfg {Number} Нижний внутренний отступ
                   */
                  marginBottom : null,
                  /**
                   * @cfg {Number} Левый внутренний отступ
                   */
                  marginLeft : null,
                  /**
                   * @cfg {Number} Верхний внешний отступ
                   */
                  spacingTop : null,
                  /**
                   * @cfg {Number} Правый внешний отступ
                   */
                  spacingRight : null,
                  /**
                   * @cfg {Number} Нижний внешний отступ
                   */
                  spacingBottom : null,
                  /**
                   * @cfg {Number} Левый внешний отступ
                   */
                  spacingLeft : null
               },
               /**
                * @cfg {string[]} Набор цветов
                */
               colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1'],
               /**
                * @cfg {Object} тут описание
                * @editor PropertyEditorStandardPopupObject
                */
               credits : {
                  enabled : false
               },
               /**
                * @cfg {Object} тут описание
                * @group
                */
               legend : {
                  /**
                   * @cfg {Boolean} Легенда отображается
                   */
                  enabled: true,
                  /**
                   * @typedef {Object} align
                   * @variant center По центру
                   * @variant left Слева
                   * @variant right Справа
                   */
                  /**
                   * @cfg {Number} Ширина легенды
                   */
                  width: undefined,
                  /**
                   * @cfg {Number} Высота легенды
                   */
                  height: undefined,
                  /**
                   * @cfg {Number} Смещение по горизонтали
                   */
                  x: 0,
                  /**
                   * @cfg {Number} Смещение по вертикали
                   */
                  y: 0,
                  /**
                   * @cfg {Function} Функция рендеринга подписи легенды
                   */
                  labelFormatter: undefined,
                  /**
                   * @cfg {align} Горизонтальное расположение
                   */
                  align: 'center',
                  /**
                   * @typedef {Object} vAlign
                   * @variant bottom Снизу
                   * @variant top Сверху
                   * @variant middle По центру
                   */
                  /**
                   * @cfg {vAlign} Вертикальное расположение
                   */
                  verticalAlign : 'bottom',
                  /**
                   * @typedef {Object} layout
                   * @variant horizontal Горизонтальное
                   * @variant vertical Вертикальное
                   */
                  /**
                   * @cfg {layout} Расположение элементов в легенде
                   */
                  layout : 'horizontal',
                  /**
                   * @cfg {boolean} Располагать легенду поверх графика
                   */
                  floating : false,
                  /**
                   * @cfg {Number} Отступ между графиком и легендой (только для отключенного floating)
                   */
                  margin : 15,
                  /**
                   * @cfg {Number} Внутренний отступ
                   */
                  padding : 8,
                  /**
                   * @cfg {Number} Ширина границы
                   */
                  borderWidth : 0,
                  /**
                   * @cfg {Object.<string, number|string>} CSS стили
                   */
                  itemStyle : {"color": "#333333", "cursor": "pointer", "fontSize": "12px", "fontWeight": "bold"}
               },
               /**
                * @cfg {Object} тут описание
                */
               plotOptions : {
                  /**
                   * @cfg {Object} тут описание
                   * @group plotOptions.column
                   */
                  column : {
                     /**
                      * @cfg {Object} тут описание
                      * @editor PropertyEditorStandardPopupObject
                      */
                     dataLabels : {
                        /**
                         * @cfg {Boolean} Подписи значений отображаются
                         */
                        enabled : true,
                        /**
                         * @cfg {String} цвет подписей
                         */
                        color : null,
                        /**
                         * @cfg {String} Форматная строка
                         */
                        format : '',
                        /**
                         * @cfg {Function} Функция рендеринга
                         */
                        formatter : undefined
                     },
                     /**
                      * @cfg {Object} тут описание
                      * @editor PropertyEditorStandardPopupObject
                      */
                     point : {
                        /**
                         * @cfg {Object} тут описание
                         * @editor PropertyEditorStandardPopupObject
                         */

                        events : {
                           /**
                            * @cfg {Function} При клике на столбец графика
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
                      * @cfg {typeStacking} Тип диаграммы
                      */
                     stacking : null,
                     /**
                      * @cfg {Number} Ширина линии
                      */
                     borderWidth : 0
                  },
                  /**
                   * @cfg {Object} тут описание
                   * @group plotOptions.line
                   */
                  line : {
                     /**
                      * @cfg {Object} тут описание
                      * @editor PropertyEditorStandardPopupObject
                      */
                     dataLabels : {
                        /**
                         * @cfg {Boolean} Подписи значений отображаются
                         */
                        enabled : true,
                        /**
                         * @cfg {String} цвет подписей
                         */
                        color : null,
                        /**
                         * @cfg {String} Форматная строка
                         */
                        format : '',
                        /**
                         * @cfg {Function} Функция рендеринга
                         */
                        formatter : undefined
                     },
                     /**
                      * @cfg {Object} тут описание
                      * @editor PropertyEditorStandardPopupObject
                      */
                     marker: {
                        /**
                         * @cfg {Boolean} Выделения точек отображаются
                         */
                        enabled: true,
                        /**
                         * @cfg {Number} Радиус точек
                         */
                        radius : 4
                     },
                     /**
                      * @cfg {Object} тут описание
                      * @editor PropertyEditorStandardPopupObject
                      */
                     point : {
                        /**
                         * @cfg {Object} тут описание
                         * @editor PropertyEditorStandardPopupObject
                         */
                        events : {
                           /**
                            * @cfg {Function} При клике на точку графика
                            */
                           click : undefined
                        }
                     },
                     /**
                      * @cfg {Number} Интервал x значений (только если значения x не заданы)
                      */
                     pointInterval : 1,
                     /**
                      * @cfg {Boolean} Соединять конец и начало графика (только для полярных диаграмм)
                      */
                     connectEnds : true,
                     /**
                      * @cfg {Boolean} Включать в график точки со значением null
                      */
                     connectNulls : false
                  },
                  /**
                   * @cfg {Object} тут описание
                   * @group plotOptions.pie
                   */
                  pie : {
                     /**
                      * @cfg {Boolean} Выделение сектора по клику
                      */
                     allowPointSelect : false,
                     /**
                      * @cfg {Object} тут описание
                      * @editor PropertyEditorStandardPopupObject
                      */
                     dataLabels : {
                        /**
                         * @cfg {Number} Расстояние от диаграммы до подписей
                         */
                        distance : 30,
                        /**
                         * @cfg {Boolean} Подписи значений отображаются
                         */
                        enabled : true,
                        /**
                         * @cfg {String} цвет подписей
                         */
                        color : null,
                        /**
                         * @cfg {String} Форматная строка
                         */
                        format : '',
                        /**
                         * @cfg {Function} Функция рендеринга
                         */
                        formatter : undefined
                     },
                     /**
                      * @cfg {Boolean} Отображать в легенде
                      */
                     showInLegend : false
                  },
                  /**
                   * @cfg {Object} тут описание
                   * @group plotOptions.series
                   */
                  series : {
                     /**
                      * @cfg {Boolean} Анимированный график
                      */
                     animation : true,
                     /**
                      * @cfg {String} Курсор
                      */
                     cursor : 'default',
                     /**
                      * @cfg {Object} тут описание
                      * @editor PropertyEditorStandardPopupObject
                      */
                     dataLabels : {
                        /**
                         * @cfg {Boolean} Подписи значений отображаются
                         */
                        enabled : true,
                        /**
                         * @cfg {String} цвет подписей
                         */
                        color : null,
                        /**
                         * @cfg {String} Форматная строка
                         */
                        format : '',
                        /**
                         * @cfg {Function} Функция рендеринга
                         */
                        formatter : undefined
                     },
                     /**
                      * @cfg {Object} тут описание
                      * @editor PropertyEditorStandardPopupObject
                      */
                     point : {
                        events : {
                           /**
                            * @cfg {Function} При клике на точку графика
                            */
                           click : undefined
                        }
                     }
                  }
               },
               /**
                * @cfg {Object} тут описание
                * @group
                */
               title : {
                  /**
                   * @cfg {align} Горизонтальное расположение
                   */
                  align: 'center',
                  /**
                   * @cfg {boolean} Располагать заголовок поверх графика
                   */
                  floating : false,
                  /**
                   * @cfg {Number} Отступы заголовка
                   */
                  margin : 15,
                  /**
                   * @cfg {String} Текст заголовка диаграммы
                   * @translatable
                   */
                  text : '',
                  /**
                   * @cfg {Object.<string, number|string>} CSS стили
                   */
                  style : {"color": "#333333", "fontSize": "18px"}
               },
               tooltip : {
                  /**
                   * @cfg {Boolean} Всплывающие подсказки отображаются
                   * @group tooltip
                   */
                  enabled : true,
                  /**
                   * @cfg {Boolean} Общий тултип. (Все точки с одним значением X выделяются вместе)
                   * @group tooltip
                   */
                  shared : false,
                  /**
                   * @cfg {function} Функция рендеринга
                   * @group tooltip
                   */
                  formatter : undefined,
                  /**
                   * @cfg {Boolean} Использовать HTML
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
               months : [ 'Январь' , 'Февраль' , 'Март' , 'Апрель' , 'Май' , 'Июнь' , 'Июль' , 'Август' , 'Сентябрь' , 'Октябрь' , 'Ноябрь' , 'Декабрь'],
               shortMonths : [ 'Янв' , 'Фев' , 'Мар' , 'Апр' , 'Май' , 'Июн' , 'Июл' , 'Авг' , 'Сен' , 'Окт' , 'Ноя' , 'Дек'],
               weekdays: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресение'],
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
         this._options.highChartOptions.plotOptions.spline = $ws.core.clone(this._options.highChartOptions.plotOptions.line);
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
         plotCont.highcharts(this._options.highChartOptions);
         this._chartObj = plotCont.highcharts();
      },

      _recordSetParse : function() {
         var
            seriesOpts = this._wsSeries,
            rs = this._sourceData.data,
            arr = [];

         rs.rewind();
         var rec = rs.next();
         while(rec) {

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
                     throw new Error ('Для графика-области надо определить 3 поля данных (ws-series.sourceField)');
                  }
               }

            }


            rec = rs.next();
         }
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

         rs.rewind();
         var rec = rs.next();
         var iterate = function(axis) {
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
         while(rec) {
            iterate(xAxis);
            iterate(yAxis);
            rec = rs.next();
         }

         return {
            xAxis : xAxis,
            yAxis : yAxis
         }
      },


      _getData : function() {
         var
            self = this,
            resultDef = new $ws.proto.Deferred();
         /*Метод бизнес логики*/
         if (this._sourceData.getDataType == 'standartBL') {
            /*если задан метод БЛ, дергаем его*/
            var BL = this._options.sourceData.methodBL.split(".");
            if (BL.length > 1) {
               // запускаем запрос на получение данных
               $ws.proto.BLObject(BL[0]).query(BL[1], this._filters).addCallbacks(function (rs) {
                  /*результат метода пишем в data*/
                  self._sourceData.data = rs;
                  resultDef.callback();
               }, function (err) {
                  self.hide();
                  resultDef.errback(err);
               });
            }
            else {
               resultDef.errback('Ошибка в параметрах метода БЛ')
            }
         }
         else {
            /*проверяем что задан пользовательский обработчик и он является функцией*/
            if (this._sourceData.userGetData && this._sourceData.userGetData instanceof Function) {
               var tempResult = this._sourceData.userGetData(this._filters);

               /*если он асинхронный, то ждем результат и его считаем данными*/
               if (tempResult instanceof $ws.proto.Deferred) {
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
               resultDef.errback('Пользовательский обработчик получения данных не является функцией')
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
            throw new Error ('Данные не загружены');
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
            def = new $ws.proto.Deferred(),
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

         this._getData().addCallback(function(){
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
         }).addErrback(function(){
            throw new Error('Ошибка получения данных для диаграммы');
         });

         return def;
      },

      setQuery : function (obj) {
         if ($ws.helpers.type(obj) == 'object') {
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
         HighCharts.superclass.destroy.call(this);
      }

   });
   return HighCharts;
});