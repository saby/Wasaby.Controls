define('js!SBIS3.CONTROLS.ClockPicker',
   [
      'js!SBIS3.CONTROLS.CompoundControl',
      'tmpl!SBIS3.CONTROLS.ClockPicker',
      'Core/tmpl/js/helpers/decorators',
      'js!SBIS3.CONTROLS.ClockPickerHeader',
      'js!SBIS3.CONTROLS.ClockPickerBody'
   ],
   function(CompoundControl, dotTplFn, decorators) {

      'use strict';

      /**
       * Контрол представляющий из шапку часов, и часы с быстрым выбором значения часов или минут.
       *
       * @class SBIS3.CONTROLS.ClockPicker
       * @extend SBIS3.CONTROLS.CompoundControl
       * @demo SBIS3.CONTROLS.Demo.MyClockPicker
       *
       * @initial
       * Пример инициализации контрола.
       * Результат: ClockPicker с выбором минут, стрелкой показывающей на 17, шапкой со временем 20:17
       * и подсвеченным временем 17. При смене представления на hours(см. {@link setViewName})
       * будет ClockPicker с выбором часов, стрелкой показывающей на 20, и шапкой с подсвеченным временем 20.
       *
       * <ol>
       *    <li>
       *       На dot.js:
       *       <component data-component="SBIS3.CONTROLS.ClockPicker">
       *          <options name="time">
       *             <option name="hours">20</option>
       *             <option name="minutes">17</option>
       *          </options>
       *          <option name="viewName">minutes</option>
       *       </component>
       *    </li>
       *    <li>
       *       На logicless:
       *       <ws:SBIS3.CONTROLS.ClockPicker>
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
      var ClockPicker = CompoundControl.extend(/** @lends SBIS3.CONTROLS.ClockPickerBody.prototype */{
         _dotTplFn: dotTplFn,

         /**
          * @event onChangeTime Происходит после смены положения стрелки.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Object} time Текущее время.
          */

         /**
          * @event onChangeViewName Происходит после смены представления.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Object} viewName Текущее имя представления.
          */

         /**
          * @event onClose Происходит при нажатии на кнопку дом.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          */

         /**
          * @event onClose Происходит при нажатии на кнопку закрыть.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          */

         $protected: {
            _options: {
               /**
                * @cfg {Object} Время.
                *
                * @example
                * Установить время 20:17.
                * <ol>
                *    <li>
                *       На dot.js:
                *       <pre>
                *          <options name="time">
                *             <option name="hours" type="number">20</option>
                *             <option name="minutes" type="number">17</option>
                *          </options>
                *       </pre>
                *    </li>
                *    <li>
                *       На logicless:
                *       <pre>
                *          <ws:time>
                *             <ws:Object>
                *                <ws:hours>
                *                   <ws:Number>20</ws:Number>
                *                </ws:hours>
                *                <ws:minutes>
                *                   <ws:Number>17</ws:Number>
                *                </ws:minutes>
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

            //Количество обновленных контролов.
            _countUpdateControls: 0
         },

         $constructor: function() {
            this._publish('onChangeTime', 'onChangeViewName', 'onHome', 'onClose');
         },

         init: function() {
            ClockPicker.superclass.init.call(this);

            //Найдем внутренние контролы
            this._header = this.getChildControlByName('header');
            this._body = this.getChildControlByName('body');

            //Подпишимся на события внутренних контролов
            this._header.subscribe('onChangeTime', this._onChangeOwnOptionHandler.bind(this, 'time', 'body'));
            this._header.subscribe('onChangeActiveTime', this._onChangeOwnOptionHandler.bind(this, 'viewName', 'body'));
            this._header.subscribe('onHome', this._onHomeHandler.bind(this));
            this._header.subscribe('onClose', this._onCloseHandler.bind(this));
            this._body.subscribe('onChangeTime', this._onChangeOwnOptionHandler.bind(this, 'time', 'header'));
            this._body.subscribe('onChangeViewName', this._onChangeOwnOptionHandler.bind(this, 'viewName', 'header'));
         },

         /**
          * Получить установленное время.
          * @returns {Object} установленное время.
          * @public
          */
         getTime: function() {
            return this._options.time;
         },

         /**
          * Изменить установленное время.
          * @param {Object} time новое время
          * @public
          */
         setTime: function(time) {
            this._setOwnOption('time', time);
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
            this._setOwnOption('viewName', viewName);
         },

         _setOwnOption: function(option, value) {
            this._updateControl('header', option, value);
            this._notify('onChange' + decorators.ucFirst(option), value);
         },

         _isUpdate: function() {
            return this._countUpdateControls === 3 && (this._countUpdateControls = 0) && true;
         },

         _updateControl: function(name, property, value) {
            this.getLinkedContext().setValueSelf(property + '/' + name, value);
         },

         /**
          * Обработчик смены времени.
          * * @param {String} option название опции.
          * @param {String} control имя обновляемого контрола.
          * @param {$ws.proto.EventObject} event дескриптор события.
          * @param {Object} time время
          * @private
          */
         _onChangeOwnOptionHandler: function(option, control, event, value) {
            this._countUpdateControls++;
            if (this._isUpdate()) {
               return;
            }
            this._setOption(option, value);
            this._countUpdateControls++;
            this._updateControl(control, option, value);
         },

         /**
          * Обработчик клика по кнопке дома в шапке.
          * @private
          */
         _onHomeHandler: function() {
            this._notify('onHome');
         },

         /**
          * Обработчик клика по кнопке закрыть в шапке.
          * @private
          */
         _onCloseHandler: function() {
            this.hide();
            this._notify('onClose');
         },

         destroy: function() {
            this._header.unsubscribe('onChangeTime', this._onChangeOwnOptionHandler);
            this._header.unsubscribe('onChangeActiveTime', this._onChangeOwnOptionHandler);
            this._header.unsubscribe('onClose', this._onCloseHandler);
            this._body.unsubscribe('onChangeTime', this._onChangeOwnOptionHandler);
            this._body.unsubscribe('onChangeViewName', this._onChangeOwnOptionHandler);

            ClockPicker.superclass.destroy.call(this);
         }
      });

      return ClockPicker;
   }
);