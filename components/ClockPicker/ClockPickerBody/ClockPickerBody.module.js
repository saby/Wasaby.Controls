define('js!SBIS3.CONTROLS.ClockPickerBody',
   [
      'js!SBIS3.CONTROLS.CompoundControl',
      'tmpl!SBIS3.CONTROLS.ClockPickerBody',
      'js!SBIS3.CONTROLS.DragNDropMixin',
      'tmpl!SBIS3.CONTROLS.ClockPickerBody/resources/Circle'
   ],
   function(CompoundControl, dotTplFn, DragNDropMixinNew, circleTplFn) {

      'use strict';

      //Время анимация перехода между view.
      var ANIMATION_TIME = 200;

      /**
       * Контрол представляющий из себя часы с быстрым выбором значения часов и минут.
       * Он состоит из стрелки для выбора и набора tick - значение для выбора.
       *
       * @class SBIS3.CONTROLS.ClockPickerBody
       * @extend SBIS3.CONTROLS.CompoundControl
       *
       * @initial
       * Пример инициализации контрола.
       * Результат: ClockPickerBody с выбором минут, и стрелкой показывающей на 17. При смене
       *            представления на hours(см. {@link setViewName}) будет ClockPickerBody с выбором часов,
       *            и стрелкой показывающей на 20.
       *
       * <ol>
       *    <li>
       *       На dot.js:
       *       <component data-component="SBIS3.CONTROLS.ClockPickerBody">
       *          <options name="time">
       *             <option name="hours">20</option>
       *             <option name="minutes">17</option>
       *          </options>
       *          <option name="viewName">minutes</option>
       *       </component>
       *    </li>
       *    <li>
       *       На logicless:
       *       <ws:SBIS3.CONTROLS.ClockPickerBody>
       *          <ws:time>
       *             <ws:Object>
       *                <ws:hours>20</ws:hours>
       *                <ws:minutes>17</ws:minutes>
       *             </ws:Object>
       *          </ws:time>
       *          <ws:viewName>minutes</ws:view>
       *       </ws:SBIS3.CONTROLS.ClockPickerBody>
       *    </li>
       * </ol>
       *
       * @control
       * @public
       * @author Крайнов Дмитрий Олегович
       */
      var ClockPickerBody = CompoundControl.extend([DragNDropMixinNew], /** @lends SBIS3.CONTROLS.ClockPickerBody.prototype */ {
         _dotTplFn: dotTplFn,

         /**
          * @event onChangeTime Происходит после смены положения стрелки.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Object} time Текущее положение стрелки.
          */

         /**
          * @event onChangeViewName Происходит после смены представления.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Object} viewName Текущее имя представления.
          */

         $protected: {
            _options: {
               /**
                * @cfg {Object} Положение стрелки в разных представлениях.
                *
                * @example
                * Установить стрелку представлений hours на 20, а minutes на 17.
                * <ol>
                *    <li>
                *       На dot.js:
                *       <pre>
                *          <options name="time">
                *             <option name="hours">20</option>
                *             <option name="minutes">17</option>
                *          </options>
                *       </pre>
                *    </li>
                *    <li>
                *       На logicless:
                *       <pre>
                *          <ws:time>
                *             <ws:Object>
                *                <ws:hours>20</ws:hours>
                *                <ws:minutes>17</ws:minutes>
                *             </ws:Object>
                *          </ws:time>
                *       </pre>
                *    </li>
                * </ol>
                *
                * @see getTime
                * @see setTime
                */
               time: {
                  hours: 0,
                  minutes: 0
               },

               /**
                * @cfg {String} Имя текущего предсталения.
                * <ol>
                *    <li>Часов: hours.</li>
                *    <li>Минут: minutes.</li>
                * </ol>
                *
                * @example
                * Установить представление минут.
                * <ol>
                *    <li>
                *       На dot.js:
                *       <pre>
                *          <option name="viewName">minutes</option>
                *       </pre>
                *    </li>
                *    <li>
                *       На logicless:
                *       <pre>
                *          <ws:viewName>minutes</ws:view>
                *       </pre>
                *    </li>
                * </ol>
                *
                * @see getViewName
                * @see setViewName
                */
               viewName: 'hours'
            },
            //Хранит в себе jQuery объекты помеченных tick.
            _markTick: {},

            //Смещение tick-ов относительно друг друга, в tick-ах.
            _tickOffset: {
               hours: 1,
               minutes: 5
            },

            //Текущая конфигурация стрелки.
            _arrowConfig: {
               circle: 'outer',
               deg: 180
            },

            //Метки для представлений.
            _unitTime: {
               hours: 'ЧАСЫ',
               minutes: 'МИНУТЫ'
            }
         },

         constructor: function ClockPickerBody() {
            this._publish('onChangeTime', 'onChangeViewName');
         },

         init: function() {
            ClockPickerBody.superclass.init.call(this);

            this._isViewHours = this.getViewName() === 'hours';

            //Подпишимся на события для работы стрелки.
            this._container.on('mousedown touchstart', '.js-controls-ClockPickerBody__arrowTip', this._getDragInitHandler());
            this._container.bind('mousedown touchstart', this._onClickHandler.bind(this));
            this._container.bind('mouseup touchend', this._onMouseupHandler.bind(this));

            //Расчитаем положение стрелки и установим название представления.
            this.getLinkedContext().setValueSelf('arrow', {
               isInner: false,
               isOuter: true
            });
            this._calcArrow();
            this.getLinkedContext().setValueSelf('unitTime', this._unitTime[this.getViewName()]);
         },

         /**
          * Получить положение стрелки.
          * @returns {Object} положение стрелки в разных представлениях.
          * @public
          */
         getTime: function() {
            return this._options.time;
         },

         /**
          * Изменить положение стрелки.
          * @param {Object} time новое положение стрелки в разных представлениях.
          * @public
          */
         setTime: function(time) {
            var setTime = {};
            for (var system in this.getTime()) {
               if (!(system in time) || this.getTime()[system] === time[system]) {
                  continue;
               }
               this.getTime()[system] = time[system];
               setTime[system] = time[system];
            }

            //Проверим изменилось ли время.
            if (!Object.isEmpty(setTime)) {
               //Пересчитаем положение стрелки, если изменилось время на активном представлении.
               if (this.getViewName() in setTime) {
                  this._calcArrow();
               }
               this._notify('onChangeTime', setTime)
            }
         },

         /**
          * Получить имя активного представления.
          * @returns {String} имя активного представления.
          * @public
          */
         getViewName: function() {
            return this._options.viewName;
         },

         /**
          * Изменить активное представление.
          * @param {String} viewName имя нового представления.
          * @public
          */
         setViewName: function(viewName) {
            //Проверим можем ли мы установить новое представление или не совподает ли оно с текущим.
            if (this.getViewName() === viewName || !(viewName in this.getTime())) {
               return;
            }
            this._options.viewName = viewName;
            this._isViewHours = !this._isViewHours;
            this._createView && this._createView();

            //Анимация
            this.getLinkedContext().setValueSelf('arrow/opacity', 0);
            setTimeout(function() {
               var className = 'controls-ClockPickerBody_hours controls-ClockPickerBody_minutes';
               this._calcArrow();
               this._container.toggleClass(className);
               this.getLinkedContext().setValueSelf('arrow/opacity', 1);
               this.getLinkedContext().setValueSelf('unitTime', this._unitTime[viewName]);
            }.bind(this), ANIMATION_TIME);
            this._notify('onChangeViewName', this.getViewName());
         },

         _modifyOptions: function(options) {
            options = ClockPickerBody.superclass._modifyOptions.call(this, options);
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
               arrow = this._container.find('.js-controls-ClockPickerBody__arrow');

            for (circle in this._options._ticks[this.getViewName()]) {
               arrow[circle === 'outer' ? 'before' : 'after']($(circleTplFn({
                  viewName: this.getViewName(),
                  circleName: circle,
                  ticks: this._options._ticks[this.getViewName()][circle],
                  animationTime: ANIMATION_TIME,
                  isMark: this.getViewName() === 'minutes'
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
            this._offset = this._container.offset();
            this._centerX = this._offset.left + this._container.width() / 2;
            this._centerY = this._offset.top + this._container.height() / 2;
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
               angularOffset = 30 / this._tickOffset[this.getViewName()],
               setTime = {},
               circle, deg, tick;

            if (this._isViewHours) {
               circle = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) < 103 ? 'inner' : 'outer';
            } else {
               circle = 'outer';
            }

            //57.29577951308232 = 180 / PI
            deg = -Math.round(Math.atan2(x, y) * 57.29577951308232 / angularOffset) * angularOffset;
            deg <= 0 && (deg += 360);

            tick = this._getTick(circle, deg);

            if (this._options.time[this.getViewName()] !== tick) {
               this._setArrow(circle, deg, tick);
               this._options.time[this.getViewName()] = tick;
               setTime[this.getViewName()] = tick;
               this._notify('onChangeTime', setTime);
            }
         },

         //SBIS3.CONTROLS.DragNDropMixin
         _endDragHandler: function() {
            this._isDragArrow = true;
            /**
             * Организуем поведение при котором при окончательном выборе часов, происходила смена
             * представления на минуты.
             */
            this.getViewName() === 'hours' && this.setViewName('minutes');
         },

         _onClickHandler: function() {
            this._isDragArrow = false;
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
               angularOffset = 30 / this._tickOffset[this.getViewName()],
               countTick = 12 * this._tickOffset[this.getViewName()],
               tick = (deg / angularOffset + countTick / 2) % countTick;

            this._isViewHours && (circle === 'outer' ^ !tick) && (tick += countTick);
            return tick;
         },

         /**
          * Обработчик клика по контролу.
          * @param {$ws.proto.EventObject} event дескриптор события.
          * @private
          */
         _onMouseupHandler: function(event) {
            var tick, time;
            //Проверим не тащили ли мы стрелку
            if (this._isDragArrow || /js-controls-ClockPickerBody__arrowTip/.test(event.target.className)) {
               return;
            }
            /**
             * Если клик был произведен по меченному tick, то нужно встать на этот tick.
             */
            tick = parseInt((/js-controls-ClockPickerBody__tick-([0-9]{2})/.exec(event.target.className) || [])[1]);
            if (tick) {
               time = {};
               time[this.getViewName()] = tick;
               this.setTime(time);
               return;
            }
            //Имитируем DragNDrop
            this._beginDragHandler();
            this._onDragHandler(null, event);
            this._endDragHandler();
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
            if (circle !== this._arrowConfig.circle) {
               this.getLinkedContext().setValueSelf('arrow', {
                  isInner: !this.getLinkedContext().getValueSelf('arrow/isInner'),
                  isOuter: this.getLinkedContext().getValueSelf('arrow/isInner')
               });
               this._arrowConfig.circle = circle;
            }
            //Изменим угол, если он поменялся
            if (deg !== this._arrowConfig.deg) {
               this.getLinkedContext().setValueSelf('arrow/transform', 'rotate(' + deg + 'deg)');
               this._arrowConfig.deg = deg;
            }
            this.getLinkedContext().setValueSelf('arrowTip', {
               tick: this._getStringTick(tick),
               transform: 'rotate(' + (-deg) + 'deg)'
            });
            nearestDistance = 2;
            tickOffset = this._tickOffset[this.getViewName()];

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
               this._markTick[nearestVisibleTick] = this._container.find('.js-controls-ClockPickerBody__tick-' + this._getStringTick(nearestVisibleTick));
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
            var circle, deg, tick;

            tick = this.getTime()[this.getViewName()];

            if (this._isViewHours) {
               if (tick > 12 || tick === 0) {
                  circle = 'outer';
               } else {
                  circle = 'inner';
               }
            } else {
               circle = 'outer';
            }
            deg = 30 / this._tickOffset[this.getViewName()] * tick + 180;

            this._setArrow(circle, deg, tick);
         },

         destroy: function() {
            this._container.off('mousedown touchstart');
            this._container.unbind('mouseup touchend');

            ClockPickerBody.superclass.destroy.call(this);
         }
      });

      return ClockPickerBody;
   }
);