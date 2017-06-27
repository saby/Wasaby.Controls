define('js!SBIS3.CONTROLS.ClockPicker',
   [
      'js!SBIS3.CORE.CompoundControl',
      'tmpl!SBIS3.CONTROLS.ClockPicker',
      'js!SBIS3.CONTROLS.DragNDropMixin',
      'tmpl!SBIS3.CONTROLS.ClockPicker/resources/Circle',
      'Core/core-functions',
      'js!SBIS3.CONTROLS.TimePickerUtils',
      'css!SBIS3.CONTROLS.ClockPicker'
   ],
   function(CompoundControl, dotTplFn, DragNDropMixinNew, circleTplFn, coreFunctions, Utils) {

      'use strict';

      //Время анимации перехода между view.
      var ANIMATION_TIME = 200;

      /**
       * Контрол представляющий из себя часы с быстрым выбором значения часов и минут.
       * Он состоит из стрелки для выбора и набора tick - значение для выбора.
       *
       * @class SBIS3.CONTROLS.ClockPicker
       * @extend SBIS3.CONTROLS.CompoundControl
       *
       * @initial
       * Пример инициализации контрола.
       * Результат: ClockPicker с выбором минут, и стрелкой показывающей на 17. При смене
       *            режима на hours(см. {@link setMode}) будет ClockPicker с выбором часов,
       *            и стрелкой показывающей на 20.
       *
       * <ws:SBIS3.CONTROLS.ClockPicker>
       *    <ws:time>
       *       <ws:Object>
       *          <ws:hours>20</ws:hours>
       *          <ws:minutes>17</ws:minutes>
       *       </ws:Object>
       *    </ws:time>
       *    <ws:mode>minutes</ws:mode>
       * </ws:SBIS3.CONTROLS.ClockPicker>
       *
       * @control
       * @private
       * @author Крайнов Дмитрий Олегович
       */
      var ClockPicker = CompoundControl.extend([DragNDropMixinNew], /** @lends SBIS3.CONTROLS.ClockPicker.prototype */ {
         _dotTplFn: dotTplFn,

         $protected: {
            _options: {
               /**
                * @cfg {Object} Время.
                *
                * @example
                * Установить время 20:17.
                * <pre>
                *    <ws:time>
                *       <ws:Object>
                *          <ws:hours>
                *             <ws:Number>20</ws:Number>
                *          </ws:hours>
                *          <ws:minutes>
                *             <ws:Number>17</ws:Number>
                *          </ws:minutes>
                *       </ws:Object>
                *    </ws:time>
                * </pre>
                *
                * @see getTime
                * @see setTime
                */
               time: {
                  hours: 0,
                  minutes: 0
               },
               /**
                * @cfg {String} Текущий режим.
                * <ol>
                *    <li>Часы: hours.</li>
                *    <li>Минуты: minutes.</li>
                * </ol>
                *
                * @example
                * Установить режим minutes.
                * <pre>
                *    <ws:mode>
                *       <ws:String>minutes</ws:String>
                *    </ws:mode>
                * </pre>
                *
                * @see getMode
                * @see setMode
                */
               mode: 'hours'
            },

            //Хранит в себе jQuery объекты помеченных tick.
            _markTick: {},

            //Config стрелки.
            _arrowConfig: {
               circle: 'outer',
               deg: 180
            },

            //Смещение tick-ов относительно друг друга, в tick-ах.
            _tickOffset: {
               hours: 1,
               minutes: 5
            },

            //Метки для режимов.
            _unitTime: {
               hours: 'ЧАСЫ',
               minutes: 'МИНУТЫ'
            }
         },

         /**
          * @event onChangeTime Происходит после смены времени.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Object} time Текущее время.
          */

         /**
          * @event onChangeMode Происходит после смены режима.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {String} mode Текущий режим.
          */

         /**
          * @event onTimeSelect Происходит при окончании выбора времени.
          * @remark
          * Окончанием выбора времени является окончание работы со стрелкой выбора времени.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Object} time Время, которое установили.
          */
         $constructor: function() {
            this._publish('onChangeTime', 'onChangeMode', 'onTimeSelect');
         },

         init: function() {
            var mode = this._options.mode;
            ClockPicker.superclass.init.call(this);

            this._isHoursMode = mode === 'hours';

            //Подпишимся на события для работы стрелки.
            this._container.one('mousedown touchstart', function() {
               this._offset = this._container.offset();
               this._centerX = this._offset.left + this._container.width() / 2;
               this._centerY = this._offset.top + this._container.height() / 2;

               /**
                * В каждой теме свои размеры и поэтому, что бы определить когда нам смещаться
                * на внутренний круг мы расчитаем это расстояние.
                */
               var
                  outerCircle = this._container[0].children[0],
                  outerCircleHeight = parseInt(getComputedStyle(outerCircle).height),
                  tickHeight = parseInt(getComputedStyle(outerCircle.children[0]).height);

               this._innerCircleRadius = (outerCircleHeight - tickHeight) / 2;
            }.bind(this));
            this._container.on('mousedown touchstart', this._dragInitHandler.bind(this));
            // При клике на метку нужно сменить режим
            this._container.find('.js-controls-ClockPicker__unitTime').on('click', this._toggleMode.bind(this));
            //this._container.on('mousedown touchstart', this._onMousedownHandler.bind(this));
            //this._container.on('mouseup touchend', this._endDragHandler.bind(this));

            //Расчитаем положение стрелки и установим название режим.
            this._calcArrow();
            this.getLinkedContext().setValueSelf('unitTime', this._unitTime[mode]);
         },

         /**
          * Изменить установленное время.
          * @param {Object} time новое время
          * @public
          */
         setTime: function(time) {
            Utils.setTime.call(this, time);
            this._calcArrow();
         },

         /**
          * Изменить режим.
          * @param {String} mode  представления.
          * @public
          */
         setMode: function(mode) {
            Utils.setMode.call(this, mode);
            this._isHoursMode = !this._isHoursMode;
            // Если возможно, то создадим режим. Невозможно создать, только в том случае, если режим уже создан.
            if (this._createMode) {
               this._createMode();
            }

            //Анимация
            this.getLinkedContext().setValueSelf('arrow/visible', false);
            this.getLinkedContext().setValueSelf('arrow/hidden', true);
            setTimeout(function() {
               var className = 'controls-ClockPicker_hours controls-ClockPicker_minutes';
               this._calcArrow();
               this._container.toggleClass(className);
               this.getLinkedContext().setValueSelf('arrow/visible', true);
               this.getLinkedContext().setValueSelf('arrow/hidden', false);
               this.getLinkedContext().setValueSelf('unitTime', this._unitTime[mode]);
            }.bind(this), ANIMATION_TIME);
         },

         _toggleMode: function() {
            var mode = this._isHoursMode ? 'minutes' : 'hours';

            this.setMode(mode);
         },

         _modifyOptions: function(options) {
            ClockPicker.superclass._modifyOptions.call(this, options);
            options._animationTime = ANIMATION_TIME;
            options._ticks = {
               hours: {
                  outer: ['00', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
                  inner: ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']
               },
               minutes: {
                  outer: ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']
               }
            };

            return options;
         },

         /**
          * Создать режим.
          * @private
          */
         _createMode: function() {
            var
               circle,
               mode = this._options.mode,
               arrow = this._container.find('.js-controls-ClockPicker__arrow');

            for (circle in this._options._ticks[mode]) {
               arrow[circle === 'outer' ? 'before' : 'after']($(circleTplFn({
                  mode: mode,
                  circleName: circle,
                  ticks: this._options._ticks[mode][circle],
                  animationTime: ANIMATION_TIME,
                  isMark: !this._isHoursMode
               })));
            }
            /**
             * Из-за того, что у нас возможны только 2 представления, и первое создается в момент инициализации,
             * значит при вызове данного метода мы создадим 2-ое представление. Поэтому мы избавимся от
             * переменных для создания представления и от самого метода.
             */
            delete this._options._ticks;
            delete this._options._animationTime;
            this._createMode = undefined;
         },

         /**
          * SBIS3.CONTROLS.DragNDropMixin
          * Вернуть метод который инициализирует DragNDrop
          */
         _dragInitHandler: function(event) {
            var tick, time, exec;

            exec = /js-controls-ClockPicker__tick-([0-9]{2})|js-controls-ClockPicker__unitTime/.exec(event.target.className) || [];
            /**
             * 1. Если клик был произведен по меченному tick,
             * то нужно встать на этот tick (exec[1] = число в виде строки).
             * 2. Если клик был произведен по unitTime блоку,
             * то перемещать стрелку не нужно (exec[1] = undefined, exec[0] != undefined).
             * 3. Если не выполнились условия выше, то нужно сымитировать DragNDrop,
             * чтобы начались расчеты положения стрелки (exec[0] = undefined).
             */
            tick = parseInt(exec[1]);
            if (!isNaN(tick)) {
               time = coreFunctions.clone(this._options.time);
               time[this._options.mode] = tick;
               this.setTime(time);
            } else if (exec[0]) {
               return;
            } else {
               this._beginDragHandler();
               this._onDragHandler(null, event);
            }

            this._initDrag.call(this, event);
            event.preventDefault();
         },

         //SBIS3.CONTROLS.DragNDropMixin
         _beginDragHandler: function() {
            var offset = this._container.offset();
            if (this._offset.left !== offset.left) {
               this._centerX += offset.left - this._offset.left;
               this._offset.left = offset.left;
            }
            if (this._offset.top !== offset.top) {
               this._centerY += offset.top - this._offset.top;
               this._offset.top = offset.top;
            }
         },

         //SBIS3.CONTROLS.DragNDropMixin
         _onDragHandler: function(dragObject, e) {
            var
               x = e.clientX - this._centerX,
               y = e.clientY - this._centerY,
               mode = this._options.mode,
               angularOffset = 30 / this._tickOffset[mode],
               setTime, circle, deg, tick, arrowConfig;

            if (this._isHoursMode) {
               circle = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) < this._innerCircleRadius ? 'inner' : 'outer';
            } else {
               circle = 'outer';
            }

            //57.29577951308232 = 180 / PI
            deg = -Math.round(Math.atan2(x, y) * 57.29577951308232 / angularOffset) * angularOffset;
            deg <= 0 && (deg += 360);

            tick = this._getTick(circle, deg);

            arrowConfig = this._getArrowConfig(circle, deg);
            circle = arrowConfig.circle;
            deg = arrowConfig.deg;

            if (this._options.time[mode] !== tick) {
               this._setArrow(circle, deg, tick);
               setTime = coreFunctions.clone(this._options.time);
               setTime[mode] = tick;
               //this._setUtilOption('time', setTime);
            }
         },

         //SBIS3.CONTROLS.DragNDropMixin
         _endDragHandler: function() {
            /**
             * Организуем поведение при котором при окончательном выборе часов, происходила смена
             * представления на минуты.
             */
            if (this._options.mode === 'hours') {
               this.setMode('minutes')
            }
            Utils._notifyTimeSelect.call(this);
         },

         /**
          * Переопределим метод SBIS3.CONTROLS.DragNDropMixin, потому что при клике происходит перемещение, а значит
          * оно происходит всегда.
          * @returns {boolean}
          * @private
          */
         _isDrag: function() {
            return true;
         },

         /**
          * Метод для определения поменялся ли config стрелки и что именно.
          * @param circle
          * @param deg
          * @returns {{circle: (false|*), deg: (false|*)}}
          * Если config можно поменять, то возвращаем переданное значение. В противном случае возвращаем false.
          * @private
          */
         _getArrowConfig: function(circle, deg) {
            return {
               circle: this._arrowConfig.circle !== circle && circle,
               deg: this._arrowConfig.deg !== deg && deg
            };
         },

         /**
          * Вернуть время в зависимости от положения стрелки.
          * @param circle круг на который показывает стрелка.
          * @param deg угол.
          * @returns {Number} время.
          * @private
          */
         _getTick: function(circle, deg) {
            var
               mode = this._options.mode,
               angularOffset = 30 / this._tickOffset[mode],
               countTick = 12 * this._tickOffset[mode],
               tick = (deg / angularOffset + countTick / 2) % countTick;

            this._isHoursMode && (circle === 'outer' ^ !tick) && (tick += countTick);
            return tick;
         },

         /**
          * Обработчик клика по контролу.
          * @param {$ws.proto.EventObject} event дескриптор события.
          * @private
          */
         _onMousedownHandler: function(event) {
            var tick, time;
            //Проверим не тащили ли мы стрелку
            if (/js-controls-ClockPicker__arrowTip/.test(event.target.className)) {
               return;
            }
            /**
             * Если клик был произведен по меченному tick, то нужно встать на этот tick.
             */
            tick = parseInt((/js-controls-ClockPicker__tick-([0-9]{2})/.exec(event.target.className) || [])[1]);
            if (!isNaN(tick)) {
               time = coreFunctions.clone(this.getTime());
               time[this.getActiveTime()] = tick;
               this.setTime(time);
               return;
            }
            //Имитируем DragNDrop
            this._beginDragHandler();
            this._onDragHandler(null, event);
         },

         /**
          * Изменить положение стрелки.
          * @param circle круг на который должна показывать стрелка.
          * @param deg угол стрелки.
          * @param tick время установленное в наконечнике стрелки.
          * @private
          */
         _setArrow: function(circle, deg, tick) {
            var tickOffset, nearestDistance, nearestVisibleTick, mode = this._options.mode;
            //Изменим круг, если он поменялся
            if (circle) {
               this.getLinkedContext().setValueSelf('arrow', {
                  isInner: !this.getLinkedContext().getValueSelf('arrow/isInner'),
                  isOuter: this.getLinkedContext().getValueSelf('arrow/isInner')
               });
               this._arrowConfig.circle = circle;
            }

            //Изменим угол, если он поменялся
            if (deg) {
               this.getLinkedContext().setValueSelf('arrow/transform', 'rotate(' + deg + 'deg)');
               this._arrowConfig.deg = deg;

               this.getLinkedContext().setValueSelf('arrowTip', {
                  tick: this._getStringTick(tick),
                  transform: 'rotate(' + (-deg) + 'deg)'
               });
            } else if (typeof tick === 'number') {
               this.getLinkedContext().setValueSelf('arrowTip/tick', this._getStringTick(tick));
            }

            nearestDistance = 2;
            tickOffset = this._tickOffset[mode];

            nearestVisibleTick = tick % tickOffset;
            if (nearestVisibleTick < tickOffset / 2) {
               nearestVisibleTick = -nearestVisibleTick;
            } else {
               nearestVisibleTick = tickOffset - nearestVisibleTick;
            }

            if (Math.abs(nearestVisibleTick) < nearestDistance) {
               nearestVisibleTick += tick;
               nearestVisibleTick === 60 && (nearestVisibleTick = 0);
            } else {
               nearestVisibleTick = undefined;
            }

            /**
             * Может быть так, что мы уже скрывали tick ранее и поэтому скрывать его не нужно.
             * Например: стрелка показывает на 29 и скрыт tick = 30, после мы перелючили стрелку на 31
             * и нам требуется скрыть тот же tick.
             */
            if (this._hiddenTick === nearestVisibleTick) {
               return;
            }
            if (this._$hiddenTick) {
               this._$hiddenTick.show();
               this._$hiddenTick = null;
               this._hiddenTick = null;
            }

            if (typeof nearestVisibleTick !== 'number') {
               return;
            }
            //Если tick, который мы хотим скрыть раньше не скрывался, то нам его нужно сначало найти.
            if (!this._markTick[nearestVisibleTick]) {
               this._markTick[nearestVisibleTick] = this._container.find('.js-controls-ClockPicker__tick-' + this._getStringTick(nearestVisibleTick));
            }
            this._$hiddenTick = this._markTick[nearestVisibleTick].hide();
            this._hiddenTick = nearestVisibleTick;
         },

         /**
          * Вернуть строковое представление времени
          * @param tick время
          * @returns {string} время в формате строки
          * @private
          */
         _getStringTick: function(tick) {
            return tick < 10 && !this._isHoursMode || tick === 0 ? '0' + tick : '' + tick;
         },

         /**
          * Функция устанавливает положение стрелки соответствующее текущему времени.
          * @private
          */
         _calcArrow: function() {
            var circle, deg, tick, arrowConfig, mode = this._options.mode;

            tick = this._options.time[mode];

            if (this._isHoursMode) {
               if (tick > 12 || tick === 0) {
                  circle = 'outer';
               } else {
                  circle = 'inner';
               }
            } else {
               circle = 'outer';
            }
            deg = 30 / this._tickOffset[mode] * tick + 180;

            this._arrowConfig.circle = circle;
            this._arrowConfig.deg = deg;
            this.getLinkedContext().setValueSelf('arrow', {
               isInner: circle === 'outer',
               isOuter: circle === 'inner'
            });

            this._setArrow(circle, deg, tick);
         },

         destroy: function() {
            this._container.off('mousedown touchstart');
            this._container.unbind('mouseup touchend');

            ClockPicker.superclass.destroy.call(this);
         }
      });

      return ClockPicker;
   }
);