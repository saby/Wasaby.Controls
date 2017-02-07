define('js!SBIS3.CONTROLS.HighChartsLight', [
   "Core/core-functions",
   "Core/core-merge",
   "Core/constants",
   "js!SBIS3.CORE.Control",
   "html!SBIS3.CONTROLS.HighChartsLight",
   "Core/helpers/dom&controls-helpers",
   "browser!cdn!/highcharts/4.2.3/highcharts-more-min.js",
   "css!SBIS3.CONTROLS.HighChartsLight"
],
function( cFunctions, cMerge, constants,BaseControl, dotTpl, dcHelpers){
   'use strict';

   /**
    * Диаграмма HighChartsLight
    * @class SBIS3.CONTROLS.HighChartsLight
    * @extends $ws.proto.Control
    *
    * @cssModifier controls-HighChartsLight__overflow-visible Отменяет обрезание для контенеров в которых лежит график. Все элементы которые рисуются с опцией useHTML не будут обрезаться границами контенера
    * @cssModifier controls-HighChartsLight__svg-overflow-visible Отменяет обрезание для контенеров в которых лежит график, в том числе и для самого svg контенера графика. Все элементы в том числе и те, которые рисуются внутри svg, не будут обрезаться.
    *
    * @control
    * @author Крайнов Дмитрий Олегович
    * @public
    * @category Table
    * @designTime actions /design/design
    * @initial
    * <component data-component='SBIS3.CONTROLS.HighChartsLight'>
    * </component>
    */
   var HighChartsLight = BaseControl.Control.extend(/** @lends SBIS3.CONTROLS.HighChartsLight.prototype */{
      _dotTplFn : dotTpl,
      $protected : {
         _chartObj : null,
         _defaultOptions : {
            credits : {
               enabled : false
            },
            chart: {
               events: {
                  redraw: function() {}/*чтобы hightcharts нормально понимал как функцию*/
               }
            }
         },
         _options: {
            /**
             * @cfg {Object} Начальная отрисовка
             */
            firstLoad : true,
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
               plotOptions : {
                  /**
                   * @cfg {Object} тут описание
                   * @group plotOptions.column
                   */
                  column : {
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
                     point : {
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
                     point : {
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
                  formatter : undefined
               },
               /**
                * @cfg {Object} тут описание
                * @group
                */
               xAxis : {
                  /**
                   * @cfg {Boolean} Выводить дробные значения
                   */
                  allowDecimals : true,
                  /**
                   * @cfg {Number} Толщина линий сетки
                   */
                  gridLineWidth : 0,
                  labels : {
                     /**
                      * @cfg {function} Функция рендеринга меток оси X
                      */
                     formatter : undefined,
                     /**
                      * @cfg {Number} Количество строк при выводе меток к оси X
                      */
                     staggerLines : 0,
                     /**
                      * @cfg {Number} Шаг подписи меток оси X
                      */
                     step : 0
                  },
                  title : {
                     /**
                      * @cfg {String} Текст заголовка оси X
                      * @translatable
                      */
                     text : ''
                  },
                  /**
                   * @cfg {Number} Минимальное значение
                   */
                  min : null,
                  /**
                   * @cfg {Number} Максимальное значение
                   */
                  max : null
               },
               /**
                * @cfg {Object} тут описание
                * @group
                */
               yAxis : {
                  /**
                   * @cfg {Boolean} Выводить дробные значения
                   */
                  allowDecimals : true,
                  /**
                   * @cfg {Number} Толщина линий сетки
                   */
                  gridLineWidth : 1,
                  labels : {
                     /**
                      * @cfg {function} Функция рендеринга меток оси Y
                      */
                     formatter : undefined,
                     /**
                      * @cfg {Number} Шаг подписи меток оси Y
                      */
                     step : 0
                  },
                  /**
                   * @cfg {Number} Толщина оси Y
                   * <wiTag group="Отображение">
                   */
                  lineWidth : 1,
                  title : {
                     /**
                      * @cfg {String} Текст заголовка оси Y
                      * @translatable
                      */
                     text : ''
                  },
                  plotLines: [{
                     value: 0,
                     width: 1
                  }],
                  /**
                   * @cfg {Number} Минимальное значение
                   */
                  min : null,
                  /**
                   * @cfg {Number} Максимальное значение
                   */
                  max : null
               },
               series : []
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
         var self = this;
         HighChartsLight.superclass.init.call(this);
         if (this._options.firstLoad !== false) {
            this._drawHighChart();
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

      _drawHighChart : function() {
         var self = this;
         this._options.highChartOptions.chart.events = this._options.highChartOptions.chart.events || {};
         if (this._chartObj) {
            this._chartObj.destroy();
         }
         this.getContainer().highcharts(this._options.highChartOptions);
         this._chartObj = this.getContainer().highcharts();
      },

      setConfig : function(config) {
         this._options.highChartOptions = cMerge(this._options.highChartOptions, config);
         this._drawHighChart();
      },

      setFullConfig : function(config) {
         this._options.highChartOptions = cMerge(config, this._defaultOptions);
         this._drawHighChart();
      },

      getConfig : function() {
         return this._options.highChartOptions;
      },

      /**
       * Обновляет размеры графика под размеры контейнера. Вызывает одноименный метод из highcharts
       * http://api.highcharts.com/highcharts/Chart.reflow
       */
      reflow: function () {
         // TODO: выделить в базовый класс однотипный функционал для SBIS3.CONTROLS.HighChartsLight и SBIS3.CONTROLS.HighCharts
         if (this._chartObj) {
            this._chartObj.reflow();
         }
      },

      _onResizeHandler: function(){
         this.reflow();
      },

      destroy: function() {
         dcHelpers.trackElement(this._container, false);
         if (this._chartObj) {
            this._chartObj.destroy();
         }
         HighChartsLight.superclass.destroy.call(this);
      }
   });
   return HighChartsLight;
});