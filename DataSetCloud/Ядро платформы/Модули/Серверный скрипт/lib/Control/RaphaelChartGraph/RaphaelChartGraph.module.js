define("js!SBIS3.CORE.RaphaelChartGraph", ["js!SBIS3.CORE.RaphaelDrawerInternal", "js!SBIS3.CORE.Infobox"], function(internal) {
   "use strict";

   var defEpsilon = 1E-4,
       defAbsEpsilon = 1E-12,
       LOG_E10 = Math.log(10),
       CommonGraphConst = internal.CommonGraphConst,
       helpers = internal.helpers,
       ChartBaseElement = internal.ChartBaseElement,
       ChartLegend = internal.ChartLegend,
       clone = helpers.clone,
       extend = helpers.extend,
       extendStyle = helpers.extendStyle,
       ensureArray = helpers.ensureArray,
       readyDefWrapper = helpers.readyDefWrapper,
       isSimpleValue = helpers.isSimpleValue,
       inBoundsBySideCalc = helpers.inBoundsBySideCalc,
       normalizeBounds = helpers.normalizeBounds,
       textStyleToCss = helpers.textStyleToCss,
       removeBr = helpers.removeBr,
       isArray = helpers.isArray,
       forEach = $ws.helpers.forEach,
       filter = $ws.helpers.filter,
       map = $ws.helpers.map,
       reduce = $ws.helpers.reduce,
       percentNameMap = helpers.percentNameMap;

   /**
    * @class Дефолтные значения стилей для компонентов RaphaelChartGraph
    * @private
    */
   var ChartGraphConst = {
      defaultLegendStyle: CommonGraphConst.defaultLegendStyle,

      hintOverRectAttrs: {
         opacity: 0.01,
         stroke: 'none',
         fill: 'black',
         cursor: 'pointer'
      },

      defaultAxisMarkStyleType: 'default',
      defaultAxisMarkStyle: {
         axisTick: {
            length: 5,
            pathStyle: {stroke: 'black'}
         },
         gridTick: {
            length: 5,
            pathStyle: {stroke: 'black'}
         },
         gridLine: {
            pathStyle: {
               stroke: 'gray'
            }
         },
         label: {
            textStyle: {}
         }
      },

      axisMarkStyleTypeMap: {'default': function() {return ChartAxisMarkStyleDefault;} },

      defaultChartStyle: {
         gridFrame: {
            pathStyle: {
               'stroke-width': 1
            }
         },

         chartFrame: {
            pathStyle: {
               'stroke-width': 1
            }
         },

         drawPhases: [
            {part: 'axis', phases: ['serieZonesBackground', 'gridLines']},
            {part: 'rangeAreas', phases: ['back', 'description', 'custom']},
            {part: 'series', phases: ['back', 'bars', 'line', 'points']},
            {part: 'axis', phases:  ['axisLine', 'ticks', 'labels', 'description', 'serieZones', 'custom']},
            {part: 'series', phases: ['labels', 'labelBarHints',  'custom']},
            {part: 'legend', phases: ['default']},
            {part: 'axis', phases:  ['cleanupDraw']}
         ]
      },

      defaultAxisStyleType: 'default',
      defaultAxisStyle: {
         labelPadding: undefined,
         descriptionPadding: 5,
         width: undefined,
         widthH: 30,
         widthV: 50,
         showDescription: true,
         descriptionTextStyle: {
            'font-size': 14
         },
         pathStyle: {},
         serieZone: {
            widthH: 30,
            widthV: 30,
            descriptionTextStyle: {
               'font-size': 14
            },
            backPathStyle: undefined
         }
      },

      axisStyleTypeMap: {'default': function() {return ChartAxisDefault;} },

      defaultSerieType: 'default',

      serieTypeMap: {'default': function() {return ChartLineSerie;},
                     'line': function() {return ChartLineSerie;},
                     'bar': function() {return ChartLineSerie;}},

      defaultSerieStyle: {
         line: {
            hintPathStyle: {
               stroke: 'hsl(120, 2%, 70%)',
               fill: 'rgb(241, 241, 241)'
            },

            linePathStyle: {
               //'stroke-width': 2,
               //'stroke-dasharray': '--',
               //'arrow-end': 'classic-wide-long'
            },

            backPathStyle: {
               stroke: 'none',
               fill: 'none'
            },

            pointStyle: {
               element: '_circle',
               elementStyle: {
                  r: 5,
                  fill: 'blue',
                  'fill-opacity': 0.7
               }
            },

            barPathStyle: false,
            showInLegend: true,
            smooth: true
         },
         bar: {
            hintPathStyle: {
               stroke: 'hsl(120, 2%, 70%)',
               fill: 'rgb(241, 241, 241)'
            },

            barWidth: '30%',
            interBarPadding: 10,
            barWidthMin: 15,
            barPathStyle: {
               'stroke-width': 1
            },

            pointStyle: false,
            linePathStyle: false,
            backPathStyle: false,
            smooth: true,
            showInLegend: true
         }
      },

      defaultSerieLabelBlock: {
         padding: 0
      },

      defaultSerieLabelStyle: {
         showInHint: true,
         showInDiagram: true,
         textStyle: { 'font-size': 12 },
         overflowStyle: {
            'stroke-dasharray': '.',
            'stroke-width': 2
         }
      },

      defaultRangeArea: {
         rangeX: {start: 'min', end: 'max'},

         style: {
            descriptionStyle: {
               side: 'bottom',
               sidePosition: 'center',
               sidePadding: 5,
               textStyle: { 'font-size': 12 }
            },

            backPathStyle: {
               'fill-opacity': 0.2, stroke: 'none'
            }
         }
      },

      axisFormatMap: {'number': function() { return NumberFormatter; },
                      'category': function() { return CategoryFormatter; }},

      side: CommonGraphConst.side,

      direction: {
         topBottom: 'topBottom',
         bottomTop: 'bottomTop',
         leftRight: 'leftRight',
         rightLeft: 'rightLeft'
      },

      defaultDirectionForSide: {
         left: 'bottomTop',
         right: 'bottomTop',
         top: 'leftRight',
         bottom: 'leftRight'
      },

      sideForDirection: {
         topBottom: {left: 1, right: 1},
         bottomTop: {left: 1, right: 1},
         leftRight: {top: 1, bottom: 1},
         rightLeft: {top: 1, bottom: 1}
      },

      directionHV: {
         topBottom: 'V',
         bottomTop: 'V',
         leftRight: 'H',
         rightLeft: 'H'
      },

      HV_BySide: {left: 'V', right: 'V', bottom: 'H', top: 'H'},

      chartMinHeight: 10,
      chartMinWidth: 10,
      axisLabelPaddingV: 5,
      axisLabelPaddingH: 3,
      minMargin: 2,
      axisStartEndGap: {H: 20, V: 10},

      autoRangeIntervalWidth: 40,//ширина промежутка в случае авто-интервала
      autoRangeSignCount: 3,
      autoRangeRoundNum: 5
   };

   function isBadNumValue(value) {
      return value === undefined || value === null || isNaN(value);
   }

   function isPlainObject(obj) {
      //TODO: воткнуть в ws?
      return $.isPlainObject(obj);
   }

   function isZero(val) {
      return Math.abs(val) < defAbsEpsilon;
   }

   function isGoodShapeStyle(style) {
      return style && ((style.fill && style.fill !== 'none') || (style.fill && style.fill !== 'none'));
   }

   function calkRoundedRange(start, end, fixedPoint, stepCount, signCount, roundNum) {
      function calkRoundedRangeLow(start, end, startFixed, endFixed, stepCount, signCount, roundNum) {

         function log10R(val) {
            return Math.floor(Math.log(val) / LOG_E10);
         }

         function roundToSign(val, sign, roundNum, up) {
            function mantEquals(mant1, mant2) {
               return isZero(Math.abs(mant1 - mant2));
            }

            function calkMant(val) {
               return val / Math.pow(10, log10R(val));
            }

            var log10 = log10R(val),
               mant = val / Math.pow(10, log10),
               mantR = Math.floor(mant * Math.pow(10, sign - 1)) / Math.pow(10, sign - 1),
               res = mantR * Math.pow(10, log10);

            if (up && !mantEquals(mant, mantR)) {
               res += Math.pow(10, log10 - sign + 1);
            }

            var res0 = res,
               roundLog = -(log10 - sign + 1),
               div = Math.floor(res * Math.pow(10, roundLog) / roundNum);

            res = div * roundNum / Math.pow(10, roundLog);
            if (up && !mantEquals(calkMant(res), calkMant(res0))) {
               res = (div + 1) * roundNum / Math.pow(10, roundLog);
            }

            return res;
         }

         function roundSteps(steps, roundNum, signCount, start, end, startOrig, endOrig) {
            var log10 = log10R(Math.max(Math.abs(start), Math.abs(end))),
               roundLog = signCount - log10 - 1,
               step = roundNum / Math.pow(10, roundLog);

            if (!startFixed && !isZero(startOrig - start) && (startOrig - start < (step / 2))) {
               start -= step;
            }

            var diffSteps = Math.round(((end - start) * Math.pow(10, roundLog)) / roundNum),
               stepsH = Math.round((steps * 4) / 3), stepsL = 2,
               stepsRes;

            function findNearest() {
               var sL = steps, sH = steps + 1;
               while (sL >= stepsL || sH <= stepsH) {
                  if (sL >= stepsL && diffSteps % sL === 0)
                     return sL;

                  if (sH <= stepsH && diffSteps % sH === 0)
                     return sH;

                  sL--; sH++;
               }

               return undefined;
            }

            if (diffSteps > steps) {
               stepsRes = findNearest();
               if (stepsRes === undefined) {
                  diffSteps++;
                  stepsRes = findNearest();

                  if (startFixed)
                     end += step;
                  else if (endFixed)
                     start -= step;
                  else if ((end + step - endOrig) < (startOrig - (start - step)))
                     end += step;
                  else
                     start -= step;
               }
            }
            else
               stepsRes = diffSteps;

            if (stepsRes < steps) {
               while (stepsRes * 2 < steps) {
                  stepsRes = stepsRes * 2;
               }
            }

            return {stepCount: stepsRes, start: start, end: end, step: (end - start) / stepsRes};
         }

         function calkSteps(start, end, divCount, signCount) {
            var res = [],
               add = (end - start) / divCount;

            while ((start < end) || isZero(end - start)) {
               res.push(parseFloat(start.toPrecision(signCount + 2)));
               start = start + add;
            }

            return res;
         }

         var signStart = start >= 0 ? 1 : -1,
            signEnd = end >= 0 ? 1 : -1,
            absStart = Math.abs(start),
            absEnd = Math.abs(end),
            logStart = isZero(absStart) ? 0 : log10R(absStart),
            logEnd = isZero(absEnd) ? 0 : log10R(absEnd),
            signCountStart = signCount + logStart - Math.max(logStart, logEnd),
            signCountEnd = signCount + logEnd - Math.max(logStart, logEnd),
            startR = isZero(absStart) ? 0 : roundToSign(absStart, signCountStart, roundNum, signStart < 0) * signStart,
            endR = isZero(absEnd) ? 0 : roundToSign(absEnd, signCountEnd, roundNum, signEnd > 0) * signEnd,
            result = isZero(absEnd - absStart) ?
            {stepCount: 0, start: startR, end: endR, step: 0} :
               roundSteps(stepCount, roundNum, signCount, startR, endR, start, end);

         result.steps = calkSteps(result.start, result.end, result.stepCount, signCount);
         return result;
      }

      var result = null;
      if (fixedPoint === undefined) {
         result = calkRoundedRangeLow(start, end, false, false, stepCount, signCount, roundNum);
      } else if (isZero(fixedPoint - start) || (fixedPoint < start)) {
         result = calkRoundedRangeLow(fixedPoint, end, true, false, stepCount, signCount, roundNum);
      } else if (isZero(fixedPoint - end) || (fixedPoint > end)) {
         result = calkRoundedRangeLow(start, fixedPoint, false, true, stepCount, signCount, roundNum);
      } else {
         var upperPart = (fixedPoint - start) < (end - fixedPoint),
            diff = upperPart ? end - fixedPoint : fixedPoint - start,
            stepCount_ = Math.max(2, Math.round(stepCount * diff / (end - start))),
            start_ = upperPart ? fixedPoint : start,
            end_ = upperPart ? end : fixedPoint,
            value, steps = [];

         result = calkRoundedRangeLow(start_, end_, upperPart, !upperPart, stepCount_, signCount, roundNum);

         if (result.stepCount > 0) {
            if (upperPart) {
               value = result.start;
               while (value > start) {
                  value -= result.step;
                  steps.push(parseFloat(value.toPrecision(signCount + 2)));
               }
               steps.reverse();
               result.stepCount += steps.length;
               result.start = value;
               result.steps = steps.concat(result.steps);
            } else {
               value = result.end;
               while (value < end) {
                  value += result.step;
                  steps.push(parseFloat(value.toPrecision(signCount + 2)));
               }
               result.stepCount += steps.length;
               result.end = value;
               result.steps = result.steps.concat(steps);
            }
         }
      }

      var i, l;
      for (i = 0, l = result.steps.length; i < l; i++) {
         if (isZero(result.steps[i]))
            result.steps[i] = 0;
      }

      return result;
   }

   /**
    * @class Дефолтный отрисовщик для меток на оси
    */
   var ChartAxisMarkStyleDefault = $ws.proto.Abstract.extend(/** @lends ChartAxisMarkStyleDefault */ {
      createLabel: function(p, text, canvas, styleParams) {
         var result = canvas.text(p.x, p.y, text);
         if (styleParams)
            result.attr(styleParams);
         return result;
      },

      createAxisTick: function(p, direction, canvas, styleParams) {
         var tickLn = (styleParams && styleParams.length) || ChartGraphConst.defaultAxisMarkStyle.axisTick.length;
         var horz = ChartGraphConst.directionHV[direction] === 'H';
         var p0 = horz ? {x: p.x, y: p.y - tickLn} : {x: p.x - tickLn, y: p.y};
         var p1 = horz ? {x: p.x, y: p.y + tickLn} : {x: p.x + tickLn, y: p.y};

         var result = canvas.path('M' + p0.x + ',' + p0.y + 'L' + p1.x + ',' + p1.y);
         if (styleParams && styleParams.pathStyle)
            result.attr(styleParams.pathStyle);
         return result;
      },

      createGridAxisTick: function(p, direction, canvas, styleParams) {
         var result = this.createAxisTick(p, direction, canvas, styleParams);
         if (styleParams && styleParams.pathStyle)
            result.attr(styleParams);
         return result;
      },

      createGridLine: function(p0, p1, canvas, styleParams) {
         var result = canvas.path('M' + p0.x + ',' + p0.y + 'L' + p1.x + ',' + p1.y);
         if (styleParams && styleParams.pathStyle)
            result.attr(styleParams.pathStyle);
         return result;
      }
   });

   var parseIntervalAsDate = function(value) {
      var dateIntervalRegex = new RegExp('^(-)?P(?:(\\d+)Y)?(?:(\\d+)M)?(?:(\\d+)D)?' +
         '(T(?:(\\d+)H)?(?:(\\d+)M)?(?:(\\d+(?:\\.\\d+)?)S)?)?$');

      var parts = value.match(dateIntervalRegex);
      if (!parts) {
         return null;
      }

      var timeEmpty = !(parts[6] || parts[7] || parts[8]);
      var dateTimeEmpty = timeEmpty && !(parts[2] || parts[3] || parts[4]);
      if (dateTimeEmpty || timeEmpty && parts[5]) {
         return null;
      }

      var negative = parts[1];
      var years = 1970 + (parseInt(parts[2], 10) || 0);
      var months = parseInt(parts[3], 10) || 0;
      if (months > 11)
         throw new Error('Bad month part in value: ' + value);

      var days = 1 + (parseInt(parts[4], 10) || 0);
      if (days > 31)
         throw new Error('Bad days part in value: ' + value);

      var hours = parseInt(parts[6], 10) || 0;
      if (hours > 24)
         throw new Error('Bad hours part in value: ' + value);

      var minutes = parseInt(parts[7], 10) || 0;
      if (minutes > 60)
         throw new Error('Bad minutes part in value: ' + value);

      var seconds = parseFloat(parts[8]) || 0;
      if (seconds > 60)
         throw new Error('Bad seconds part in value: ' + value);

      var utc = negative ? Date.UTC(-years, -months, -days, -hours, -minutes, -seconds) :
         Date.UTC(years, months, days, hours, minutes, seconds);

      return new Date(utc);
   };

   var wsRender = $ws.render.defaultColumn;
   var NumberRenderMap = {
      real: function(val, params) {
         return wsRender.real(val, params.decimals, params.delimiters);
      },

      money: function(val) {
         return wsRender.money(val);
      },

      integer: function(val, params) {
         return wsRender.integer(val, !params.delimiters);
      },

      'default': function(val) {
         return String(val);
      }
   };

   /** @lends NumberFormatter */
   var NumberFormatterFuncs = {
      parseValue: function(value) {
         if (typeof value === 'number')
            return value;
         else if (typeof value === 'string')
            return parseFloat(value);
         else
            return NaN;
      },

      parseInterval: function(value) {
         return this.parseValue(value);
      },

      parseRangeExtendInterval: function(value) {
         return this.parseValue(value);
      },

      roundToInterval: function(value, interval, roundToUpper) {
         var lower = Math.floor(value / interval) * interval;
         if (this.compare(lower, value) === 0)
            return lower;
         else
            return lower + (roundToUpper ? interval : 0);
      },

      generateSequence: function(minValue, maxValue, interval) {
         var x, result = [];

         if (minValue <= maxValue) {
            for (x = minValue; x < maxValue; x += interval)
               result.push(x);
         } else {
            for (x = minValue; x > maxValue; x -= interval)
               result.push(x);
         }

         if (this.compare(x, maxValue) === 0)
            result.push(x);

         return result;
      },

      compare: function(v1, v2, epsilon) {
         if (!epsilon)
            epsilon = Math.abs(v2 - v1) * defEpsilon;

         var diff = v1 - v2;
         return (Math.abs(diff) <= epsilon) ? 0 : (diff > 0 ? 1 : -1);
      },

      formatValue: function(value, params) {
         var render = (params && NumberRenderMap[params.type]) || NumberRenderMap['default'];
         return render(value, params);
      },

      minValue: function() {
         return Number.MIN_VALUE;
      },

      maxValue: function() {
         return Number.MAX_VALUE;
      },

      sub: function(val, sub) { return val - sub; },

      add: function(val, add) { return val + add;  },

      normalizedToRange: function(normalizedMin, normalizedMax, valueMin, valueMax) {
         var rangeDiff =  (1 / (normalizedMax - normalizedMin)) * (valueMax - valueMin),
             min = valueMin - (normalizedMin * rangeDiff), max = min + rangeDiff;

         return {min: min, max: max};
      },

      normalizedToValue: function(normalized, range) {
         var min = range.min, max = range.max;

         if (this.compare(min, max) === 0)
            return min * normalized;
         else
            return min + (max - min) * normalized;
      },

      normalizedFromValueRange: function(value, range) {
         return this.compare(range.max, range.min) !== 0 ? ((value - range.min) / (range.max - range.min)) : 0;
      },

      createDataIntf: function(dataIntf) {
         return {
            getCount: dataIntf.getCount,
            getFieldValue: function(index, field) { return parseFloat(dataIntf.getFieldValue(index, field)); }
         };
      },

      supportsAutoRange: function() { return true; },

      zeroValue: 0,
      isBadValue: isBadNumValue,
      isBadInterval: function(interval, intervalAsValue) {
         if (intervalAsValue)
            return this.isBadValue(interval);
         else
            return this.isBadValue(interval) || (this.compare(interval, 0, defEpsilon) === 0) || (interval < 0);
      }
   };

   /** @class NumberFormatter Класс, реализующий формат данных Number (число с плавающей точкой) для осей и серий */
   var NumberFormatter = $ws.proto.Abstract.extend(NumberFormatterFuncs);

   /**
    * @class CategoryFormatter Класс, реализующий формат данных Category (текстоные данные, где численным значением является индекс в массиве данных) для осей и серий
    */

   var CategoryFormatter = $ws.proto.Abstract.extend(/** @lends CategoryFormatter */ {
      parseValue: function(value) {
         if (typeof value === 'number')
            return {idx: Math.floor(value), text: undefined};
         else if (typeof value === 'string') {
            var idx = parseInt(value, 10);
            return isNaN(idx) ? NaN : {idx: idx, text: undefined};
         }
         else
            return NaN;
      },

      createDataIntf: function(dataIntf, fields) {
         var defField = (fields && fields.length > 0) ? fields[0] : undefined;
         return {
            defaultField: defField,
            getCount: dataIntf.getCount,
            getFieldValue: function(index, field) {
               return {idx: index, text: dataIntf.getFieldValue(index, field)};
            },
            getDefaultFieldValue:
               defField ? function(index) { return {idx: index, text: dataIntf.getFieldValue(index, this.defaultField)}}
                        : function(index) { return {idx: index, text: undefined}}
         };
      },

      parseInterval: function(value) {
         return this.parseValue(value);
      },

      parseRangeExtendInterval: function(value) {
         if (typeof value === 'number')
            return {idx: value, text: undefined};
         else if (typeof value === 'string') {
            var idx = parseFloat(value);
            return isNaN(idx) ? NaN : {idx: idx, text: undefined};
         }
         else
            return NaN;
      },

      roundToInterval: function(value, interval, roundToUpper) {
         value = value.idx;
         interval = interval.idx;

         var lower = parseInt((Math.floor(value / interval) * interval), 10),
             result = lower + ((roundToUpper && (lower !== value)) ?  interval : 0);

         return {idx: parseInt(result, 10), text: undefined};
      },

      generateSequence: function(minValue, maxValue, interval, dataIntf) {
         var dataLn = dataIntf.getCount();

         minValue = minValue.idx;
         maxValue = maxValue.idx;
         interval = interval.idx;

         var result = [], x,
             addX = function(x) { result.push((x >= 0 && x < dataLn) ?
                                              dataIntf.getDefaultFieldValue(x) :
                                              {idx: x, text: undefined}); };

         if (minValue <= maxValue) {
            for (x = Math.round(minValue); x <= maxValue; x += interval)
               addX(Math.round(x));
         }
         else {
            for (x = Math.round(minValue); x >= maxValue; x -= interval)
               addX(Math.round(x));
         }

         return result;
      },

      compare: function(v1, v2) {
         if (this.isBadValue(v1) || this.isBadValue(v2))
            throw new Error('Неправильные значения в compare');

         return v1.idx - v2.idx;
      },

      sub: function(val, sub) { return {idx: val.idx - sub.idx, text: undefined}; },

      add: function(val, add) { return {idx: val.idx + add.idx, text: undefined}; },

      formatValue: function(value/*, format*/) {
         //return (value.text || '') + ' - ' + value.idx;
         return value.text ? String(value.text) : '';
      },

      minValue: function() {
         return {idx: Number.MIN_VALUE, text: undefined};
      },

      maxValue: function() {
         return {idx: Number.MAX_VALUE, text: undefined};
      },

      normalizedToRange: function(normalizedMin, normalizedMax, valueMin, valueMax) {
         var rangeDiff =  (1 / (normalizedMax - normalizedMin)) * (valueMax.idx - valueMin.idx),
             min = valueMin.idx - (normalizedMin * rangeDiff),
             max = min + rangeDiff;

         return {min: {idx: min, text: undefined}, max: {idx: max, text: undefined}};
      },

      normalizedToValue: function(normalized, range) {
         var min = range.min.idx, max = range.max.idx;

         if (min === max)
            return {idx: min * normalized, text: undefined};
         else
            return {idx: min + (max - min) * normalized, text: undefined};
      },

      normalizedFromValueRange: function(value, range) {
         return (range.max.idx > range.min.idx) ? (value.idx - range.min.idx) / (range.max.idx - range.min.idx) : 0;
      },

      prepareData: function(data) {
         return map(data, function(item, i) { return {idx: parseInt(i, 10), text: item}; });
      },

      supportsAutoRange: function() { return false; },

      zeroValue: {idx: 0, text: '0'},

      isBadValue: function(value) {
         return value === undefined || value === null ||
                (!(value instanceof Object) && isNaN(value));//??? нужно ли Object и NaN тут смотреть?
      },

      isBadInterval: function(interval, intervalAsValue) {
         if (intervalAsValue)
            return this.isBadValue(interval);
         else
            return (this.isBadValue(interval) || (interval.idx <= 0));
      }
   });

   var ChartMarkDef = $ws.proto.Abstract.extend({
      $constructor: function(cfg) {
         extend(this, cfg);

         this._publish('onDataFormat');
         if (this.onDataFormat)
            this.subscribe('onDataFormat', this.onDataFormat);
      }
   });

   var AxisSeriesZone = ChartBaseElement.extend({
      $protected: {
         _compiledStyle: null,
         _gridDrawBounds: null,
         _oppositeDrawBounds: null,
         _series: [],
         _rangeAreas: [],
         _headerVisible: true,
         _boundAxis: []
      },

      $constructor: function(cfg) {
         this._compiledStyle = cfg;
      },

      _addSerie: function(serie) {
         this._series.push(serie);
      },

      _addRangeArea: function(rangeArea) {
         this._rangeAreas.push(rangeArea);
      },

      _addBoundAxis: function(axis) {
         this._boundAxis.push(axis);
      },

      _setGridDrawBounds: function(bounds) {
         this._invalidateDrawBounds();
         this._gridDrawBounds = bounds;
      },

      _reduceSeries: function(serieFn, memo) {
         return reduce(this._series, serieFn, memo, this);
      },

      _reduceRangeAreas: function(areaFn, memo) {
         return reduce(this._rangeAreas, areaFn, memo, this);
      },

      _reduceBoundAxis: function(axisFn, memo) {
         return reduce(this._boundAxis, axisFn, memo, this);
      },

      _getGridDrawBounds: function() {
         return this._gridDrawBounds;
      },

      _setOppositeDrawBounds: function(bounds) {
         this._oppositeDrawBounds = bounds;
      },

      _setHeaderVisible: function(visible) { this._headerVisible = visible; },

      _getHeaderVisible: function() { return this._headerVisible; },

      _getOppositeDrawBounds: function() {
         return this._oppositeDrawBounds;
      },

      _getCompiledStyle: function() {
         return this._compiledStyle;
      }
   });

   AxisSeriesZone.parseZoneIdx = function(idx, msg) {
      var result = parseInt(idx || 0, 10);
      if (isNaN(result) || result < 0)
         throw new Error(msg + idx);
      return result;
   };

   var axisRangeParser = function() {
      function rangePointNameToPercent(name) {
         var result = percentNameMap[name], match;
         if (result === undefined) {
            match = String(name).match(/(.+)%$/);
            if (match) //проценты
               result = parseFloat(String.trim(match[1]));
            else
               result = NaN;
         }

         return result;
      }

      function parsePercentedRange(rangeSrc, name, formatter) {
         if (rangeSrc.value === undefined)
            throw new Error('Не задано значение для точки диапазона: ' + name);

         function throwErr() {
            throw new Error('Неправильный формат имени точки диапазона "' + name + '": (надо min/max/center, или проценты, или абсолютное значение): ' + rangeSrc.value);
         }

         var result = {valuePercent: undefined, value: undefined, name: name}, val = rangePointNameToPercent(rangeSrc.value);
         if (isNaN(val)) {
            val = formatter.parseValue(rangeSrc.value);
            if (formatter.isBadValue(val))
               throwErr();

            result.value = val;
         } else {
            result.valuePercent = val;
         }

         return result;
      }

      function parseInterval(interval) {
         var formatter = this.getDataFormat();

         if (interval === undefined || interval === null)
            throw new Error('Не задано значение интервала');

         var result = formatter.parseInterval(interval);
         if (formatter.isBadInterval(result))
            throw new Error('Неправильный формат интервала: ' + interval);

         return result;
      }

      function parseRange(cfgRange, options) {
         var result, formatter = this.getDataFormat();

         function parseAbsValueProp(obj, prop) {
            var result = undefined;
            if (obj[prop] !== undefined) {
               result = formatter.parseValue(obj[prop]);
               if (formatter.isBadValue(result))
                  throw new Error('Неправильный формат абсолютного значения точки автодиапазона: ' + obj[prop]);
            }

            return result;
         }

         if (cfgRange && (cfgRange === 'auto' || cfgRange['auto'] === true)) {
            if (options && options.allowAuto === false) {
               throw new Error(options.allowAutoErrMsg);
            }

            if (formatter.supportsAutoRange()) {
               if (cfgRange === 'auto')
                  cfgRange = {};

               result = {auto: true};
               if (isNaN(result.intervalWidth = parseFloat(cfgRange.intervalWidth)))
                  result.intervalWidth = ChartGraphConst.autoRangeIntervalWidth;

               if (isNaN(result.roundNum = parseInt(cfgRange.roundNum, 10)))
                  result.roundNum = ChartGraphConst.autoRangeRoundNum;

               if (isNaN(result.signCount = parseInt(cfgRange.signCount, 10)))
                  result.signCount = ChartGraphConst.autoRangeSignCount;

               result.max = parseAbsValueProp(cfgRange, 'max');
               result.min = parseAbsValueProp(cfgRange, 'min');
               result.fixedPoint = parseAbsValueProp(cfgRange, 'fixedPoint');
            }
            else
               throw new Error('Формат данных ' + cfg.dataFormat + ' не поддерживает автоподгонку диапазона');
         }
         else {
            result = [];
            cfgRange = cfgRange || {};

            if (Object.isEmpty(cfgRange))
               cfgRange = {min: '0%', max: '100%'};

            var parsedRangeHash = reduce(cfgRange, function(memo, range, name){
               memo.cnt++;
               if (memo.cnt > 2)
                  throw new Error('Можно задавать максимум две точки диапазона, задано же больше');

               if (!isPlainObject(range))
                  range = {value: range};

               var _range = parsePercentedRange(range, name, formatter);
               _range.rangePercent = rangePointNameToPercent(name);

               if (isNaN(_range.rangePercent))
                  throw new Error('Неправильный формат имени точки диапазона: (надо min/max/center или проценты): ' + name);

               var val = range.round;
               if (val !== undefined) {
                  val = formatter.parseInterval(val);
                  if (formatter.isBadInterval(val))
                     throw new Error('Неправильный формат округления точки диапазона: ' + range.round);

                  _range.round = val;
               }

               val = String(_range.rangePercent.toFixed(2));//тут ключи по процентам...
               memo.hash[val] = _range;//тут точно будут лежать разные проценты от диапазона...
               return memo;
            }, {cnt: 0, hash: {}}).hash;

            result = result.concat(map(parsedRangeHash, function(value) { return value; }));

            if (result.length < 2)
               throw new Error('Нужно задавать две точки диапазона или не задавать диапазон вообще');

            if (result[0].rangePercent > result[1].rangePercent) {
               result = result.reverse();
            }

            //проверить интервал на min < max
            if (result.length === 2) {
               var v1, v2, err = 'Стартовая точка диапазона должна быть меньше конечной';
               if ((v1 = result[0].value) !== undefined && (v2 = result[1].value) !== undefined) {
                  if (formatter.compare(v1, v2) >= 0)
                     throw new Error(err);
               }
               else if ((v1 = result[0].valuePercent) !== undefined && (v2 = result[1].valuePercent) !== undefined) {
                  if (NumberFormatterFuncs.compare(v1, v2) >= 0)
                     throw new Error(err);
               }
            }
         }
         return result;
      }

      function parseRangeExtend(cfgExtend) {
         var formatter = this.getDataFormat();
         function parseExtendInterval(val) {
            if (val !== undefined) {
               val = formatter.parseRangeExtendInterval(val);
               if (formatter.isBadInterval(val, true))
                  throw new Error('Неправильный формат значения в параметре rangeExtend: ' + val);
            }
            return val;
         }

         var result = isPlainObject(cfgExtend) ? cfgExtend : {min: cfgExtend, max: cfgExtend};

         return {min: parseExtendInterval(result.min),
                 max: parseExtendInterval(result.max),
                 forEmptyRangeOnly: cfgExtend && cfgExtend.forEmptyRangeOnly};
      }

      function parseRangeLink(rangeLink) {
         var result = [],
             start = isPlainObject(rangeLink.start) ? rangeLink.start : {value: rangeLink.start},
             end = isPlainObject(rangeLink.end) ? rangeLink.end : {value: rangeLink.end},
             formatter = this.getDataFormat();

         if (start === undefined)
            throw new Error('Не задан параметр start для диапазона');

         if (end === undefined)
            throw new Error('Не задан параметр end для диапазона');

         result[0] = parsePercentedRange(start, 'start', formatter);
         if (start.round !== undefined)
            result[0].round = parseInterval.call(this, start.round);
         result[0].rangePercent = rangePointNameToPercent('start');

         result[1] = parsePercentedRange(end, 'end', formatter);
         if (end.round !== undefined)
            result[1].round = parseInterval.call(this, end.round);
         result[1].rangePercent = rangePointNameToPercent('end');

         return result;
      }

      function parsedRangeToDataRange(rangeParsed, rangeData, resultDefault) {
         var i, rangePt, formatter = this.getDataFormat(),
             result = resultDefault;

         function roundValue(rangePt, roundToUpper) {
            if (rangePt.round !== undefined && rangePt.value !== undefined)
               rangePt.value = formatter.roundToInterval(rangePt.value, rangePt.round, roundToUpper);
         }

         //Вычисляем абсолютные значения по процентам
         if (rangeData) {
            for (i = 0; i < rangeParsed.length; i++) {
               rangePt = rangeParsed[i];
               if (rangePt.valuePercent !== undefined) {
                  rangePt.value = formatter.normalizedToValue(rangePt.valuePercent / 100, rangeData);
               }
            }
         }

         if (rangeParsed.length > 0) {
            roundValue(rangeParsed[0], false);
            roundValue(rangeParsed[1], true);

            //вычисляем диапазон по значениям rangePercent
            if (rangeParsed[0].value !== undefined && rangeParsed[1].value !== undefined &&
                rangeParsed[0].rangePercent !== undefined && rangeParsed[1].rangePercent !== undefined)
            {
               result = formatter.normalizedToRange(rangeParsed[0].rangePercent / 100,rangeParsed[1].rangePercent / 100,
                                                    rangeParsed[0].value, rangeParsed[1].value);
            }
         }

         return result;
      }

      return function(axis) {
         return {
            parseInterval: parseInterval.bind(axis),
            parseRangeLink: parseRangeLink.bind(axis),
            parseRangeExtend: parseRangeExtend.bind(axis),
            parseRange: parseRange.bind(axis),
            parsedRangeToDataRange: parsedRangeToDataRange.bind(axis)
         };
      };
   }();

   /** @class Дефолтная реализации оси на диаграмме $ws.proto.RaphaelChartGraph */
   var ChartAxisDefault = ChartBaseElement.extend(/** @lends ChartAxisDefault */ {
      $protected: {
         _chart: null,
         _side: null,
         _direction: null,
         _directionHV: null,
         _dataIntf: null,
         _dataIntfSrc: null,
         _dataFields: [],
         _cfgDataFields: [],
         _dataFormat: null,
         _dataFormatterParams: undefined,
         _boundToAxis: {
            name: undefined,
            axis: undefined,
            value: undefined,
            valuePercent: undefined,
            zone: 0
         },
         _dataRangeParsed: null,
         _dataRangeFromAxis: null,
         _dataRangeExtend: {min: undefined, max: undefined, forEmptyRangeOnly: false},
         _dataRangeCalcSrc: {min: null, max: null},
         _dataRangeCalc: {min: null, max: null},

         _layout: {markers: []},
         _zonesLayout: {},

         _drawElements: {/*idx: {markers: [], axisLine: null, serieZone: null}*/},
         _drawBoundsInvalidateParts: ['dataFinal'],

         _markDefs: [],
         _gridDrawBounds: null,
         _zonesDrawBounds: null,
         _validState: { dataSrc: false, dataFinal: false },
         _style: {},
         _styleCompiled: {},
         _serieZones: [],
         _seriesMargin: null,
         _secondaryRanges: [],

         _eventNames: {'onElementCustomDraw': 1, 'onElementMouseDown': 1, 'onElementMouseUp': 1,
                       'onElementMouseOver': 1, 'onElementMouseOut': 1, 'onPrepareData': 1,
                       'onCustomGenerateMarks': 1, 'onDataFormat': 1}
      },

      /** Инициализировать ось по конфигу (см. секцию осей в конфиге диаграммы)
       *  @param cfg Конфиг оси
       */
      $constructor: function(cfg) {
         var prop, formatter;

         this._rangeParser = axisRangeParser(this);

         this._dataFields = ensureArray(cfg.dataField || cfg.dataFields);
         this._cfgDataFields = clone(this._dataFields);

         this._style = cfg.style || {};
         var style = (typeof this._style === 'string') ? {baseName: this._style} : this._style;

         if (cfg.description)
            style.description = cfg.description;

         this._styleCompiled = extend(this._chart._getAxisStyleConfig(style.baseName), style);

         if ((prop = this._styleCompiled.width) !== undefined) {
            prop = parseInt(prop, 10);
            if (isNaN(prop) || prop <= 0)
               throw new Error('Неправильный параметр width: ' + prop);
         }

         if ((prop = this._styleCompiled.labelPadding) !== undefined) {
            prop = parseInt(prop, 10);
            if (isNaN(prop) || prop <= 0)
               throw new Error('Неправильный параметр labelPadding: ' + prop);
         }

         this._side = cfg.side;
         if (ChartGraphConst.side[this._side] === undefined)
            throw new Error('Неправильный параметр side: ' + this._side);

         this._direction = cfg.direction;
         if (this._direction === undefined)
            this._direction = ChartGraphConst.defaultDirectionForSide[this._side];

         if (ChartGraphConst.direction[this._direction] === undefined)
            throw new Error('Неправильный параметр direction: ' + this._direction);

         var sideForDir = ChartGraphConst.sideForDirection[this._direction];
         if (sideForDir === undefined || sideForDir[this._side] === undefined)
            throw new Error('Неправильное сочетание параметров side и direction: ' + this._side + '/' + this._direction);

         this._directionHV = ChartGraphConst.directionHV[this._direction];

         var formatType = ChartGraphConst.axisFormatMap[cfg.dataFormat];
         if (formatType === undefined)
            throw new Error('Неизвестный формат данных для оси (dataFormat): ' + cfg.dataFormat);

         formatType = formatType();
         formatter = this._dataFormat = new formatType();

         this._dataFormatterParams = cfg.dataFormatterParams || {};

         if (cfg.range && cfg.range.fromAxis) {
            this._dataRangeFromAxis = cfg.range.fromAxis;
            this._dataRangeParsed = null;
         } else {
            this._dataRangeFromAxis = null;
            this._dataRangeParsed = this._rangeParser.parseRange(cfg.range);
         }

         this._dataRangeExtend = this._rangeParser.parseRangeExtend(cfg.rangeExtend);

         //Интервал готов, далее метки настраиваем
         var markDefs = (cfg.markDefinitions || []);
         this._markDefs = this._markDefs.concat(map(markDefs, function(markDefinition, i) {
            var markDef = new ChartMarkDef(markDefinition),
                val, interval;

            markDef.dataFormatterParams = markDef.dataFormatterParams || this._dataFormatterParams;

            if ((markDef.interval === undefined && markDef.pointInterval === undefined) ||
               (markDef.interval !== undefined && markDef.pointInterval !== undefined))
               throw new Error('Нужно задать один из параметров interval или pointInterval, но только один');

            if (markDef.interval !== undefined) {
               if (markDef.interval === 'auto') {
                  if (!formatter.supportsAutoRange())
                     throw new Error('Формат данных ' + cfg.dataFormat + ' не поддерживает авторазметку оси');
               }
               else
                  markDef.interval = this._rangeParser.parseInterval(markDef.interval);
            }

            if ((val = markDef.pointInterval) !== undefined) {
               markDef.pointInterval = parseInt(val, 10);
               if (isNaN(markDef.pointInterval) || markDef.pointInterval <= 0)
                  throw new Error('Неправильный формат параметра pointInterval (нужно целое число больше нуля): ' + val);
            }

            markDef.priority = parseInt(markDef.priority, 10) || i;
            markDef.styleCompiled = this._getCompiledStyle(markDef.style);

            markDef.ranges = ensureArray(markDef.ranges);

            if (markDef.ranges.length === 0)
               markDef.ranges = [{start: 'min', end: 'max'}];

            if (markDef.round !== undefined) {
               interval = (markDef.round === true) ? markDef.interval : this._rangeParser.parseInterval(markDef.round);
               markDef.round = interval;
            }

            markDef.ranges = reduce(markDef.ranges, function(ranges, range, key) {
               range = this._rangeParser.parseRangeLink(range);

               if (range[0].round === undefined)
                  range[0].round = markDef.round;

               if (range[1].round === undefined)
                  range[1].round = markDef.round;

               ranges[key] = range;
               return ranges;
            }, {}, this);

            return markDef;
         }, this));

         var serieZones = cfg.serieZones || [];
         if (!(serieZones instanceof Array))
            throw new Error('Параметр оси serieZones должен быть массивом');

         if (serieZones.length === 0)
            serieZones.push({});

         forEach(serieZones, function(zone, index) {
            this._initZone(index, zone, true);
         }, this);
      },

      _setupPointIntervals: function() {
         var defaultDataField;
         if (this._cfgDataFields.length === 1)
            defaultDataField = this._cfgDataFields[0];
         else if (this._dataFields.length === 1)
            defaultDataField = this._dataFields[0];

         forEach(this._markDefs, function(markDef) {
            if (markDef.pointInterval !== undefined) {
               if (markDef.pointIntervalDataField === undefined)
                  markDef.pointIntervalDataField = defaultDataField;

               if (!markDef.pointIntervalDataField)
                  throw new Error('Не задано поле данных (параметр pointIntervalDataField) для параметра pointInterval, и нельзя использовать параметр dataField оси по умолчанию (он не задан, или в нём несколько полей).');
            }
         }, this);
      },

      _rangeParser: null,

      _addSecondaryRange: function(rangeParsed) {
         var range = {min: rangeParsed[0].value, max: rangeParsed[1].value};
         if (range.min !== undefined || range.max !== undefined)
            this._secondaryRanges.push(range);
      },

      _checkConfig: function() {
         if (this._dataFields.length === 0)
            throw new Error('Не задан параметр dataField (он же dataFields) у оси, и не заданы соответствующие параметры axisYdataField/axisXdataField у серий, привязанных к оси');

         this._setupPointIntervals();
      },

      _getSeriesZoneConfig: function(cfg) {
         return extend(clone(ChartGraphConst.defaultAxisStyle.serieZone), cfg || {});
      },

      _checkZoneIdx: function(zoneIndex) {
         return this._serieZones[zoneIndex] || this._initZone(zoneIndex, {}, true);
      },

      _addObjectToZone: function(objFn, zoneIndex) {
         var zone = this._checkZoneIdx(zoneIndex);
         objFn(zone);
         zone._setVisibleImplicit(true);
         return zone;
      },

      _addSerieToZone: function(serie, zoneIndex) {
         return this._addObjectToZone(function(zone) { zone._addSerie(serie); }, zoneIndex);
      },

      _addRangeAreaToZones: function(area, zoneIndexStart, zonesCnt, parsedRange) {
         function addToZone(zone) { zone._addRangeArea(area); }

         for (var i = zoneIndexStart; i !== zoneIndexStart + zonesCnt; i++)
            this._addObjectToZone(addToZone, i);

         this._addSecondaryRange(parsedRange);
      },

      _addBoundAxisToZone: function(axis, zoneIndex) {
         var zone = this._checkZoneIdx(zoneIndex);
         zone._addBoundAxis(axis);
         zone._setVisibleImplicit(true);
         return zone;
      },

      _initZone: function(zoneIndex, zoneCfg, visibleImplicit) {
         var cfg = this._getSeriesZoneConfig(zoneCfg),
             zone = new AxisSeriesZone(cfg);

         this._serieZones[zoneIndex] = zone;
         zone._setVisibleImplicit(visibleImplicit);

         return zone;
      },

      _addDataField: function(field) {
         var fields = this._dataFields;
         for (var i in fields) {
            if (!fields.hasOwnProperty(i))
               continue;

            if (fields[i] === field)
               return;
         }

         this._dataFields.push(field);
      },

      _getBoundAxis: function() { return this._boundToAxis.axis; },

      _getBoundAxisParams: function() { return this._boundToAxis; },

      _getAxisLineDiff: function() {
         var bounds = this._drawBounds,
             diffMap = {
                left: {x: bounds.width, y: 0},
                right: {x: 0, y: 0},
                top: {x: 0, y: bounds.height},
                bottom: {x: 0, y: 0}
             };
         return diffMap[this._side];
      },

      _setBoundAxis: function(cfg) {
         var chart = this._chart, axis, name, val, match, formatter;

         //Разбираем параметр привязки к оси
         if (cfg.boundToAxis) {
            if (!(name = cfg.boundToAxis.name))
               throw new Error('Не задано имя оси для привязки в параметре boundToAxis');

            if (!(axis = chart.getAxis(name)))
               throw new Error('Не найдена ось для привязки, указанная в параметре boundToAxis: ' + name);

            if (this._directionHV === axis._directionHV)
               throw new Error('Нельзя привязывать горизонтальную ось к горизонтальной или вертикальную к вертикальной');

            formatter = axis.getDataFormat();

            this._boundToAxis.axis = axis;
            this._boundToAxis.name = name;

            this._boundToAxis.zoneIdx = AxisSeriesZone.parseZoneIdx(
               cfg.boundToAxis.zone, 'Номер зоны в оси для привязанной оси должен быть числом >=0, задано же: ');

            axis._addBoundAxisToZone(this, this._boundToAxis.zoneIdx);

            val = cfg.boundToAxis.value;
            match = String(val).match(/(.+)%$/);
            if (match) { //проценты
               val = parseFloat(String.trim(match[1]));
               if (isNaN(val))
                  throw new Error('Неправильный относительный параметр value в boundToAxis: ' + cfg.boundToAxis.value);

               this._boundToAxis.valuePercent = val;
               this._boundToAxis.value = undefined;
            } else {
               val = formatter.parseValue(val);
               if (formatter.isBadValue(val))
                  throw new Error('Неправильный абсолютный параметр value в boundToAxis: ' + cfg.boundToAxis.value);

               this._boundToAxis.valuePercent = undefined;
               this._boundToAxis.value = val;
            }

            val = cfg.boundToAxis.round;
            if (val !== undefined) {
               val = formatter.parseInterval(val);
               if (formatter.isBadInterval(val))
                  throw new Error('Неправильный формат округления в boundToAxis: ' + cfg.boundToAxis.round);

               this._boundToAxis.round = val;
            }
         }

         if (this._dataRangeFromAxis) {
            name = this._dataRangeFromAxis;
            this._dataRangeFromAxis = chart.getAxis(name);

            if (!this._dataRangeFromAxis)
               throw new Error('Не найдена ось, указанная в параметре range.fromAxis: ' + name);

            if (this._dataRangeFromAxis._dataRangeFromAxis)
               throw new Error('У оси, указанной в параметре range.fromAxis: (' + name + '), диапазон (параметр range) должен быть задан явно, а не через другую ось.');

            if (this._direction !== this._dataRangeFromAxis._direction)
               throw new Error('У оси, указанной в параметре range.fromAxis: (' + name + '), направление должно быть такое же, как и у этой оси (' + this._name + ')');

            if (this._dataFields.length === 0) {
               this._dataFields = this._dataRangeFromAxis._dataFields;
            }
         }
      },

      _getCompiledStyle: function(style) {
         if (typeof style === 'string')
            return this._chart._getAxisMarkStyleConfig(style);
         else if (typeof style === 'object') {
            var base = this._chart._getAxisMarkStyleConfig(style.baseName);
            return extend(base, style);
         }
         else
            return this._chart._getAxisMarkStyleConfig();
      },

      _setDataIntf: function(dataIntf) {
         this._invalidate(['dataSrc', 'dataFinal']);

         this._dataIntfSrc = dataIntf;
         this._dataIntf = this._dataFormat.createDataIntf(dataIntf, this._dataFields);
      },

      getChart: function() { return this._chart; },

      getDataFields: function() { return clone(this._cfgDataFields); },

      getDataRange: function() { return clone(this._dataRangeParsed); },

      getDataFormat: function() { return this._dataFormat; },

      getGridDrawBounds: function() { return clone(this._gridDrawBounds); },

      getDrawBounds: function() { return clone(this._drawBounds); },

      getDataRangeCalc: function() {
         this._getLayout();
         return clone(this._dataRangeCalc);
      },

      /**
       * Отдаёт описание оси из стиля (поле style.description).
       */
      getDescription: function() { return this._styleCompiled.description; },

      _getMaxBounds: function() {
         var style = this._styleCompiled;
         return this._directionHV === 'V' ? {width: (style.width || style.widthV)} : {height: (style.width || style.widthH)};
      },

      _setOppositeDrawBounds: function(bounds) {
         this._zonesDrawBounds = bounds;
         this._updateSerieZonesBounds();
      },

      _reduceVisibleZones: function(zoneFn, memo) {
         return reduce(this._zonesLayout.zonesArr, zoneFn, memo, this);
      },

      _setSeriesMargin: function(margin) {
         if (this._seriesMargin.left !== margin.left || this._seriesMargin.right !== margin.right ||
             this._seriesMargin.top !== margin.top || this._seriesMargin.bottom !== margin.bottom)
         {
            var self = this;
            this._seriesMargin = clone(margin);

            forEach(this._chart._axes, function(axis) {
               if (axis._dataRangeFromAxis === self) {
                  axis._invalidate();
               }
            });

            this._invalidate(['dataFinal']);
         }
      },

      _getOppositeMaxBounds: function() {
         var result = {};
         result[this._getWidthDimension()] = this._zonesLayout.zonesWidth;
         return result;
      },

      _setGridDrawBounds: function(bounds) {
         this._invalidate(['dataFinal']);
         this._gridDrawBounds = bounds;
      },

      _getDataIntf: function() { return this._dataIntf; },

      _getAutoRangeStepCount: function(intervalWidth) {
         var selfWidth = this._drawBounds.width,
             selfHeight = this._drawBounds.height;

         var dirMapFuncs = { topBottom: selfHeight, bottomTop: selfHeight, leftRight: selfWidth, rightLeft: selfWidth };
         return Math.max(2, Math.round(dirMapFuncs[this._direction] / intervalWidth));
      },

      _updateSerieZonesBounds: function() {
         var cnt = this._zonesLayout.count;
         forEach(this._zonesLayout.zonesArr, function(zone, num) {
            zone._setOppositeDrawBounds(this._getBoundsPart(this._zonesDrawBounds, num, cnt));
         }, this);
      },

      _initSerieZoneDrawElemens: function(serieIdx) {
         this._drawElements[serieIdx] = {markers: [], axisLine: null, serieZone: null};
      },

      _preCalcLayout: function(initial, inReflow) {
         var style = this._styleCompiled.serieZone, zonesWidth;

         this._seriesMargin = {left: 0, right: 0, top: 0, bottom: 0};
         if (initial) {
            var dimW = (this._directionHV === 'V' ? style.widthV : style.widthH),
                allZonesCnt = this._serieZones.length;

            this._drawElements = {};
            this._zonesLayout = reduce(this._serieZones, function(zones, zone, index) {
               if (zone.getVisible()) {
                  zones.zones[index] = zone;
                  zones.zonesArr.push(zone);
                  zones.zoneIndexes.push(index);
                  zones.count++;

                  var style = zone._getCompiledStyle(),
                      headerVisible = style.description || allZonesCnt > 1;

                  zone._setHeaderVisible(headerVisible);
                  if (!style.description && headerVisible) {
                     style.description = reduce(zone._series, function(memo, serie) {
                        var descr = serie.getDescription();
                        if (descr)
                           memo.push(descr);
                        return memo;
                     }, []).join(', ');
                  }

                  if (headerVisible)
                     zones.zonesWidth = dimW;

                  this._initSerieZoneDrawElemens(index);
               }
               return zones;
            }, {zones: {}, zonesArr: [], zoneIndexes: [], zonesWidth: 0, count: 0}, this);
            zonesWidth = this._zonesLayout.zonesWidth;
         } else {
            var cnt = this._zonesLayout.count, dimName = this._getWidthDimension();

            zonesWidth = this._reduceVisibleZones(function(memo, zone, num) {
               var width = 0;
               if (zone._getHeaderVisible()) {
                  var zoneIndex = this._zonesLayout.zoneIndexes[num], elBox;
                  zone._setOppositeDrawBounds(this._getBoundsPart(this._zonesDrawBounds, num, cnt));
                  if (!inReflow)
                     this._drawSerieZonePrepare(zone, zoneIndex);

                  elBox = this._drawElements[zoneIndex].serieZone.elBox;
                  width = Math.max(memo, elBox[dimName] + ChartGraphConst.defaultAxisStyle.descriptionPadding);
               }
               return width;
            }, 0);
         }

         this._zonesLayout.zonesWidth = zonesWidth;
         this._layout.displayZones = this._zonesLayout.zones;
         this._layout.displayZoneIndexes = this._zonesLayout.zoneIndexes;
         this._layout.displayZonesCount = this._zonesLayout.count;
      },

      _getLengthDimension: function() {
         return ChartGraphConst.directionHV[this._direction] === 'H' ? 'width' : 'height';
      },

      _getWidthDimension: function() {
         return ChartGraphConst.directionHV[this._direction] === 'H' ? 'height' : 'width';
      },

      _getLayout: function() {
         //вход:
         // _dataRangeParsed: [] | pangePoint |
         //                   [pangePoint1, pangePoint2] pangePoint1.rangePercent < pangePoint2.rangePercent
         //                   pangePoint1.value < pangePoint2.value (или valuePercent)
         // rangePoint:      {name: min|max|center, rangePercent: 0-100,
         //                   valuePercent: undefined|(0-100),
         //                   value: undefined|value}
         //выход:
         // _dataRangeCalc: {min, max} => подогнано по данным, меткам, диапазону - расширительно
         //                 min < max
         // _layout.markers: [... [..{value: 123, text: 'puzz', style: stylePtr}..] ... ] => отсортировано по возрастанию
         //    при неполном _dataRange _layout пустой
         //    все value меток лежат в _dataRange
         var i, k, markValues, markObjects, markObj, min, max,
             formatter = this._dataFormat,
             fields = this._dataFields,
             dataIntf, dataLn,
             rangeData, rangeCalc,
             rangeParsed, rangeExtend,
             displayZones, lastZoneNum,
             rangeAuto = undefined,
             self = this;

         function setBoundAxisPercentValues(range) {
            return self._reduceVisibleZones(function(cnt, zone) {
               return zone._reduceBoundAxis(function(cnt, axis) {
                  var boundParams = axis._getBoundAxisParams();
                  if (boundParams.value === undefined) {
                     boundParams.value = formatter.normalizedToValue(boundParams.valuePercent / 100, range);
                     cnt++;
                  }
                  return cnt;
               }, cnt);
            }, 0);
            return 0;
         }

         function calkBoundAxisMinMax(range) {
            self._reduceVisibleZones(function(_, zone) {
               return zone._reduceBoundAxis(function(_, axis) {
                  var val = axis._getBoundAxisParams().value, isBad;
                  if (val !== undefined) {
                     isBad = formatter.isBadValue(val);
                     if (!isBad && (range.min === null || formatter.compare(val, range.min) < 0))
                        range.min = val;

                     if (!isBad && (range.max === null || formatter.compare(val, range.max) > 0))
                        range.max = val;
                  }
               });
            });

            return range;
         }

         function sumFieldAxisBoundPercented(field, isSum) {
            var res = isSum, boundParams;
            if (res) {
               boundParams = field.axis._getBoundAxisParams();
               res = boundParams && boundParams.valuePercent !== undefined;
            }
            return res;
         }

         function sumFieldAxisBoundPercented_not(field, isSum) {
            return !sumFieldAxisBoundPercented(field, isSum);
         }

         function calkDataMinMax(filterFn) {
            var min = max = null, i, j, k, val, valUp, valDown, valF, axisVal, boundParams, sumFields, field, isSum;

            function setMinMax(val) {
               if (!formatter.isBadValue(val) && (min === null || formatter.compare(val, min) < 0))
                  min = val;

               if (!formatter.isBadValue(val) && (max === null || formatter.compare(val, max) > 0))
                  max = val;
            }

            for (j in fields) {
               if (!fields.hasOwnProperty(j))
                  continue;

               field = fields[j];
               isSum = (typeof field === 'object') && field.sum;
               if (!filterFn(field, isSum))
                  continue;

               for (i = 0; i < dataLn; i++) {
                  if (isSum) {
                     val = undefined;

                     sumFields = field.sum;
                     boundParams = field.axis._getBoundAxisParams();
                     axisVal = formatter.isBadValue(boundParams.value) ? formatter.zeroValue : boundParams.value;//TODO: не zero ставить, а низ оси?
                     valUp = axisVal;
                     valDown = axisVal;

                     for (k in sumFields) {
                        if (!sumFields.hasOwnProperty(k))
                           continue;

                        valF = dataIntf.getFieldValue(i, sumFields[k]);

                        if (formatter.compare(valF, formatter.zeroValue) >= 0)
                           valUp = formatter.add(valUp, valF);
                        else
                           valDown = formatter.add(valDown, valF);
                     }

                     if (sumFields.length > 0) {
                        valF = dataIntf.getFieldValue(i, sumFields[0]);
                        if (!formatter.isBadValue(valF) && (min === null || formatter.compare(valF, min) < 0))
                           min = valF;
                     }

                     setMinMax(valUp);
                     setMinMax(valDown);
                  }
                  else {
                     val = dataIntf.getFieldValue(i, field);
                     setMinMax(val);
                  }
               }
            }

            return {min: min, max: max};
         }

         if (!this._validState.dataSrc || !this._validState.dataFinal) {
            dataIntf = this._getDataIntf();
            dataLn = dataIntf.getCount();
            rangeExtend = this._dataRangeExtend;
            if (!this._dataRangeFromAxis) {
               rangeParsed = clone(this._dataRangeParsed);
            }
            displayZones = this._zonesLayout;
            lastZoneNum = displayZones.count - 1;
         }

         if (!this._validState.dataSrc) {
            this._validState.dataFinal = false;
            this._layout.markers = [];

            //Если диапазон берём из другой оси
            if (this._dataRangeFromAxis) {
               this._dataRangeFromAxis._getLayout();

               this._dataRangeCalcSrc = clone(this._dataRangeFromAxis._dataRangeCalcSrc);
               this._dataRangeCalc = clone(this._dataRangeFromAxis._dataRangeCalc);

               rangeCalc = this._dataRangeCalcSrc;
            }
            else //иначе сами считаем
            {
               //Если есть процентовые установки диапазона, то надо диапазон по данным посчитать
               if (rangeParsed.auto || rangeParsed.length < 2 || rangeParsed[0].valuePercent !== undefined || rangeParsed[1].valuePercent !== undefined) {
                  //ищем диапазон по данным, если он не задан явно

                  //TODO: если поле - нарастающий итог (field.sum), а ось X привязана к процентному значению оси Y (этой оси, которую тут считаем) - оно не повлияет на диапазон оси,
                  //      поскольку нарастающий итог зависит от положения оси X, а оно неизвестно. Придумать тут что-то или описать в доке...
                  rangeData = calkBoundAxisMinMax(calkDataMinMax(sumFieldAxisBoundPercented_not));
                  min = rangeData.min; max = rangeData.max;

                  forEach(this._secondaryRanges, function(range) {
                     if (!formatter.isBadValue(range.min) && (min === null || formatter.compare(range.min, min) < 0))
                        min = range.min;

                     if (!formatter.isBadValue(range.max) && (max === null || formatter.compare(range.max, max) > 0))
                        max = range.max;
                  });

                  rangeData = min !== null ? {min: min, max: max} : null;
               }

               rangeCalc = rangeData || {min: null, max: null};
               if (rangeParsed.auto) {
                  if (rangeData) {
                     if (rangeParsed.min !== undefined)
                        rangeData.min = rangeParsed.min;

                     if (rangeParsed.max !== undefined)
                        rangeData.max = rangeParsed.max;

                     rangeAuto = calkRoundedRange(rangeData.min, rangeData.max, rangeParsed.fixedPoint,
                        this._getAutoRangeStepCount(rangeParsed.intervalWidth),
                        rangeParsed.signCount, rangeParsed.roundNum);
                     rangeCalc = {min: rangeAuto.start, max: rangeAuto.end};
                  }
               } else {
                  rangeCalc = this._rangeParser.parsedRangeToDataRange(rangeParsed, rangeData, rangeCalc);
               }

               if (rangeCalc.min !== null && rangeCalc.max !== null) {
                  if (setBoundAxisPercentValues(rangeCalc) > 0) {
                     rangeData = calkBoundAxisMinMax(calkDataMinMax(sumFieldAxisBoundPercented));
                     if (rangeData.min !== null) {
                        if (formatter.compare(rangeData.min, rangeCalc.min) < 0)
                           rangeCalc.min = rangeData.min;

                        if (formatter.compare(rangeData.max, rangeCalc.max) > 0)
                           rangeCalc.max = rangeData.max;
                     }
                  }
               }

               //Диапазон готов
               this._dataRangeCalcSrc = rangeCalc;
               this._dataRangeCalc = rangeCalc;
            }

            //Делаем маркеры по диапазону и данным (здесь rangeCalc.start <> rangeCalc.end)
            if (rangeCalc.min !== null && rangeCalc.max !== null) {
               var start, end;

               if (formatter.compare(rangeCalc.min, rangeCalc.max) > 0) {
                  start = rangeCalc.max;
                  rangeCalc.max = rangeCalc.min;
                  rangeCalc.min = start;
               }

               if (!rangeExtend.forEmptyRangeOnly ||
                   formatter.compare(rangeExtend.min, rangeExtend.max) !== 0)
               {
                  if (rangeExtend.min !== undefined)
                     rangeCalc.min = formatter.sub(rangeCalc.min, rangeExtend.min);

                  if (rangeExtend.max !== undefined)
                     rangeCalc.max = formatter.add(rangeCalc.max, rangeExtend.max);
               }
               markObjects = [];

               var insertMarkObj = function(markObj) {
                  if (formatter.isBadValue(markObj.value))
                     return;

                  var l = 0, h = markObjects.length, m;

                  while (l < h) {
                     m = (l + h) >> 1;
                     if (formatter.compare(markObjects[m].value, markObj.value) < 0)
                        l = m + 1;
                     else
                        h = m;
                  }

                  if (l == markObjects.length)
                     markObjects.push(markObj);
                  else {
                     if (formatter.compare(markObjects[l].value, markObj.value) === 0) {
                        if (markObjects[l].priority < markObj.priority)
                           markObjects[l] = markObj;
                     }
                     else
                        markObjects.splice(l, 0, markObj);
                  }
               };

               var markInsideRange = function(markValue, range) {
                  return !formatter.isBadValue(markValue) &&
                     formatter.compare(range.min, markValue) <= 0 &&
                     formatter.compare(markValue, range.max) <= 0;
               };

               forEach(this._markDefs, function(markDef) {
                  forEach(markDef.ranges, function(range) {
                     start = range[0].value !== undefined ? range[0].value :
                             formatter.normalizedToValue(range[0].valuePercent / 100, rangeCalc);

                     if (range[0].round !== undefined)
                        start = formatter.roundToInterval(start, range[0].round, false);

                     ///

                     end = range[1].value !== undefined ? range[1].value :
                           formatter.normalizedToValue(range[1].valuePercent / 100, rangeCalc);

                     if (range[1].round !== undefined)
                        end = formatter.roundToInterval(end, range[1].round, true);

                     if (markDef.interval === 'auto')  {
                        markValues = [];
                        if (rangeAuto) {
                           markValues = rangeAuto.steps;
                        }
                     } else if (markDef.interval !== undefined)  {
                        markValues = formatter.generateSequence(start, end, markDef.interval, dataIntf);
                     }
                     else if (markDef.pointInterval !== undefined) {
                        markValues = [];

                        var markFn = function(k, rangeMark) {
                           var val = dataIntf.getFieldValue(k, markDef.pointIntervalDataField);
                           if (markInsideRange(val, rangeMark))
                              markValues.push(val);
                        };

                        var rangeMark;
                        if (formatter.compare(start, end) < 0) {
                           rangeMark = {min: start, max: end};
                           for (k = 0; k < dataLn; k += markDef.pointInterval)
                              markFn(k, rangeMark);
                        }
                        else {
                           rangeMark = {min: end, max: start};
                           for (k = dataLn - 1; k >= 0; k -= markDef.pointInterval)
                              markFn(k, rangeMark);
                        }
                     }

                     for (k in markValues) {
                        if (!markValues.hasOwnProperty(k))
                           continue;

                        if (!markInsideRange(markValues[k], rangeCalc))
                           continue;

                        markObj = {value: markValues[k], text: undefined};

                        markObj.text = markDef._notify('onDataFormat', markObj.value, markDef.dataFormatterParams);

                        if (markObj.text === undefined)
                           markObj.text = this._notify('onDataFormat', markObj.value, markDef.dataFormatterParams);

                        if (markObj.text === undefined)
                           markObj.text = formatter.formatValue(markObj.value, markDef.dataFormatterParams);

                        markObj.styleCompiled = markDef.styleCompiled;
                        markObj.priority = markDef.priority;
                        markObj.gridLine = markDef.gridLine;

                        insertMarkObj(markObj);
                     }
                  }, this);
               }, this);

               var obj, defCustomMarksPriority = this._markDefs.length,
                   objs = ensureArray(this._notify('onCustomGenerateMarks', rangeCalc.min, rangeCalc.max, dataIntf, formatter));

               for (i in objs) {
                  if (!objs.hasOwnProperty(i))
                     continue;

                  obj = objs[i];

                  if (formatter.isBadValue(obj.value) || !markInsideRange(obj.value, rangeCalc))
                     continue;

                  if (obj.text === undefined)
                     obj.text = this._notify('onDataFormat', obj.value, this._dataFormatterParams);

                  if (obj.text === undefined)
                     obj.text = formatter.formatValue(obj.value, this._dataFormatterParams);

                  if (obj.priority === undefined)
                     obj.priority = defCustomMarksPriority;

                  obj.styleCompiled = this._getCompiledStyle(obj.style);

                  insertMarkObj(obj);
               }

               this._layout.markers = markObjects;
            }

            this._validState.dataSrc = true;
         }

         if (!this._validState.dataFinal) {
            forEach(displayZones.zonesArr, function(zone, index) {
               var count = displayZones.count,
                  bounds = this._getBoundsPart(this._drawBounds, index, count),
                  gridBounds = this._getBoundsPart(this._gridDrawBounds, index, count);

               zone._setDrawBounds(bounds);
               zone._setGridDrawBounds(gridBounds);
            }, this);

            this._validState.dataFinal = true;

            if (!this._dataRangeFromAxis) { //Если берём диапазон из чужой оси, то отступы и вылезания не учитываем
               rangeCalc = this._dataRangeCalcSrc;
               this._dataRangeCalc = rangeCalc;

               var rangeMargin = clone(this._seriesMargin);

               if (displayZones.count > 1 && this._layout.markers.length > 2) {
                  //Определяем, не вылезают ли крайние метки между зонами...
                  forEach(displayZones.zoneIndexes, function(zoneIdx, zoneNum) {
                     var zone = displayZones.zones[zoneIdx],
                         phases = ['labels'],
                         bounds = normalizeBounds(zone._getDrawBounds()),
                         oldMarkers = this._layout.markers,
                         lastMarkerIdx = oldMarkers.length - 1,
                         draw;

                     if (zoneNum === 0) {
                        this._layout.markers = [oldMarkers[lastMarkerIdx]];
                     }
                     else if (zoneNum === lastZoneNum) {
                        this._layout.markers = [oldMarkers[0]];
                     }
                     else {
                        this._layout.markers = [oldMarkers[0], oldMarkers[lastMarkerIdx]];
                     }

                     draw = this._drawSerieZone(zoneIdx).bind(this);

                     forEach(phases, draw);
                     forEach(this._drawElements[zoneIdx].markers, function(marker) {
                        return forEach(marker.elementsArray, function(el) {
                           var r = el.getBBox();
                           rangeMargin.left = Math.max(bounds.left - r.x,       rangeMargin.left);
                           rangeMargin.right = Math.max(r.x2 - bounds.right,    rangeMargin.right);
                           rangeMargin.top = Math.max(bounds.top - r.y,         rangeMargin.top);
                           rangeMargin.bottom = Math.max(r.y2 - bounds.bottom,  rangeMargin.bottom);
                        }, this);
                     }, this);

                     forEach(this._drawElements[zoneIdx].markers, function(marker, index) {
                        this._layout.markers[index].drawMarker = marker;
                     }, this);

                     this._drawElements[zoneIdx].markers = [];
                     this._layout.markers = oldMarkers;
                  }, this);
               }

               if (rangeCalc.min !== null && rangeCalc.max !== null) {
                  var rangeAddPixH = {
                     leftRight: {min: 'left', max: 'right'},
                     rightLeft: {min: 'right', max: 'left'}
                  },
                  rangeAddPixV = {
                     topBottom: {min: 'top', max: 'bottom'},
                     bottomTop: {min: 'bottom', max: 'top'}
                  },
                  rangeAddPix = {
                     bottom: rangeAddPixH, top: rangeAddPixH,
                     left: rangeAddPixV, right: rangeAddPixV
                  }[this._side][this._direction],
                  bounds = normalizeBounds(displayZones.zones[0]._getDrawBounds()),
                  boundsDimVal = bounds[this._getLengthDimension()],
                  pixDiffMin = rangeMargin[rangeAddPix.min], pixDiffMax = rangeMargin[rangeAddPix.max],
                  normMin = pixDiffMin / boundsDimVal, normMax = 1 - (pixDiffMax / boundsDimVal);

                  this._dataRangeCalc = formatter.normalizedToRange(normMin, normMax, rangeCalc.min, rangeCalc.max);
               }
            }
         }

         return this._layout;
      },

      _getNotNullDataRange: function() {
         var formatter = this._dataFormat,
            range = clone(this.getDataRangeCalc());

         if (formatter.isBadValue(range.min))
            range.min = formatter.minValue();

         if (formatter.isBadValue(range.max))
            range.max = formatter.maxValue();

         return range;
      },

      _getVisibleSerieZonesCount: function() {
         return this._layout.displayZonesCount;
      },

      _getVisibleSerieZone: function(zoneIdx) {
         var serieZones = this._getLayout().displayZones;
         if (!(zoneIdx in serieZones))
            throw new Error('Эта зона серий в оси не существует или невидима: ' + zoneIdx);

         return serieZones[zoneIdx];
      },

      _getAxisInternalGridLineMapFn: function(serieZoneIdx, ortAxisZone, ortAxisZoneIdx) {
         var serieZone = this._getVisibleSerieZone(serieZoneIdx),
             gridBounds, axisBounds;

         if (ortAxisZoneIdx === 0) {
            gridBounds = serieZone._getGridDrawBounds();
            axisBounds = serieZone._getDrawBounds();
         } else {
            gridBounds = ortAxisZone._getDrawBounds();
            axisBounds = gridBounds;
         }

         var
             gridL = gridBounds.left,
             gridR = gridL + gridBounds.width - 1,
             gridT = gridBounds.top,
             gridB = gridT + gridBounds.height - 1,
             axisL = axisBounds.left,
             axisR = axisL + axisBounds.width - 1,
             axisT = axisBounds.top,
             axisB = axisT + axisBounds.height - 1,
             isBoundAxis = this._getBoundAxis();

         var sideMap = {
               left:   function(p) { return {x: gridL, y: p.y}; },
               right:  function(p) { return {x: gridR, y: p.y}; },
               top:    function(p) { return {x: p.x, y: gridT}; },
               bottom: function(p) { return {x: p.x, y: gridB}; }
            },
             sideMapBound = {
               left:   function(p) { return {x: axisR, y: p.y}; },
               right:  function(p) { return {x: axisL, y: p.y}; },
               top:    function(p) { return {x: p.x, y: axisB}; },
               bottom: function(p) { return {x: p.x, y: axisT}; }
             };

         return (isBoundAxis ? sideMapBound : sideMap)[this._side];
      },

      _getAxisPosFromValueFunc: function(serieZoneIdx) {
         var serieZone = this._getVisibleSerieZone(serieZoneIdx),
             axisBounds = serieZone._getDrawBounds(),
             formatter = this._dataFormat,
             range = this._getNotNullDataRange(),
             selfWidth = axisBounds.width,
             selfHeight = axisBounds.height;

         function normToRange(value) {
            return formatter.isBadValue(value) ? range.min : formatter.normalizedFromValueRange(value, range);
         }

         var dirMapFuncs = {
            topBottom: function(value) { return {y: normToRange(value) * selfHeight - 1,       x: 0}; },
            bottomTop: function(value) { return {y: (1 - normToRange(value)) * selfHeight - 1, x: 0}; },
            leftRight: function(value) { return {x: normToRange(value) * selfWidth - 1,        y: 0}; },
            rightLeft: function(value) { return {x: (1 - normToRange(value)) * selfWidth - 1,  y: 0}; }
         };
         return dirMapFuncs[this._direction];
      },

      _getMaxAxisPos: function(serieZone) {
         var drawBounds = serieZone._getDrawBounds(),
             selfWidth = drawBounds.width,
             selfHeight = drawBounds.height;

         var dirMapPos = { topBottom: {y: selfHeight, x: 0}, bottomTop: {y: 0, x: 0},
                           leftRight: {x: selfWidth, y: 0},  rightLeft: {x: 0, y: 0} };
         return dirMapPos[this._direction];
      },

      _getBoundsPart: function(bounds, partNum, partsCount) {
         var dirKoefFwd = partNum / partsCount,
             dirKoefRew = 1 - ((partNum + 1) / partsCount),
             cntKoef = 1 / partsCount,
             dirKoef = {
                leftRight: dirKoefFwd, rightLeft: dirKoefRew,
                topBottom: dirKoefFwd, bottomTop: dirKoefRew
             }[this._direction],
             topBottomKoefs = {left: dirKoef, top: 0, width: cntKoef, height: 1},
             leftRightKoefs = {left: 0, top: dirKoef, width: 1, height: cntKoef},
             sideKoefs = { bottom: topBottomKoefs, top: topBottomKoefs,
                           left: leftRightKoefs, right: leftRightKoefs }[this._side];

         return {
            left: bounds.left + (bounds.width * sideKoefs.left),
            top:  bounds.top + (bounds.height * sideKoefs.top),
            width: bounds.width * sideKoefs.width,
            height: bounds.height * sideKoefs.height
         };
      },

      _clearDraw: function() {
         var inherited = ChartAxisDefault.superclass._clearDraw;
         inherited.call(this);

         this._drawElements = {};
      },

      _draw: function() {
         if (!this.getVisible())
            return undefined;

         var layout = this._getLayout();
         var zonePhasesMap = reduce(layout.displayZones, function(zonesMap, zone, serieZoneIdx) {
            zonesMap[serieZoneIdx] = this._drawSerieZone(serieZoneIdx);
            return zonesMap;
         }, {}, this);

         return function(phase) {
            function drawEachZone() {
               forEach(zonePhasesMap, function(drawFn) { drawFn(phase); });
            }

            function drawFirstZone() {
               var zoneIndexes = layout.displayZoneIndexes;
               zonePhasesMap[zoneIndexes[0]](phase);
            }

            if (phase === 'description')
               drawFirstZone();
            else
               drawEachZone();
         };
      },

      _addCustomDrawElements: function(els, drawEventArgs) {
         var customEls = this.hasEventHandlers('onElementCustomDraw') &&
                         this._notify.apply(this, ['onElementCustomDraw'].concat(drawEventArgs));

         return customEls ? els.concat(ensureArray(customEls)) : els;
      },

      _drawDescrOnEdgeFn: function(side) {
         var padding = ChartGraphConst.defaultAxisStyle.descriptionPadding, canvas = this._chart.getCanvas();

         var funcMap = {
            left: function(edges, styleCompiled) {
               var el = canvas.text(edges.left - padding, (edges.bottom + edges.top) / 2, styleCompiled.description).
                  transform('r-90').attr(styleCompiled.descriptionTextStyle);

               var box = el.getBBox(), dx = box.x2 - (edges.left - padding);
               if (dx > 0) {
                  el.transform('t-' + dx + ',0r-90');
               }

               return el;
            },

            right: function(edges, styleCompiled) {
               var el = canvas.text(edges.right + padding, (edges.bottom + edges.top) / 2, styleCompiled.description).
                  transform('r90').attr(styleCompiled.descriptionTextStyle);

               var box = el.getBBox(), dx = edges.right + padding - box.x;

               if (dx > 0) {
                  el.transform('t' + dx + ',0r90');
               }

               return el;
            },

            top: function(edges, styleCompiled) {
               var el = canvas.text((edges.left + edges.right) / 2, edges.top - padding, styleCompiled.description).
                  attr(styleCompiled.descriptionTextStyle);

               var box = el.getBBox(), dy = box.y2 - (edges.top - padding);
               if (dy > 0) {
                  el.transform('t0,-' + dy);
               }

               return el;
            },

            bottom: function(edges, styleCompiled) {
               var el = canvas.text((edges.left + edges.right) / 2, edges.bottom + padding, styleCompiled.description).
                  attr(styleCompiled.descriptionTextStyle);

               var box = el.getBBox(), dy = edges.bottom + padding - box.y;
               if (dy > 0) {
                  el.transform('t0,' + dy);
               }

               return el;
            }
         };

         return funcMap[side];
      },

      _drawSerieZonePrepare: function (serieZone, serieZoneIdx) {
         var bounds = serieZone._getOppositeDrawBounds(),
             bottom = bounds.top + bounds.height,
             right = bounds.left + bounds.width,
             styleCompiled = serieZone._getCompiledStyle(),
             canvas = this._chart.getCanvas(),

             //подписи на обратных сторонах
             edges = {
                bottom: { left: bounds.left, right: right, top: bottom, bottom: bottom },
                left: { left: bounds.left, right: bounds.left, top: bounds.top, bottom: bottom },
                top: { left: bounds.left, right: right, top: bounds.top, bottom: bounds.top },
                right: { left: right, right: right, top: bounds.top, bottom: bottom }
             }[this._side],
             oppSide = {left: 'right', right: 'left', bottom: 'top', top: 'bottom'},
             moveFunc = ({
                bottom: function(newBounds) { return {dx: 0, dy: newBounds.top + newBounds.height - bottom}; },
                left: function(newBounds) { return {dx: 0, dy: bounds.left - newBounds.left}; },
                right: function(newBounds) { return {dx: 0, dy: newBounds.left - bounds.left}; },
                top: function(newBounds) { return {dx: 0, dy: bottom - newBounds.top - newBounds.height}; }
             }[this._side]).bind(this);

         var el = this._drawDescrOnEdgeFn(oppSide[this._side])(edges, styleCompiled),
            elBox = el.getBBox(),
            elements = {description: el},
            drawEventArgs = [
               'serieZoneDescription',
               { elements: elements,
                 serieZoneIndex: serieZoneIdx,
                 style: styleCompiled },
               canvas, null
            ];

         this._drawElements[serieZoneIdx].serieZone = { drawEventArgs: drawEventArgs,
                                                        elBox: elBox, moveFunc: moveFunc, elements: elements};

         var els = this._addCustomDrawElements([el], drawEventArgs);
         this._registerElementsBindEvents(els, drawEventArgs);

         return els;
      },

      _drawSerieZone: function(serieZoneIdx) {
         var self = this,
             serieZone = this._getVisibleSerieZone(serieZoneIdx),
             isBoundAxis = this._getBoundAxis(),
             styleCompiled = this._styleCompiled,
             range = this._getNotNullDataRange(),
             drawBounds = serieZone._getDrawBounds(),
             gridDrawBounds  = serieZone._getGridDrawBounds(),

             selfTop = drawBounds.top,
             selfWidth = drawBounds.width,
             selfHeight = drawBounds.height,

             gridTop = gridDrawBounds.top,
             gridLeft = gridDrawBounds.left,
             gridWidth = gridDrawBounds.width,
             gridHeight = gridDrawBounds.height,

             side = this._side,
             labelPaddingV = styleCompiled.labelPadding || ChartGraphConst.axisLabelPaddingV,
             labelPaddingH = styleCompiled.labelPadding || ChartGraphConst.axisLabelPaddingH,
             chart = this._chart,
             canvas = chart.getCanvas(),
             phaseElNames = {ticks: 'tick', gridLines: 'gridLine', labels: 'labels'};

         function getXyOnAxeFn() {
            var dirMapFunc = self._getAxisPosFromValueFunc(serieZoneIdx),
                selfW = drawBounds.width,
                selfH = drawBounds.height,
                selfL = drawBounds.left,
                selfT = drawBounds.top;

            var sideMapFuncs = {
               left:   function(value) { return {x: selfW - 1, y: dirMapFunc(value).y}; },
               right:  function(value) { return {x: 0, y: dirMapFunc(value).y}; },
               top:    function(value) { return {x: dirMapFunc(value).x, y: selfH - 1}; },
               bottom: function(value) { return {x: dirMapFunc(value).x, y: 0}; }
            };

            var sideMapFunc = sideMapFuncs[side];

            return function(value) {
               var p = sideMapFunc(value);
               return {x: Math.round(p.x + selfL), y: Math.round(p.y + selfT)};
            };
         }

         var getXyOnAxe = getXyOnAxeFn();

         var maxXyOnAxe = function() {
            var maxAxisPos = self._getMaxAxisPos(serieZone),
                sideMap = {
                   left: {x: selfWidth - 1, y: maxAxisPos.y}, right: {x: 0, y: maxAxisPos.y},
                   top: {x: maxAxisPos.x, y: selfHeight - 1}, bottom: {x: maxAxisPos.x, y: 0}
                },
                p = sideMap[side];

            return {x: Math.round(p.x + drawBounds.left), y: Math.round(p.y + selfTop)};
         }();

         var getGridTickPos = function(){
            var sideFunc = {
               left:   function(axeP) { return {x: gridLeft, y: axeP.y}; },
               right:  function(axeP) { return {x: gridLeft + gridWidth, y: axeP.y}; },
               top:    function(axeP) { return {x: axeP.x, y: gridTop}; },
               bottom: function(axeP) { return {x: axeP.x, y: gridTop + gridHeight}; }
            }[side];

            return function(axeP) {
               var p = sideFunc(axeP);
               return (p.x !== axeP.x || p.y !== axeP.y) ? p : null;
            };
         }();

         var getLabelPos = {
            left: function(labelBox, axeP) {
               return { x: axeP.x - labelPaddingV - (labelBox.width >> 1), y: axeP.y };
            },
            right: function(labelBox, axeP) {
               return { x: axeP.x + labelPaddingV + (labelBox.width >> 1), y: axeP.y };
            },
            top: function(labelBox, axeP) {
               return { x: axeP.x, y: axeP.y - (labelBox.height >> 1) - labelPaddingH };
            },
            bottom: function(labelBox, axeP) {
               return { x: axeP.x, y: axeP.y + (labelBox.height >> 1) + labelPaddingH };
            }
         }[side];

         var fixLabelBoxPt = {
            left: function(labelBox, elP) {
               labelBox.x = elP.x - (labelBox.width >> 1);
            },
            right: function(labelBox, elP) {
               labelBox.x = elP.x - (labelBox.width >> 1);
            },
            top: function(labelBox, elP) {
               labelBox.y = elP.y - (labelBox.height >> 1);
            },
            bottom: function(labelBox, elP) {
               labelBox.y = elP.y - (labelBox.height >> 1);
            }
         }[side];

         var getGridLinePoints = function(){
            var leftRight = function(axeP) {
                  return [{x: gridLeft, y: axeP.y}, {x: gridLeft + gridWidth - 1, y: axeP.y}];
                },
                topBottom = function(axeP) {
                   return [{x: axeP.x, y: gridTop}, {x: axeP.x, y: gridTop + gridHeight - 1}];
                },
                sideMapper = {
                   left: leftRight, right: leftRight, top: topBottom, bottom: topBottom
                };

            return sideMapper[side];
         }();
         //

         var marks = this._getLayout().markers,
             markProps = [],
             markDrawElements = this._drawElements[serieZoneIdx].markers,
             drawUtils = {getGridLinePoints: getGridLinePoints, getLabelPos: getLabelPos,
                          getGridTickPos: getGridTickPos};

         function forEachMark(markFn, phase) {
            function makeEventArgs(i) {
               return [
                  'mark',                    //аргумент elementType
                  {                          //аргумент elementData
                     mark: marks[i],
                     serieZoneIndex: serieZoneIdx,
                     elements: markProps[i].elements,
                     style: markProps[i].style,
                     axisPoint: markProps[i].pt
                  },
                  canvas,                    //аргумент canvas
                  drawUtils                  //аргумент drawUtils
                  //и сюда ещё нужно добавлять raphael-элемент, для которого произошло событие типа mousedown
               ];
            }

            var i, ln;
            for (i = 0, ln = marks.length; i !== ln; i++) {
               var mark = marks[i], prop = markProps[i], els;

               if (!prop) {
                  markProps[i] = prop = {
                     style: chart._getAxisMarkStyle(mark.styleCompiled.type),
                     pt: getXyOnAxe(mark.value),
                     elements: {},
                     elementsArray: []
                  };
               }

               prop.elements[phaseElNames[phase]] = null;

               els = markFn(mark, prop.elements, prop.style, prop.pt, i, makeEventArgs);
               if (els) {
                  els = ensureArray(els);
                  prop.elementsArray = prop.elementsArray.concat(els);

                  if (!(i in markDrawElements))
                     markDrawElements[i] = {drawEventArgs: makeEventArgs(i), elementsArray: prop.elementsArray};

                  self._registerElementsBindEvents(els, markDrawElements[i].drawEventArgs);
               }
            }
         }

         function getOldDrawElement(mark, elName) {
            var drawMarker = mark.drawMarker,
                args = drawMarker && drawMarker.drawEventArgs,
                arg = args && args[1],
                elements = arg && arg.elements,
                result = elements && elements[elName];

            if (result) {
               result.isOld = true;
               delete elements[elName];

               if (result.removed)//TODO: убрать костыль
                  result = null;
            }

            return result;
         }

         var markPhaseFuncs = {
            gridLines: function(mark, elements, style, pt) {
               //Линия сетки
               var styleParams, points, el;
               styleParams = mark.styleCompiled.gridLine;
               if (styleParams) {
                  points = getGridLinePoints(pt);
                  el = style.createGridLine(points[0], points[1], canvas, styleParams);
                  elements.gridLine = el;
                  return el;
               }
               else
                  return undefined;
            },
            ticks: function(mark, elements, style, pt) {
               var styleParams, el, result = [], pl;
               //Риска на самой оси
               styleParams = mark.styleCompiled.axisTick;
               if (styleParams) {
                  el = style.createAxisTick(pt, self._direction, canvas, styleParams);
                  result.push(el);

                  elements.tick = elements.tick || {};
                  elements.tick.axis = el;
               }

               //Риска-отражение на области графиков и сетки
               if (!isBoundAxis && (styleParams = mark.styleCompiled.gridTick)) {
                  //если ось лежит на краю области графиков - риска не нужна
                  pl = getGridTickPos(pt);
                  if (pl) {
                     el = style.createGridAxisTick(pl, self._direction, canvas, styleParams);
                     result.push(el);

                     elements.tick = elements.tick || {};
                     elements.tick.grid = el;
                  }
               }

               return result;
            },
            labels: function(mark, elements, style, pt) {
               var styleParams, el, pl, oldEl, bbox;
               //Метка
               styleParams = mark.styleCompiled.label;

               if (styleParams && mark.text && mark.text.length) {
                  oldEl = getOldDrawElement(mark, 'label');
                  if (oldEl) {
                     el = oldEl;
                     bbox = el.__bbox;
                  }
                  else {
                     el = style.createLabel(pt, mark.text, canvas, styleParams);
                     bbox = el.getBBox();
                     el.__bbox = bbox;
                  }

                  pl = getLabelPos(bbox, pt);
                  el.attr(pl);

                  fixLabelBoxPt(bbox, pl);
                  bbox.x2 = bbox.x + bbox.width;
                  bbox.y2 = bbox.y + bbox.height;

                  elements.label = el;

                  return el;
               }
               else
                  return undefined;
            },
            custom: function(mark, elements, style, pt, markIndex, makeEventArgs) {
               return self.hasEventHandlers('onElementCustomDraw') &&
                      self._notify.apply(self, ['onElementCustomDraw'].concat(makeEventArgs(markIndex)));
            }
         };

         function drawAxisLine() {
            var p0 = getXyOnAxe(range.min),
                p1 = maxXyOnAxe,
                styleParams, drawEventArgs, el;

            if (p0.x === p1.x && p0.y === p1.y)
               p1 = {x: p0.x + 1,  y: p1.y + 1};

            el = canvas.path("M" + p0.x + ',' + p0.y + "L" + p1.x + "," + p1.y);

            if ((styleParams = styleCompiled.pathStyle)) {
               el.attr(styleParams);
            }

            drawEventArgs = [
               'axisLine',                //аргумент elementType
               {                          //аргумент elementData
                  pointStart: p0,
                  pointEnd: p1,
                  serieZoneIndex: serieZoneIdx,
                  elements: {
                     axisLine: el
                  },
                  style: styleCompiled
               },
               canvas,                    //аргумент canvas
               drawUtils                  //аргумент drawUtils
               //и сюда ещё нужно добавлять raphael-элемент, для которого произошло событие типа mousedown
            ];

            self._drawElements[serieZoneIdx].axisLine = { drawEventArgs: drawEventArgs };
            self._registerElementsBindEvents(self._addCustomDrawElements([el], drawEventArgs));
         }

         var drawDescrOnEdge = self._drawDescrOnEdgeFn(this._side);

         function drawDescription() {
            var
                drawBounds = self._drawBounds,
                edgesH = {left: drawBounds.left, right: drawBounds.left + drawBounds.width,
                          top: drawBounds.top + drawBounds.height, bottom: drawBounds.top},
                edgesV = {left: drawBounds.left + drawBounds.width, right: drawBounds.left,
                          top: drawBounds.top, bottom: drawBounds.top + drawBounds.height},
                edges = { left: edgesV, right: edgesV, top: edgesH, bottom: edgesH }[self._side];

            function processEdges(element) {
               if (element) {
                  var box = element.__bbox || element.getBBox();
                  edges.left = Math.min(edges.left, box.x);
                  edges.right = Math.max(edges.right, box.x2);
                  edges.top = Math.min(edges.top, box.y);
                  edges.bottom = Math.max(edges.bottom, box.y2);
               }
            }

            self.enumerateElements(function(elementType, elementData) {
               if (elementType === 'mark') {
                  var elements = elementData.elements;
                  processEdges(elements.label);
                  if (!elements.label)
                     processEdges(elements.tick && elements.tick.axis);
               } else if (elementType === 'axisLine') {
                  processEdges(elementData.elements.axisLine);
               }
            }, serieZoneIdx);

            var el = drawDescrOnEdge(edges, styleCompiled);
            if (el) {
               var drawEventArgs = [
                  'description',
                  { elements: { description: el},
                    serieZoneIndex: serieZoneIdx,
                    style: styleCompiled },
                  canvas, drawUtils
               ];

               self._drawElements[serieZoneIdx].description = { drawEventArgs: drawEventArgs };
               self._registerElementsBindEvents(self._addCustomDrawElements([el], drawEventArgs));
            }

            return el;
         }

         function drawSerieZoneBackground() {
            var styleCompiled = serieZone._getCompiledStyle(), drawEventArgs;
            if (styleCompiled.backPathStyle) {
               var drawBounds = serieZone._getOppositeDrawBounds(),
                   el = canvas.rect(drawBounds.left, drawBounds.top, drawBounds.width, drawBounds.height);
               el.attr(styleCompiled.backPathStyle);

               drawEventArgs = [
                  'serieZoneBackground', //аргумент elementType
                  {                      //аргумент elementData
                     serieZoneIndex: serieZoneIdx,
                     elements: { serieZoneBackground: el },
                     style: styleCompiled.backPathStyle
                  },
                  canvas //аргумент canvas
               ];

               self._drawElements[serieZoneIdx].serieZoneBackground = { drawEventArgs: drawEventArgs };
               self._registerElementsBindEvents(self._addCustomDrawElements([el], drawEventArgs));
            }
         }

         function drawSerieZone() {
            if (serieZone._getHeaderVisible()) {
               var drawZone = self._drawElements[serieZoneIdx].serieZone,
                   oppBounds = serieZone._getOppositeDrawBounds(),
                   diff = drawZone.moveFunc(oppBounds);
               forEach(drawZone.elements, function(el) {
                  var newTr = map(el.transform().concat([['t', diff.dx, diff.dy]]),
                                  function(t) { return t[0] + t.slice(1).join(','); }).join('');

                  el.transform(newTr);
                  el.toFront();
                  self._graphSet.push(el);
               });
            }
         }

         function cleanupDraw() {
            for (var i = 0, ln = marks.length; i !== ln; i++) {
               var mark = marks[i];
               if (mark.drawMarker)
                  delete mark.drawMarker;
            }
         }

         return function(phase) {
            function eachMarkPhaseFunc() {
               forEachMark(markPhaseFuncs[phase], phase);
            }

            var phaseFuncs = {
               axisLine: styleCompiled.pathStyle && drawAxisLine,
               description: styleCompiled.showDescription &&
                            styleCompiled.description &&
                            drawDescription,
               gridLines: eachMarkPhaseFunc,
               ticks: eachMarkPhaseFunc,
               labels: eachMarkPhaseFunc,

               serieZonesBackground: drawSerieZoneBackground,
               serieZones: drawSerieZone,

               custom: eachMarkPhaseFunc,
               cleanupDraw: cleanupDraw
            };

            var result = undefined;
            if (phaseFuncs[phase]) {
               result = phaseFuncs[phase]();
            }
            return result;
         };
      },

      /**
       * Перебирает элементы оси. Этот метод позволяет обойти логические элементы оси: все метки на ней, линии сетки, созданные метками,
       * саму линию оси, получить соответствующие им графические элементы, и как-либо их изменить.
       * @param elementFunc Функция-обработчик элемента оси. Параметры функции такие же, как у обработчика события оси <b>onElementCustomDraw</b>
       * Подробнее см. документацию по событию диаграммы <b>onElementCustomDraw</b>
       * @param {Number} [serieZoneIdx] Номер зоны серий, в которой перебираются элементы. Актуально, если ось разбита по зонам.
       */
      enumerateElements: function(elementFunc, serieZoneIdx) {
         var indexes = this._zonesLayout.zoneIndexes;
         if (serieZoneIdx !== undefined && !(serieZoneIdx in this._drawElements)) {
            throw new Error('Зоны серий в оси с таким индексом нет или она невидима (индекс: ' + serieZoneIdx + ')');
         }

         var zoneIndexes = serieZoneIdx !== undefined ? [serieZoneIdx] : indexes;

         forEach(zoneIndexes, function(zoneIdx) {
            var drawElements = this._drawElements[zoneIdx];

            var elements = [];
            if (drawElements.axisLine)
               elements.push(drawElements.axisLine);

            if (drawElements.serieZone)
               elements.push(drawElements.serieZone);

            forEach(elements.concat(drawElements.markers), function(element) {
               elementFunc.apply(this, element.drawEventArgs);
            }, this);

         }, this);
      }
   });

   var ChartLineSerie = ChartBaseElement.extend({
      $protected: {
         _type: undefined,
         _name: null,
         _axisX: null,
         _axisXZone: 0,
         _axisY: null,
         _axisYZone: 0,
         _axisXdataField: null,
         _axisYdataField: null,
         _styleCompiled: null,
         _drawElements: {points: [], line: null, back: null},
         _drawBoundsInvalidateParts: ['extraMargin'],
         _validState: { extraMargin: false, pointLabels: false },
         _layout: {
            pointLabels: null,
            extraMargin: {left: 0, top: 0, right: 0, bottom: 0}
         }
      },

      $constructor: function(cfg) {
         var chart = this._chart, self = this;

         var zoneMsg = 'Номер зоны в оси для серии должен быть числом >=0, задано же: ';

         this._publish('onCustomGenerateSerieLabels');
         if (cfg.onCustomGenerateSerieLabels)
            this.subscribe('onCustomGenerateSerieLabels', cfg.onCustomGenerateSerieLabels);

         this._type = cfg.type;
         this._name = cfg.name;

         if (!cfg.type)
            throw new Error('Не задан тип серии (параметр type)');

         if (!cfg.axisX)
            throw new Error('Не задана ось X для серии');

         if (!cfg.axisY)
            throw new Error('Не задана ось Y для серии');

         this._axisXZone = AxisSeriesZone.parseZoneIdx(cfg.axisXZone, zoneMsg);
         this._axisYZone = AxisSeriesZone.parseZoneIdx(cfg.axisYZone, zoneMsg);

         this._axisX = chart.getAxis(cfg.axisX);
         if (!this._axisX)
            throw new Error('Задано имя несуществующей оси X для серии: ' + cfg.axisX);

         this._axisY = chart.getAxis(cfg.axisY);
         if (!this._axisY)
            throw new Error('Задано имя несуществующей оси Y для серии: ' + cfg.axisY);

         this._style = cfg.style || {};
         var style = (typeof this._style === 'string') ? {baseName: this._style} : this._style;

         if (cfg.description)
            style.description = cfg.description;

         this._styleCompiled = chart._getSerieStyleConfig(style.baseName, style, this._type);

         if (this._type === 'bar') {
            if (this._styleCompiled.linePathStyle)
               throw new Error('Для серии типа "bar" нельзя задавать свойство linePathStyle');

            if (this._styleCompiled.backPathStyle)
               throw new Error('Для серии типа "bar" нельзя задавать свойство backPathStyle');

            if (this._styleCompiled.pointStyle)
               throw new Error('Для серии типа "bar" нельзя задавать свойство pointStyle');

            ////////////////////////
            //Ширина столбика
            var val, valPercent, match;

            val = this._styleCompiled.barWidth;
            match = String(val).match(/(.+)%$/);

            if (match) { //проценты
               valPercent = parseFloat(String.trim(match[1]));
               val = undefined;
            }
            else {
               val = parseInt(String.trim(String(val)), 10);
               valPercent = undefined;
            }

            if ((isNaN(val) && isNaN(valPercent)) || (val <= 0 || valPercent <= 0))
               throw new Error('Задан неправильный формат ширины столбика: ' + this._styleCompiled.barWidth + '. Ширина должна задаваться либо в процентах, либо числом больше нуля.');

            this._styleCompiled.barWidth = val;
            this._styleCompiled.barWidthPercent = valPercent;

            //////////////////////////////////////////
            //Расстояние между столбиками в группе

            val = this._styleCompiled.interBarPadding;
            val = parseInt(String.trim(String(val)), 10);
            if (isNaN(val) || (val < 0))
               throw new Error('Задан неправильный формат столбика расстояния между столбиками в группе: ' + this._styleCompiled.interBarPadding + '. Тут должно быть целое число больше нуля.');

            this._styleCompiled.interBarPadding = val;
         } else if (this._type === 'line') {
            if (this._styleCompiled.barPathStyle)
               throw new Error('Для серии типа "line" нельзя задавать свойство barPathStyle');
         }

         //////////////////////////////////////////

         var dataField, fields;

         //настройка поля данных для оси X
         if ((dataField = cfg.axisXdataField)) {
            if (typeof dataField !== 'string')
               throw new Error('Параметр axisXdataField может быть только строчкой. Сложная конфигурация с группировкой столбиков возможна только для параметра axisYdataField для типа серии "bar"');

            this._axisX._addDataField(dataField);
         }

         fields = this._axisX.getDataFields();
         this._axisXdataField = cfg.axisXdataField || (fields.length === 1 ? fields[0] : undefined);
         if (!this._axisXdataField)
            throw new Error('Не задано поле данных по оси X для серии. Поле данных по умолчанию из оси X получить нельзя, поскольку там или не заданы поля данных, или их больше, чем одно');

         //настройка поля данных для оси Y
         function parseYdataField() {
            var axisY = self._axisY,
               axisYfields = axisY.getDataFields(),
               fields, stackFields, sumFields, i, j;

            function normalizeField(fieldDef) {
               if (typeof fieldDef === 'string')
                  fieldDef = {name: fieldDef};

               if (typeof fieldDef.name !== 'string')
                  throw new Error('Не задан параметр name у определения поля (он должен быть строкой): ' + JSON.stringify(fieldDef));

               if (fieldDef.style === undefined)
                  fieldDef.style = {};
               else if (typeof fieldDef.style === 'string') {
                  fieldDef.style = {baseName: fieldDef.style};
               }

               var base = fieldDef.style.baseName || self._styleCompiled;
               fieldDef.style = chart._getSerieStyleConfig(base, fieldDef.style, self._type);

               //Для отдельных столбиков не задаётся ничего, кроме стиля отрисовки столбика и линии в легенде
               for (var f in fieldDef.style) {
                  if (!fieldDef.style.hasOwnProperty(f))
                     continue;

                  if (f !== 'barPathStyle' && f !== 'legendPathStyle')
                     delete fieldDef.style[f];
               }

               return fieldDef;
            }

            dataField = (cfg.axisYdataField || cfg.axisYdataFields);
            if (dataField) {
               if (typeof dataField !== 'string' && self._type !== 'bar')
                  throw new Error('Параметр axisYdataField для серии с типом "line" может быть только строчкой. ' +
                                  'Сложная конфигурация с группировкой столбиков возможна только для типа серии "bar"');
            }
            else
               dataField = (axisYfields.length === 1 ? axisYfields[0] : undefined);

            fields = self._axisYdataField = ensureArray(dataField);
            for (i in fields) {
               if (!fields.hasOwnProperty(i))
                  continue;

               if (fields[i].stack === undefined) {
                  fields[i] = normalizeField(fields[i]);
                  axisY._addDataField(fields[i].name);
               }
               else {
                  stackFields = fields[i].stack;
                  if (!(stackFields instanceof Array))
                     throw new Error('Значение параметра stack должно быть массивом');

                  sumFields = [];
                  for (j in stackFields) {
                     if (!stackFields.hasOwnProperty(j))
                        continue;

                     stackFields[j] = normalizeField(stackFields[j]);
                     sumFields.push(stackFields[j].name);
                  }

                  axisY._addDataField({sum: sumFields, axis: self._axisX});
               }
            }

            if (self._axisYdataField.length === 0)
               throw new Error('Не заданы настройки поля (полей) данных по оси Y для серии. ' +
                               'Поле данных по умолчанию из оси Y получить нельзя, поскольку там или не заданы поля данных, или их больше, чем одно');
         }

         parseYdataField();

         this._axisX._addSerieToZone(this, this._axisXZone);
         this._axisY._addSerieToZone(this, this._axisYZone);
      },

      _clearDraw: function() {
         var inherited = ChartLineSerie.superclass._clearDraw;
         inherited.call(this);

         this._drawElements.points = [];
         this._drawElements.bars = [];
         this._drawElements.labels = [];
         this._drawElements.line = null;
         this._drawElements.back = null;
      },

      _getSerieBounds: function() {
         var axisXZoneIdx = this._axisXZone,
             axisXZone = this._axisX._getVisibleSerieZone(axisXZoneIdx),
             axisYZoneIdx = this._axisYZone,
             axisYZone = this._axisY._getVisibleSerieZone(axisYZoneIdx),
             boundsX = normalizeBounds(axisXZone._getGridDrawBounds()),
             boundsY = normalizeBounds(axisYZone._getGridDrawBounds()),
             left = Math.max(boundsX.left, boundsY.left),
             right = Math.min(boundsX.right, boundsY.right),
             top = Math.max(boundsX.top, boundsY.top),
             bottom = Math.min(boundsX.bottom, boundsY.bottom);

         return { left: left, right: right, top: top, bottom: bottom,
                  width: right - left, height: bottom - top};
      },

      _getLayout: function() {
         var self = this;

         function normalizePointLabel(label) {
            function normalizePointVal(val) {
               if (isSimpleValue(val) || isArray(val)) {
                  val = {top: val};
               }

               forEach(['top', 'underTop', 'underTopHint', 'left', 'right'], function(name) {
                  if (val[name]) {
                     var i, ln, sideLabels = val[name],
                         padding = parseInt(sideLabels.padding, 10) || ChartGraphConst.defaultSerieLabelBlock.padding,
                         v = ensureArray('labels' in sideLabels ? sideLabels.labels : sideLabels);

                     for (i = 0, ln = v.length; i !== ln; i++) {
                        if (isSimpleValue(v[i]))
                           v[i] = {value: v[i]};

                        if (!v[i].style) {
                           v[i].style = ChartGraphConst.defaultSerieLabelStyle;
                        }
                        else {
                           if (typeof v[i].style === 'string')
                              v[i].style = self._chart._getSerieLabelsStyleConfig(v[i].style);
                           else
                              v[i].style = self._chart._getSerieLabelsStyleConfig(v[i].style.baseName, v[i].style);
                        }
                     }
                     val[name] = {labels: v, padding: padding};
                  } else {
                     val[name] = {labels: [], padding: 0};
                  }
               });

               return val;
            }

            return map(ensureArray(label), function(labelObj) {
               return {stack: map(labelObj.stack || [labelObj], normalizePointVal)};
            });
         }

         if (!this._validState.pointLabels) {
            var pointLabels = this._notify('onCustomGenerateSerieLabels', this._chart._chartData) || [];
            this._layout.pointLabels = map(pointLabels, normalizePointLabel, this);
            this._validState.pointLabels = true;
         }

         if (!this._validState.extraMargin) {
            var bounds = normalizeBounds(this._getSerieBounds()),
                drawer = this._draw();

            if (drawer) {
               drawer('labelsPrepare');
               this._layout.extraMargin = reduce(this._drawElements.labels, function(margin, label) {
                  var elBox = label.elBox;
                  margin.left = Math.max(margin.left, bounds.left - elBox.x);
                  margin.top = Math.max(margin.top, bounds.top - elBox.y );
                  margin.right = Math.max(margin.right, elBox.x2 - bounds.right);
                  margin.bottom = Math.max(margin.bottom, elBox.y2 - bounds.bottom);

                  return margin;
               }, {left: 0, top: 0, right: 0, bottom: 0});

               this._clearDraw();//TODO: оптимизировать
            }
            this._validState.extraMargin = true;
         }

         return this._layout;
      },

      _getExtraMargin: function() {
         return this._getLayout().extraMargin;
      },

      _draw: function() {
         if (!this.getVisible())
            return undefined;

         var self = this,
            canvas = this._chart.getCanvas(),
            axisX = this._axisX,
            axisY = this._axisY,
            axisXZoneIdx = this._axisXZone,
            axisYZoneIdx = this._axisYZone,
            axisXZone = this._axisX._getVisibleSerieZone(axisXZoneIdx),
            axisYZone = this._axisY._getVisibleSerieZone(axisYZoneIdx),
            fieldX = this._axisXdataField,
            fieldsY = this._axisYdataField,
            dataX = axisX._getDataIntf(),
            dataY = axisY._getDataIntf(),
            getXFn = axisX._getAxisPosFromValueFunc(axisXZoneIdx),
            getYFn = axisY._getAxisPosFromValueFunc(axisYZoneIdx),
            formatterX = axisX.getDataFormat(),
            formatterY = axisY.getDataFormat(),
            gridLineMapFnX = axisX._getAxisInternalGridLineMapFn(axisXZoneIdx, axisYZone, axisYZoneIdx),
            selfTop = Number(axisYZone._getGridDrawBounds().top),
            selfLeft = Number(axisXZone._getGridDrawBounds().left),
            style = this._styleCompiled,
            points = [], pointProps = [], pointByXIndexes,
            pointXStart = {x: undefined, y: undefined},
            pointXEnd = {x: undefined, y: undefined},
            barWidthMin = ChartGraphConst.defaultSerieStyle.bar.barWidthMin,
            axisHorz = true,
            pointLabels = this._layout.pointLabels || [],
            drawUtils;

         var getCanvasBounds = function() {
            var canvasEl = $(canvas.canvas).parent(),
                chartOffset = canvasEl.offset(),
                canvasBounds = {left: chartOffset.left, top: chartOffset.top,
                                width: canvasEl.width(), height: canvasEl.height()};

            getCanvasBounds = function() { return canvasBounds; };
            return canvasBounds;
         };

         function preparePoints() {
            var i, j, k, xVal, yVal, yValF, yVals, pXY, fieldY,
               yValStack, pXYstack, dataFieldsYstack, stylesStack,
               dataFieldsY, dataLabelsY, stackFields, styles, internals, dataLn, ln2, ln3,
               boundParams = axisX._getBoundAxisParams(),
               axisXVal, yValUp, yValDown, positiveStart, posInsert, isPositive;

            function valToPoint(xVal, yVal) {
               var dx = getXFn(xVal), dy = getYFn(yVal),
                   yf = selfTop + dx.y + dy.y,
                   xf = selfLeft + dx.x + dy.x;
               return {x: xf, y: yf, xf: xf, yf: yf};
            }

            dataLn = Math.min(dataX.getCount(), dataY.getCount());

            axisXVal = formatterY.isBadValue(boundParams.value) ? formatterY.zeroValue : boundParams.value;

            for (i = 0; i < dataLn; i++) {
               xVal = dataX.getFieldValue(i, fieldX);
               yVals = [];
               pXY = [];
               dataFieldsY = [];
               dataLabelsY = [];
               styles = [];
               internals = null;

               for (j = 0, ln2 = fieldsY.length; j !== ln2; j++) {
                  fieldY = fieldsY[j];
                  if (fieldY.stack) {
                     yValStack = [];
                     pXYstack = [];
                     dataFieldsYstack = [];
                     stylesStack = [];
                     yValUp = axisXVal;
                     yValDown = axisXVal;
                     positiveStart = -1;

                     stackFields = fieldY.stack;
                     for (k = 0, ln3 = stackFields.length; k !== ln3; k++) {
                        yValF = dataY.getFieldValue(i, stackFields[k].name);
                        if (!formatterY.isBadValue(yValF)) {
                           isPositive = (formatterY.compare(yValF, formatterY.zeroValue) >= 0);
                           if (isPositive) {
                              yVal = yValUp = formatterY.add(yValUp, yValF);
                              posInsert = yValStack.length;
                           }
                           else {
                              yVal = yValDown = formatterY.add(yValDown, yValF);
                              positiveStart++;
                              posInsert = positiveStart;
                           }

                           yValStack.splice(posInsert, 0, yValF);
                           pXYstack.splice(posInsert, 0, valToPoint(xVal, yVal));

                           dataFieldsYstack.splice(posInsert, 0, stackFields[k].name);
                           stylesStack.splice(posInsert, 0, stackFields[k].style);
                        }
                     }

                     if (yValStack.length > 0) {
                        yVals.push(yValStack);
                        pXY.push(pXYstack);

                        dataFieldsY.push(dataFieldsYstack);
                        styles.push(stylesStack);
                     }
                  } else {
                     yVal = dataY.getFieldValue(i, fieldY.name);

                     if (!formatterY.isBadValue(yVal)) {
                        yVals.push(yVal);
                        pXY.push(valToPoint(xVal, yVal));

                        dataFieldsY.push(fieldY.name);
                        styles.push(fieldY.style);
                     }
                  }
               }

               if (formatterX.isBadValue(xVal) || yVals.length === 0)
                  continue;

               points.push(pXY);
               pointProps.push({point: pXY, dataPoint: {x: xVal, y: yVals},
                                dataFields: {x: fieldX, y: dataFieldsY},
                                internal: internals, style: styles});
            }

            //Точка начала обоих осей (для столбиков потом пригодится)
            var rangeX = axisX.getDataRangeCalc(),
                rangeY = axisY.getDataRangeCalc();

            pointXStart = valToPoint(rangeX.min, rangeY.max);
            pointXEnd = valToPoint(rangeX.max, rangeY.max);
         }

         function getBarPointSortedIndex(i) {
            pointByXIndexes = new Array(points.length);
            for (var j = 0; j < points.length; j++)
               pointByXIndexes[j] = j;

            pointByXIndexes.sort(function(i1, i2) { return points[i1][0].x - points[i2][0].x; });

            getBarPointSortedIndex = function(i) { return pointByXIndexes[i]; };
            return pointByXIndexes[i];
         }

         preparePoints();

         if (points.length > 0) {
            axisHorz = (points[0].x === gridLineMapFnX(points[0]).x);
         }

         function closePathToXAxis(path, points) {
            if (points.length < 2)
               return path;

            var ps = points[0][0],
               pe = points[points.length - 1][0],
               axisPs = gridLineMapFnX(ps),
               axisPe = gridLineMapFnX(pe);

            path = ['M', axisPs.x, axisPs.y, 'L', ps.x, ps.y].concat(path, 'L', axisPe.x, axisPe.y, 'L', axisPs.x, axisPs.y);
            return path;
         }

         function pointsToLinePath(points, isBackPath) {
            if (points.length < 2)
               return null;

            var i, path = ['M', Math.round(points[0][0].x), Math.round(points[0][0].y)];
            for (i = 1; i < points.length; i++)
               path = path.concat(['L', Math.round(points[i][0].x), Math.round(points[i][0].y)]);

            if (isBackPath)
               path = closePathToXAxis(path, points);

            return canvas.path(path);
         }

         function pointsToBeizerPath(points, isBackPath) {
            if (points.length < 3)
               return null;

            var path = ['M', points[0][0].x, points[0][0].y, 'C'],
               x0, x, y0, y, w, i;

            for (i = 1; i < points.length; i++) {
               x0 = points[i - 1][0].x;
               x = points[i][0].x;
               y0 = points[i - 1][0].y;
               y = points[i][0].y;

               w = (x - x0) * 0.5;

               path = path.concat([x0 + w, y0, x - w, y, x, y]);
            }

            if (isBackPath)
               path = closePathToXAxis(path, points);

            return canvas.path(path);
         }

         var pointElementFuncs = {
            circle: function(p, elementStyle) {
               return canvas.circle(p.x, p.y, elementStyle.r).attr(elementStyle);
            }
         };

         function barPathFnCreate(pathDrawFnHorz, pathDrawFnVert) {
            var minH = 3;

            if (axisHorz)
               return function(point, pointProp, axisP, barWidthX, barWidthY, allWidthX, allWidthY, style, idx) {
                  var i, j, k, ln, ln2, stack, startX, pPrev, p, yDiff,
                      yValStack, yFieldStack, styleStack, dataPoint, dataFields,
                      obj, result = [], stackEls, dir, dirPrev, points;

                  startX = axisP.x - (allWidthX / 2);

                  for (i = 0, ln = point.length; i !== ln; i++) {
                     stack = ensureArray(point[i]);
                     yValStack = ensureArray(pointProp.dataPoint.y[i]);
                     yFieldStack = ensureArray(pointProp.dataFields.y[i]);
                     styleStack = ensureArray(pointProp.style[i]);

                     stackEls = [];
                     pPrev = axisP;
                     dirPrev = null;

                     for (j = 0, ln2 = stack.length; j !== ln2; j++) {
                        p = stack[j];
                        dir = p.yf <= pPrev.yf ? 1 : -1;//TODO: учесть для перевёрнутых Y-осей

                        if (dirPrev !== null && dir !== dirPrev) {
                           dirPrev = null;
                           pPrev = axisP;
                           j--;
                           continue;
                        }

                        if ((pPrev.yf - p.yf) * dir < minH) { //TODO: для axisHorz, и придумать, как соотнести это с точками и линиями
                           yDiff = p.yf - (pPrev.y - minH * dir);

                           for (k = j; k !== ln2; k++) {
                              stack[k].yf -= yDiff;
                              stack[k].y = stack[k].yf;
                           }
                        }

                        points = [{x: startX, y: pPrev.y}, {x: startX, y: p.y, yf: p.yf},
                                  {x: startX + barWidthX, y: p.y}, {x: startX + barWidthX, y: pPrev.y}];

                        obj = pathDrawFnHorz(idx, i, j, styleStack[j], points);

                        if (obj !== null) {
                           dataPoint = {x: pointProp.dataPoint.x, y: yValStack[j]};
                           dataFields = {x: pointProp.dataFields.x, y: yFieldStack[j]};

                           obj.dataPoint = dataPoint;
                           obj.dataFields = dataFields;
                           obj.style = styleStack[j];
                           obj.groupIdx = i;
                           obj.stackIdx = j;
                           obj.barWidth = barWidthX;
                           obj.dir = dir;

                           stackEls.push(obj);
                        }
                        pPrev = p;
                        dirPrev = dir;
                     }

                     result = result.concat(stackEls);
                     startX += (barWidthX + style.interBarPadding);
                  }

                  return result;
               };
            else
               return function(point, pointProp, axisP, barWidthX, barWidthY, allWidthX, allWidthY, style, idx) {
                  var i, j, ln, ln2, stack, startY, pPrev, p,
                      yValStack, yFieldStack, styleStack, dataPoint, dataFields,
                      obj, result = [], stackEls, dir, dirPrev, points;

                  startY = axisP.y - (allWidthY / 2);

                  for (i = 0, ln = point.length; i !== ln; i++) {
                     stack = ensureArray(point[i]);
                     yValStack = ensureArray(pointProp.dataPoint.y[i]);
                     yFieldStack = ensureArray(pointProp.dataFields.y[i]);
                     styleStack = ensureArray(pointProp.style[i]);

                     pPrev = axisP;
                     stackEls = [];
                     dirPrev = null;

                     for (j = 0, ln2 = stack.length; j !== ln2; j++) {
                        p = stack[j];
                        dir = p.xf >= pPrev.xf ? 1 : -1;

                        if (dirPrev !== null && dir !== dirPrev) {
                           dirPrev = null;
                           pPrev = axisP;
                           j--;
                           continue;
                        }

                        points = [{x: pPrev.x, y: startY}, {x: p.x, xf: p.xf, y: startY}, {x: p.x, y: startY + barWidthY}, {x: pPrev.x, y: startY + barWidthY}];

                        obj = pathDrawFnVert(idx, i, j, styleStack[j], points);

                        if (obj !== null) {
                           dataPoint = {x: pointProp.dataPoint.x, y: yValStack[j]};
                           dataFields = {x: pointProp.dataFields.x, y: yFieldStack[j]};

                           obj.dataPoint = dataPoint;
                           obj.dataFields = dataFields;
                           obj.style = styleStack[j];
                           obj.groupIdx = i;
                           obj.stackIdx = j;
                           obj.barWidth = barWidthX;
                           obj.dir = 1;//TODO: сделать реализацию для горизонтальных столбиков

                           stackEls.push(obj);
                        }

                        pPrev = p;
                        dirPrev = dir;
                     }

                     result = result.concat(stackEls);
                     startY += (barWidthY + style.interBarPadding);
                  }
                  return result;
               };
         }

         function barDrawFunc(idx, groupIdx, stackIdx, barStyle, points) {
            var path = ['M', points[0].x, points[0].y, 'L', points[1].x, points[1].y,
                        'L', points[2].x, points[2].y, 'L', points[3].x, points[3].y],
                el = canvas.path(path),
                barPathStyle = barStyle.barPathStyle;

            el.attr(barPathStyle[idx] || barPathStyle[0] || barPathStyle);

            return {el: el, style: barStyle};
         }

         function labelStackProcess(idx, groupIdx, stackEls) {
            var elMinDim = 20;

            function getSpans(stackEls, dim) {
               var result = reduce(stackEls, function(result, stackEl, idx) {
                  var last, lastIdx = result.length - 1, dimVal = stackEl.bounds[dim];
                  if (lastIdx < 0 || dimVal > elMinDim)
                     result.push({cnt: 1, start: idx, ids: [idx], barEl: stackEl.barEl, overIds: stackEl.overflow ? [idx] : []});
                  else {
                     last = result[lastIdx];
                     last.cnt += 1;
                     if (stackEl.overflow)
                        last.overIds.push(idx);
                     last.ids.push(idx);
                  }

                  return result;
               }, []);

               return filter(result, function(res) { return res.overIds.length > 0; });
            }

            function showHint(id, span) {
               var legendProps = self._getLegendProps(true);

               function getLegendProp(groupIdx, stackIdx) {
                  groupIdx = parseInt(groupIdx, 10);
                  stackIdx = parseInt(stackIdx, 10);

                  return $ws.helpers.find(legendProps, function(prop) {
                     return prop.groupIdx === groupIdx && prop.stackIdx === stackIdx;
                  });
               }

               var hintRows = reduce(span.ids, function(memo, id) {
                  function labelsConvert(memo, labelName) {
                     var labels = labelInStack && labelInStack[labelName] && labelInStack[labelName].labels;
                     if (labels) {
                        return reduce(labels, function(memo, label) {

                           var style = label.style;
                           if (style && style.showInHint) {
                              var
                                  textStyle = style && style.textStyle,
                                  text = label.value,
                                  tr = '<tr><td></td><td><span style="{style}">{text}</td></tr>'.
                                       replace('{text}', removeBr(text)).replace('{style}', textStyleToCss(textStyle));

                              memo.push(tr);
                           }

                           return memo;
                        }, memo);
                     } else {
                        return memo;
                     }
                  }

                  var stackIdx = id,
                      pointLabel = pointLabels[idx] || [],
                      labelStack = (pointLabel[groupIdx] || {}).stack || [],
                      labelInStack = labelStack[stackIdx] || {},
                      labelRows = reduce(['top', 'underTop'], labelsConvert, []),
                      legendProp = getLegendProp(groupIdx, stackIdx),
                      legendTr = '<tr><td><div style="width: 15px; height: 15px; margin-right: 10px; background-color: {legendColor}"></div></td><td>{legendDescr}</td></tr>'.
                                  replace('{legendColor}', legendProp.style.stroke).
                                  replace('{legendDescr}', removeBr(legendProp.description)),
                      separatorTr = '<tr><td colspan="2"><div style="position: relative; width: 100%; border-top: 1px dashed rgb(176, 176, 176); margin: 3px 0;"></div></td></tr>';

                  return memo.concat(legendTr, labelRows, separatorTr);
               }, []);

               var hintHtml = '<table style="width: 100%"><colgroup><col width="25"/><col /></colgroup>' +
                               hintRows.slice(0, hintRows.length - 1).join('') +
                              '</table>';

               var lastEl = stackEls[id].barEl.node;
               $ws.single.Infobox.show(lastEl, hintHtml);
            }

            function createHints(spans, single) {
               forEach(spans, function(span) {
                  var overIdsLn = span.overIds.length;
                  if (overIdsLn > 0 && ((overIdsLn === 1) === single)) {
                     var hintData = {},
                         clearShowTimeout = function() {
                            if (hintData.__lastMouseMove) {
                               clearTimeout(hintData.__lastMouseMove);
                               hintData.__lastMouseMove = null;
                            }
                         };

                     var onMouseMove = function(id) {
                        clearShowTimeout();
                        hintData.__lastMouseMove = setTimeout(function() {
                           hintData.__lastMouseMove = null;
                           showHint(id, span);
                        }, 200);
                     },
                     onMouseOut = function() {
                        clearShowTimeout();
                        $ws.single.Infobox.hide();
                     };

                     forEach(span.ids, function(id) {
                        var el = stackEls[id].el,
                            barEl = stackEls[id].barEl;

                        el.mousemove(onMouseMove.bind(undefined, id));
                        el.mouseout(onMouseOut);
                        el.attr({cursor: 'pointer'});

                        barEl.mousemove(onMouseMove.bind(undefined, id));
                        barEl.mouseout(onMouseOut);
                        barEl.attr({cursor: 'pointer'});
                     });
                  }
               });
            }

            var spans = getSpans(stackEls, 'height');

            createHints(spans, true);
            createHints(spans, false);

            return [];
         }

         function labelDrawFunc(idx, groupIdx, stackIdx, barStyle, points) {
            var bounds = {left: Math.min(points[0].x, points[1].x, points[2].x, points[3].x),
                          right: Math.max(points[0].x, points[1].x, points[2].x, points[3].x),
                          top: Math.min(points[0].y, points[1].y, points[2].y, points[3].y),
                          bottom: Math.max(points[0].y, points[1].y, points[2].y, points[3].y)},
                pointLabel = pointLabels[idx] || [],
                labelStack = (pointLabel[groupIdx] || {}).stack || [],
                labelInStack = labelStack[stackIdx] || {},
                halfW, x0, y0, res, canClip,
                setBox = {x: bounds.left, y: bounds.top, x2: bounds.right, y2: bounds.bottom, width: 0, height: 0},
                dir = points[1].yf <= (points[0].yf || points[0].y) ? 1 : -1,
                haveOverflow = false,
                minHeight = 5, dotsMinH = 8, dotsWidth = 12,
                dummyBatchCfg = {labels: [], badding: 0};

            bounds.width = bounds.right - bounds.left;
            bounds.height = bounds.bottom - bounds.top;

            halfW = bounds.width / 2;
            canClip = bounds.width !== 0;

            function extendSetBox(x, y, width, height) {
               setBox.x = Math.min(x, setBox.x);
               setBox.x2 = Math.max(x + width, setBox.x2);
               setBox.y = Math.min(y, setBox.y);
               setBox.y2 = Math.max(y + height, setBox.y2);
            }

            function drawBatch(batchCfg, x, y, dx, dy, rotate, doClip) {
               var i, labelIdx, ln, el, elBox, label, style, xOver, yOver, yOverCnt, halfH, halfW, yDiff,
                   newText, y0, overflowStyle, notDotsCnt = 0, allDots = [], yStart = y,
                   batch = batchCfg.labels, batchPadding = batchCfg.padding;

               function drawDots(x, y, style) {
                  var centerY = y + (dotsMinH * dir) / 2, dots;

                  if (centerY < bounds.bottom && centerY > bounds.top) {
                     dots = canvas.path('M' + (x + 1 - dotsWidth / 2) + ',' + centerY + 'L' + (x + 1 + dotsWidth / 2) + ',' + centerY).attr(style);
                     allDots.push(dots);
                  }

                  halfH = dotsMinH / 2;
                  return centerY;
               }

               function calkTextVars(moveCenter, isLast) {
                  var step, yDiffAdd = isLast ? 0 : dotsMinH;

                  y = y0;
                  elBox = el.getBBox();
                  halfH = elBox.height / 2;
                  halfW = elBox.width / 2;
                  step = moveCenter ? halfH : 0;
                  y = y + dy * step;

                  xOver = doClip && (elBox.width > bounds.width);
                  yDiff = dir === 1 ? bounds.bottom - (y - halfH) : (y + halfH) - bounds.top;
                  yOver = doClip && (yDiff < (elBox.height + yDiffAdd));
               }

               function removeElDrawDots() {
                  y = y0;
                  halfH = 0;
                  el.remove();
                  if (ln > 1) {
                     y = drawDots(x, y0, overflowStyle);
                  }
               }

               y = y + (dy * batchPadding);
               yOverCnt = 0;
               for (i = 0, ln = batch.length; i !== ln && yOverCnt === 0; i++) {
                  labelIdx = dy === 1 ? i : ln - i - 1;
                  label = batch[labelIdx];

                  if (label.style && !label.style.showInDiagram)
                     continue;

                  style = label.style && label.style.textStyle;
                  overflowStyle = label.style && label.style.overflowStyle;
                  if (style && style.fill)
                     overflowStyle.stroke = style.fill;

                  el = canvas.text(x, y, label.value);
                  if (style)
                     el.attr(style);

                  y0 = y;
                  calkTextVars(true, i === ln - 1);

                  if (xOver || yOver) {
                     haveOverflow = true;

                     if (yOver)
                        yOverCnt++;

                     if (yDiff >= minHeight) {
                        if (xOver) {
                           removeElDrawDots();
                        } else {
                           newText = label.value.split('\n');

                           while (newText.length > 0) {
                              newText = newText.slice(0, newText.length - 1);
                              if (newText.length > 0) {
                                 el.attr({text: newText.join('\n')});
                                 calkTextVars(true);

                                 if (yDiff >= (elBox.height + dotsMinH))
                                    break;
                              }
                           }

                           newText = newText.join('\n');

                           if (newText) {
                              notDotsCnt++;
                              el.attr({x: x, y: y});
                              y = drawDots(x, y + halfH, overflowStyle);
                           }
                           else {
                              removeElDrawDots();
                           }
                        }
                     }
                     else {
                        y = y0;
                        halfH = 0;
                        el.remove();
                     }
                  } else {
                     notDotsCnt++;
                     el.attr({x: x, y: y});
                     extendSetBox(x - halfW, y - halfH, elBox.width, elBox.height);
                  }
                  y = y + dy * halfH;
               }

               if (notDotsCnt === 0) {
                  forEach(allDots, function(dot) { dot.remove(); });
                  y = yStart;
               }

               return y;
            }

            function drawLeftRightBatch(batchCfg, x, y, dx) {
               var i, ln, label, el, elBox, padding = 2,
                   batch = batchCfg.labels, batchPadding = batchCfg.padding, halfW, halfH;

               x = x + dx * batchPadding;
               for (i = 0, ln = batch.length; i !== ln; i++) {
                  label = batch[i];
                  style = label.style && label.style.textStyle;

                  x += (dx * padding);

                  el = canvas.text(x, y, label.value);
                  if (style)
                     el.attr(style);
                  elBox = el.getBBox();
                  halfW = elBox.width / 2;
                  halfH = elBox.height / 2;
                  el.attr({x: x + dx * halfW});

                  extendSetBox(x + (dx * halfW * 2), y - halfH, elBox.width, elBox.height);

                  x = x + dx * elBox.width;
               }
            }

            canvas.setStart();

            if (axisHorz) {
               x0 = bounds.left + halfW;
               y0 = dir === 1 ? bounds.top : bounds.bottom;

               drawBatch(labelInStack.top || dummyBatchCfg, x0, y0, 0, -dir, null, false);
               drawBatch(labelInStack.underTop || dummyBatchCfg, x0, y0, 0, dir, null, canClip);

               drawLeftRightBatch(labelInStack.left || dummyBatchCfg, setBox.x, y0, -1);
               drawLeftRightBatch(labelInStack.right || dummyBatchCfg, setBox.x2, y0, 1);
            }
            res = canvas.setFinish();

            setBox.width = setBox.x2 - setBox.x;
            setBox.height = setBox.y2 - setBox.y;

            return {el: res, elBox: setBox, bounds: bounds, overflow: haveOverflow};
         }

         var barPathFn = barPathFnCreate(barDrawFunc, barDrawFunc);
         var labelPathFn = barPathFnCreate(labelDrawFunc, labelDrawFunc);

         function pointBarsLabelsDraw(idx, style, elDrawFn) {
            var sortedIdx = getBarPointSortedIndex(idx),
               point = points[sortedIdx],
               pointProp = pointProps[sortedIdx],
               barWidthX, barWidthY,
               allBarWidthX, allBarWidthY, width,
               pointsLast = points.length - 1,
               pNext, pPrev, axisP, diffX1, diffX2, diffY1, diffY2;

            function calcWidth(diff1, diff2) {
               var allWidth = Math.max(Math.min(Math.abs(diff1), Math.abs(diff2)) * style.barWidthPercent / 100, barWidthMin);

               if (point.length > 1)
                  return [allWidth, (allWidth - (style.interBarPadding * (point.length - 1))) / point.length];
               else
                  return [allWidth, allWidth];
            }

            function getAxisP(point) {
               var p = (point[0] instanceof Array) ? point[0][0] : point[0];
               return gridLineMapFnX(p);
            }

            axisP = getAxisP(point);
            axisP.xf = axisP.x;
            axisP.yf = axisP.y;
            if (style.barWidthPercent !== undefined) {
               pNext = (sortedIdx < pointsLast) ? getAxisP(points[sortedIdx + 1]) : null;
               pPrev = (sortedIdx > 0) ? getAxisP(points[sortedIdx - 1]) : null;

               if (pNext === null && pPrev === null) {
                  diffX1 = diffX2 = pointXEnd.x - pointXStart.x;
                  diffY1 = diffY2 = pointXEnd.y - pointXStart.y;
               } else {
                  if (pNext === null) {
                     diffX1 = diffX2 = axisP.x - pPrev.x;
                     diffY1 = diffY2 = axisP.y - pPrev.y;
                  } else if (pPrev === null) {
                     diffX1 = diffX2 = pNext.x - axisP.x;
                     diffY1 = diffY2 = pNext.y - axisP.y;
                  } else {
                     diffX1 = axisP.x - pPrev.x;
                     diffX2 = pNext.x - axisP.x;
                     diffY1 = axisP.y - pPrev.y;
                     diffY2 = pNext.y - axisP.y;
                  }
               }

               width = calcWidth(diffX1, diffX2);
               allBarWidthX = width[0];
               barWidthX = width[1];

               width = calcWidth(diffY1, diffY2);
               allBarWidthY = width[0];
               barWidthY = width[1];
            } else {
               allBarWidthX = allBarWidthY = barWidthX = barWidthY = (style.barWidth || 0);
            }

            var res = ensureArray(elDrawFn(point, pointProp, axisP, barWidthX, barWidthY, allBarWidthX, allBarWidthY, style, idx));
            forEach(res, function(_res) { _res.idx = sortedIdx; });
            return res;
         }

         var pointPhaseGetMapFunc = {
            points: function(i, style) {
               var func, props, elStyle;

               if ((func = pointElementFuncs[style.element])) {
                  props = pointProps[i];
                  elStyle = style.elementStyle;

                  return {el: func(points[i][0], elStyle[i] || elStyle[0] || elStyle),
                          idx: i, style: style,
                          dataPoint: {x: props.dataPoint.x, y: props.dataPoint.y[0]},
                          dataFields: {x: props.dataFields.x, y: props.dataFields.y[0]}};
               }
               else
                  return undefined;
            },

            labels: function(idx, style) {
               return pointBarsLabelsDraw(idx, style, labelPathFn);
            },

            bars: function(idx, style) {
               return pointBarsLabelsDraw(idx, style, barPathFn);
            }
         };

         function forEachPoint(phase, style, isTemporary) {
            var phaseToNameMap = {points: 'point', bars: 'bar', labels: 'label'},
                pointFn = pointPhaseGetMapFunc[phase], name = phaseToNameMap[phase];

            return reduce(points, function(result, _, i) {
               var resProps = map(ensureArray(pointFn(i, style, isTemporary)), function(res) {
                  var result = {element: res.el, elBox: res.elBox};
                  if (!isTemporary) {
                     var props = {elements: {}, index: res.idx};

                     props.elements[name] = res.el;
                     props.dataPoint = res.dataPoint;
                     props.dataFields = res.dataFields;
                     props.style = res.style;
                     props.internal = res;

                     result.drawEventArgs = [name, props, canvas, drawUtils, res.el];
                  }
                  return result;
               });

               return result.concat(resProps);
            }, []);
         }

         var linePathFn = (style.smooth && points.length > 2) ? pointsToBeizerPath : pointsToLinePath;

         function drawLabelsPhase(isTemporary) {
            var labels;

            if (pointLabels.length > 0) {
               labels = forEachPoint('labels', style, isTemporary);
            } else {
               labels = [];
            }
            self._drawElements.labels = labels;
            return labels;
         }

         var phaseMap = {
            line:
               style.linePathStyle &&
                  function() {
                     var el = linePathFn(points, false);
                     if (el) {
                        el.attr(style.linePathStyle);

                        var drawEventArgs = [
                           'line',                   //аргумент elementType
                           {elements: {line: el},
                            style: style},           //аргумент elementData
                           canvas,                   //аргумент canvas
                           drawUtils                 //аргумент drawUtils
                        ];

                        self._drawElements.line = { drawEventArgs: drawEventArgs };
                        return [{element: el, drawEventArgs: drawEventArgs}];
                     }
                     else
                        return [];
                  },
            back:
               isGoodShapeStyle(style.backPathStyle) &&
                  function() {
                     var el = linePathFn(points, true);
                     if (el) {
                        el.attr(style.backPathStyle);

                        var drawEventArgs = ['back', {elements: {back: el}, style: style}, canvas, drawUtils];
                        self._drawElements.back = {drawEventArgs: drawEventArgs};
                        return [{element: el, drawEventArgs: drawEventArgs}];
                     }
                     else
                        return [];
                  },

            points: style.pointStyle &&
               function() {
                  var points = forEachPoint('points', style.pointStyle);
                  self._drawElements.points = points;
                  return points;
               },
            bars: style.barPathStyle &&
               function() {
                  var bars = forEachPoint('bars', style);
                  self._drawElements.bars = bars;
                  return bars;
               },

            labelsPrepare: drawLabelsPhase.bind(undefined, true),
            labels: drawLabelsPhase,

            labelBarHints: function() {
               var labelGroups = reduce(self._drawElements.labels, function(memo, label) {
                  var props = label.drawEventArgs[1],
                      idx = props.index,
                      groupIdx = props.internal.groupIdx,
                      stackIdx = props.internal.stackIdx,
                      groups = memo[idx], stack;

                  if (!groups)
                     groups = memo[idx] = {};

                  stack = groups[groupIdx];
                  if (!stack)
                     stack = groups[groupIdx] = {overflow: false, elements: {}};

                  stack.elements[stackIdx] = props;
                  stack.overflow = stack.overflow || props.internal.overflow;

                  return memo;
               }, {});

               forEach(self._drawElements.bars, function(bar) {
                  var props = bar.drawEventArgs[1],
                      idx = props.index,
                      groupIdx = props.internal.groupIdx,
                      stackIdx = props.internal.stackIdx;

                  var labelStack = labelGroups[idx] && labelGroups[idx][groupIdx];
                  if (labelStack && labelStack.overflow && labelStack.elements[stackIdx]) {
                     labelStack.elements[stackIdx].internal.barEl = props.elements.bar;
                  }
               });

               forEach(labelGroups, function(group, idx) {
                  forEach(group, function(stack, groupIdx) {
                     if (stack.overflow) {
                        var stackEls = map(stack.elements, function(props) {
                           return props.internal;
                        }).sort(function(el1, el2) { return el1.stackIdx - el2.stackIdx; }),
                        barWidth = stackEls[0].barWidth,
                        dir = stackEls[0].dir;

                        labelStackProcess(idx, groupIdx, stackEls, barWidth, dir);
                     }
                  });
               });
            },

            custom: self._customDrawFn.bind(self)
         };

         return function(phase) {
            var result;
            if (phaseMap[phase]) {
               result = phaseMap[phase]();
               forEach(ensureArray(result), function(el) {
                  self._registerElementsBindEvents([el.element], el.drawEventArgs);
               });
            }
            return result;
         };
      },

      /**
       * Отдаёт описание серии из стиля (поле style.description). Если style.description не установлено, отдаёт значение getDescription оси Y.
       */
      getDescription: function() {
         return this._styleCompiled.description;
      },

      getCompiledStyle: function() {
         return clone(this._styleCompiled);
      },

      _getLegendProps: function(forceAddAll) {
         var self = this, style = this._styleCompiled;
         function lineStyleFromFillStyle(fillStyle) {
            if (!fillStyle)
               return undefined;

            var stroke = fillStyle.fill || fillStyle.stroke;
            return extend(clone(fillStyle), {stroke: stroke});
         }

         function addFieldsProp(fieldProp, result, groupIdx, stackIdx) {
            var description, style, barPathStyle, pointStyle;

            description = fieldProp.description || self.getDescription();
            if (!forceAddAll && fieldProp.style.legendPathStyle === false)
               style = false;
            else {
               barPathStyle = fieldProp.style.barPathStyle;
               pointStyle = fieldProp.style.pointStyle;

               if (forceAddAll && !description)
               description = fieldProp.name;

               style = extend(fieldProp.style.linePathStyle ||
                              lineStyleFromFillStyle(barPathStyle[0] || barPathStyle ||
                                                     (pointStyle[0] && pointStyle[0].elementStyle) ||
                                                     (pointStyle && pointStyle.elementStyle)),
                              fieldProp.style.legendPathStyle || {});
            }

            if (description && style)
               result.push({description: description, style: style, groupIdx: groupIdx, stackIdx: stackIdx});
         }

         if (this._type === 'line') {
            if (!forceAddAll && style.legendPathStyle === false)
               return [];
            else  if (style.legendPathStyle)
               return [{description: this.getDescription(), style: style.legendPathStyle}];
            else
               return [{description: this.getDescription(),
                        style: style.linePathStyle || lineStyleFromFillStyle(style.pointStyle && style.pointStyle.elementStyle)}];
         }
         else if (this._type === 'bar') {
            var yFields = this._axisYdataField, result = [];

            forEach(yFields, function(yField, groupIdx) {
               if (yField.stack)
                  forEach(yField.stack, function(stackItem, stackIdx) { addFieldsProp(stackItem, result, groupIdx, stackIdx); });
               else
                  addFieldsProp(yField, result, groupIdx, 0);
            });
            return result;
         }
         else
            return [];
      },

      /**
       * Перебирает элементы серии. Этот метод позволяет обойти логические элементы серии: линию, площадь между линией и осью X, точки данных, столбики, получить соответствующие им графические элементы, и как-либо их изменить.
       * @param elementFunc Функция-обработчик элемента серии. Параметры функции такие же, как у обработчика события оси <b>onElementCustomDraw</b>
       * Подробнее см. документацию по событию диаграммы <b>onElementCustomDraw</b>
       */
      enumerateElements: function(elementFunc) {
         var drawElements = this._drawElements,
            elements = [drawElements.line, drawElements.back].
                        concat(drawElements.points || [],
                        drawElements.bars || []);

         forEach(elements, function(element) {
            if (element && element.drawEventArgs)
               elementFunc.apply(this, element.drawEventArgs);
         }, this);
      }
   });

   var ChartRangeArea = ChartBaseElement.extend({
      $protected: {
         _axisX: null,
         _axisXZone: null,
         _axisXParsedRange: null,
         _axisY: null,
         _axisYZone: null,
         _axisYParsedRange: null,
         _styleCompiled: null,
         _drawElements: {back: null, description: null},
         _drawBoundsInvalidateParts: ['ranges', 'drawing'],
         _validState: { ranges: false, drawing: false, permanentElements: false },
         _layout: {rangeX: null, rangeY: null, extraMargin: {left: 0, top: 0, right: 0, bottom: 0}, drawer: null},
         _sideCalc: null,
         _description: null
      },

      $constructor: function(cfg) {
         var chart = this._chart;

         if (!cfg.axisX)
            throw new Error('Не задана ось X для области');

         if (!cfg.axisY)
            throw new Error('Не задана ось Y для области');

         var zoneMsg = 'Номер зоны в оси для области должен быть числом >=0, задано же: ';
         this._axisXZone = (cfg.axisXZone !== undefined && AxisSeriesZone.parseZoneIdx(cfg.axisXZone, zoneMsg)) || null;
         this._axisYZone = (cfg.axisXZone !== undefined && AxisSeriesZone.parseZoneIdx(cfg.axisYZone, zoneMsg)) || null;

         this._axisX = chart.getAxis(cfg.axisX);
         if (!this._axisX)
            throw new Error('Задано имя несуществующей оси X для области: ' + cfg.axisX);

         this._axisY = chart.getAxis(cfg.axisY);
         if (!this._axisY)
            throw new Error('Задано имя несуществующей оси Y для области: ' + cfg.axisY);

         this._style = cfg.style || {};
         var style = (typeof this._style === 'string') ? {baseName: this._style} : this._style;

         this._description = cfg.description;

         var rangeX = cfg.rangeX || ChartGraphConst.defaultRangeArea.rangeX,
             rangeY = cfg.rangeY;

         this._axisXParsedRange = this._axisX._rangeParser.parseRangeLink(rangeX);
         this._axisYParsedRange = this._axisY._rangeParser.parseRangeLink(rangeY);

         var idxStartX = this._getStartZoneIdx(this._axisXZone),
             idxEndX = this._getEndZoneIdx(this._axisXZone, this._axisX),
             idxStartY = this._getStartZoneIdx(this._axisYZone),
             idxEndY = this._getEndZoneIdx(this._axisYZone, this._axisY);

         this._axisX._addRangeAreaToZones(this, idxStartX, idxEndX - idxStartX + 1, this._axisXParsedRange);
         this._axisY._addRangeAreaToZones(this, idxStartY, idxEndY - idxStartY + 1, this._axisYParsedRange);

         this._styleCompiled = chart._getRangeAreaStyleConfig(style.baseName, style);

         var side = this._styleCompiled.descriptionStyle.side,
             sidePosition = this._styleCompiled.descriptionStyle.sidePosition;

         this._descrSide = side;
         this._descrSideHV = ChartGraphConst.directionHV[ChartGraphConst.defaultDirectionForSide[side]];
         this._sideCalc = inBoundsBySideCalc(side, sidePosition,
                                             'Задан неправильный параметр side у области. ' + side + ' Он должен быть одним из вариантов: left/right/top/bottom.',
                                             'Задан неправильный параметр sidePosition у области. ' + sidePosition + ' Он должен быть одним из вариантов: start/center/end.');
      },

      _getStartZoneIdx: function(zoneIdx) {
         return zoneIdx !== null ? zoneIdx : 0;
      },

      _getEndZoneIdx: function(zoneIdx, axis) {
         return zoneIdx !== null ? zoneIdx : (axis._getVisibleSerieZonesCount() - 1);
      },

      _getLayout: function(parts) {
         var self = this;
         function createDrawer() {
            function getZonesRange(zoneIdx, ortZoneIdx, axis, ortZoneAxis) {
               ortZoneIdx = ortZoneIdx !== null ? ortZoneIdx : 0;

               var idxStart = self._getStartZoneIdx(zoneIdx),
                  idxEnd = self._getEndZoneIdx(zoneIdx, axis),
                  zoneStart = axis._getVisibleSerieZone(idxStart),
                  zoneEnd = axis._getVisibleSerieZone(idxEnd),
                  zoneStartTop = zoneStart._getGridDrawBounds().top,
                  zoneStartLeft = zoneStart._getGridDrawBounds().left,
                  zoneEndTop = zoneEnd._getGridDrawBounds().top,
                  zoneEndLeft = zoneEnd._getGridDrawBounds().left,

                  ortZone = ortZoneAxis._getVisibleSerieZone(ortZoneIdx),
                  startAxisPosFn = axis._getAxisPosFromValueFunc(idxStart),
                  startGridPosFn = axis._getAxisInternalGridLineMapFn(idxStart, ortZone, ortZoneIdx),
                  endAxisPosFn = axis._getAxisPosFromValueFunc(idxEnd),
                  endGridPosFn = axis._getAxisInternalGridLineMapFn(idxEnd, ortZone, ortZoneIdx),
                  startPosFn = function(val) {
                     var pt = startAxisPosFn(val); pt.x += zoneStartLeft; pt.y += zoneStartTop;
                     return startGridPosFn(pt);
                  },
                  endPosFn = function(val) {
                     var pt = endAxisPosFn(val); pt.x += zoneEndLeft; pt.y += zoneEndTop;
                     return endGridPosFn(pt);
                  };

               return { zoneStart: zoneStart, zoneEnd: zoneEnd, startPosFn: startPosFn, endPosFn: endPosFn, idxStart: idxStart, idxEnd: idxEnd};
            }

            function getCoordRange(zonesRange, dataRange) {
               var start = zonesRange.startPosFn(dataRange.min),
                  end = zonesRange.endPosFn(dataRange.max);

               return {
                  left: Math.min(start.x, end.x),
                  width: Math.abs(start.x - end.x),
                  top: Math.min(start.y, end.y),
                  height: Math.abs(start.y - end.y)
               }
            }

            var layout = self._layout,
               canvas = self._chart.getCanvas(),
               zonesRangeX = getZonesRange(self._axisXZone, self._axisYZone, self._axisX, self._axisY),
               zonesRangeY = getZonesRange(self._axisYZone, self._axisXZone, self._axisY, self._axisX),
               coordBoundsX = getCoordRange(zonesRangeX, layout.rangeX),
               coordBoundsY = getCoordRange(zonesRangeY, layout.rangeY),
               coordBounds = {left: Math.min(coordBoundsX.left, coordBoundsY.left),
                  top: Math.min(coordBoundsX.top, coordBoundsY.top),
                  width: Math.max(coordBoundsX.width, coordBoundsY.width),
                  height: Math.max(coordBoundsX.height, coordBoundsY.height)},
               style = self._styleCompiled,
               phasesMapPermanent = { descriptionPrepare: true },
               rotate = self._sideCalc.getSideRotate(),
               phasesMap = {
                  back: isGoodShapeStyle(style.backPathStyle) && function() {
                     var el = canvas.rect(coordBounds.left, coordBounds.top, coordBounds.width, coordBounds.height).attr(style.backPathStyle),
                        drawEventArgs = ['back', {elements: {back: el}, style: style}, canvas];

                     self._drawElements.back = {drawEventArgs: drawEventArgs};
                     return {element: el, drawEventArgs: drawEventArgs};
                  },

                  descriptionPrepare: self._description && style.descriptionStyle && function() {
                     var el = canvas.text(0, 0, self._description).attr(style.descriptionStyle.textStyle),
                        drawEventArgs = ['description', {elements: {description: el}, style: style}, canvas];

                     if (rotate) {
                        el.transform('r' + rotate);
                     }
                     el.__bbox = el.getBBox();
                     el.__pt0 = {x: 0, y: 0};

                     self._drawElements.description = {element: el, drawEventArgs: drawEventArgs};
                     return self._drawElements.description;
                  },

                  description: function() {
                     self._getLayout({permanentElements: true});

                     if (self._drawElements.description)
                     {
                        var el = self._drawElements.description.element,
                            pt0 = el.__pt0,
                            pt = self._sideCalc.getStartPoint(coordBounds),
                            w = el.__bbox.width, h = el.__bbox.height,
                            dpos;

                        el.__bbox.x = pt.x - w / 2;
                        el.__bbox.y = pt.y - h / 2;
                        el.__bbox.x2 = el.__bbox.x + w;
                        el.__bbox.y2 = el.__bbox.y + h;

                        dpos = self._sideCalc.getPositionElementOnSideDiff(el.__bbox, coordBounds, style.descriptionStyle.sidePadding || 0);

                        pt.x += dpos.x;
                        pt.y += dpos.y;

                        if (pt0.x !== pt.x || pt0.y !== pt.y) {
                           el.attr({x: pt.x, y: pt.y});
                           el.__pt0 = pt;
                        }
                     }
                  },

                  custom: self._customDrawFn.bind(self)
               };

            layout.coordBounds = coordBounds;

            return function(phase) {
               var result = phasesMap[phase] && phasesMap[phase](),
                  isPermanent = phasesMapPermanent[phase];
               if (result) {
                  forEach(ensureArray(result), function(el) {
                     self._registerElementsBindEvents([el.element], el.drawEventArgs, isPermanent);
                  });
               }
            };
         }

         function getRange(axis, rangeParsed) {
            var axisRangeCalk = axis.getDataRangeCalc();
            return axis._rangeParser.parsedRangeToDataRange(rangeParsed, axisRangeCalk, axisRangeCalk);
         }

         if (this._needValidatePart(parts, 'permanentElements')) {
            this._getLayout({ranges: true}).drawer('descriptionPrepare');
            this._validState.permanentElements = true;
         }

         if (this._needValidatePart(parts, 'ranges')) {
            this._layout.rangeX = getRange(this._axisX, this._axisXParsedRange);
            this._layout.rangeY = getRange(this._axisY, this._axisYParsedRange);

            this._layout.drawer = createDrawer();
            this._validState.ranges = true;
         }

         if (this._needValidatePart(parts, 'drawing')) {
            this._getLayout({ranges: true}).drawer('description');

            var margin = this._layout.extraMargin, range = this._axisYParsedRange;
            if (self._drawElements.description && (range[0].valuePercent === 0 || range[1].valuePercent === 100)) {
               var descrBox = self._drawElements.description.element.__bbox,
                   coordBounds = this._layout.coordBounds,
                   diffY = Math.max(0, descrBox.y2 - (coordBounds.top + coordBounds.height)) +
                           Math.max(0, coordBounds.top - descrBox.y);

               if (range[0].valuePercent === 0)
                  margin.bottom = diffY;
               else
                  margin.top = diffY;

            } else {
               margin.top = 0; margin.bottom = 0; margin.left = 0; margin.right = 0;
            }

            this._validState.drawing = true;
         }

         return this._layout;
      },

      _getExtraMargin: function() {
         return this._getLayout({drawing: true}).extraMargin;
      },

      _draw: function() {
         return this._getLayout({ranges: true}).drawer;
      }
   });

   /**
    * @class $ws.proto.RaphaelChartGraph
    * @extends $ws.proto.RaphaelAbstractGraph
    * @control
    * @category Content
    *
    * @cfgOld {Object} style Объект, описывающий стиль рамок и поля диаграммы
    * @cfgOld {Object|Boolean} style.gridFrame Объект, описывающий стиль внутренней рамки диаграммы (той, вокруг которой строятся оси, а внутри лежат серии (графики)). При значении <b>false</b> рамка не рисуется.
    * @cfgOld {Object} style.gridFrame.pathStyle Рафаэлевские атрибуты внутренней рамки: см. <a href="http://raphaeljs.com/reference.html#Element.attr">Element.attr</a>

    * @cfgOld {Object|Boolean} style.chartFrame Объект, описывающий стиль внешней рамки диаграммы (внутри которой лежат оси и серии (графики)). При значении <b>false</b> рамка не рисуется.
    * @cfgOld {Object} style.chartFrame.pathStyle Рафаэлевские атрибуты внутренней рамки: см. <a href="http://raphaeljs.com/reference.html#Element.attr">Element.attr</a>

    * @cfgOld {Array} data Массив с данными диаграммы
    *
    * @cfgOld {String} axisStyles Коллекция именованных стилей для осей. Имена (ключи в объекте axisStyles) тут могут быть любые.
    * На них потом можно ссылаться в настройках стиля оси через св-во baseName или через строковое значение стиля оси.
    * Пример:
    <pre>
    axisStyles: {
      sample: {
         pathStyle: { //рафаэлевские атрибуты линии
            stroke: 'yellow' //цвет линии
            arrow-end: 'classic' //стрелку включили
            //.... другие атрибуты линии ... (http://raphaeljs.com/reference.html#Element.attr) ...
         },
         width: 50 //ширина оси
      }
   }</pre>
    * @cfgOld {Object} axisStyles.someStyle.pathStyle Рафаэлевские атрибуты линии оси : см. <a href="http://raphaeljs.com/reference.html#Element.attr">Element.attr</a>
    * Пример см. в параметре <b>axisStyles</b>
    * @cfgOld {Object} axisStyles.someStyle.width Ширина оси, в пикселях. Пример см. в параметре <b>axisStyles</b>
    * @cfgOld {Object} axisStyles.someStyle.showDescription. Параметр включает отображение подписи к оси
    * @cfgOld {Object} axisStyles.someStyle.descriptionTextStyle. Стиль текста подписи к оси (формат см. в справке по атрибутам рафаэлевского элемента <a href="http://raphaeljs.com/reference.html#Element.attr">Element.attr</a>)
    *
    * @cfgOld {Array} axes Конфигурация осей. Каждый элемент массива - определение для какой-то оси.
    * @cfgOld {String} axes[].name - Имя оси. Оно нужно для доступа к оси через API и из других секций конфига.
    * @cfgOld {String} axes[].description - Описание оси. Оно нужно для показа подписи к оси.
    *
    * @cfgOld {String|Object} axes[].style Визуальный стиль оси. Если указан параметр <b>style.baseName</b>, или параметр <b>style</b> имеет такой вид: <i>style = 'horizontal'</i>,
    * то этот стиль наследует свойства именованного стиля из параметра <b>axisStyles</b>, при этом, если заданы собственные параметры стиля, то они перекрывают унаследованные.
    * Формат стиля подробно описан в комментариях к параметру диаграммы <b>axisStyles</b>.
    *
    * @cfgOld {Boolean} axes[].visible  Видимость оси. Ось может быть невидимой, но при этом она будет ассоциирована с той или иной стороной диаграммы,
    * а значит, сможет отображать точки данных в пиксельные координаты на диаграмме, и к ней можно привязывать серии и другие оси так же, как и к видимой оси.
    *
    * @cfgOld {String} axes[].dataFormat Формат данных оси.
    <b>category</b> - это текстовые данные, численными значениями которых являются их индексы в массиве данных, а текстовыми (используемыми для подписей, форматирования и т.п.) - сами значения. При загрузке данных в ось, у которой <i>dataFormat='category'</i>, они преобразуются в объекты: <i>{idx: 123, text: 'value'}</i>. Здесь idx - это индекс в массиве данных, соответствующий значению, а text - само значение.
    <b>number</b> - это числа с плавающей точкой.
    Задавая параметр <b>dataFormatterParams</b>, можно настраивать текстовое отображение данных, показываемых элементами оси или серий, привязанных к оси.
    <u>Параметры форматирующих функций</u><br>
    Форматирование - это преобразование значения метки на оси (или значения координат X и Y точки данные) в текст.
    Оно выполняется по-разному, в зависимости от того, какой формат данных (параметр <b>dataFormat</b>) указан у оси.
    Параметры форматирования задаются для оси или определения метки параметром <b>dataFormatterParams</b>, также параметры форматирования могут передаваться в объект-форматировщик, переданный обработчику события <b>onCustomGenerateMarks</b>.
    У него можно вызвать метод <b>formatter.formatValue(value, params)</b>, передав свои параметры форматирования. Опишем возможные параметры форматирования для различных форматов данных оси (параметр <b>dataFormat</b>).

    <pre>dataFormat = number. Числа форматируются функциями объекта $ws.render.defaultColumn:
    { type: 'real', decimals: 2, delimiters: true/false } - этот тип форматирования соответствует
    функции real.
    здесь decimals - число знаков после запятой,
    а delimiters - то, нужно или нет разделять группы знаков (десятичные триады)
    { type: 'money' } - этот тип форматирования соответствует функции money, и не имеет доп. параметров.
    значение форматируется так, как должно форматироваться денежное значение.
    { type: 'integer', delimiters: true/false } - этот тип форматирования соответствует
    функции integer.
    здесь delimiters - то, нужно или нет разделять группы знаков (десятичные триады)</pre>


    * @cfgOld {String|String[]} axes[].dataField Поле объекта данных, которое использует ось. По умолчанию ось пользуется данными диаграммы, которые представляют собой масссив объектов. Данными оси является массив, созданный путём выбора поля <b>dataField</b> из каждого элемента массива данных диаграммы.
    * Ось использует этот параметр, чтобы определять диапазон отображаемых в её координатах данных, и, используя этот диапазон, преобразовывать значения из этого диапазона в точки на поле диаграммы.
    * Если параметр <b>dataField</b> является массивом, то все указанные поля используются для определения минимума и максимума диапазона.
    * Также на диапазон данных оси влияют параметры <b>axisYdataField</b> / <b>axisXdataField</b>, заданные для серий, привязанных к этой оси: значения этих
    * параметров неявно добавляются в параметр <b>dataField</b>, и тоже участвуют в определении диапазона оси.
    *
    * @cfgOld {String} axes[].side Сторона диаграммы, к которой "прилеплена" ось.
    * Возможны такие значения параметра: <b>bottom</b>/<b>top</b> (горизонтальные оси), <b>left</b>/<b>right</b> (вертикальные оси).
    * Возможно наличие нескольких осей с одинаковым параметром <b>side</b>. В таком случае - они располагаются от края диаграммы друг за другом в порядке определения в конфиге.
    * @cfgOld {String} axes[].direction Направление оси. Возможны такие направления: <b>leftRight</b>/<b>rightLeft</b>/<b>topBottom</b>/<b>bottomTop</b>
    * Это необязательный параметр. По умолчанию, направление оси зависит от параметра <b>side</b>, и принимает такие значения:
    <code><b>side</b>&nbsp;&nbsp;<b>direction</b>
    left &nbsp;&nbsp; bottomTop
    right &nbsp;&nbsp; bottomTop
    top &nbsp;&nbsp; leftRight
    bottom &nbsp;&nbsp; leftRight</code>
    *
    * @cfgOld {Object} axes[].boundToAxis Привязка к другой оси. Если этот параметр не задан, то ось располагается на краю диаграммы в соответствии с параметром <b>side</b>.
    * Если же он задан, то ось сдвикается на точку, соответствующую значению диапазона оси, которая указана в под-параметре
    * <b>boundToAxis.name</b>. Привязка имеет смысл только для вертикальной оси к горизонтальной или наоборот.
    * Нельзя привязать вертикальную ось к вертикальной или горизонтальную к горизонтальной.
    * Пример привязки:
    * <pre>
    boundToAxis: {
    name: 'Y', //К какой оси привязываемся
    //К какому процентному значению диапазона оси привязываемся.
    //Имеются в виду значения диапазона после окончательных расчётов с учётом всех элементов параметра range той оси
    value: '50%'
    //Или так: value: 123  - абсолютное значение привязки

    round: 1000 //округление для точки привязки
   }</pre>
    *
    * @cfgOld {Object} axes[].range Диапазон данных оси.
    * По умолчанию диапазон данных считается автоматически, из максимума и минимума данных, по полям данных, указанным в
    * параметре <b>dataField</b> (с учётом полей, указанных в параметрах <b>axisYdataField</b> / <b>axisXdataField</b> серий,
    * привязанных к этой оси.
    * Однако, диапазон можно задавать вручную, или корректировать автоматически посчитанный диапазон.
    * При этом, надо дать две разные точки нового диапазона (<b>min</b>/<b>max</b>/<b>center</b> или
    * процентное значение точки в новом диапазоне).
    * Для каждой из этих точек (нового диапазона) нужно задать их положение в исходном диапазоне (абсолютное или процентное).
    * Примеры диапазона:
    * <pre>
    range: {
      //Верхняя точка диапазона оси должна быть на максимуме диапазона данных, округлённом (кратном) 1000
      max: {value: '100%'
            round: 1000},
      center: {value: 0}   //Середина диапазона оси должна быть на абсолютном значении - 0
   }</pre>

    * <pre>
    range: {
      //диапазон расширен на 10% вверх и вниз
      min: {value: '-10%'},
      max: {value: '110%'}
   }</pre>

    * @cfgOld {Object} axes[].rangeExtend Параметр, корректирующий диапазон оси.
    * Автоматически посчитанный диапазон можно скорректировать не только значениями параметра <b>range</b>,
    * но и параметром <b>rangeExtend</b>.
    * В нём можно задать абсолютное значение, добавляемое к максимуму, и вычитаемое из минимума диапазона оси:
    * Примеры:
    * <code>rangeExtend: 1000 //добавить 1000 к максимуму и вычесть 1000 из минимума</code>
    * <code>rangeExtend: {min: 1000} //вычесть 1000 из минимума</code>
    * <code>rangeExtend: {max: 1000} //добавить 1000 к максимуму</code>
    *
    * @cfgOld {Number} axes[].rangeExtend.min Параметр, корректирующий диапазон оси по минимальной границе(см. параметр <strong>axes[].rangeExtend</strong>).
    * @cfgOld {Number} axes[].rangeExtend.max Параметр, корректирующий диапазон оси по максимальной границе (см. параметр <strong>axes[].rangeExtend</strong>).
    * @cfgOld {Boolean} axes[].rangeExtend.forEmptyRangeOnly Параметр, включающий коррекцию диапазона только для случая пустого диапазона (когда min==max). По умолчанию выключен, так что параметр <strong>rangeExtend</strong>, если задан, применяется к любому диапазону.

    * @cfgOld {Object} axisMarkStyles Именованные стили меток по осям. Имена (ключи в объекте axisMarkStyles) тут могут быть любые.
    * На них потом можно ссылаться в настройках стиля оси через св-во baseName или через строковое значение стиля метки.
    * Пример стиля метки:
    <pre>
    axisMarkStyles: {
   defaultX:  {
      axisTick: { pathStyle: { stroke: 'blue' } }, //риска - голубая линия одинарной толщины
      label: { 'font-style': 'italic' }, // текстовая метка будет италиком
      gridLine: false, //линии сетки нет
      gridTick: false //риски на краю диаграммы нет
 }</pre>
 *
 * @cfgOld {Object|Boolean} axisMarkStyles.someStyle.axisTick Стиль риски на оси. При значении <b>false</b> риска не отображается.
    * @cfgOld {Object} axisMarkStyles.someStyle.axisTick.pathStyle Рафаэлевские атрибуты линии риски на оси: см. <a href="http://raphaeljs.com/reference.html#Element.attr">Element.attr</a>
    *
    * @cfgOld {Object|Boolean} axisMarkStyles.someStyle.label Рафаэлевские атрибуты текстовой метки на оси: см. <a href="http://raphaeljs.com/reference.html#Element.attr">Element.attr</a>
    * При значении <b>false</b> текст не отображается.
    *
    * @cfgOld {Object|Boolean} axisMarkStyles.someStyle.gridLine Стиль линии сетки (внутри прямоугольника диаграммы, где линии серий идут), генерируемой меткой. При значении <b>false</b> линия сетки не отображается.
    * @cfgOld {Object} axisMarkStyles.someStyle.gridLine.pathStyle Рафаэлевские атрибуты линии сетки: см. <a href="http://raphaeljs.com/reference.html#Element.attr">Element.attr</a>
    *
    * @cfgOld {Object|Boolean} axisMarkStyles.someStyle.gridTick  Тоже риска, но не на оси, а на краю диаграммы, соответствующем оси. При значении <b>false</b> линия сетки не отображается.
    * Параметры такие же, как у axisTick. Риска на краю диаграммы может быть нужна, если на одной стороне диаграммы расположены несколько осей
    * (к левой стороне несколько осей прилеплены, например). Тогда трудно сопоставить риски дальних осей на этой стороне с диаграммой,
    * и нужно рисовать на краю диаграммы дополнительную риску, соответствующую оси.
    * @cfgOld {Object} axisMarkStyles.someStyle.gridTick.pathStyle Рафаэлевские атрибуты риски на краю диаграммы: см. <a href="http://raphaeljs.com/reference.html#Element.attr">Element.attr</a>
    *
    * @cfgOld {Object[]} axes[].markDefinitions Определения для меток на оси.
    *
    * @cfgOld {Object} axes[].markDefinitions[].interval Интервал в диапазоне оси (посчитанном с учётом параметра <b>range</b>),
    * через который будут откладываться метки на оси. Если задан этот параметр, метки будут генерироваться исходя из диапазона данных, а не исходя из точек данных,
    * как в случае с параметром <b>pointInterval</b>. Этот параметр нельзя задавать одновременно с параметром <b>pointInterval</b>.
    * Однако же, один из этих параметров обязательно нужно задать для определения меток.
    *
    * @cfgOld {Object} axes[].markDefinitions[].pointInterval Интервал по точкам данных, для которых будут генерироваться метки на оси.
    * Если задан этот параметр, метки будут генерироваться для каждой N-й точки данных из массива данных оси.
    * Этот параметр нельзя задавать одновременно с параметром <b>interval</b>.
    * Однако же, один из этих параметров обязательно нужно задать для определения меток.
    *
    * @cfgOld {Object} axes[].markDefinitions[].round Округление для значений, полученных делением диапазона оси с помощью параметра interval
    * Метки отклажываются в соответствии с диапазонами меток, заданными в параметре <b>ranges</b>, при этом начальная точка каждого диапазона меток округляется в соответствии с параметром <b>round</b>
    * При заданном <b>pointInterval</b> смысла у этого параметра нет, поскольку метки ставятся не по диапазону, а по точкам данных.
    *
    * @cfgOld {Object} axes[].markDefinitions[].priority Задаёт определению меток приоритет относительно другим определениям меток этой оси.
    * Если несколько определений меток генерируют метки с одинаковым значением, то оставляется метка от определения с наивысшим значением параметра <b>priority</b>.
    *
    * @cfgOld {Object} axes[].markDefinitions[].dataFormatterParams Параметры форматирования (преобразования в текст) значений меток.
    * Возможные параметры зависят от того, какой формат данных (параметр <b>dataFormat</b>) задан у оси.
    * Для стандартных значений <b>dataFormat</b> они указаны в описании параметра <b>dataFormat</b>.
    * Если же задан обработчик события <b>onDataFormat</b>, то параметры передаются в обработчик как есть.
    *
    * @cfgOld {Object} axes[].markDefinitions[].onDataFormat Обработчик события <b>onDataFormat</b>. Подробнее см. описание этого события.
    *
    * @cfgOld {Object} axes[].markDefinitions[].ranges Диапазоны меток, то есть, под-диапазоны диапазона оси, в которых откладываются метки этого определения.
    * По умолчанию, метки откладываются от начала диапазона оси до конца. В примере ниже метки откладываются от середины оси до начала и от середины до конца, что гарантированно даёт нам метку в середине оси.
    *
    <pre>
    ranges: [ //Первый под-диапазон оси: от середины оси до макс. значения
    { start: 'center',//Точка начала под-диапазона
                      // положение точки в диапазоне оси (абсолютное (123), относительное (50%),
                      //                                  или символическое (min/max/center)
      end:  'max'    //Точка конца под-диапазона - определяется так же, как и точка начала
      //или: start: '50%', end: 4
    },
    //Второй под-диапазон оси: от середины оси до мин. значения
    {start: 'center', end: 'min'}

    /// С округлением точки начала меток:
    ranges: [ //Первый под-диапазон оси: от середины оси до макс. значения
    { start: {value: 'center', round: 1000},//Точка начала под-диапазона, кратная 1000
      end:  'max'    //Точка конца под-диапазона - определяется так же, как и точка начала
    },
    //Второй под-диапазон оси: от середины оси до мин. значения
    {start: {value: 'center', round: 1000}, end: 'min'}

    ]</pre>

    * @cfgOld {String|Object} axes[].markDefinitions[].style Визуальный стиль метки. Если указан параметр <b>style.baseName</b>, или параметр <b>style</b> имеет такой вид: <i>style = 'labelsSomeStyle'</i>,
    * то этот стиль наследует свойства именованного стиля из параметра <b>axisMarkStyles</b>, при этом, если заданы собственные параметры стиля, то они перекрывают унаследованные.
    * Формат стиля подробно описан в комментариях к параметру диаграммы <b>axisMarkStyles</b>.
    * Пример:
    <pre>
    style: {
   baseName: 'defaultX',//наследуем все свойства от стиля defaultX
   gridLine: {
      pathStyle: {'stroke-dasharray': '. '} //перекрываем свойство stroke-dasharray у стиля линии сетки
   }
 }</pre>

    * @cfgOld {Object} serieStyles Стили серий (то есть, графиков на диаграмме).
    * Имена (ключи в объекте <b>serieStyles</b>) тут могут быть любые. На них потом можно ссылаться в настройках стиля серии через св-во <b>baseName</b> или через имя стиля серии.
    *
    * @cfgOld {Boolean} serieStyles.someStyle.smooth Сглаживание (для серии типа <b>line</b>). При значении smooth=true линия будет сглаживаться кривыми Безье, для smooth=false она будет ломаной.
    * @cfgOld {Boolean} serieStyles.someStyle.showInLegend Отображение серии в легенде. При значении showInLegend=false описания серии в легенде не будет.
    * @cfgOld {Object} serieStyles.someStyle.legendPathStyle Стиль линии, соответсвующей серии в легенде. Формат такой же, как у всех элементов pathStyle. При значении <b>false</b> линия серии в легенде не отображается.
    * По умолчанию в качестве <strong>legendPathStyle</strong> (стиля линии этой серии в легенде) используется <strong>linePathStyle</strong> для серий типа <strong>line</strong>, и
    * <strong>barPathStyle</strong> для серий типа <strong>bar</strong>, причём в последнем случае для цвета линии используется атрибут <strong>fill</strong>.
    *
    * @cfgOld {Object|Boolean} serieStyles.someStyle.linePathStyle Стиль линии серии (для серии типа <b>line</b>). Формат такой же, как у всех элементов pathStyle. При значении <b>false</b> линия серии не отображается.
    * При значении, отличном от false, должен задаваться объект с рафаэлевскими атрибутами линии серии: см. <a href="http://raphaeljs.com/reference.html#Element.attr">Element.attr</a>

    * @cfgOld {Object|Boolean} serieStyles.someStyle.backPathStyle Стиль 'задника' (площади между линией и осью X) линии серии. (для серии типа <b>line</b>). Формат такой же, как у всех элементов pathStyle. При значении <b>false</b> задник не отображается.
    * При значении, отличном от false, должен задаваться объект с рафаэлевскими атрибутами задника линии серии: см. <a href="http://raphaeljs.com/reference.html#Element.attr">Element.attr</a>
    * По умолчанию у задника есть только заливка (fill) и нету линии (stroke). stroke можно и включить, но вряд ли в этом есть смысл.
    * Пример:
    * <pre>
    backPathStyle: {
      fill: 'lightblue',
      'fill-opacity': 0.2
   }</pre>

    * @cfgOld {Object|Boolean} serieStyles.someStyle.pointStyle Стиль точки данных на линии серии. (для серии типа <b>line</b>). При значении <b>false</b> точки данных не отображаются.
    * Пример:
    <pre>
    pointStyle: {
     //Тип элемента, которым будет рисоваться точка данных. Пока что поддерживается только 'circle'.
     //Если тип элемента не указан, то будет тип по умолчанию ('circle')
     element: 'circle',
     //Стиль элемента. Если не задан - используется стиль по умолчанию
     elementStyle: {
        r: 5,  //Радиус кружочка
        fill: 'blue', //Далее идут свойства, такие же, как у pathStyle см. сноску (1) сверху
        'fill-opacity': 0.7
     }
   }</pre>

    * @cfgOld {Number|String} serieStyles.someStyle.barWidth Ширина столбика (для серии типа <b>bar</b>). Может задаваться как в абсолютных значениях (в пикселях) (Number), так и в относительных (String: Number+'%').
    * В случае задания относительного значения это будет процент от минимального расстояния между центром этого столбика и соседних (или краёв диаграммы).
    * Примеры: <pre>barWidth: '70%'</pre>, <pre>barWidth: 70</pre>.
    * В случае горизонтальной склейки нескольких столбиков с разными полями Y и одинаковым полем X, ширина каждого столбика получится делением значения параметра <b>barWidth</b> на число столбиков.
    * См. описание склеек в параметре серии <b>series[].axisYdataField</b>

    * @cfgOld {Number} serieStyles.someStyle.interBarPadding Зазор между столбиками (для серии типа <b>bar</b>) в группе столбиков, участвующих в горизонтальной склейке, в пикселях.
    * Пример: <pre>interBarPadding: 4 //зазор между столбиками</pre>
    * См. описание склеек в параметре серии <b>series[].axisYdataField</b>

    * @cfgOld {Object|Boolean} serieStyles.someStyle.barPathStyle Парамер контура и заливки для столбика. (для серии типа <b>bar</b>). Формат такой же, как у всех элементов pathStyle. При значении <b>false</b> столбики не отображаются.
    * При значении, отличном от false, должен задаваться объект с рафаэлевскими атрибутами столбиков по точкам данных серии: см. <a href="http://raphaeljs.com/reference.html#Element.attr">Element.attr</a>
    * Пример:
    <pre>
    barPathStyle: {
      stroke: 'red',//контур столбика
      fill: 'cyan',//цвет заливки по контуру столбика
      'fill-opacity': 0.7 //прозрачность заливки - 30%
   }
    </pre>

    *
    * @cfgOld {Array} series Конфигурация серий, то есть, собственно графиков: линейных или столбчатых.
    * Каждая серия обязательно должна быть привязана к двум осям: горизонтальной и вертикальной, при помощи параметров <b>axisX</b> и <b>axisY</b>
    * Эти оси транслируют точки данных в пиксельные значения на диаграмме.
    * Далее серия отрисовывает себя на основе этих точек - рисует линию, соединяющую точки, столбики, и т.п.
    * По умолчанию, серия пользуется полями данных, указанными в параметрах <b>dataField</b> её осей, если этот параметр у соотв. оси задан, и он указывает только на одно поле, а не на массив имён полей.
    * Если же нужно указать поле данных, отличное от поля данных оси, то нужно задать серии параметры <b>axisYdataField</b>, <b>axisXdataField</b>, для X-оси и Y-оси соответственно.
    *
    * @cfgOld {Boolean} series[].visible Видимость серии. По умолчанию - true (серия видима). Если указано значение false, то серия рисоваться не будет.
    *
    * @cfgOld {String} series[].description Описание серии. Это описание должно появляться в легенде, если легенда не выключена, и параметр showInLegend у стиля серии не равен false
    *
    * @cfgOld {String} series[].axisX Горизонтальная ось для серии. Из неё берутся данные X-значений точек, она преобразует их в пиксели по горизонтали в
    * в соответствии со своим направлением (справа налево, слева направо - см. параметр <b>direction</b> у оси)
    * Ось X может быть и вертикальной, тогда в качестве оси Y нужно указывать одну из горизонтальных осей. Такая конфигурация даст график, лежащий "на боку".
    * Ось X играет особую роль в построении серии (графика): в случае линейного графика можно залить площадь между осью X и линией графика, а в случае столбчатого графика столбик строится с помощью проецирования точки данных на ось X.
    *
    * @cfgOld {String} series[].axisY Вертикальная ось для серии. Из неё берутся данные Y-значений точек, она преобразует их в пиксели по вертикали в
    * в соответствии со своим направлением (сверху вниз, снизу вверх - см. параметр <b>direction</b> у оси)
    * Ось Y может быть и горизонтальной, тогда в качестве оси X нужно указывать одну из вертикальных осей. Такая конфигурация даст график, лежащий "на боку".
    *
    * @cfgOld {String} series[].type Тип серии: линейная или столбчатая.
    <b>bar</b>: Столбиковая серия. У такой серии рисуются столбики от точки данных к её проекции на ось <b>axisX</b>. Других визуальных элементов у серии такого типа быть не может.
    Также, стиль такой серии не может содержать параметры <b>linePathStyle</b>, <b>backPathStyle</b>, и <b>pointStyle</b>

    <b>line</b>: Линейная серия. У такой серии по умолчанию включена линия, соединяющая точки, выключены сами точки, и выключена заливка площади между линией и осью X (<b>axisX</b>).

    * @cfgOld {String|Object} series[].style Визуальный стиль серии. Если указан параметр <b>style.baseName</b>, или параметр <b>style</b> имеет такой вид: <i>style = 'serieSomeStyle'</i>,
    * то этот стиль наследует свойства именованного стиля из параметра <b>serieStyles</b>, при этом, если заданы собственные параметры стиля, то они перекрывают унаследованные.
    * Формат стиля подробно описан в параметре диаграммы <b>serieStyles</b>.
    * Пример:
    *
    Для столбчатого графика (type='bar')
    <pre>
    style: {
   //Ширина столбика - в пикселях или долях от минимальной дистанции от его центра до центра ближних столбиков или ближайшей оси
   barWidth: 20,
   //barWidth: '20%',

   interBarPadding: 4, //Промежуток между столбиками, в случае горизонтальной склейки столбиков с одинаковым X и разными Y (см. параметр series[].axisYdataField)

   //параметр pathStyle для столбика: атрибуты заливки, линии...
   //если задано barPathStyle: false - столбики рисоваться не будут
   barPathStyle: {
      fill: 'cyan',
      'fill-opacity': 0.7
      //, 'arrow-end': 'classic-wide-long'
   }
 }</pre>

    Для линейного графика (type='line')
    <pre>
    style: {
   linePathStyle: {stroke: 'red'}, //контур линии
   backPathStyle: { //заливка под линией
      fill: 'lightblue',
      'fill-opacity': 0.2
   },

   //Стиль точки данных на линии.
   //Если задано pointStyle: false, то точка выключена.
   pointStyle: {
      //Тип элемента, которым будет рисоваться точка данных. Пока что поддерживается только 'circle'
      element: 'circle',
      //Стиль элемента. Если не задан - используется стиль по умолчанию
      elementStyle: {
         r: 5,  //Радиус кружочка
         fill: 'blue', //Далее идут свойства, такие же, как у pathStyle см. сноску (1) сверху
         'fill-opacity': 0.7
      }
   },

   smooth: false //ломаная линия: сглаживание линии выключено (по умолчанию оно включено)
 }</pre>

    * @cfgOld {String} series[].axisXdataField Поле данных для серии по оси X. Если это поле не указано, то используется поле данных из параметра <b>dataField</b> оси, указанной в
    * параметре <b>axisX</b> (если там указано одно поле, а не несколько). Если же параметр <b>dataField</b> у X-оси не задан, или задано несколько полей в этом параметре, то необходимо задать
    * параметр <b>axisXdataField</b> у серий, привязанных к этой оси как к X-оси (через параметр <b>axisX</b>).

    * @cfgOld {String|String[]|Object[]} series[].axisYdataField Поле (поля) данных для серии по оси Y. Если это поле не указано, то используется поле данных из параметра <b>dataField</b> оси, указанной в
    * параметре <b>axisY</b> (если там указано одно поле, а не несколько). Если же параметр <b>dataField</b> у Y-оси не задан, или задано несколько полей в этом параметре, то необходимо задать
    * параметр <b>axisYdataField</b> у серий, привязанных к этой оси как к Y-оси (через параметр <b>axisY</b>).
    * Возможны варианты этого параметра для разных типов серий:
    *
    * <i>Тип серии - line (линейный график)</i>.
    * В этом случае параметр <b>axisYdataField</b> должен быть простой строкой, указывая на поле, которое используется в качестве Y - значения для графика.
    * Тут параметр <b>axisYdataField</b> задаётся точно так же, как и параметр <b>axisXdataField</b>.


    * <i>Тип серии - bar (столбчатый график)</i>. Для такого графика можно задавать сложные значения параметра <b>axisYdataField</b>, ставя столбики для разных Y-полей рядом,
    * по одному значению X-поля (горизонтальная склейка), или друг над другом вертикально, для одного значения X-поля (вертикальная склейка или группировка нарастающми итогом).
    * Варианты поля <b>axisYdataField</b> для столбчатого графика:
    *
    * <b>(1)</b> 'someField' (строка) - одно поле, один столбик на точку по X
    * <b>(2)</b> Горизонтальная склейка столбиков по разным полям.
    * Задаётся массивом имён полей, соответствующих столбикам:
    <pre>['Y', 'Y1']</pre>
    Массив имён полей со стилями столбиков:
    <pre>[{name: 'Y', style: 'styleY'},
    {name: 'Y1', style: {baseName: 'styleY1', barPathStyle: {fill: 'red'}}}]</pre>

    На одну точку по X будет два столбика рядом, склееные по X,
    с высотой, соответствующей полям Y и Y1.
    У первого столбика будет стиль 'styleY' из коллекции стилей, заданной в параметре диаграммы <b>serieStyles</b>,
    стиль же второго столбика будет унаследован от стиля 'styleY1' из той же коллекции, с перекрытием некоторых его параметров, так же, как и у св-ва серии
    series[].style.
    * <b>(3)</b> Показ "нарастающим итогом" (вертикальная склейка столбиков по разным полям).
    * Задаётся объектом с полем 'stack', в котором лежит массив полей, по которым должны показываться столбики нарастающим итогом, друг над другом.
    На одну точку по X будет один столбик, составленный из двух с высотами, соответствующей полям Y и Y1 - один на другом.
    <pre>{stack: ['Y', 'Y1']}</pre>
    Массив имён полей со стилями столбиков:
    <pre>{stack: [{name: 'Y', style: 'styleY'},
                 {name: 'Y1', style: 'styleY1'}]}</pre>
    Здесь стили столбиков задаются так же, как и в предыдущем варианте.
    * <b>(4)</b> Комбинация (2) и (3) (комбинация предыдущих двух вариантов).
    <pre>
    [ {name: 'Y', style: 'styleY'},
    {stack: [{name: 'Y1', style: 'styleY2'},{name: 'Y2', style: 'styleY2'}]},
    {stack: ['Y3', 'Y4']} ]</pre>
    Задаётся горизонтальная склейка одного простого столбика по полю Y, и двух составных столбиков по полям Y1+Y2 и Y3+Y4 соответственно.

    * @cfgOld {Object} legend Конфигурация легенды
    *
    * @cfgOld {String} legend.side Сторона диаграммы, к которой привязана легенда. Возможные значения: top/bottom/left/right

    * @cfgOld {String} legend.sidePosition Положение легенды на стороне диаграммы, к которой она привязана легенда.
    * Возможные значения: start (в начале стороны), center (в середине), end (в конце).
    * Например, сочетание {side: top, sidePosition: end} даст позицию легенды в правом верхнем углу.
    *
    * @cfgOld {Boolean} legend.visible Видимость легенды. По умолчанию - true (легенда видима). Если указано значение false, то легенда рисоваться не будет.
    *
    * @cfgOld {Number} legend.width Явно заданная ширина легенды. По умолчанию ширина легенды автоматическая (по содержимому).
    *
    * @cfgOld {Number} legend.height Явно заданная высота легенды. По умолчанию высота легенды автоматическая (по содержимому).
    *
    * @cfgOld {Boolean} legend.insideChart Позиционирование легенды: внутри области графиков (true) или снаружи графиков и осей (false).
    *
    * @cfgOld {Number} legend.padding Отступ легенды от ближайших краёв диаграммы
    *
    * @cfgOld {Number} legend.interLegendPadding Отступ внутри легенды - между описаниями серий
    *
    * @cfgOld {Number} legend.legendLineWidth Внутри легенды - ширина линии, изображающей линию серии
    *
    * @cfgOld {Number} legend.legendLineTextPadding Внутри легенды - расстояние между линией, изображающей линию серии, и подписью серии
    *
    * @cfgOld {Object} legend.textStyle Внутри легенды - стиль (рафаэлевские атрибуты) подписей.
    * См. текстовые атрибуты здесь: <a href="http://raphaeljs.com/reference.html#Element.attr">Element.attr</a>
    *
    * @cfgOld {Object} legend.frameStyle Стиль рамки вокруг легенды.
    * См. атрибуты стиля здесь: <a href="http://raphaeljs.com/reference.html#Element.attr">Element.attr</a>.
    * Как правило, тут важны атрибуты типа stroke и fill
    **/
   $ws.proto.RaphaelChartGraph = $ws.proto.RaphaelAbstractGraph.extend(/** @lends $ws.proto.RaphaelChartGraph */{

      /**
       * @event onPrepareData Событие <b>диаграммы</b> на подготовку данных перед загрузкой в диаграмму (из рекордсета или через прямой вызов setData).
       * Событие вызывается при явном задании данных всем осям методом <b>setData</b> у диаграммы, или при неявном задании данных диаграммы в случае их загрузки через recordSet/dataSource.
       * Обработчик должен возвращать массив значений диаграммы.
       * Пример:
       * <pre>
       //обработчик делает новое поле из нескольких исходных полей
       onPrepareData: function(event, srcData) {
         var result = clone(srcData);
         for (var i in srcData) {
            result[i].calcField = srcData[i].field1 + ' ' + srcData[i].field2;
         }
         event.setResult(result);
      }
       * </pre>
       * @param {Object} event - объект события. описание в классе $ws.proto.Abstract
       * @param {Object[]} srcData - исходные данные, переданные в setData диаграммы
       * @param {$ws.proto.RaphaelChartGraph} this - объект-диаграмма, для которого вызывается обработчик
       */

      /**
       * @event onDataFormat Событие <b>оси</b> на форматирование значений меток (преобразование их в текст).
       * Обработчик этого события используется, если не задан такой обработчик такого же события у соответствующего определения меток.
       * Если этот обработчик не задан, то используется форматирование по умолчанию для формата данных оси (см. параметр <b>dataFormat</b>)
       * Обработчик должен возвращать текст, соответствующий значению.
       * <pre>onDataFormat: function(event, value, formatterParams) {
            event.setResult('[' + value.text + ']');
           }</pre>
       * @param {Object} event - объект события. описание в классе $ws.proto.Abstract
       * @param {Object} value - значение, переданное для форматирования.
       * В случае, если формат данных у оси - <b>category</b>, это будет объект такого формата: {idx: dataIndex, text: 'value'}. Здесь <b>idx</b> - это индекс в массиве данных, соответствующий значению, а <b>text</b> - само значение.
       *
       * В случае, если формат данных у оси - <b>number</b>, это будет само значение (целое или с плавающей точкой).
       * @param {Object} formatterParams - параметры форматирования, заданные в параметре метки <b>dataFormatterParams</b> или параметре оси <b>dataFormatterParams</b>
       * @param {Object} this - объект-ось, для которого вызывается обработчик
       */

      /**
       * @event onCustomGenerateMarks Событие <b>оси</b> на генерацию меток на оси.
       * Метки могут генерироваться как автоматически, в соответствие с параметрами, заданными в параметре оси <b>markDefinitions</b>, так и через событие <b>onCustomGenerateMarks</b>.
       * Обработчик получает диапазон (окончательный рассчитанный с учётом параметра оси <b>range</b>), в котором надо генерировать метки, весь массив данных, принадлежащих диаграмме (dataIntf), и утилитный объект, умеющий работать с этими данными (<b>formatter</b>).
       * Для события самая нужная функция этого объекта - <b>formatValue</b>.
       * На выходе событие должно выдать массив меток в таком формате:
       * <pre>[{text: 'bebe', value: 123, style: { pathStyle: {stroke: 'red', fill: 'blue'} }...]</pre>
    * Здесь:
    *    поле <b>text</b> у метки - это текст, отображаемый меткой (его стиль задаётся параметром <b>label</b> у стиля метки (см. параметр <b>axisMarkStyles</b> у конфигурации диаграммы).
    *    поле <b>value</b> у метки - это значение, нужное для расчёта положения метки на оси. Оно должно находиться в диапазоне между параметрами события <b>rangeMin</b> и <b>rangeMax</b>.
    *    поле <b>style</b> у метки - это стиль, используемый в отрисовке этой метки. формат стиля см. в параметре <b>style</b> метки (<b>axes[].markDefinitions[].style</b> в описании конфига диаграммы).
    * Для того, чтоб вернуть результат, нужно вызвать метод event.setResult(resultArray)
    * Пример:
    * Делим диапазон оси на 10 частей, и ставим метки. Стиль у каждой метки будет взят из коллекции стилей диаграммы <b>axisMarkStyles</b>, из её элемента с именем someStyle.
    * <pre>
      onCustomGenerateMarks: function(event, rangeMin, rangeMax, dataIntf, formatter) {
         var result = [];
         for (var v = rangeMin; v < rangeMax; v = v + (rangeMax - rangeMin) / 10)
            result.push({text: formatter.formatValue(v), value: v, style: 'someStyle'});
         event.setResult(result);
      }</pre>
    * @param {Object} event - объект события. описание в классе $ws.proto.Abstract
       * @param {Object|Number} rangeMin - нижняя граница диапазона оси.
       * В случае, если формат данных у оси - <b>category</b>, это будет объект такого формата: {idx: dataIndex, text: 'value'}. Здесь <b>idx</b> - это индекс в массиве данных, соответствующий значению, а <b>text</b> - само значение.
       *
       * В случае, если формат данных у оси - <b>number</b>, это будет само значение (целое или с плавающей точкой).
       *
       * @param {Object|Number} rangeMax - верхняя граница диапазона оси. формат такой же, как у <b>rangeMin</b>
       * @param {Object} dataIntf - объект, предоставляющий доступ к данным диаграммы. Имеет следующие методы:
       * <b>getCount</b> - даёт количество объектов-"строк" в массиве данных диаграммы
       * <b>getFieldValue</b> - даёт поле-"столбец" объекта-"строки" из массива данных диаграммы
       * @param {Object} formatter - утилитный объект, умеющий работать с типом данных оси. Для события самая нужная функция этого объекта - <b>formatValue</b>, принимающая значение и параметры форматирования (см. параметр диаграммы <b>axes[].dataFormat</b>).
       * @param {Object} this - объект-ось, для которого вызывается обработчик
       */

      /**
       * @event onElementCustomDraw Событие <b>оси</b> или <b>серии</b> на отрисовку элемента оси/серии.
       * Этот обработчик вызывается после отрисовки элемента. Он может использоваться для добавления каких-либо дополнительных графических raphael-элементов к элементу оси/серии.
       * Обработчик должен возвращать массив графических элементов, добавленных им к элементу оси. Если добавлен только один элемент, то можно возвращать его, а не массив. Если ничего не добавлено, то возвращать значения не надо.
       * Пример:
       * <pre>
       onElementCustomDraw: function(event, elementType, elementData, canvas, drawUtils) {
         var result = [];
         if (elementType === 'mark') {
            var mark = elementData.mark;
            if (mark.value % 21000 === 0) { //если значение метки кратно 21000, подправляем её шрифт
               var label = elementData.elements.label;
               label.attr({'font-size': 20, stroke: 'red'});
               var box = label.getBBox();
               //и рисуем прямоугольник вокруг текста
               result.add(canvas.rect(box.x, box.y, box.width, box.height));
            }
         }
         event.setResult(result);//обязательно возвращаем созданные элементы
      }</pre>
       * @param {Object} event - объект события. описание в классе $ws.proto.Abstract
       * @param {String} elementType - тип элемента.
       * Типы для осей:
       * <pre>
       mark: метка оси. она состоит из нескольких графических raphael-элементов,
       ссылки на которые лежат в elementData.elements:
       gridLine: линия сетки, соответствующая метке
       tick: {
               axis: риска на самой оси
               grid: риска на краю диаграммы
            }
       label: текстовая метка
       axisLine: собственно линия оси. Ссылка на графический элемент лежит в elementData.elements.axisLine
       </pre>
       * Типы для серий:
       <pre>
       point: точка данных. Ссылка на графический элемент (заданный параметром pointStyle.element стиля серии)
       лежит в elementData.elements.point
       bar: столбик, направленный от точки данных на диаграмме к её проекции на ось X (axisX)
       Ссылка на графический элемент (замкнутый прямоугольник) лежит в elementData.elements.bar
       line: линия, соединяющая все точки данных.
       Ссылка на графический элемент (кривую или ломаную линию) лежит в elementData.elements.line
       back: задник - площадь под линией серии (между линией серии и линией оси axisX).
       Ссылка на графический элемент (замкнутую фигуру) лежит в elementData.elements.back
       </pre>
       * @param {Object} elementData - данные этого элемента оси/серии.
       * Данные по типам элементов для осей:
       <pre>
       mark:  - у метки данные такие:
       axisPoint - точка на оси, в пикселях
       mark: {
             text: текст метки
             value: значение метки
             style: стиль метки, рассчитанный с учётом всех наследований, перекрытий, и умолчаний
          }
       elements: именованные графические элементы - части риски (описание см. выше)
       axisLine:  - у линии оси данные такие:
       pointStart: точка начала линии, в пикселях
       pointEnd: точка конца линии, в пикселях
       у всех элементов оси:
       style: стиль элемента оси, указанный в его конфигурации (с  учётом всех наследований)
       </pre>
       * Данные по типам элементов для серий:
       <pre>
       point:
       dataPoint: {x: 123, y: 123} - значение точки данных: x - соотв. значение из данных оси axisX, y - из данных оси axisY
       dataFields: {x: 'xField', y: 'yField'} - поля данных для координаты по X- и Y-оси
       elements: {point: {raphaelObj}} - графический элемент
       bar:
       dataPoint: {x: 123, y: 123} - значение точки данных: x - соотв. значение из данных оси axisX, y - из данных оси axisY
       dataFields: {x: 'xField', y: 'yField'} - поля точки данных: x - соотв. поле данных оси axisX, y - оси axisY
       elements: {bar: {raphaelObj}} - графический элемент
       line:
       elements: {line: {raphaelObj}} - графический элемент
       back: задник - площадь под линией серии (между линией серии и линией оси axisX).
       elements: {back: {raphaelObj}} - графический элемент
       У всех элементов серии:
       style: стиль элемента серии, указанный в его конфигурации (с  учётом всех наследований)
       </pre>
       * @param {Object} canvas - рафаэлевский объект типа Paper (http://raphaeljs.com/reference.html#Paper), позволяющий создавать новые графические элементы на канве диаграммы (их обработчик должен вернуть - они будут добавлены к элементу серии)
       * @param {Object} drawUtils - объект, содержащий разные полезные функции (свои для разных типов элемента серии). эти функции относятся к расчёту положения различных частей данного элемента серии или отрисовке этих частей.
       * @param {Object} this - объект - серия или ось, для которого вызывается обработчик
       */

      /**
       * @event onElementMouseOver Событие mouseover на элементе <b>оси</b> или <b>серии</b>.
       * @param {Object} event - объект события. описание см. в <b>onElementCustomDraw</b>
       * @param {String} elementType - тип элемента. описание см. в <b>onElementCustomDraw</b>
       * @param {Object} elementData - данные этого элемента оси/серии. описание см. в <b>onElementCustomDraw</b>
       * @param {Object} canvas - описание см. в <b>onElementCustomDraw</b>
       * @param {Object} drawUtils - описание см. в <b>onElementCustomDraw</b>
       * @param {Object} element - графический raphael-элемент, для которого произошло событие. этот элемент, как правило, присутствует в параметре elementData.elements, в одном из его полей.
       * @param {Object} this - объект - серия или ось, для которого вызывается обработчик
       */

      /**
       * @event onElementMouseOut Событие mouseout на элементе <b>оси</b> или <b>серии</b>.
       * @param {Object} event - объект события. описание см. в <b>onElementCustomDraw</b>
       * @param {String} elementType - тип элемента. описание см. в <b>onElementCustomDraw</b>
       * @param {Object} elementData - данные этого элемента оси/серии. описание см. в <b>onElementCustomDraw</b>
       * @param {Object} canvas - описание см. в <b>onElementCustomDraw</b>
       * @param {Object} drawUtils - описание см. в <b>onElementCustomDraw</b>
       * @param {Object} element - графический raphael-элемент, для которого произошло событие. этот элемент, как правило, присутствует в параметре elementData.elements, в одном из его полей.
       * @param {Object} this - объект - серия или ось, для которого вызывается обработчик
       */

      /**
       * @event onElementMouseDown Событие mousedown на элементе <b>оси</b> или <b>серии</b>.
       * @param {Object} event - объект события. описание см. в <b>onElementCustomDraw</b>
       * @param {String} elementType - тип элемента. описание см. в <b>onElementCustomDraw</b>
       * @param {Object} elementData - данные этого элемента оси/серии. описание см. в <b>onElementCustomDraw</b>
       * @param {Object} canvas - описание см. в <b>onElementCustomDraw</b>
       * @param {Object} drawUtils - описание см. в <b>onElementCustomDraw</b>
       * @param {Object} element - графический raphael-элемент, для которого произошло событие. этот элемент, как правило, присутствует в параметре elementData.elements, в одном из его полей.
       * @param {Object} this - объект - серия или ось, для которого вызывается обработчик
       */

      /**
       * @event onElementMouseUp Событие mouseup на элементе <b>оси</b> или <b>серии</b>.
       * @param {Object} event - объект события. описание см. в <b>onElementCustomDraw</b>
       * @param {String} elementType - тип элемента. описание см. в <b>onElementCustomDraw</b>
       * @param {Object} elementData - данные этого элемента оси/серии. описание см. в <b>onElementCustomDraw</b>
       * @param {Object} canvas - описание см. в <b>onElementCustomDraw</b>
       * @param {Object} drawUtils - описание см. в <b>onElementCustomDraw</b>
       * @param {Object} element - графический raphael-элемент, для которого произошло событие. этот элемент, как правило, присутствует в параметре elementData.elements, в одном из его полей.
       * @param {Object} this - объект - серия или ось, для которого вызывается обработчик
       */

      /**
       * @event onCustomGenerateSerieLabels TODO: !!!!!!
       * @param {Object} event - объект события. описание в классе $ws.proto.Abstract
       * @param {Object[]} srcData - исходные данные, переданные в setData диаграммы
       * @param {ChartLineSerie} this - объект-серия, для которого вызывается обработчик
       *
       * Пример:
       * <pre>
       onCustomGenerateSerieLabels: function(event, srcData) {
         var result = [], diff, diffObj;
         for (var i = 0, ln = srcData.length; i != ln; i++) {
            diff = i === 0 ? '' : srcData[i].fieldY - srcData[i - 1].fieldY;
            diffObj = diff > 0 ? {value: '+' + diff, style: 'подъём'} : {value: '-' + diff, style: 'спад'};

            result.push({center: i, underTop: diffObj, top: srcData[i]});
         }
         event.setResult(result);
      }
       * </pre>
       */

      $protected: {
         _gridDrawBounds: null,
         _defaultObjects: {
            _axesBySide: {
               left: [],
               bottom: [],
               top: [],
               right: []
            },
            _axes: [],
            _axesByName: {},
            _axisMarkStyles: {},
            _axisMarkStyleConfigs: {},
            _axisStyleConfigs: {},
            _serieStyleConfigs: {},
            _seriesByName: {},
            _series: [],
            _legend: null,
            _style: {},
            _styleCompiled: {},
            _rangeAreas: [],
            _rangeAreaStyleConfigs: {},
            _serieLabelStyleConfigs: {}
         },

         _defaultMarkStyle: null,
         _chartData: [], //[{x: 1, y: 2}, {x: 12, y: 22} ..]
         _chartDataIntf: null,
         _stdDataIntf: null,
         _graphSet: [],
         _haveObjects: false,
         _isValid: false
      },

      $constructor : function(config) {
         this._chartDataIntf = this._getStdDataIntf();

         this.getReadyDeferred().addCallback(function() {
            this.setConfig(config);
         }.bind(this));
      },

      /** Обработчик изменения настроек элемента диаграммы (оси или серии) @private */
      _onComponentChange: function(component, change) {
         if (this._inInternalChange())
            return;

         var self = this, handler;

         function fullRebuild() { self.draw(); }

         var changeMap = {
            element: {data: fullRebuild, visible: fullRebuild}
         };

         handler = (changeMap[component] && changeMap[component][change]);
         if (handler)
            handler();
      },

      /**
       * Строим диаграмму по заданному конфигу, сбрасывая предыдущие настройки диаграммы.
       * Если диаграмма не готова (getReadyDeferred().isReady() == false), и ожидает результата обращения к бизнес-логике, то вызов будет отложен до готовности диаграммы.
       * @param {Object} config Конфигурация диаграммы (формат смотри в описании диаграммы)
       * @return {$ws.proto.Deferred} Объект ожидания готовности диаграммы
       */
      setConfig: readyDefWrapper(function(config) {
         this._isValid = false;
         this._options = this._extendDefaultOptionsByConfig(config, $ws.proto.RaphaelChartGraph);
         this._runInternalChange(function(){
            this._reset();

            var name, type, typeFn, self = this;

            this._style = config.style || {};
            this._styleCompiled = extend(clone(ChartGraphConst.defaultChartStyle), this._style);

            if (config.margin) {
               this._options.margin.left = parseFloat(config.margin.left) || 0;
               this._options.margin.right = parseFloat(config.margin.right) || 0;
               this._options.margin.top = parseFloat(config.margin.top) || 0;
               this._options.margin.bottom = parseFloat(config.margin.bottom) || 0;
            }

            forEach(config.axisMarkStyles, function(cfg, name) {
               typeFn = ChartGraphConst.axisMarkStyleTypeMap[cfg.type || ChartGraphConst.defaultAxisMarkStyleType];
               if (typeFn === undefined)
                  throw new Error('Неизвестный тип у стиля меток ' + name + ': ' + cfg.type);

               if (this._axisMarkStyles[name])
                  throw new Error('Стиль меток с именем ' + name + ' уже есть в конфиге стилей меток');

               type = typeFn();
               this._axisMarkStyles[name] = new type(cfg);
               this._axisMarkStyleConfigs[name] = cfg || {};
            }, this);

            this._defaultMarkStyle = new ChartAxisMarkStyleDefault();

            forEach(config.axisStyles, function(cfg, name) {
               this._axisStyleConfigs[name] = cfg || {};
            }, this);

            config.axes = config.axes || [];
            forEach(config.axes, function(cfg) {
               cfg.chart = this;

               typeFn = ChartGraphConst.axisStyleTypeMap[cfg.type || ChartGraphConst.defaultAxisStyleType];
               if (typeFn === undefined)
                  throw new Error('Неизвестный тип у оси: ' + cfg.type);

               if (cfg.name && this._axesByName[cfg.name])
                  throw new Error('Ось с именем ' + cfg.name + ' уже есть');

               type = typeFn();

               var axis = new type(cfg);
               axis._setDataIntf(this._chartDataIntf);

               this._axesByName[cfg.name] = axis;
               this._axesBySide[cfg.side].push(axis);
               this._axes.push(axis);
            }, this);

            config.serieStyles = config.serieStyles || {};
            forEach(config.serieStyles, function(cfg, name) {
               this._serieStyleConfigs[name] = cfg;
            }, this);

            config.serieLabelStyles = config.serieLabelStyles || {};
            forEach(config.serieLabelStyles, function(cfg, name) {
               this._serieLabelStyleConfigs[name] = cfg;
            }, this);

            forEach(config.series, function(cfg) {
               cfg.chart = this;

               typeFn = ChartGraphConst.serieTypeMap[cfg.type || ChartGraphConst.defaultSerieType];
               if (typeFn === undefined)
                  throw new Error('Неизвестный тип у серии: ' + cfg.type);

               if (cfg.name && this._seriesByName[cfg.name])
                  throw new Error('Серия с именем ' + cfg.name + ' уже есть');

               type = typeFn();
               var serie = new type(cfg);
               if (serie._name)
                  this._seriesByName[serie._name] = serie;
               this._series.push(serie);
            }, this);

            forEach(this._axes, function(axis, i) {
               axis._setBoundAxis(config.axes[i]);
               axis._checkConfig();
               axis._preCalcLayout(true);
            }, this);

            config.rangeAreaStyles = config.rangeAreaStyles || {};
            forEach(config.rangeAreaStyles, function(cfg, name) {
               this._rangeAreaStyleConfigs[name] = cfg;
            }, this);

            this._rangeAreas = map(config.rangeAreas || [], function(cfg) {
               cfg.chart = this;
               return new ChartRangeArea(cfg);
            }, this);

            this._publish('onPrepareData');
            if (config.onPrepareData)
               this.subscribe('onPrepareData', config.onPrepareData);

            function createLegend(legendCfg) {
               var config = self._getLegendConfig(legendCfg, ChartGraphConst.defaultLegendStyle);

               var legends = [];
               forEach(self._series, function(serie) {
                  var style = serie.getCompiledStyle();
                  if (style.showInLegend) {
                     var props = serie._getLegendProps();
                     forEach(props, function(prop) { legends.push(prop); });
                  }
               });

               var cfg = clone(config);
               cfg.legends = legends;
               cfg.chart = self;

               return new ChartLegend(cfg);
            }

            this._legend = createLegend(config.legend);

            if (config.data)
               this.setData(config.data);
            else if (config.recordSet)
               this.setRecordSet(config.recordSet);
            else if (this._options.dataSource)
               this.setDataSource(this._options.dataSource, {filterParams: config.filterParams});
         });
         this._isValid = true;
         this.draw();
      }),

      /** Отдаёт ось по имени
       * @param name
       * @return {ChartAxisDefault}
       */
      getAxis: function(name) {
         return this._axesByName[name];
      },

      /** Отдаёт серию по имени
       * @param name
       * @return {ChartLineSerie}
       */
      getSeries: function(name) {
         return this._seriesByName[name];
      },

      _forEachAxes: function(axisFn) {
         forEach(this._axes, axisFn, this);
      },

      _reduceAxes: function(axisFn, memo) {
         return reduce(this._axes, axisFn, memo);
      },

      _reduceSeries: function(serieFn, memo) {
         return reduce(this._series, serieFn, memo);
      },

      _invalidateBoundsForAll: function(objs) {
         forEach(objs, function(obj) { obj._invalidateDrawBounds(); });
      },

      /** Расставляет оси и серии по полю @private  */
      _layout: function() {
         var self = this;
         this._runInternalChange(function() {

            forEach(this._axes, function(axis) { axis._preCalcLayout(true); });

            function layoutContent(contentBounds, implicitMargin) {
               var canReflow = !implicitMargin,
                   inReflow = !!implicitMargin,
                   sidesToIterate = {left: 1, right: 1, top: 1, bottom: 1},
                   directionBySide = {left: -1, right: 1, top: -1, bottom: 1};

               implicitMargin = implicitMargin || {left: 0, right: 0, top: 0, bottom: 0};

               function forEachAxis(side, boundOnly, axisFn) {
                  var axes = self._axesBySide[side],
                     dir = directionBySide[side],
                     range = (dir === 1 ? [0, axes.length] : [axes.length - 1, -1]),
                     axis, boundAxis, i;
                  for (i = range[0]; i != range[1]; i += dir) {
                     axis = axes[i];
                     boundAxis = axis._getBoundAxis();
                     if (boundOnly && boundAxis) {
                        axis._setVisibleImplicit(true);
                        axisFn(axis, boundAxis);
                     }
                     else if (boundOnly === undefined || (!boundOnly && !boundAxis)) {
                        axisFn(axis, boundAxis);
                     }
                  }
               }

               var layoutAxes = function() {
                  var axesSize = {left: 0, right: 0, top: 0, bottom: 0},
                      dimBySize = {left: 'width', right: 'width', top: 'height', bottom: 'height'},
                      oppositeSide = {left: 'right', right: 'left', top: 'bottom', bottom: 'top'},
                      dependentSzSides = {left: {top: 1, bottom: 1}, right: {top: 1, bottom: 1},
                                          top: {left: 1, right: 1}, bottom: {left: 1, right: 1}},
                      chartR = {left: contentBounds.left, top: contentBounds.top,
                                width: Math.max(0, contentBounds.width - implicitMargin.left - implicitMargin.right),
                                height: Math.max(0, contentBounds.height - implicitMargin.top - implicitMargin.bottom)};

                  self._forEachAxes(function(axis) { axis._setVisibleImplicit(true); });

                  //Считаем сумму размеров всех фиксированных осей и их размеров на "обратной стороне"
                  forEach(sidesToIterate, function(_, side) {
                     forEachAxis(side, false, function(axis) {
                        var size = axis._getMaxBounds(),
                            dim = dimBySize[side],
                            dimVal = size[dim] - 1,
                            visible = (axesSize[oppositeSide[side]] + axesSize[side] + dimVal ) < chartR[dim];

                        if (visible && axis.getVisible()) {
                           axesSize[side] += dimVal;
                        }

                        axis._setVisibleImplicit(visible);
                     });
                  });

                  //Считаем сумму размеров всех привязанных осей...
                  forEach(sidesToIterate, function(_, side) {
                     forEachAxis(side, undefined, function(axis) {
                        var oppSize = axis._getOppositeMaxBounds(),
                            dim = dimBySize[side];

                        axesSize[oppositeSide[side]] += (oppSize[dim] - 1);
                     });
                  });

                  forEach(sidesToIterate, function(_, side) {
                     if (self._legend.getSide() !== side) {
                        var depSizeSz = dependentSzSides[side];
                        for (var depSide in depSizeSz) {
                           if (!depSizeSz.hasOwnProperty(depSide))
                              continue;

                           if (self._axesBySide[depSide].length > 0) {
                              axesSize[side] =
                                 Math.max(axesSize[side], ChartGraphConst.axisStartEndGap[ChartGraphConst.HV_BySide[depSide]]);
                              break;
                           }
                        }
                     }
                  });

                  chartR.left = contentBounds.left + axesSize.left + implicitMargin.left;
                  chartR.top = contentBounds.top + axesSize.top + implicitMargin.top;
                  chartR.width = Math.max(0, chartR.width - axesSize.left - axesSize.right);
                  chartR.height = Math.max(0, chartR.height - axesSize.top - axesSize.bottom);

                  var x, y;

                  ////////////////////////////////////////////////////
                  //Сначала место под легенды зон серий от правых осей
                  x = chartR.left + 1;

                  forEachAxis('right', undefined, function(axis) {
                     var width = axis._getOppositeMaxBounds().width;
                     axis._setOppositeDrawBounds({left: x - width, top: chartR.top, width: width, height: chartR.height});

                     if (axis.getVisible() && width > 0)
                        x -= (width - 1);
                  });

                  //Теперь место под левые оси

                  forEachAxis('left', undefined, function(axis, boundAxis) {
                     var width = axis._getMaxBounds().width;
                     axis._setDrawBounds({left: x - width, top: chartR.top, width: width, height: chartR.height});

                     if (axis.getVisible() && width > 0 && !boundAxis)
                        x -= (width - 1);
                  });

                  ////////////////////////////////////////////////////
                  //Сначала место под легенды зон серий от левых осей

                  x = chartR.left + chartR.width;
                  forEachAxis('left', undefined, function(axis) {
                     var width = axis._getOppositeMaxBounds().width;
                     axis._setOppositeDrawBounds({left: x, top: chartR.top, width: width, height: chartR.height});
                     if (axis.getVisible() && width > 0)
                        x += (width - 1);
                  });

                  //Теперь место под правые оси

                  forEachAxis('right', undefined, function(axis, boundAxis) {
                     var width = axis._getMaxBounds().width;
                     axis._setDrawBounds({left: x, top: chartR.top, width: width, height: chartR.height});
                     if (axis.getVisible() && width > 0 && !boundAxis)
                        x += (width - 1);
                  });

                  ////////////////////////////////////////////////////
                  //Сначала место под легенды зон серий от нижних осей

                  y = chartR.top + 1;

                  forEachAxis('bottom', undefined, function(axis) {
                     var height = axis._getOppositeMaxBounds().height;
                     axis._setOppositeDrawBounds({left: chartR.left, top: y - height, width: chartR.width, height: height});

                     if (axis.getVisible() && height > 0)
                        y -= (height - 1);
                  });

                  //Теперь место под верхние оси

                  forEachAxis('top', undefined, function(axis, boundAxis) {
                     var height = axis._getMaxBounds().height;
                     axis._setDrawBounds({left: chartR.left, top: y - height, width: chartR.width, height: height});

                     if (axis.getVisible() && height > 0 && !boundAxis)
                        y -= (height - 1);
                  });

                  ////////////////////////////////////////////////////
                  //Сначала место под легенды зон серий от верхних осей
                  y = chartR.top + chartR.height;

                  forEachAxis('top', undefined, function(axis) {
                     var height = axis._getOppositeMaxBounds().height;
                     axis._setOppositeDrawBounds({left: chartR.left, top: y, width: chartR.width, height: height});

                     if (axis.getVisible() && height > 0)
                        y += (height - 1);
                  });

                  //Теперь место под нижние оси

                  forEachAxis('bottom', undefined, function(axis, boundAxis) {
                     var height = axis._getMaxBounds().height;
                     axis._setDrawBounds({left: chartR.left, top: y, width: chartR.width, height: height});

                     if (axis.getVisible() && height > 0 && !boundAxis)
                        y += (height - 1);
                  });

                  return {chartR: chartR};
               }.bind(this);

               layoutAxes();

               self._forEachAxes(function(axis) { axis._preCalcLayout(false, inReflow); });

               var chartR = layoutAxes().chartR;

               self._gridDrawBounds = chartR;
               self._forEachAxes(function(axis) {
                   axis._setGridDrawBounds(chartR);
               });

               var layoutBoundAxes = function () {
                  forEach(sidesToIterate, function(_, side) {
                     forEachAxis(side, true, function(axis, boundAxis) {

                        var boundParams = axis._getBoundAxisParams(),
                            zoneIdx = boundParams.zoneIdx,
                            posMapFunc = boundAxis._getAxisPosFromValueFunc(zoneIdx),
                            range = boundAxis.getDataRangeCalc(),
                            formatter = boundAxis.getDataFormat(),
                            val, pos, axisLineDiff, bounds;

                        if (range.min !== null && range.max !== null) {
                           if (boundParams.value === undefined) {  //TODO: !!! убрать проверку!!!
                              throw new Error('boundParams.value === undefined !!!!');
                           }
                           else {
                              val = boundParams.value;
                           }

                           if (boundParams.round !== undefined) {
                              val = formatter.roundToInterval(val, boundParams.round, false);
                           }

                           pos = posMapFunc(val);

                           axisLineDiff = axis._getAxisLineDiff();
                           pos.x -= axisLineDiff.x;
                           pos.y -= axisLineDiff.y;
                        }
                        else {
                           pos = {x: 0, y: 0};
                        }

                        bounds = extend({left: chartR.left + pos.x,
                                         top: chartR.top + pos.y,
                                         width: chartR.width,
                                         height: chartR.height}, axis._getMaxBounds());

                        if (bounds.left < 0)
                           implicitMargin.left = Math.max(-bounds.left, implicitMargin.left);

                        if (bounds.top < 0)
                           implicitMargin.top = Math.max(-bounds.top, implicitMargin.top);


                        val = chartR.left + chartR.width - bounds.left - bounds.width;
                        if (val < 0)
                           implicitMargin.right = Math.max(-val, implicitMargin.right);

                        val = chartR.top + chartR.height - bounds.top - bounds.height;
                        if (val < 0)
                           implicitMargin.bottom = Math.max(-val, implicitMargin.bottom);

                        axis._setDrawBounds(bounds);
                     });
                  }, this);
               }.bind(this);
               layoutBoundAxes();

               self._invalidateBoundsForAll(self._series);
               self._invalidateBoundsForAll(self._rangeAreas);

               var extraMarginExtend = function(_margin, obj) {
                  var extra = obj._getExtraMargin();
                  return { left: Math.max(_margin.left, extra.left), right: Math.max(_margin.right, extra.right),
                           top: Math.max(_margin.top, extra.top), bottom: Math.max(_margin.bottom, extra.bottom) };
               };

               var haveChanges = self._reduceAxes(function(_haveChanges, axis) {
                  var seriesMargin = axis._reduceVisibleZones(function(_margin, zone) {
                     var result = zone._reduceSeries(extraMarginExtend, _margin);
                     return zone._reduceRangeAreas(extraMarginExtend, result);
                  }, {left: 0, right: 0, top: 0, bottom: 0});

                  axis._setSeriesMargin(seriesMargin);
                  return _haveChanges || (seriesMargin.left !== 0 ||
                                          seriesMargin.right !== 0 ||
                                          seriesMargin.top !== 0 ||
                                          seriesMargin.bottom !== 0);
               }, false);

               if (haveChanges)
                  layoutBoundAxes();

               if (canReflow &&
                  (implicitMargin.left > 0 || implicitMargin.top > 0 ||
                   implicitMargin.top > 0 || implicitMargin.bottom > 0))
               {
                  layoutContent(contentBounds, implicitMargin);
               }
            }

            var margin = clone(self._options.margin);

            margin.left   = Math.max(ChartGraphConst.minMargin, margin.left);
            margin.right  = Math.max(ChartGraphConst.minMargin, margin.right);
            margin.top    = Math.max(ChartGraphConst.minMargin, margin.top);
            margin.bottom = Math.max(ChartGraphConst.minMargin, margin.bottom);

            var contentBounds = {left: margin.left, top: margin.top,
                                 width: Math.max(0, self._options.width - margin.left - margin.right),
                                 height: Math.max(0, self._options.height - margin.top - margin.bottom)},
                legendInside = self._legend._getInsideChart(),
                legendMargin;

            if (!legendInside) {
               self._legend._setDrawBounds(contentBounds);
               legendMargin = self._legend._getLayoutMargin();

               contentBounds.left += legendMargin.left;
               contentBounds.top += legendMargin.top;
               contentBounds.width -= (legendMargin.left + legendMargin.right);
               contentBounds.height -= (legendMargin.top + legendMargin.bottom);
            }

            layoutContent(contentBounds);

            self._invalidateBoundsForAll(self._rangeAreas);

            if (legendInside)
               self._legend._setDrawBounds(self._gridDrawBounds);
         });
      },

      /** удаляем все графические raphael-элементы, созданные диаграммой и её компонентами. @private */
      _clearDraw: function() {
         forEach(this._graphSet, function(gs) { gs.remove(); });
         this._graphSet = [];

         forEach([this._axes, this._series, this._rangeAreas, [this._legend]],
            function (objs) { forEach(objs, function(obj) {
               if (obj)
                  obj._clearDraw();
            });
         });
      },

      _clearData: function() {
         this._chartData = [];
      },

      _drawEachVisible: function(collection) {
         var result = [];
         forEach(collection, function(item) {
            if (item.getVisible())
               result.push(item._draw());
         });
         return result;
      },

      /** функция, непосредственно реализующая отрисовку диаграммы. @private */
      _drawChart: function() {
         this._layout();

         var self = this,
             canvas = this.getCanvas(),
             gridBounds = this._gridDrawBounds,
             styleCompiled = this._styleCompiled,
             el, style;

         style = (styleCompiled.gridFrame && styleCompiled.gridFrame.pathStyle);
         if (style) {
            el = canvas.rect(gridBounds.left, gridBounds.top, gridBounds.width, gridBounds.height);
            el.attr(style);
            this._graphSet.push(el);
         }

         style = (styleCompiled.chartFrame && styleCompiled.chartFrame.pathStyle);
         if (style && this._options.width > 0 && this._options.height > 0) {
            el = canvas.rect(0, 0, this._options.width - 1, this._options.height - 1);
            el.attr(style);
            this._graphSet.push(el);
         }

         var partPainters = {},
             partPainterInit = {
                axis: function() { return self._drawEachVisible(self._axes); },
                series: function() { return self._drawEachVisible(self._series); },
                rangeAreas: function() { return self._drawEachVisible(self._rangeAreas); },
                legend: function() {
                   return [function() { self._legend._draw(); }];
                }
             };

         var parts = styleCompiled.drawPhases;

         forEach(parts, function(part) {
            var partName = part.part;

            if (!(partName in partPainters))
               partPainters[partName] = partPainterInit[partName] ? partPainterInit[partName]() : [];

            var phasePainters = partPainters[partName], phases = part.phases;

            forEach(phases, function(phase) {
               forEach(phasePainters, function(painter) {
                  painter(phase);
               });
            });
         });
      },

      /**  @private */
      _getAxisMarkStyle: function(name) {
         var defStyle = this._defaultMarkStyle;
         return (name ? this._axisMarkStyles[name] : defStyle) || defStyle;
      },

      /**  @private */
      _getAxisMarkStyleConfig: function(name) {
         var result;
         if (!(name && (result = this._axisMarkStyleConfigs[name])))
            result = {};

         return extend(clone(ChartGraphConst.defaultAxisMarkStyle), result);
      },

      /**  @private */
      _getAxisStyleConfig: function(name) {
         var result;
         if (!(name && (result = this._axisStyleConfigs[name])))
            result = {};
         return extend(clone(ChartGraphConst.defaultAxisStyle), result);
      },

      /**  @private */
      _getSerieStyleConfig: function(baseName, style, type) {
         var base;
         if (!baseName || typeof baseName === 'string') {
            base = (baseName && this._serieStyleConfigs[baseName]) || {};
            base = extendStyle(ChartGraphConst.defaultSerieStyle[type], base);
         } else {
            base = baseName;
         }
         return extendStyle(base, style);
      },

      _getRangeAreaStyleConfig: function(baseName, style) {
         var base;
         if (!baseName || typeof baseName === 'string') {
            base = (baseName && this._rangeAreaStyleConfigs[baseName]) || {};
            base = extendStyle(ChartGraphConst.defaultRangeArea.style, base);
         } else {
            base = baseName;
         }
         return extendStyle(base, style);
      },

      _getSerieLabelsStyleConfig: function(baseName, style) {
         var base;
         if (!baseName || typeof baseName === 'string') {
            base = (baseName && this._serieLabelStyleConfigs[baseName]) || {};
            base = extendStyle(ChartGraphConst.defaultSerieLabelStyle, base);
         } else {
            base = baseName;
         }
         return extendStyle(base, style);
      },

      /** сбрасывет значения и очищает график @private */
      _reset: function(){
         if (this._haveObjects) {
            this._clearDraw();
            this._removeAxes();
            this._removeSeries();
            this._removeLegend();
         }

         for (var i in this._defaultObjects) {
            if (!this._defaultObjects.hasOwnProperty(i))
               continue;

            this[i] = clone(this._defaultObjects[i]);
         }

         if (this._options.onPrepareData) {
            this.unsubscribe('onPrepareData', this._options.onPrepareData);
         }

         this._haveObjects = true;
      },

      /**  Удаляем все оси из диаграммы: удаляем их raphael-объекты из DOM, отцепляем события... @private */
      _removeAxes: function() {
         forEach(this._axes, function(axis) { axis._remove(); });
      },

      /**  Удаляем все серии из диаграммы: удаляем их raphael-объекты из DOM, отцепляем события... @private */
      _removeSeries: function() {
         forEach(this._series, function(serie) { serie._remove(); });
      },

      /**  Удаляем все области значений из диаграммы: удаляем их raphael-объекты из DOM, отцепляем события... @private */
      _removeRangeAreas: function() {
         forEach(this._rangeAreas, function(rangeArea) { rangeArea._remove(); });
      },

      _removeLegend: function() {
         if (this._legend)
            this._legend._remove();
      },

      /** удаляем объекты компонентов диаграммы из SVG-DOM, отцепляем компоненты от событий - очищаем диаграмму @private */
      _remove: function(){
         this._clearDraw();
         this._clearData();

         this._removeAxes();
         this._removeSeries();
         this._removeRangeAreas();
         this._removeLegend();
      },

      _getStdDataIntf: function() {
         var self = this;
         if (!this._stdDataIntf) {
            this._stdDataIntf = {
               getCount: function() { return self._chartData.length; },
               getFieldValue: function(index, field) { return self._chartData[index][field]; }
            }
         }

         return this._stdDataIntf;
      },

      /**
       * Загружает данные в диаграмму. Реализация метода {$ws.proto.AbstractGraph.setData}
       * Если диаграмма не готова (getReadyDeferred().isReady() == false), и ожидает результата обращения к бизнес-логике, то вызов будет отложен до готовности диаграммы.
       * @param {Array} data - массив объектов с полями: [{f1: x, f2: y}, {f1: x1, f2: x2}...]. поля соответствуют данным осей.
       * @return {$ws.proto.Deferred} Объект ожидания готовности диаграммы
       */
      setData: readyDefWrapper(function(data) {
         var dataByEvents;

         dataByEvents = this._notify('onPrepareData', data);
         if (dataByEvents !== undefined)
            data = dataByEvents;

         this._chartData = data;
         if (data instanceof Array)
            this._chartDataIntf = this._getStdDataIntf();
         else { //Передан объект-интерфейс к данным
            if (typeof data.getCount !== 'function' ||
               typeof data.getFieldValue !== 'function') {
               throw new Error('Неправильный аргумент data: он не является ни массивом, ни объектом-интерфейсом к данным (у такого объекта должны быть функции getCount и getFieldValue)');
            }

            this._chartDataIntf = this._chartData;
         }

         this._runInternalChange(function() {
            forEach(this._axes, function(axis) {
               axis._setDataIntf(this._chartDataIntf);
            }, this);

            forEach(this._series, function(serie) { serie._invalidate('pointLabels'); });
         });

         if (!this._inInternalChange()) {
            this.draw();
         }
         this._notify('onAfterLoad');
      })
   });

   return $ws.proto.RaphaelChartGraph;
});