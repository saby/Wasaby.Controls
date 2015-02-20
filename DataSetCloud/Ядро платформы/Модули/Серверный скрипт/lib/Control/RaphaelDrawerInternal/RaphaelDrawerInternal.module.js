define("js!SBIS3.CORE.RaphaelDrawerInternal", [
   "js!SBIS3.CORE.Control",
   "is!browser?js!SBIS3.CORE.RaphaelDrawerInternal/resources/ext/graphael/raphael-min",
   "is!browser?js!SBIS3.CORE.RaphaelDrawerInternal/resources/ext/graphael/g.raphael-min"], function() {
   "use strict";

   var forEach = $ws.helpers.forEach,
       reduce = $ws.helpers.reduce;

   function clone(obj) {
      obj = {v: obj};
      var result = $ws.core.merge({}, obj, {clone: true});
      return result.v;
   }

   function extend(objBase, objExtend) {
      return $ws.core.merge(objBase, objExtend, {clone: true});
   }

   function normalizeBounds(bounds) {
      bounds.right = bounds.left + bounds.width;
      bounds.bottom = bounds.top + bounds.height;
      return bounds;
   }

   function createBox(x, y, w, h) {
      return {x: x, y: y, x2: x + w, y2: y + h, width: w, height: h};
   }

   function boxesOverlap(box1, box2) {
      return ((box1.x >= box2.x && box1.x <= box2.x2) || (box2.x >= box1.x && box2.x <= box1.x2)) &&
         ((box1.y >= box2.y && box1.y <= box2.y2) || (box2.y >= box1.y && box2.y <= box1.y2));
   }

   function ensureArray(arr) {
      if (arr === undefined)
         return [];
      else if (arr instanceof Array)
         return arr;
      else
         return [arr];
   }

   function isArray(obj) {
      return obj instanceof Array;
   }

   function extendStyle(base, style) {
      var result = {},
         styleV, baseV, baseArr, i, j, ln, res, baseV_;

      style = style || {};

      function needClone(v) {
         return typeof v === 'object' && v !== null && !(v instanceof Date);
      }

      for (i in base) {
         if (base.hasOwnProperty(i) && !style.hasOwnProperty(i)) {
            result[i] = needClone(base[i]) ? clone(base[i]) : base[i];
         }
      }

      for (i in style) {
         if (style.hasOwnProperty(i)) {
            styleV = style[i];
            if (needClone(styleV)) {
               if (base.hasOwnProperty(i) && needClone(base[i])) {
                  baseV = base[i];
                  baseArr = isArray(baseV);

                  if (isArray(styleV)) {
                     res = [];

                     for (j = 0, ln = styleV.length; j !== ln; j++) {
                        baseV_ = baseArr ? (baseV[j] || {}) : baseV;

                        res.push(extend(clone(baseV_), styleV[j]));
                     }
                     result[i] = res;
                  } else if (baseArr) {
                     result[i] = clone(styleV);
                  } else {
                     result[i] = extendStyle(baseV, styleV);
                  }
               } else {
                  result[i] = clone(styleV);
               }
            } else {
               result[i] = styleV;
            }
         }
      }
      return result;
   }

   function ensureDeferred(obj) {
      return obj instanceof $ws.proto.Deferred ? obj : (new $ws.proto.Deferred()).callback(obj);
   }

   function readyDefCallbackWrapper(func, context) {
      var result = function() {
         var result, args = arguments;
         this._readyDefCallbackWrapperCnt++;
         try {
            result = func.apply(this, args);
         } finally {
            this._readyDefCallbackWrapperCnt--;
         }
         return result;
      };

      return context ? result.bind(context) : result;
   }

   function readyDefWrapper(func) {
      function isNotReadyDeferred(obj) {
         return obj instanceof $ws.proto.Deferred && !obj.isReady();
      }

      function getReadyDeferred() {
         return this.getReadyDeferred();
      }

      function runWrapped(func, args) {
         var result;
         this._readyDefWrapperCnt++;//счётчик вложенности вызовов
         try {
            result = func.apply(this, args);
            if (isNotReadyDeferred(result)) {
               if (getReadyDeferred.call(this).isReady())
                  this._resetDeadyDeferred();
               this._readyDeferred.push(result);
            }
         } finally {
            this._readyDefWrapperCnt--;
            if (this._readyDefWrapperCnt === 0) { //закрываем объект ожидания готовности в верхнем вызове
               if (!getReadyDeferred.call(this).isReady()) {
                  this._readyDeferred.done();
               }
            }
         }
         return result;
      }

      return function() {
         var result, args = arguments;
         if (this._isInitialized) {
            if (this._readyDefCallbackWrapperCnt === 0) { //Если это вызов метода, обёрнутого в readyDefWrapper (или вызов из обработчика readyDeferred)
               var readyDef = getReadyDeferred.call(this);
               //если это вложенный вызов, то не откладывать его до готовности
               if (this._readyDefWrapperCnt > 0 || readyDef.isReady()) {
                  result = ensureDeferred(runWrapped.call(this, func, args));
               } else {
                  //Если компонент не готов (getReadyDeferred), надо отложить вызов обёрнутого метода до готовности,
                  //и вернуть результат, по которому можно дождаться готовности и окончания метода
                  result = readyDef.addBoth(function() {
                     //после срабатывания готовности
                     return runWrapped.call(this, func, args);
                  }.bind(this)).createDependent();
               }
            } else {
               //если мы выполняем обработчик асинхронного результата в обёрнутом методе, то ждать готовности и изменять готовность не надо
               // - после обработчика засигналится готовность (когда все такие обработчики выполнятся)...
               result = func.apply(this, args);
            }
         } else {
            //При инициализации  просто складываем деферреды - закончится инициализация - будем ждать всех сразу
            result = func.apply(this, args);
            if (isNotReadyDeferred(result))
               this._readyDeferred.push(result);
         }
         return result;
      };
   }

   function argumentsToArray(args) {
      return Array.prototype.slice.call(args);
   }

   function isSimpleValue(val) {
      return typeof val === 'string' || typeof val === 'number' || val === null || val === undefined;
   }

   function registerElementsBindEvents(els, drawEventArgs, isPermanent) {
      var self = this;
      forEach(els, function(el) {
         if (el.isOld)
            return;

         if (isPermanent)
            self._graphSetPermanent.push(el);
         else
            self._graphSet.push(el);

         if (drawEventArgs) {
            if (self.hasEventHandlers('onElementMouseDown'))
               el.mousedown(function() { self._notify.apply(self, ['onElementMouseDown'].concat(drawEventArgs, el)); });

            if (self.hasEventHandlers('onElementMouseUp'))
               el.mouseup(function() { self._notify.apply(self, ['onElementMouseUp'].concat(drawEventArgs, el)); });

            if (self.hasEventHandlers('onElementMouseOver'))
               el.mouseover(function() { self._notify.apply(self, ['onElementMouseOver'].concat(drawEventArgs, el)); });

            if (self.hasEventHandlers('onElementMouseOut'))
               el.mouseout(function() { self._notify.apply(self, ['onElementMouseOut'].concat(drawEventArgs, el)); });
         }
      });
   }

   function textStyleToCss(style) {
      var propMap = {fill: 'color', 'font-family': true, 'font-size': true,  'font-weight': true, 'font-style': true};
      return reduce(style, function(memo, value, name) {
         if (name in propMap) {
            var cssName = propMap[name] === true ? name : propMap[name];
            memo.push(cssName + ': ' + style[name]);
         }
         return memo;
      }, []).join(';');
   }

   function removeBr(text) {
      return text && ("" + text).replace(/<br>/g, ' ').replace(/\n/g, '');
   }

   /** @class Базовый класс элемента диаграммы $ws.proto.RaphaelChartGraph */
   var ChartBaseElement = $ws.proto.Abstract.extend(/** @lends ChartBaseElement */ {
      $protected: {
         _visible: true,

         _visibleImplicit: true,
         _drawBounds: null,
         _chart: null,
         _graphSet: [],
         _graphSetPermanent: [],
         _validState: { drawing: false },
         _drawBoundsInvalidateParts: ['drawing'],

         _eventNames: {'onElementCustomDraw': 1, 'onElementMouseDown': 1, 'onElementMouseUp': 1,
                       'onElementMouseOver': 1, 'onElementMouseOut': 1}
      },

      $constructor: function(cfg) {
         this._visible = (cfg.visible !== undefined) ? cfg.visible : true;
         this._chart = cfg.chart;
         delete cfg.chart;

         forEach(this._eventNames, function(_, name) {
            this._publish(name);
            if (cfg[name])
               this.subscribe(name, cfg[name]);
         }, this);

         this._publish('onChange');
      },

      _setVisibleImplicit: function(value) {
         this._visibleImplicit = value;
      },

      //задаём явную видимость компоненту
      setVisible: function(value) {
         if (this._visible !== value) {
            this._visible = value;
            this._chart._onComponentChange('element', 'visible');
         }
      },

      getVisible: function() {
         return this._visible && this._visibleImplicit;
      },

      /** инвалидация внутренних данных компонента */
      _invalidate: function(state) {
         if (state) {
            forEach(ensureArray(state), function(st) {
               this._validState[st] = false;
            }, this);
         }
         else {
            for (var i in this._validState) {
               if (!this._validState.hasOwnProperty(i))
                  continue;

               this._validState[i] = false;
            }
         }
      },

      _invalidateDrawBounds: function() {
         forEach(this._drawBoundsInvalidateParts, function(part) { this._invalidate(part); }, this);
      },

      _needValidatePart: function(needParts, part) {
         return needParts[part] && !this._validState[part];
      },

      /** задаём область для отрисовки */
      _setDrawBounds: function(bounds) {
         this._invalidateDrawBounds();
         this._drawBounds = bounds;
      },

      _getDrawBounds: function() {
        return this._drawBounds;
      },

      /** удаляем внутренние рафаэлевские объекты */
      _clearDraw: function(withPermanent) {
         forEach(this._graphSet, function(gr) { gr.remove(); });
         this._graphSet = [];

         if (withPermanent) {
            forEach(this._graphSetPermanent, function(gr) { gr.remove(); });
            this._graphSetPermanent = [];
         }
      },

      /** чистим данные компонента: отцепляем события, удаляем графические рафаэлевскиие объекты  */
      _remove: function() {
         this._clearDraw(true);
         forEach(this._eventNames, function(_, name) { this.unbind(name); }, this);
      },

      _dataChanged: function() {
         this._invalidate();
      },

      _registerElementsBindEvents: registerElementsBindEvents,

      _customDrawFn: function() {
         var result = [], self = this;

         if (self.hasEventHandlers('onElementCustomDraw')) {
            self.enumerateElements(function() {
               var elements = ensureArray(self._notify.apply(self, ['onElementCustomDraw'].concat(argumentsToArray(arguments)))),
                  args = argumentsToArray(arguments);

               forEach(elements, function(element) {
                  if (element)
                     result.push({element: element, drawEventArgs: args});
               });
            });
         }

         return result;
      }
   });

   var InBoundsBySideCalc = function(side, sidePos, sideErrMsg, sidePosErrMsg) {
      var posKoef = {start: 0, center: 0.5, end: 1}[sidePos],
          sideKoefs = {
            left :  {left: 0, top: 0, x: 0, y: 1, mLeft: 1, mTop: 0, mRight: 0, mBottom: 0, width: 0},
            right:  {left: 1, top: 0, x: 0, y: 1, mLeft: 0, mTop: 0, mRight: 1, mBottom: 0, width: 0},
            top:    {left: 0, top: 0, x: 1, y: 0, mLeft: 0, mTop: 1, mRight: 0, mBottom: 0, width: 1},
            bottom: {left: 0, top: 1, x: 1, y: 0, mLeft: 0, mTop: 0, mRight: 0, mBottom: 1, width: 1}
          }[side],
          sideRotate = {
            top: null, bottom: null, left: '270', right: '90'
          };

      if (sideKoefs === undefined)
         throw new Error(sideErrMsg);

      if (posKoef === undefined)
         throw new Error(sidePosErrMsg);

      return {
         getStartPoint: function(bounds) {
            var x = bounds.left + (sideKoefs.left * bounds.width) + (posKoef * sideKoefs.x * bounds.width),
                y = bounds.top + (sideKoefs.top * bounds.height) + (posKoef * sideKoefs.y * bounds.height);

            return {x: x, y: y};
         },

         getSideKoefs: function() { return sideKoefs; },
         getSideRotate: function() { return sideRotate; },

         getPositionElementOnSideDiff: function(elBox, bounds, sidePadding) {
            var bRight = bounds.left + bounds.width,
               bBottom = bounds.top + bounds.height,
               dx = (bRight - sidePadding) - elBox.x2,
               dy = (bBottom - sidePadding) - elBox.y2;

            if (dx > 0) {
               dx = Math.max(0, (bounds.left + sidePadding) - elBox.x);
            }

            if (dy > 0) {
               dy = Math.max(0, (bounds.top + sidePadding) - elBox.y);
            }

            return {x: dx, y: dy};
         }
      }
   };

   var ChartLegend = ChartBaseElement.extend({
      $protected: {
         _legends: [], //[{pathStyle, description}]
         _padding: 0,
         _sideKoefs: undefined,
         _interLegendPadding: undefined,
         _legendLineWidth: undefined,
         _legendLineTextPadding: undefined,
         _textStyle: undefined,
         _config: undefined,
         _side: undefined,
         _explicitWidth: undefined,
         _explicitHeight: undefined,
         _sideCalc: undefined,

         _layout: {
            layoutMargin: undefined,
            elementsOrdered: undefined
         }
      },

      $constructor: function(cfg) {
         this._config = cfg;
         this._legends = cfg.legends;

         this._padding = parseFloat(cfg.padding);
         if (isNaN(this._padding) || (this._padding < 0))
            throw new Error('Задан неправильный параметр  padding у легенды. ' + cfg.padding + ' Он должен быть числом больше или равным нулю.');

         this._interLegendPadding = parseFloat(cfg.interLegendPadding);
         if (isNaN(this._interLegendPadding) || (this._interLegendPadding < 0))
            throw new Error('Задан неправильный параметр interLegendPadding у легенды. ' + cfg.interLegendPadding + ' Он должен быть числом больше или равным нулю.');


         this._legendLineWidth = parseFloat(cfg.legendLineWidth);
         if (isNaN(this._legendLineWidth) || (this._legendLineWidth <= 0))
            throw new Error('Задан неправильный параметр legendLineWidth у легенды. ' + cfg.legendLineWidth + ' Он должен быть числом больше нуля.');

         this._legendLineTextPadding = parseFloat(cfg.legendLineTextPadding);
         if (isNaN(this._legendLineTextPadding) || (this._legendLineTextPadding <= 0))
            throw new Error('Задан неправильный параметр legendLineTextPadding у легенды. ' + cfg.legendLineTextPadding + ' Он должен быть числом больше нуля.');

         this._textStyle = cfg.textStyle;
         this._frameStyle = cfg.frameStyle;

         this._sideCalc = InBoundsBySideCalc(cfg.side, cfg.sidePosition,
                                             'Задан неправильный параметр side у легенды. ' + cfg.side + ' Он должен быть одним из вариантов: left/right/top/bottom.',
                                             'Задан неправильный параметр sidePosition у легенды. ' + cfg.sidePosition + ' Он должен быть одним из вариантов: start/center/end.');

         this._side = cfg.side;
         this._sideKoefs = this._sideCalc.getSideKoefs();

         if (cfg.width !== undefined) {
            this._explicitWidth = parseFloat(cfg.width);
            if (isNaN(this._explicitWidth))
               throw new Error('Задан неправильный параметр width у легенды. ' + cfg.width);
         }

         if (cfg.height !== undefined) {
            this._explicitHeight = cfg.height;
            if (isNaN(this._explicitHeight))
               throw new Error('Задан неправильный параметр height у легенды. ' + cfg.height);
         }
      },

      getSide: function() {
         return this._side;
      },

      _setLegends: function(legends) {
         this._legends = legends;
      },

      _clearDraw: function() {
         var inherited = ChartLegend.superclass._clearDraw;
         inherited.call(this);

         this._layout.elementsOrdered = [];
      },

      _createLayout: function() {
         function checkBox(box, x, y) {
            if (isNaN(box.x) || isNaN(box.y) || isNaN(box.height) || isNaN(box.width)) {
               box.x = x;
               box.y = y;
               box.height = 5;
               box.width = 5;
               box.x2 = box.x + box.width;
               box.y2 = box.y + box.height;
            }
         }

         //вход: _visible, _drawBounds
         var layout = this._layout,
             wrapWidth = (this._drawBounds.width - this._padding * 2) * this._sideKoefs.width,
             pt0 = this._sideCalc.getStartPoint(this._drawBounds), x0 = pt0.x, y0 = pt0.y,
             canvas = this._chart.getCanvas();

         layout.layoutMargin = {left: 0, top: 0, right: 0, bottom: 0};
         layout.elementsOrdered = [];

         if (!canvas || !this.getVisible())
            return;

         if (this._explicitWidth !== undefined) {
            wrapWidth = this._explicitWidth - this._padding * 2;
         }

         function clearElements(arr, el0, el) {
            if (el !== null) {
               arr.pop();
               el.remove();
            }

            arr.pop();
            el0.remove();
         }

         var i, x = x0, y = y0, xMax = x0, xMax0 = x0, elements = [], legend, el0, el, box, rowHeight = 0,
             rowCnt = 0, yMin = y0, xMin = x0, rowsHeight, rowsWidth, strokeW, yMax;

         if (this._explicitHeight !== undefined) {
            yMax = yMin + this._explicitHeight - this._padding * 2;
         } else {
            yMax = Number.MAX_VALUE;
         }

         for (i = 0; i < this._legends.length; i++) {
            if (x - x0 > wrapWidth) {
               y = y + rowHeight + this._interLegendPadding;
               x = x0;
               rowHeight = 0;
               rowCnt = 0;
            }

            legend = this._legends[i];

            //При толстой линии почему-то она уезжает
            strokeW = parseInt(legend.style['stroke-width'], 10);
            if (strokeW && strokeW > 1) {
               x += strokeW / 2;
            }

            el0 = canvas.rect(x, y, this._legendLineWidth, 1).attr(legend.style);
            elements.push(el0);

            box = el0.getBBox();
            checkBox(box, x, y);
            rowHeight = Math.max(box.height, rowHeight);
            legendHeight = box.height;

            yMin = Math.min(yMin, box.y);
            xMin = Math.min(xMin, box.x);

            xMax0 = xMax;
            xMax = Math.max(xMax, box.x2);
            x = box.x2 + this._legendLineTextPadding;
            if (this._textStyle) {
               el = canvas.text(x, y, legend.description).attr({'text-anchor': 'start'}).attr(this._textStyle);

               elements.push(el);
               box = el.getBBox();
               checkBox(box, x, y);

               xMin = Math.min(xMin, box.x);

               rowHeight = Math.max(box.height, rowHeight);
               legendHeight = Math.max(box.height, legendHeight);

               x = box.x2 + this._interLegendPadding;
               xMax = Math.max(xMax, box.x2);

               el.attr({y: y + legendHeight / 2});
            } else {
               el = null;
            }

            el0.attr({y: y + legendHeight / 2});

            rowCnt++;

            if (y + rowHeight - yMin > yMax) {
               clearElements(elements, el0, el);
               xMax = xMax0;
               break;
            }

            if (rowCnt > 1 && (box.x2 - x0 > wrapWidth)) {
               clearElements(elements, el0, el);
               i--;
               y = y + rowHeight + this._interLegendPadding;
               x = x0;
               xMax = xMax0;
               rowHeight = 0;
               rowCnt = 0;
            }
         }

         if (this._explicitHeight !== undefined) {
            rowsHeight = yMax - yMin;
         } else {
            //y: "y" верха последней строки
            rowsHeight = y + rowHeight - yMin;
         }

         if (this._explicitWidth !== undefined) {
            rowsWidth = Math.max(wrapWidth, xMax - xMin);
         } else {
            rowsWidth = xMax - xMin;
         }

         var frameWidth = rowsWidth && (rowsWidth + this._padding * 2),
            frameHeight = rowsHeight && (rowsHeight + this._padding * 2),
            legendWidth = frameWidth && (frameWidth + this._padding * 2),
            legendHeight = frameHeight && (frameHeight + this._padding * 2),
            legendLeft = xMin - this._padding * 2,
            legendTop = yMin - this._padding * 2,
            frame = (frameWidth && frameHeight && this._frameStyle) ?
                     canvas.rect(xMin - this._padding, yMin - this._padding, frameWidth, frameHeight).
                     attr(this._frameStyle) :
                     null,
            ln;

         if (frame) {
            elements = [frame].concat(elements);
         }

         var dx = (x0 - legendLeft) - legendWidth / 2,
             dy = (y0 - legendTop) - legendHeight / 2;

         legendLeft += dx;
         legendTop += dy;

         if (legendTop < this._drawBounds.top)
            dy += this._drawBounds.top - legendTop;
         else if (legendTop + legendHeight > this._drawBounds.top + this._drawBounds.height)
            dy -= (legendTop + legendHeight - this._drawBounds.top - this._drawBounds.height);

         if (legendLeft < this._drawBounds.left)
            dx += this._drawBounds.left - legendLeft;
         else if (legendLeft + legendWidth > this._drawBounds.left + this._drawBounds.width)
            dx -= (legendLeft + legendWidth - this._drawBounds.left - this._drawBounds.width);

         for (i = 0, ln = elements.length; i !== ln; i++) {
            this._graphSet.push(elements[i]);
            elements[i].hide();
            elements[i].attr({x: elements[i].attr('x') + dx, y: elements[i].attr('y') + dy});
         }

         layout.elementsOrdered = elements;
         layout.layoutMargin = {left: legendWidth * this._sideKoefs.mLeft,
                                top: legendHeight * this._sideKoefs.mTop,
                                right: legendWidth * this._sideKoefs.mRight,
                                bottom: legendHeight * this._sideKoefs.mBottom};

         this._validState.drawing = true;
      },

      _getLayout: function() {
         if (!this._validState.drawing)
            this._createLayout();

         return this._layout;
      },

      _getLayoutMargin: function() {
         return this._getLayout().layoutMargin;
      },

      _getInsideChart: function() {
         return !!this._config.insideChart;
      },

      _draw: function() {
         var elements = this._getLayout().elementsOrdered, i, ln;
         for (i = 0, ln = elements.length; i !== ln; i++) {
            elements[i].show().toFront();
         }
      }
   });

   /**
    * @class Дефолтные значения стилей для компонентов RaphaelChartGraph
    * @private
    */
   var CommonGraphConst = {
      defaultLegendStyle: {
         side: 'top',
         sidePosition: 'center',
         visible: true,
         insideChart: false,
         padding: 10,
         interLegendPadding: 10,
         legendLineWidth: 30,
         legendLineTextPadding: 10,

         textStyle: {
            'font-size': 14
         },
         frameStyle: {
            stroke: 'gray',
            r: 5,
            'stroke-width': 1,
            fill: 'lightgray',
            'fill-opacity': 0.8
         }
      },

      side: {
         left: 'left',
         right: 'right',
         top: 'top',
         bottom: 'bottom'
      }
   };

   /**
    * @class $ws.proto.RaphaelAbstractGraph Базовый класс для всех диаграмм.
    * @extends $ws.proto.Control
    * @cfgOld {Object} raphael Рисовальный движок (http://raphaeljs.com/reference.html#Raphael). Это опция бывает нужна, когда код из одного фрейма хочет нарисовать график в другом фрейме.
    * Тогда в целевом фрейме надо загрузить скрипты движка (ws/ext/graphael/g.raphael.js, raphael.js, g.pie.js), и в конструктор диаграммы передать
    * в опциях raphael = someFrameWindow.Raphael
    * @cfgOld {Object} dataSource параметры получения данных, передаются непосредственно в $ws.proto.RecordSet
    *    пример использования смотри в описании $ws.proto.RecordSet
    * @cfgOld {Boolean} dataSource.firstRequest Загружать ли данные сразу по созданию ридера из этого dataSource
    * @cfgOld {Object} dataSource.readerParams Параметры для создания объекта-ридера данных
    * @cfgOld {String} dataSource.readerParams.queryName Имя запроса из бизнес-логики
    * @cfgOld {String} dataSource.readerParams.linkedObject Имя объекта бизнес-логики
    * @cfgOld {String} dataSource.readerParams.dbScheme Имя схемы данных бизнес-логики
    * @cfgOld {String} dataSource.readerType Тип объекта-ридера данных
    *
    * @cfgOld {Object} filterParams объект с полями и значениями, описывающими фильтр для параметра dataSource
    *
    * @cfgOld {$ws.proto.RecordSet} recordSet экземпляр класса
    * @cfgOld {Object} margin отступы в пикселях
    * @cfgOld {Number} margin.rigth отступ справа
    * @cfgOld {Number} margin.left отступ слева
    * @cfgOld {Number} margin.top отступ сверху
    * @cfgOld {Number} margin.bottom отступ снизу
    **/
   $ws.proto.RaphaelAbstractGraph = $ws.proto.Control.extend(/** @lends $ws.proto.RaphaelAbstractGraph */ {
      /**
       * @event onRecordSetChange Событие замены рекордсета
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       * @param {$ws.proto.RecordSet} newRecordSet Новый рекордсет
       * @param {$ws.proto.RecordSet} oldRecordSet Старый рекордсет
       */

      /**
       * @event onAfterLoad Событие после загрузки данных в диаграмму через setData или после обновления данных в рекордсете
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       */

      /**
       * @event onReady Событие после загрузки всех raphael-библиотек, необходимых для контрола, и готовности его к работе
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       */

      $protected: {
         _options: {
            width: undefined,
            height: undefined,
            dataSource: false,
            margin: { right:0, left: 0, top: 0, bottom: 0 },
            linkedContext: undefined
         },
         _raphael: null,
         _recordset: undefined,     //Итоговый рекордсет с данными
         _chartData: [],            //данные диаграммы
         _internalChangeCnt: 0,
         _readyDeferred: null,
         _readyDefWrapperCnt: 0,
         _readyDefCallbackWrapperCnt: 0,
         _firstSetSize: true,
         _canvas: null
      },

      $constructor : function(cfg) {
         this._publish('onClick', 'onHover', 'onOutHover','onAfterLoad', 'onRecordSetChange');
         this._resetDeadyDeferred();
         this._updateDataHandler = this._updateData.bind(this);

         this._options.width = parseFloat(this._options.width);
         this._options.height = parseFloat(this._options.height);

         if (!this._options.width && this._container)
            this._options.width = this._container.width();

         if (!this._options.height && this._container)
            this._options.height = this._container.height();

         var margin = this._options.margin;

         for(var i in margin) {
            if(margin.hasOwnProperty(i)) {
               margin[i] = parseInt(margin[i], 10);
               if (isNaN(margin[i]))
                  margin[i] = 0;
               else
                  margin[i] = Math.max(0, margin[i]);
            }
         }

         this._raphael = cfg.raphael || window.Raphael;
      },

      /**
       * Возвращает объект ожидания готовности диаграммы. Диаграмма считается готовой, если она не ожидает загрузки данных.
       * В готовую диаграмму можно устанавливать данные, и не бояться, что они затрутся ожидаемыми результатами вызова бизнес-логики.
       * @returns {$ws.proto.Deferred}
       */
      getReadyDeferred: function() {
         return this._readyDeferred.getResult();
      },

      _resetDeadyDeferred: function() {
         this._readyDeferred = new $ws.proto.ParallelDeferred();
         this._readyDeferred.getResult().addCallback(function() {
            this._notify('onReady');
         }.bind(this));
      },

      /**
       * Возвращает рафаэлевский объект типа @see <a href="http://raphaeljs.com/reference.html#Paper">Paper</a>
       * Его можно использовать для рисования поверх объектов диаграммы.
       * @returns {Object}
       */
      getCanvas: function() { return this._canvas; },

      /**
       * Находится ли диаграмма в состоянии пакетного обновления? В этом состоянии нельзя её перерисовывать...
       * @return {Boolean}
       * @private
       */
      _inInternalChange: function() { return this._internalChangeCnt > 0; },

      _extendDefaultOptionsByConfig: function(config, clazz) {
         var o = {};
         clazz.prototype._initializer.apply(o);

         $ws.helpers.forEach(o._options, function(v, k, options) {
            if (config.hasOwnProperty(k)) {
               options[k] = $ws.core.merge(v, config[k], { noOverrideByNull: true });
            }
         }, this);

         return o._options;
      },

      /**
       * Выполнить функцию в состоянии пакетного обновления. В этом состоянии метод draw отключен.
       * @param func
       * @private
       */
      _runInternalChange: function(func) {
         this._internalChangeCnt++;
         try
         {
            func.call(this);
         }
         finally {
            this._internalChangeCnt--;
         }
      },

      /**
       * Этот метод загружает рафаэлевские библиотеки, и потом строит диаграмму, после чего вызывает событие onReady
       * До этого события с API диаграммы работать нельзя.
       */
      init: function() {
         this._initChart();
         this.draw();

         this._readyDeferred.done();

         $ws.proto.RaphaelAbstractGraph.superclass.init.call(this);
      },

      /** Рисует график */
      draw: function(){
         if (this._inInternalChange() || !this._canvas || !this._isValid)
            return;

         this._options.width = Math.max(0, this._container.width());
         this._options.height = Math.max(0, this._container.height());

         this._clearDraw();
         if (this._options.width !== 0 && this._options.height !== 0) {
            this._drawChart();
         }
      },

      /** Инициализация диаграммы, создание внутренних объектов. Выполняется после загрузки всех рафаэлевских библиотек @private */
      _initChart: function() {
         //Создаём рисовалку
         if(!this._canvas) {
            this._canvas = this._raphael(this._container.get(0), Math.max(0, this._options.width), Math.max(0, this._options.height));
         }
      },

      /**  Обработчик события на обновление рекордсета (если он используется в качестве источника данных) @private */
      _updateData: readyDefCallbackWrapper(function() {
         var dataRow, data = [];
         if(this._recordset) {
            this._recordset.rewind();
            while((dataRow = this._recordset.next()) !== false){
               data.push(dataRow.toObject());
            }
         }

         this.setData(data);
      }),

      /** Очищает данные @private */
      _clearData: function(){ throw new Error('Method AbstractGraph::_clearData must be implemented'); },

      /**
       * Загрузить диаграмму из источника данных, описанного в параметре dataSource, подписаться на события обновления рекордсета, созданного по параметру dataSource
       * Если диаграмма не готова (getReadyDeferred().isReady() == false), и ожидает результата обращения к бизнес-логике, то вызов будет отложен до готовности диаграммы.
       * @param dataSource
       * @param options - доп. аргументы
       * @param options.filterParams значения фильтра
       * @return {$ws.proto.Deferred}
       */
      setDataSource: readyDefWrapper(function(dataSource, options) {
         var self = this, recDataSource;

         if ('context' in dataSource)
            delete dataSource['context'];

         dataSource = clone(dataSource);
         if (options.filterParams)
            dataSource.filterParams = options.filterParams;

         recDataSource = clone(dataSource);
         recDataSource.context = this._options.linkedContext;

         dataSource.context = this._options.linkedContext;
         this._options.dataSource = dataSource;

         var result = new $ws.proto.Deferred(),
             callback = function(recordset){
                if (dataSource.firstRequest) {
                   recordset.once('onAfterLoad', readyDefCallbackWrapper(function() {
                      self.setRecordSet(recordset);
                      result.callback();
                   }, self));
                } else {
                   result.callback();
                }
             };

         $ws.core.attachInstance('Source:RecordSet', recDataSource).addCallback(callback);
         return result;
      }),

      /**
       * Метод, выполняющий запрос к внутреннему рекордсету (если таковой установлен).
       * Если диаграмма не готова (getReadyDeferred().isReady() == false), и ожидает результата обращения к бизнес-логике, то вызов будет отложен до готовности диаграммы.
       * !Внимание. Параметры фильтрации не заменяются безусловно.
       * Вновь переданные домердживаются на все ранее сделанные.
       * @param {Object} filter Параметры фильтрации
       * @param {Boolean|undefined} clear очищать ли все записи при загрузке
       * @param {Object} [options] Объект с пользовательскими параметрами
       * @return {$ws.proto.Deferred} Объект ожидания готовности диаграммы
       */
      setQuery : readyDefWrapper(function(filter, clear, options){
         var recordSet = this.getRecordSet();
         if (recordSet)
            return recordSet.setQuery(filter, clear, options);
         else
            throw new Error('У диаграммы не задан рекордсет, к которому можно было бы делать запрос. Настройте источник данных диаграммы в Джинне или через методы setRecordSet/setDataSource');
      }),

      /**
       * Вызывает перегрузку диаграммы c перезапросом данных.
       * Если диаграмма не готова (getReadyDeferred().isReady() == false), и ожидает результата обращения к бизнес-логике, то вызов будет отложен до готовности диаграммы.
       * Возвращает деферред - готовность новых данных (и отрисовки тоже)
       * @return {$ws.proto.Deferred} Объект ожидания готовности диаграммы
       */
      reload: readyDefWrapper(function() {
         var recordSet = this.getRecordSet(),
             result;
         if (recordSet)
            result = recordSet.reload();
         else {
            result = this.setData(this._chartData || []);
         }

         return result;
      }),

      /**
       * Загрузить диаграмму из заданного рекордсета, подписаться на его события обновления.
       * Если диаграмма не готова (getReadyDeferred().isReady() == false), и ожидает результата обращения к бизнес-логике, то вызов будет отложен до готовности диаграммы.
       * Если recordSet = null, то очистить данные диаграммы
       * @return {$ws.proto.Deferred} Объект ожидания готовности диаграммы
       */
      setRecordSet: readyDefWrapper(function(recordSet){
         var oldRecordSet = this._recordset;
         if (oldRecordSet) {
            oldRecordSet.unsubscribe('onAfterLoad', this._updateDataHandler);
         }
         this._recordset = recordSet;

         if (this._recordset) {
            this._recordset.subscribe('onAfterLoad', this._updateDataHandler);
            this._updateData();
         }
         else
            this.setData([]);

         this._notify('onRecordSetChange', recordSet, oldRecordSet);
      }),

      /**
       * Вовзвращает текущий рекордсет, если диаграмма загружена из рекордсета или через setDataSource
       * @returns {$ws.proto.RecordSet}
       */
      getRecordSet: function() { return this._recordset; },

      _getLegendConfig: function(legendConfig, defaultConfig) {
         var defConfig = clone(defaultConfig);

         return legendConfig ?
                extend(defConfig, legendConfig) :
                (legendConfig === undefined ? defConfig : extend(defConfig, {visible: false}));
      },

      /**
       * Устанавливает данные. Этот метод может быть полезен для реализации собственных методов загрузки данных в диаграмму.
       * Если диаграмма не готова (getReadyDeferred().isReady() == false), и ожидает результата обращения к бизнес-логике, то вызов будет отложен до готовности диаграммы.
       * Вид параметра data свой у каждой диаграммы, но, как правило, это массив объектов с одинаковым набором полей.
       * @param {Object} data
       * @return {$ws.proto.Deferred} Объект ожидания готовности диаграммы
       **/
      setData: readyDefWrapper(function(data) { this._chartData = data; }),

      /** удаляет график со всеми визуальными объектами, отцепляется от их событий, и т.д. @private */
      _remove: function() { throw new Error('Method AbstractGraph::_remove must be implemented'); },

      /** Вызывается при удалении контрола. Вызывает метод {_remove} - удаляет график со всеми визуальными объектами, отцепляется от их событий, и т.д. */
      destroy: function() {
         this._remove();
         $ws.proto.RaphaelAbstractGraph.superclass.destroy.apply(this, arguments);
      },

      /** Рисует непосредственно график, возвращает его же. Реализуется наследниками.
       * @returns {Object} @private */
      _drawChart: function() { throw new Error('Method AbstractGraph::_drawChart must be implemented'); },

      /** Рассчитывает размещение объектов диаграммы на её поле. Реализуется наследниками. @private */
      _layout: function() { throw new Error('Method AbstractGraph::_layout must be implemented'); },

      /**
       * Обработчик изменения размеров контрола
       */
      _onResizeHandler: function() {
         var width = Math.max(0, this._container.width()),
             height = Math.max(0, this._container.height());

         if (this._options.width !== width ||
            this._options.height !== height ||
            this._firstSetSize)
         {
            this._firstSetSize = false;

            var canvas = this.getCanvas();
            if (canvas) {
               canvas.setSize(width, height);
               this.draw();
            }
         }
      }
   });

   var percentNameMap = { min: 0, max: 100, start: 0, end: 100, center: 50 };

   return {
      RaphaelAbstractGraph: $ws.proto.RaphaelAbstractGraph,
      CommonGraphConst: CommonGraphConst,
      ChartLegend: ChartLegend,
      ChartBaseElement: ChartBaseElement,
      helpers: {
         clone: clone,
         extend: extend,
         registerElementsBindEvents: registerElementsBindEvents,
         ensureArray: ensureArray,
         extendStyle: extendStyle,
         textStyleToCss: textStyleToCss,
         removeBr: removeBr,
         readyDefWrapper: readyDefWrapper,
         argumentsToArray: argumentsToArray,
         inBoundsBySideCalc: InBoundsBySideCalc,
         normalizeBounds: normalizeBounds,
         createBox: createBox,
         boxesOverlap: boxesOverlap,
         isSimpleValue: isSimpleValue,
         isArray: isArray,
         percentNameMap: percentNameMap
      }
   };
});