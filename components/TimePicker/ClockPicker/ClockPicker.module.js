define('js!SBIS3.CONTROLS.ClockPicker',
   [
      'js!SBIS3.CORE.CompoundControl',
      'tmpl!SBIS3.CONTROLS.ClockPicker',
      'js!SBIS3.CONTROLS.DragNDropMixin',
      'tmpl!SBIS3.CONTROLS.ClockPicker/resources/Circle',
      'Core/core-functions',
      'Core/helpers/String/ucFirst',
      'js!SBIS3.CONTROLS.TimePickerUtils',
      'css!SBIS3.CONTROLS.ClockPicker'
   ],
   function(CompoundControl, dotTplFn, DragNDropMixinNew, circleTplFn, coreFunctions, ucFirst, Utils) {

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
       *            представления на hours(см. {@link setActiveTime}) будет ClockPicker с выбором часов,
       *            и стрелкой показывающей на 20.
       *
       * <ws:SBIS3.CONTROLS.ClockPicker>
       *    <ws:time>
       *       <ws:Object>
       *          <ws:hours>20</ws:hours>
       *          <ws:minutes>17</ws:minutes>
       *       </ws:Object>
       *    </ws:time>
       *    <ws:activeTime>minutes</ws:activeTime>
       * </ws:SBIS3.CONTROLS.ClockPicker>
       *
       * @control
       * @public
       * @author Крайнов Дмитрий Олегович
       */
      var ClockPicker = CompoundControl.extend([DragNDropMixinNew, Utils], /** @lends SBIS3.CONTROLS.ClockPicker.prototype */ {
         _dotTplFn: dotTplFn,

         /**
          * @event onChangeTime Происходит после смены положения стрелки.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Object} time Текущее положение стрелки.
          */

         /**
          * @event onChangeActiveTime Происходит после смены представления.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Object} activeTime Текущее имя представления.
          */

         $protected: {
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

            //Метки для представлений.
            _unitTime: {
               hours: 'ЧАСЫ',
               minutes: 'МИНУТЫ'
            }
         },

         init: function() {
            ClockPicker.superclass.init.call(this);

            this._isViewHours = this.getActiveTime() === 'hours';

            //Подпишимся на события для работы стрелки.
            this._container.one('mousedown touchstart', function() {
               this._offset = this._container.offset();
               this._centerX = this._offset.left + this._container.width() / 2;
               this._centerY = this._offset.top + this._container.height() / 2;
            }.bind(this));
            this._container.on('mousedown touchstart', '.js-controls-ClockPicker__arrowTip', this._getDragInitHandler());
            this._container.bind('mousedown touchstart', this._onMousedownHandler.bind(this));
            this._container.bind('mouseup touchend', this._endDragHandler.bind(this));

            //Расчитаем положение стрелки и установим название представления.
            this._calcArrow(true);
            this.getLinkedContext().setValueSelf('unitTime', this._unitTime[this.getActiveTime()]);
         },

         /**
          * Изменить положение стрелки.
          * @param {Object} time новое положение стрелки в разных представлениях.
          * @public
          */
         setTime: function(time) {
            var isSetActiveTime = ClockPicker.superclass.setTime.call(this, time).isSetActiveTime;
            if (isSetActiveTime) {
               this._calcArrow();
            }
         },

         /**
          * Изменить активное представление.
          * @param {String} activeTime имя нового представления.
          * @public
          */
         setActiveTime: function(activeTime) {
            //Проверим можем ли мы установить новое представление или не совподает ли оно с текущим.
            if (this.getActiveTime() === activeTime || !(activeTime in this.getTime())) {
               return;
            }
            this._setUtilOption('activeTime', activeTime);
            this._isViewHours = !this._isViewHours;
            this._createView && this._createView();

            //Анимация
            this.getLinkedContext().setValueSelf('arrow/visible', false);
            this.getLinkedContext().setValueSelf('arrow/hidden', true);
            setTimeout(function() {
               var className = 'controls-ClockPicker_hours controls-ClockPicker_minutes';
               this._calcArrow();
               this._container.toggleClass(className);
               this.getLinkedContext().setValueSelf('arrow/visible', true);
               this.getLinkedContext().setValueSelf('arrow/hidden', false);
               this.getLinkedContext().setValueSelf('unitTime', this._unitTime[activeTime]);
            }.bind(this), ANIMATION_TIME);
         },

         _modifyOptions: function(options) {
            options = ClockPicker.superclass._modifyOptions.call(this, options);
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
          * Создать представление.
          * @private
          */
         _createView: function() {
            var
               circle,
               arrow = this._container.find('.js-controls-ClockPicker__arrow');

            for (circle in this._options._ticks[this.getActiveTime()]) {
               arrow[circle === 'outer' ? 'before' : 'after']($(circleTplFn({
                  activeTime: this.getActiveTime(),
                  circleName: circle,
                  ticks: this._options._ticks[this.getActiveTime()][circle],
                  animationTime: ANIMATION_TIME,
                  isMark: this.getActiveTime() === 'minutes'
               })));
            }
            /**
             * Из-за того, что у нас возможны только 2 представления, и первое создается в момент инициализации,
             * значит при вызове данного метода мы создадим 2-ое представление. Поэтому мы избавимся от
             * переменных для создания представления и от самого метода.
             */
            delete this._options._ticks;
            delete this._options._animationTime;
            this._createView = undefined;
         },

         /**
          * SBIS3.CONTROLS.DragNDropMixin
          * Вернуть метод который инициализирует DragNDrop
          */
         _getDragInitHandler: function() {
            return (function(e) {
               this._initDrag.call(this, e);
               e.preventDefault();
            }).bind(this);
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
               angularOffset = 30 / this._tickOffset[this.getActiveTime()],
               setTime, circle, deg, tick, arrowConfig;

            if (this._isViewHours) {
               circle = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) < 103 ? 'inner' : 'outer';
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

            if (this.getTime()[this.getActiveTime()] !== tick) {
               this._setArrow(circle, deg, tick);
               setTime = coreFunctions.clone(this.getTime());
               setTime[this.getActiveTime()] = tick;
               this._setUtilOption('time', setTime);
            }
         },

         //SBIS3.CONTROLS.DragNDropMixin
         _endDragHandler: function() {
            /**
             * Организуем поведение при котором при окончательном выборе часов, происходила смена
             * представления на минуты.
             */
            this.getActiveTime() === 'hours' && this.setActiveTime('minutes');
         },

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
               angularOffset = 30 / this._tickOffset[this.getActiveTime()],
               countTick = 12 * this._tickOffset[this.getActiveTime()],
               tick = (deg / angularOffset + countTick / 2) % countTick;

            this._isViewHours && (circle === 'outer' ^ !tick) && (tick += countTick);
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
            var tickOffset, nearestDistance, nearestVisibleTick;
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
            tickOffset = this._tickOffset[this.getActiveTime()];

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
            return tick < 10 && !this._isViewHours || tick === 0 ? '0' + tick : '' + tick;
         },

         /**
          * Функция устанавливает положение стрелки соответствующее текущему времени.
          * @private
          */
         _calcArrow: function() {
            var circle, deg, tick, arrowConfig;

            tick = this.getTime()[this.getActiveTime()];

            if (this._isViewHours) {
               if (tick > 12 || tick === 0) {
                  circle = 'outer';
               } else {
                  circle = 'inner';
               }
            } else {
               circle = 'outer';
            }
            deg = 30 / this._tickOffset[this.getActiveTime()] * tick + 180;

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