define("js!SBIS3.CORE.RaphaelPieGraph", ["js!SBIS3.CORE.RaphaelDrawerInternal"], function(internal) {
   "use strict";

   var CommonGraphConst = internal.CommonGraphConst,
       helpers = internal.helpers,
       readyDefWrapper = helpers.readyDefWrapper,
       map = $ws.helpers.map,
       ensureArray = helpers.ensureArray,
       forEach = $ws.helpers.forEach,
       clone = helpers.clone,
       extend = helpers.extend,
       reduce = $ws.helpers.reduce,
       filter = $ws.helpers.filter,
       textStyleToCss = helpers.textStyleToCss,
       removeBr = helpers.removeBr,
       createBox = helpers.createBox,
       boxesOverlap = helpers.boxesOverlap,
       percentNameMap = helpers.percentNameMap;

   var RAD = Math.PI / 180;

   var PieGraphConst = {
      minAngle: 2,
      maxSlices: 100,
      defaultColors: [
         '#6e1ba3',
         '#1b888a',
         '#d71d67',
         '#ffc833',
         '#2aa8f1',
         '#befdbd',
         '#ffa7a3',
         '#ffc478'
      ],

      defaultSectorOthers: {
         description: 'Остальное'
      },

      defaultSectorTotal: {
         description: 'Всего'
      },

      defaultSectorLabels: {
         sectors: [],
         total: null,
         others: null
      },

      defaultSectorStyle: {
         sectorPathStyle: {stroke: '#fff', 'stroke-width': 1},
         legendPathStyle: {}
      },

      defaultSectorLabelStyle: {
         textStyle: { fill: 'black' },
         showInHint: true,
         showInDiagram: true
      },

      defaultLegendStyle: CommonGraphConst.defaultLegendStyle
   };

   /**
    * @class $ws.proto.RaphaelPieGraph
    * @extends $ws.proto.RaphaelAbstractGraph
    * @control
    * @category Content
    * @cfgOld {String}     field      Название поля в рекордсете, по которому строится диаграмма
    * @cfgOld {String}     descriptionField  Название поля в рекордсете, в котором заданы описания значений по полю field
    * @cfgOld {String}     sectorNameField Поле, по которому конфигурация сектора (в массиве sectors[]) привязывается к элементу в массиве данных.
    * Если не задано, то конфигурация сектора привязывается к его данным через поле descriptionField
    * @cfgOld {Number}     centerX     Координата центра по оси х (в пикселях или в процентах от ширины диаграммы - формат такой: '123' или '30%')
    * @cfgOld {Number}     centerY     Координата центра по оси у (в пикселях или в процентах от ширины диаграммы - формат такой: '123' или '30%')
    * @cfgOld {Number}     radius      Радиус в пикселях (в пикселях или в процентах от минимального значения между шириной и высотой диаграммы - формат такой: '123' или '30%')
    * @cfgOld {Number}     minPercent  Минимальный процент от всей диаграммы, при котором сектор показывается. Сектора, не показанные из-за слишком маленькой доли, показываются суммой в отдельном секторе, конфигурируемом как sectorOthers.
    * @cfgOld {Number}     stroke      Цвет границы окружности
    * @cfgOld {Number}     strokeWidth Ширина границы окружности
    * @cfgOld {Array}      data        Массив с данными диаграммы
    *
    * //TODO: sectorOthers, sectorTotal, onCustomGenerateSectorLabels
    *
    * @cfgOld {Object} legend Конфигурация легенды
    *
    * @cfgOld {String} legend.side Сторона диаграммы, к которой привязана легенда. Возможные значения: top/bottom/left/right

    * @cfgOld {String} legend.sidePosition Положение легенды на стороне диаграммы, к которой она привязана легенда.
    * Возможные значения: start (в начале стороны), center (в середине), end (в конце).
    * Например, сочетание {side: top, sidePosition: end} даст позицию легенды в правом верхнем углу.
    *
    * @cfgOld {Boolean} legend.visible Видимость легенды. По умолчанию - true (легенда видима). Если указано значение false, то легенда рисоваться не будет.
    * @cfgOld {Number} legend.padding Отступ легенды от ближайших краёв диаграммы
    * @cfgOld {Number} legend.interLegendPadding Отступ внутри легенды - между описаниями значений
    * @cfgOld {Number} legend.legendLineWidth Внутри легенды - ширина линии, изображающей линию с цветом значения
    * @cfgOld {Number} legend.legendLineTextPadding Внутри легенды - расстояние между линией, изображающей линию с цветом значения, и подписью значения
    * @cfgOld {Object} legend.textStyle Внутри легенды - стиль (рафаэлевские атрибуты) подписей.
    *    См. текстовые атрибуты здесь: <a href="http://raphaeljs.com/reference.html#Element.attr">Element.attr</a>
    * @cfgOld {Object} legend.frameStyle Стиль рамки вокруг легенды.
    * См. атрибуты стиля здесь: <a href="http://raphaeljs.com/reference.html#Element.attr">Element.attr</a>.
    * Как правило, тут важны атрибуты типа stroke и fill
    *
    * @cfgOld {Array} sectors Описание конфгурации для секторов диаграммы
    * @cfgOld {Object} sectors[] Описание конфигурации для сектора диаграммы
    * @cfgOld {String} sectors[].name Имя сектора. Соответствует значению поля sectorNameField в конфигурации диаграммы.
    * Конфигурация сектора будет привязана в элементу данных диаграммы, у которого значение поля с именем, указанным в sectorNameField, равно имени сектора (sectors[].name).
    * @cfgOld {Object} sectors[].style Описание стиля сектора диаграммы
    * @cfgOld {Object} sectors[].style.sectorPathStyle Описание атрибутов стиля сектора диаграммы (атрибуты см. здесь: http://raphaeljs.com/reference.html#Element.attr)
    * @cfgOld {Object} sectors[].style.legendPathStyle Описание атрибутов линии в легендее, соотв. сектору диаграммы (атрибуты см. здесь: http://raphaeljs.com/reference.html#Element.attr)
    **/
   $ws.proto.RaphaelPieGraph = internal.RaphaelAbstractGraph.extend(/** @lends $ws.proto.RaphaelPieGraph */ {
      $protected: {
         _options: {
            field: null,    //поля из рекордсета
            descriptionField: null, //поле с подписью..
            sectorNameField: null, //поле со строкой-именем для сектора (sectors)..
            stroke: null,
            colors: null,
            minPercent: 0,
            strokeWidth: null
         },
         _flag: undefined, //Графический рафаэль - элемент с подсказкой по элементу под курсором
         _graphSet: [],
         _sectorLabels: null,
         _sectorStyles: {},
         _sectorLabelStyles: {},
         _legend: null,
         _preparedData: null,

         _defSectorStyle: null,

         _centerX: undefined,
         _centerY: undefined,
         _centerXPercent: undefined,
         _centerYPercent: undefined,
         _radiusPercent: undefined,
         _radius: undefined,
         _sectorsByName: {},
         _sectorOthers: null,
         _sectorTotal: null
      },
      $constructor : function(cfg) {
         this._publish('onPrepareData');
         this._publish('onCustomGenerateSectorLabels');
         this._publish('onElementMouseOver');
         this._publish('onElementMouseDown');
         this._publish('onElementMouseUp');
         this._publish('onElementMouseOut');

         this._options.colors = clone(PieGraphConst.defaultColors);
         this._sectorLabels = clone(PieGraphConst.defaultSectorLabels);
         this._preparedData = {total: 0, values: []};

         this.getReadyDeferred().addCallback(function() {
            this._initValidateOptions(cfg);
         }.bind(this));
      },

      _registerElementsBindEvents: internal.helpers.registerElementsBindEvents,

      _getSectorLabelCompiledStyle: function(style) {
         var base, result;

         if (typeof style === 'string') {
            base = this._sectorLabelStyles[style];
            style = {};
         }
         else {
            style = style || {};
            base = ('baseName' in style) ? this._sectorLabelStyles[style.baseName] : null;
         }
         result = extend(clone(base || PieGraphConst.defaultSectorLabelStyle), style);
         return result;
      },

      _initValidateOptions: function(cfg) {
         this._isValid = false;
         this._runInternalChange(function(){
            var self = this, centerX = cfg.centerX, centerY = cfg.centerY, radius = cfg.radius, val;

            this._sectorsByName = {};
            this._defSectorStyle = clone(PieGraphConst.defaultSectorStyle);
            if (this._options.stroke !== null)
               this._defSectorStyle.sectorPathStyle.stroke = this._options.stroke;

            if (this._options.strokeWidth !== null)
               this._defSectorStyle.sectorPathStyle['stroke-width'] = this._options.strokeWidth;

            function getSectorCompiledStyle(style) {
               var base, result, lps;

               if (typeof style === 'string') {
                  base = self._sectorStyles[style];
                  style = {};
               }
               else {
                  style = style || {};
                  base = ('baseName' in style) ? self._sectorStyles[style.baseName] : null;
               }
               result = extend(clone(base || self._defSectorStyle), style);

               lps = result.legendPathStyle;
               if (!lps.stroke && lps.fill)
                  lps.stroke = lps.fill;

               return result;
            }

            function prepareSector(sector) {
               var result = null;
               if (sector) {
                  result = clone(sector);
                  result.style = getSectorCompiledStyle(result.style);
               }
               return result;
            }

            function prepareSectorStyle(memo, style, name) {
               memo[name] = extend(clone(self._defSectorStyle), style);
               return memo;
            }

            function prepareSectorLabelStyle(memo, style, name) {
               memo[name] = extend(clone(PieGraphConst.defaultSectorLabelStyle), style);
               return memo;
            }

            function createLegend(legendCfg) {
               var config = self._getLegendConfig(legendCfg, PieGraphConst.defaultLegendStyle);

               var cfg = helpers.clone(config);
               cfg.legends = [];
               cfg.chart = self;

               return new internal.ChartLegend(cfg);
            }

            if (cfg.onCustomGenerateSectorLabels) {
               this.subscribe('onCustomGenerateSectorLabels', cfg.onCustomGenerateSectorLabels);
            }

            if (this._options.sectorNameField === null) {
               this._options.sectorNameField = this._options.descriptionField;
            }

            this._sectorStyles = reduce(cfg.sectorStyles, prepareSectorStyle, {});
            this._sectorLabelStyles = reduce(cfg.sectorLabelStyles, prepareSectorLabelStyle, {});

            var sectors = map(cfg.sectors, prepareSector);
            this._sectorOthers = prepareSector(cfg.sectorOthers);
            this._sectorTotal = prepareSector(cfg.sectorTotal);

            if (this._options.sectorNameField) {
               var i, ln, name;
               for (i = 0, ln = sectors.length; i !== ln; i++) {
                  name = sectors[i].name;
                  if (!name) {
                     throw new Error('У настроек сектора круговой диаграммы должно быть имя, соотв. имени поля, по которому идентифицируется сектор.');
                  }
                  if (name in this._sectorsByName) {
                     throw new Error('У настроек сектора круговой диаграммы должно быть уникальное имя.');
                  }

                  this._sectorsByName[name] = sectors[i];
               }
            }

            if (centerX === undefined)
               centerX = '50%';

            if (centerY === undefined)
               centerY = '50%';

            if (radius === undefined)
               radius = '30%';

            if (this._sectorTotal && this._sectorTotal.radiusPercent === undefined)
               this._sectorTotal.radiusPercent = '30%';

            function parseCoord(coord) {
               var match = String(coord).match(/(.+)%$/),
                   result;

               if (match) //проценты
                  result = [undefined, Math.max(1, parseFloat(String.trim(match[1])))];
               else
                  result = [Math.max(1, parseFloat(String.trim(String(coord)))), undefined];

               if (isNaN(result[0]) && isNaN(result[1]))
                  throw new Error('Неправильный формат параметра centerX/centerY/radius: (надо число или проценты - положительное число больше нуля): ' + coord);

               return result;
            }

            val = parseCoord(centerX);
            this._centerX = val[0];
            this._centerXPercent = val[1];

            val = parseCoord(centerY);
            this._centerY = val[0];
            this._centerYPercent = val[1];

            val = parseCoord(radius);
            this._radius = val[0];
            this._radiusPercent = val[1];

            if (this._sectorTotal) {
               val = parseCoord(this._sectorTotal.radiusPercent);
               this._sectorTotal.radiusPercent = val[0] || val[1];
            }

            val = parseFloat(this._options.minPercent);
            if (isNaN(val))
               throw new Error('Неправильный формат параметра minPercent: (надо число или проценты - положительное число больше нуля): ' + this._options.minPercent);
            this._options.minPercent = val;

            this._legend = createLegend(cfg.legend);

            if (cfg.data)
               this.setData(cfg.data);
            else if (cfg.recordSet)
               this.setRecordSet(cfg.recordSet);
            else if (this._options.dataSource)
               this.setDataSource(this._options.dataSource, {});
         });
         this._isValid = true;
         this.draw();
      },

      /**
       * Строим диаграмму по заданному конфигу, сбрасывая предыдущие настройки диаграммы.
       * Если диаграмма не готова (getReadyDeferred().isReady() == false), и ожидает результата обращения к бизнес-логике, то вызов будет отложен до готовности диаграммы.
       * @param {Object} config Конфигурация диаграммы (формат смотри в описании диаграммы)
       * @return {$ws.proto.Deferred} Объект ожидания готовности диаграммы
       */
      setConfig: readyDefWrapper(function(cfg) {
         this._options = this._extendDefaultOptionsByConfig(cfg, $ws.proto.RaphaelPieGraph);
         this._initValidateOptions(cfg);
      }),

      /** Удаляет флаг со значением, который показывается при наведении мыши @private */
      _removeFlag: function(){
         if(this._flag){
            var tmpFlag = this._flag;
            this._flag = null;

            tmpFlag.animate({opacity: 0}, 300, function () {
               this.remove();
            });
         }
      },

      /** Удаляем графические объекты диаграммы из DOM @private */
      _clearDraw: function() {
         this._removeFlag();

         forEach(this._graphSet, function(gr) { gr.remove(); });

         this._graphSet = [];

         this._legend._clearDraw();
      },

      /** Удаляем графические объекты диаграммы из DOM, отцепляемся от событий диаграммы @private */
      _remove: function() {
         this._clearDraw();
      },

      _drawSectors: function(x, y, radius, totalRadius, valuesData) {

         var self = this, canvas = this.getCanvas(),
             i, mangle, angle = 0, val, el, path,
             values = valuesData.values,
             total = valuesData.total,
             len = values.length,
             startAngle, endAngle, res, resSectors;

         function a2d(a, r) {
            return { x: r * Math.cos(-a * RAD), y: r * Math.sin(-a * RAD) };
         }

         function d2a(x, y) {
            var r = Math.sqrt(x*x + y*y),
                a = Math.atan(-y / x) / RAD + (x < 0 ? 180 : 0);

            return {r: r, a: a < 0 ? 360 + a : a};
         }

         function angleInRange(a, startA, endA) {
            if (startA < 0 && ((a - 360) > startA)) {
               a = a - 360;
            }
            return a >= startA && a <= endA;
         }

         function getArcPoints(x, y, r, startAngle, endAngle) {
            var p1 = a2d(startAngle, r),
                p2 = a2d(endAngle, r);

            p1.x += x; p1.y += y;
            p2.x += x; p2.y += y;
            return [p1, p2];
         }

         function ringSector(x, y, startAngle, endAngle) {
            var
               tmpMax = Math.max(startAngle, endAngle), x0, y0, innerPts, outerPts, res, arcSign;

            startAngle = Math.min(startAngle, endAngle);
            endAngle = tmpMax;

            if (Math.abs(endAngle - startAngle - 360) <= 0.01) {
               endAngle -= 0.01;
            }
            arcSign = +(Math.abs(endAngle - startAngle) > 180);

            outerPts = getArcPoints(x, y, radius, startAngle, endAngle);
            if (totalRadius > 0) {
               innerPts = getArcPoints(x, y, totalRadius, startAngle, endAngle);

               x0 = innerPts[0].x;
               y0 = innerPts[0].y;

               res = [
                  "M", x0, y0,
                  "L", outerPts[0].x, outerPts[0].y,
                  "A", radius, radius, 0, arcSign, 0, outerPts[1].x, outerPts[1].y,
                  "L", innerPts[1].x, innerPts[1].y,
                  "A", totalRadius, totalRadius, 0, arcSign, 1, x0, y0,
                  "z"
               ];
            } else {
               res = [
                  "M", x, y,
                  "L", outerPts[0].x, outerPts[0].y,
                  "A", radius, radius, 0, arcSign, 0, outerPts[1].x, outerPts[1].y,
                  "z"
               ];
            }

            return res;
         }

         function getSectorCfg(idx, isTotal) {
            return isTotal ? self._sectorTotal : values[idx].sectorCfg;
         }

         function drawLabels(idx, isTotal, startAngle, endAngle, innerRadius, outerRadius) {
            function isGoodPos(angle, radius, bbox) {
               var p0 = a2d(angle, radius),
                   w2 = bbox.width / 2, h2 = bbox.height / 2,
                   pts = [{x: p0.x - w2, y: p0.y - h2}, {x: p0.x + w2, y: p0.y - h2},
                          {x: p0.x - w2, y: p0.y + h2}, {x: p0.x + w2, y: p0.y + h2}],
                  i, apt, ln = pts.length, ok = true;

               for (i = 0; i !== ln && ok; i++) {
                  apt = d2a(pts[i].x, pts[i].y);
                  ok = angleInRange(apt.a, startAngle, endAngle) && apt.r >= innerRadius && apt.r <= outerRadius;
               }

               return ok;
            }

            function drawLabel(memo, label) {
               if (memo.S > 0 && label.style.showInDiagram) {
                  var labelEl, labelFn, bbox;

                  if (label.value) {
                     labelEl = canvas.text(0, 0, label.value).attr(label.style);
                     labelFn = null;
                     bbox = labelEl.getBBox();
                     bbox = createBox(bbox.x, bbox.y, bbox.width, bbox.height);
                  }
                  else {
                     labelEl = null;
                     labelFn = function () { return canvas.image(label.image, 0, 0, label.width, label.height); };
                     bbox = createBox(0, 0, label.width, label.height);
                  }

                  memo.labels.push({labelEl: labelEl, labelFn: labelFn, bbox: bbox,
                                    angle: label.angle, radius: label.radius, centered: !!labelEl,
                                    overflow: false, ownOverflowOnly: label.ownOverflowOnly});
                  memo.S -= (bbox.width * bbox.height);
               }

               return memo;
            }

            function layoutLabel(overflow, labelEl) {
               var overflowLocal = overflow && !labelEl.ownOverflowOnly;

               if (!overflowLocal) {
                  var bbox = labelEl.bbox,
                      angle = startAngle + (endAngle - startAngle) * labelEl.angle / 100,
                      radius = innerRadius + (outerRadius - innerRadius) * labelEl.radius / 100,
                      a = angle, r = radius, p;

                  overflowLocal = !isGoodPos(a, r, bbox);
                  if (overflowLocal) {
                     var
                        step,
                        rStep = 1, aStep = 1,
                        maxDiffs = map([(r - innerRadius) / rStep, (outerRadius - r) / rStep,
                                        (a - startAngle) / aStep, (endAngle - a) / aStep], function(v) { return Math.max(0, Math.floor(v));}),
                        sideValid = [true, true, true, true],
                        sideStep = [rStep, rStep, aStep, aStep],
                        sideStepCnt,
                        sideRad = [true, true, false, false],
                        sides = [r, r, a, a],
                        sideOpps = [[2, 3], [2, 3], [0, 1], [0, 1]],
                        k1, k2m, k20, k21, k2s, k2e,
                        adders = [-1, 1, -1, 1],
                        maxDiffsLn = maxDiffs.length, i, j, sidesValidCnt;

                     a = Math.min(Math.max(startAngle, angle), endAngle);
                     r = Math.min(Math.max(innerRadius, radius), outerRadius);

                     do {
                        sidesValidCnt = 0;
                        for (i = 0; i !== maxDiffsLn; i++) {
                           sideValid[i] = maxDiffs[i] !== 0;
                           if (sideValid[i]) {
                              sides[i] += (adders[i] * sideStep[i]);
                              maxDiffs[i]--;
                              sidesValidCnt++;
                           }
                        }
                        if (sidesValidCnt !== 0) {
                           for (i = 0; i !== maxDiffsLn && overflowLocal; i++) {
                              if (sideValid[i]) {
                                 k1 = sides[i];
                                 k2s = sides[ sideOpps[i][0] ];
                                 k2e = sides[ sideOpps[i][1] ];
                                 k2m = (k2s + k2e) / 2;
                                 sideStepCnt = Math.floor((k2e - k2s) / sideStep[i] / 2);
                                 for (j = 0; j !== sideStepCnt && overflowLocal; j++) {
                                    step = sideStep[ sideOpps[i][0] ] * j;
                                    k20 = k2m + step;
                                    k21 = k2m - step;
                                    if (sideRad[i]) {
                                       overflowLocal = !isGoodPos(k20, k1, bbox);
                                       if (!overflowLocal) {
                                          a = k20; r = k1;
                                       } else {
                                          overflowLocal = !isGoodPos(k21, k1, bbox);
                                          if (!overflowLocal) {
                                             a = k21; r = k1;
                                          }
                                       }
                                    } else {
                                       overflowLocal = !isGoodPos(k1, k20, bbox);
                                       if (!overflowLocal) {
                                          a = k1; r = k20;
                                       } else {
                                          overflowLocal = !isGoodPos(k1, k21, bbox);
                                          if (!overflowLocal) {
                                             a = k1; r = k21;
                                          }
                                       }
                                    }
                                 }
                              }
                           }
                        }
                     } while (sidesValidCnt !== 0 && overflowLocal);
                  }

                  if (!overflowLocal) {
                     p = a2d(a, r);

                     bbox.x = p.x - bbox.width / 2;
                     bbox.y = p.y - bbox.height / 2;
                     bbox.x2 = bbox.x + bbox.width;
                     bbox.y2 = bbox.y + bbox.height;
                  }
               }
               labelEl.overflow = overflowLocal;

               return overflow || overflowLocal;
            }

            function moveLabel(label) {
               if (label.labelFn)
                  label.labelEl = label.labelFn();

               var xpos = x + label.bbox.x + (label.centered ? label.bbox.width / 2 : 0),
                   ypos = y + label.bbox.y + (label.centered ? label.bbox.height / 2 : 0);

               label.labelEl.attr({x: xpos, y: ypos});

               return label.labelEl;
            }

            var sectorS = Math.PI * (outerRadius * outerRadius - innerRadius * innerRadius) * (endAngle - startAngle) / 360,
                labels = isTotal ? self._sectorLabels.total : values[idx].sectorCfg.labels,
                labelEls = reduce(labels, drawLabel, {labels: [], S: sectorS}),
                labelsDrawn = labelEls.labels,
                hasOverflows, labelsNotOvr, labelsOvrOwn,
                els, i, j, ln;

            reduce(labelsDrawn, layoutLabel, false);

            ln = labelsDrawn.length;
            for (i = 0; i < ln - 1; i++) {
               for (j = i + 1; j !== ln; j++) {
                  if (!labelsDrawn[i].overflow && !labelsDrawn[j].overflow &&
                      boxesOverlap(labelsDrawn[i].bbox, labelsDrawn[j].bbox))
                  {
                     labelsDrawn[i].overflow = !labelsDrawn[i].ownOverflowOnly;
                     labelsDrawn[j].overflow = !labelsDrawn[j].ownOverflowOnly;
                  }
               }
            }

            labelsNotOvr = filter(labelsDrawn, function(label) { return !label.overflow; });
            hasOverflows = labelsNotOvr.length !== labelsDrawn.length;
            if (hasOverflows) {
               labelsOvrOwn = filter(labelsNotOvr, function(label) { return label.ownOverflowOnly; });
               els = map(labelsOvrOwn, moveLabel);

               forEach(labelsDrawn, function(label) {
                  if (!label.ownOverflowOnly) {
                     label.labelEl && label.labelEl.remove();
                  }
               });
            } else {
               els = map(labelsDrawn, moveLabel);
            }

            return {els: els, overflow: hasOverflows};
         }

         function processEl(el, idx, isTotal, startAngle, endAngle) {
            var
                sectorCfg = getSectorCfg(idx, isTotal),
                drawEventArgs = [
                  'sector', //аргумент elementType
                  {         //аргумент elementData
                     isTotal: isTotal,
                     isOthers: !isTotal && values[idx].others,
                     value: isTotal ? valuesData.total : values[idx].value,
                     elements: {
                        sector: el
                     },
                     style: sectorCfg
                  },
                  canvas,   //аргумент canvas
                  null      //аргумент drawUtils
                ],
                innerRadius = isTotal ? 0 : totalRadius,
                outerRadius = isTotal ? totalRadius : radius,
                labels, els;

            el.attr(sectorCfg.style.sectorPathStyle);

            labels = drawLabels(idx, isTotal, startAngle, endAngle, innerRadius, outerRadius);
            els = [el].concat(labels.els);

            self._registerElementsBindEvents(els, drawEventArgs, false);
            return {overflow: labels.overflow};
         }

         function createHints(hintSectors) {
            function getSpans() {
               var result = reduce(hintSectors, function(result, hintSector, idx) {
                  var last, lastIdx = result.length - 1;
                  if (lastIdx < 0 || hintSector.angle > PieGraphConst.minAngle)
                     result.push({cnt: 1, start: idx, ids: [idx], overIds: hintSector.overflow ? [idx] : []});
                  else {
                     last = result[lastIdx];
                     last.cnt += 1;
                     if (hintSector.overflow)
                        last.overIds.push(idx);
                     last.ids.push(idx);
                  }

                  return result;
               }, []);

               return filter(result, function(res) { return res.overIds.length > 0; });
            }

            function showHint(id, span) {

               var hintRows = reduce(span.ids, function(memo, id) {
                  function labelConvert(memo, label) {
                     var style = label.style;
                     if (style && style.showInHint && label.value) {
                        var
                           textStyle = style && style.textStyle,
                           text = label.value,
                           tr = '<tr><td></td><td><span style="{style}">{text}</td></tr>'.
                                 replace('{text}', removeBr(text)).replace('{style}', textStyleToCss(textStyle));

                        memo.push(tr);
                     }

                     return memo;
                  }

                  var hintSector = hintSectors[id],
                      sectorCfg = getSectorCfg(hintSector.idx, hintSector.isTotal),
                      sectorAttrs = sectorCfg.style.sectorPathStyle,
                      sectorDescr = sectorCfg.description,
                      labels = hintSector.isTotal ? self._sectorLabels.total :
                               self._sectorLabels.sectors[ values[hintSector.idx].order ];

                  var labelRows = reduce(labels, labelConvert, []),
                      legendTr = '<tr><td><div style="width: 15px; height: 15px; margin-right: 10px; background-color: {legendColor}"></div></td><td>{legendDescr}</td></tr>'.
                                   replace('{legendColor}', sectorAttrs.fill).
                                   replace('{legendDescr}', removeBr(sectorDescr)),
                     separatorTr = '<tr><td colspan="2"><div style="position: relative; width: 100%; border-top: 1px dashed rgb(176, 176, 176); margin: 3px 0;"></div></td></tr>';

                  return memo.concat(legendTr, labelRows, separatorTr);
               }, []);

               var hintHtml = '<table style="width: 100%"><colgroup><col width="25"/><col /></colgroup>' +
                                 hintRows.slice(0, hintRows.length - 1).join('') +
                              '</table>';

               var lastEl = hintSectors[id],
                   canvasOffset = $(self._container).offset();
               $ws.single.Infobox.show({control: lastEl.sectorEl.node, message: hintHtml,
                                        offset: {left: canvasOffset.left + lastEl.hintBindBox.x,
                                                 top: canvasOffset.top + lastEl.hintBindBox.y}});
            }

            var spans = getSpans();

            forEach(spans, function(span) {
               var overIdsLn = span.overIds.length;
               if (overIdsLn > 0) {

                  var onMouseMove = function(id) { showHint(id, span); },
                      onMouseOut = function() { $ws.single.Infobox.hide(); };

                  forEach(span.ids, function(id) {
                     var el = hintSectors[id].sectorEl;
                     el.mousemove(onMouseMove.bind(undefined, id));
                     el.mouseout(onMouseOut);
                     el.attr({cursor: 'pointer'});
                  });
               }
            });
         }

         function getHintBindBox(angleStart, angleEnd, radiusInner, radiusOuter) {
            var a = (angleEnd - angleStart) < 330 ? ((angleEnd + angleStart) / 2) : 90,
                r = radiusInner > 0 ? (radiusOuter + radiusInner) / 2 : 0,
                pt = a2d(a, r);
            return createBox(pt.x + x, pt.y + y, 1, 1);
         }

         if (len == 1) {
            el = canvas.circle(x, y, radius);
            res = processEl(el, 0, false, 0, 360);
            if (res.overflow) {
               resSectors = [{isTotal: false, idx: 0, angle: 360, sectorEl: el,
                              hintBindBox: getHintBindBox(0, 360, 0, radius)}];
               createHints(resSectors);
            }
         } else {
            resSectors = [];

            if (this._sectorTotal && totalRadius > 0) {
               el = canvas.circle(x, y, totalRadius);
               res = processEl(el, null, true, 0, 360);
               resSectors.push({isTotal: true, idx: null, angle: 360, sectorEl: el,
                                overflow: res.overflow,
                                hintBindBox: getHintBindBox(0, 360, 0, totalRadius)});
            }

            for (i = 0; i !== len; i++) {
               val = values[i].value;
               mangle = angle - 360 * val / total / 2;

               if (!i) {
                  angle = 90 - mangle;
               }

               endAngle = angle;
               startAngle = endAngle - Math.max(360 * val / total, PieGraphConst.minAngle);
               angle = startAngle;

               path = ringSector(x, y, startAngle, endAngle);
               el = canvas.path(path);
               res = processEl(el, i, false, startAngle, endAngle);
               resSectors.push({isTotal: false, idx: i,
                                angle: endAngle - startAngle, sectorEl: el, overflow: res.overflow,
                                hintBindBox: getHintBindBox(startAngle, endAngle, totalRadius, radius)});
            }
            createHints(resSectors);
         }
      },

      /** Фунцкия, непосредственно рисующая диаграмму @private */
      _drawChart : function(){
         var
            self = this,
            margin = this._options.margin,
            drawBounds = {left: margin.left, top: margin.top,
                          width: this._options.width - margin.left - margin.right,
                          height: this._options.height - margin.top - margin.top},
            legendMargin,
            centerX, centerY, radius;

         var totalRadius;

         this._legend._setDrawBounds(drawBounds);

         if (!this._legend._getInsideChart()) {
            legendMargin = this._legend._getLayoutMargin();
            drawBounds.left += legendMargin.left;
            drawBounds.top += legendMargin.top;
            drawBounds.width -= (legendMargin.left + legendMargin.right);
            drawBounds.height -= (legendMargin.top + legendMargin.bottom);
         }

         if (this._centerX !== undefined)
            centerX = drawBounds.left + this._centerX;
         else
            centerX = drawBounds.left + (this._centerXPercent * drawBounds.width / 100);

         if (this._centerY !== undefined)
            centerY = drawBounds.top + this._centerY;
         else
            centerY = drawBounds.top + (this._centerYPercent * drawBounds.height / 100);

         if (this._radius !== undefined)
            radius = this._radius;
         else
            radius = this._radiusPercent * Math.min(drawBounds.height, drawBounds.width) / 100;

         totalRadius = this._sectorTotal && this._preparedData.values.length > 1 ?
                       this._sectorTotal.radiusPercent * radius / 100 : 0;

         this._drawSectors(centerX, centerY, radius, totalRadius, this._preparedData);
         this._legend._draw();
      },

      _clearData: function(){
         this._chartData = [];
      },

      /**
       * Загружает данные в диаграмму. Реализация метода {$ws.proto.AbstractGraph.setData}
       * Если диаграмма не готова (getReadyDeferred().isReady() == false), и ожидает результата обращения к бизнес-логике, то вызов будет отложен до готовности диаграммы.
       * @param {Array} data - массив объектов с полями, соответствующими значению сектора диаграммы и его названию:
       * [{X: 10, D: 'IE 7'}, {X: 20, D: 'Firefox 10+'}, {X: 100, D: 'Opera 9+'}, {X: 30, D: 'Safari 10+'}}].
       * @return {$ws.proto.Deferred} Объект ожидания готовности диаграммы
       */
      setData: readyDefWrapper(function(data) {
         var self = this,
             legends = [];

         function addSectorToLegend(sectorCfg) {
            if (sectorCfg.description) {
               legends.push({description: sectorCfg.description, style: sectorCfg.style.legendPathStyle});
            }
         }

         function prepareValues(valuesData) {
            var i, v, len = valuesData.length, total, values = [],
               others = 0, cut = self._options.maxSlices || PieGraphConst.maxSlices,
               minPercent = parseFloat(self._options.minPercent),
               dataField = self._options.field,
               defcut = Boolean( minPercent);

            function getSectorForSorted(idx, isOther) {
               function createSectorCfg() {
                  return clone({style: PieGraphConst.defaultSectorStyle});
               }

               var sectorCfg, val, dataVal, nameField, descrField, style,
                   colors = ensureArray(self._options.colors);

               if (isOther) {
                  sectorCfg = self._sectorOthers && createSectorCfg(idx);
                  sectorCfg.description = sectorCfg.description || PieGraphConst.defaultSectorOthers.description;
                  sectorCfg.labels = self._sectorLabels.others;
               } else {
                  val = values[idx];
                  nameField = self._options.sectorNameField;
                  descrField = self._options.descriptionField;
                  dataVal = self._chartData[val.order];

                  if (nameField)
                     sectorCfg = self._sectorsByName[ dataVal[nameField] ];

                  sectorCfg = sectorCfg || createSectorCfg();

                  if (!sectorCfg.description && descrField) {
                     sectorCfg.description = dataVal[descrField];
                  }
                  sectorCfg.labels = self._sectorLabels.sectors[val.order];
               }

               if (colors.length === 0)
                  colors = clone(PieGraphConst.defaultColors);

               while (colors.length <= idx) {
                  colors.push(colors[colors.length - 1]);
               }

               style = sectorCfg.style;
               style.sectorPathStyle = style.sectorPathStyle || {};
               style.legendPathStyle = style.legendPathStyle || {};
               if (!style.sectorPathStyle.fill) {
                  style.sectorPathStyle.fill = colors[idx];
               }

               if (!style.legendPathStyle.stroke) {
                  style.legendPathStyle.stroke = style.sectorPathStyle.fill;
               }

               return sectorCfg;
            }

            if (len === 1) {
               total = valuesData[0][dataField] || 0;
               values[0] = { value: total, order: 0 };
               values[0].sectorCfg = getSectorForSorted(0, false);
            } else {
               total = 0;
               for (i = 0; i < len; i++) {
                  v = valuesData[i][dataField] || 0;
                  total += v;
                  values[i] = { value: v, order: i, others: false };
               }

               //values are sorted numerically
               values.sort(function (a, b) { return b.value - a.value; });

               for (i = 0; i < len; i++) {
                  if (defcut && values[i].value * 100 / total < minPercent) {
                     cut = i;
                     defcut = false;
                  }

                  if (i > cut) {
                     defcut = false;
                     values[cut].value += values[i].value;
                     values[cut].others = true;
                     others = values[cut].value;
                  } else {
                     values[i].sectorCfg = getSectorForSorted(i, false);
                  }
               }

               len = Math.min(cut + 1, values.length);
               if (others) {
                  values.splice(len) && (values[cut].others = true);
                  values[cut].sectorCfg = getSectorForSorted(cut, true);
               }
            }

            for (i = 0; i !== len; i++) {
               addSectorToLegend(values[i].sectorCfg);
            }

            return {total: total, values: values};
         }

         function normalizeSectorLabels(labels) {
            function normalizePercentValue(val) {
               var percent = val in percentNameMap ? percentNameMap[val] : parseFloat(val);
               if (isNaN(percent) || percent < 0 || percent > 100) {
                  throw new Error('Неправильный формат точки диапазона "' + val + '": (надо min/max/center, или проценты в диапахоне от 0 до 100)');
               }
               return percent;
            }

            function normalizeImgDim(label, dim) {
               var result = parseInt(label[dim], 10);
               if (isNaN(result) || result <= 0) {
                  throw new Error('Неправильный формат размера картинки "' + label[dim] + '": необходимо указать ширину и высоту картинки (нужно число в диапахоне от 1 и больше)');
               }

               return result;
            }

            function normalizeSectorLabel(label) {
               var result = null;
               if ('value' in label || 'image' in label) {
                  result = {angle: normalizePercentValue(label.angle),
                     radius: normalizePercentValue(label.radius),
                     style: self._getSectorLabelCompiledStyle(label.style),
                            ownOverflowOnly: !!label.ownOverflowOnly,
                     value: label.value, image: label.image};

                  if (result.image) {
                     result.width = normalizeImgDim(label, 'width');
                     result.height = normalizeImgDim(label, 'height');
                  }
               }//W/H
               return result;
            }

            function normalizeSectorLabels(labelArg) {
               return labelArg ? map(ensureArray(labelArg), normalizeSectorLabel) : [];
            }

            return {
               total: normalizeSectorLabels(labels.total),
               others: normalizeSectorLabels(labels.others),
               sectors: map(labels.sectors, normalizeSectorLabels)
            };
         }

         var dataByEvents = this._notify('onPrepareData', data);
         if (dataByEvents !== undefined)
            this._chartData = ensureArray(dataByEvents);
         else
            this._chartData = ensureArray(data);

         var labels = this._notify('onCustomGenerateSectorLabels', data) || PieGraphConst.defaultSectorLabels;
         labels.sectors = ensureArray(labels.sectors);
         labels.sectors.length = this._chartData.length;

         this._sectorLabels = normalizeSectorLabels(labels);

         this._preparedData = prepareValues(this._chartData);

         if (this._sectorTotal)
            addSectorToLegend(this._sectorTotal);

         this._legend._setLegends(legends);

         this.draw();
         this._notify('onAfterLoad');
      }),

      /**
       * проверяет значения из рекордсета
       * @param {String|Number} value парсит значения во float
       * @param {Number} number номер текущей строки
       * @return {Number}
       * @private
       */
      _checkValue: function(value, number){
         if(typeof value == 'string' || typeof value == 'number' ){
            value = parseFloat(value);
            if(isNaN(value)){
               throw new Error('Can\'t cast value to float.See RecordSet record: ' + number);
            }
         }  else {
            throw new Error('Invalid type value in RecordSet.See RecordSet record: ' + number);
         }
         return value;
      },

      _layout: function() { }
   });

   return $ws.proto.RaphaelPieGraph;
});