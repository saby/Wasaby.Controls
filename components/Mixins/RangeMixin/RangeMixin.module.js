define('js!SBIS3.CONTROLS.RangeMixin', [], function() {

   /**
    * Миксин, добавляющий поведение хранения начального и конечного значений диапазона.
    * @mixin SBIS3.CONTROLS.RangeMixin
    * @author Миронов Александр Юрьевич
    * @public
    */
   var RangeMixin = /**@lends SBIS3.CONTROLS.RangeMixin.prototype  */{
      /**
       * @event onStartValueChange После изменения начального значения диапазона
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {*} startValue Новое значение начала диапазона.
       * @example
       * <pre>
       *     myDateRange.subscribe('onStartValueChange', function(eventObject, newStartValue) {
       *        TextBox.setText(newStartValue.toString());
       *     });
       * </pre>
       * @see startValue
       * @see setStartValue
       * @see getStartValue
       */
      /**
       * @event onEndValueChange После изменения конечного значения диапазона
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {*} startValue Новое значение конца диапазона.
       * @example
       * <pre>
       *     myDateRange.subscribe('onEndValueChange', function(eventObject, newEndValue) {
       *        TextBox.setText(newEndValue.toString());
       *     });
       * </pre>
       * @see endValue
       * @see setEndValue
       * @see getEndValue
       */
      /**
       * @event onRangeChange После изменения диапазона
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {*} startValue Начало измененного диапазона.
       * @param {*} endValue Конец измененного диапазона.
       * @example
       * <pre>
       *     myDateRange.subscribe('onEndValueChange', function(eventObject, startValue, endValue) {
       *        TextBox.setText(startValue.toString() + '-' + endValue.toString());
       *     });
       * </pre>
       * @see startValue
       * @see setStartValue
       * @see getStartValue
       * @see endValue
       * @see setEndValue
       * @see getEndValue
       * @see setRange
       * @see getRange
       */
      $protected: {
         _options: {
            /**
             * @cfg {*} Начальное значение диапазона
             */
            startValue: null,
            /**
             * @cfg {*} Конечное значение диапазона
             */
            endValue: null
         }
      },

      $constructor: function() {
         this._publish('onRangeChange', 'onStartValueChange', 'onEndValueChange');
      },

      /**
       * Установить начальное значение диапазона.
       * @param {Object} value Начальное значение.
       * @param {Boolean} silent Если True, то события изменения свойства не генерируются.
       * @see startValue
       */
      setStartValue: propertySetter('startValue', undefined, '_notifyOnRangeChangedAfterSetters'),

      /**
       * Получить начальное значение диапазона.
       * @return {Object} Начальная дата диапазона.
       * @see startValue
       */
      getStartValue: function() {
         return this._options.startValue;
      },

      /**
       * Установить конечное значение диапазона.
       * @param {Object} value Конечное значение диапазона.
       * @param {Boolean} silent Если True, то события изменения свойства не генерируются.
       * @see endValue
       */
      setEndValue: propertySetter('endValue', undefined, '_notifyOnRangeChangedAfterSetters'),

      /**
       * Получить конечное значение диапазона.
       * @return {Object} Конечная дата диапазона.
       * @see endValue
       */
      getEndValue: function() {
         return this._options.endValue;
      },

      /**
       * Установить начальное и конечное значение.
       * Необходимо использовать, если надо одновлеменно установить начальное и конечное значение. Если вместо этого
       * использовать setStartValue и setEndValue, то событие onRangeChange будет сгенерировано 2 раза.
       * @param startValue Начальное значение диапазона.
       * @param endValue Конечное значение диапазона.
       */
      setRange: function(startValue, endValue, silent) {
         var changed = false;

         if (this.setStartValue(startValue, true)) {
            if (!silent) {
               this._notifyOnStartValueChanged();
            }
            changed = true;
         }

         if (this.setEndValue(endValue, true)) {
            if (!silent) {
               this._notifyOnEndValueChanged();
            }
            changed = true;
         }

         if (changed && !silent) {
            this._notifyOnRangeChanged();
         }
         return changed;
      },

      _notifyOnRangeChangedAfterSetters: function (value, oldValue, silent) {
         if (!silent) {
            this._notifyOnRangeChanged();
         }
      },

      _notifyOnStartValueChanged: function () {
         this._notifyOnPropertyChanged('startValue');
         this._notify('onStartValueChange', this._options.startValue);
      },
      
      _notifyOnEndValueChanged: function () {
         this._notifyOnPropertyChanged('endValue');
         this._notify('onEndValueChange', this._options.endValue);
      },

      _notifyOnRangeChanged: function () {
         this._notify('onRangeChange', this._options.startValue, this._options.endValue);
      }
   };


   /**
    * Фабрика, генерирующая сеттеры свойства для модулей.
    * Для хранения значения свойства использует переменную в поле _options у объекта.
    * @param optionName {String} Название переменной в поле _options в объекте.
    * @param validationFunction {Function} Функция проверяющая граничные условия для устанавливаемого значения.
    * На вход принимает утанавливаемое значение. Должна вернуть скоректированное устанавливаемое значение,
    * которое будет установлено для свойства. Или сгенерировать исключение.
    * быть перерисовано. Для работы этого параметра необходимо что бы к классу был подключен ViewValidateMixin.
    * @param afterFunction {Function} Функция которая вызывается после того как значение свойства было установлено.
    * Вместо этой функции лучше использовать подписку на события изменения свойства. В отличии от подписки на события,
    * эта функция вызывается для silent вызовов сеттера которые не генерируют события.
    * @return {Function}
    */
   function propertySetter (optionName, validationFunction, afterFunction) {
      var propertyWrap =  function (value, silent) {
         var oldValue = this._options[optionName],
            eventName;

         if (oldValue === value) {
            return false;
         } else if ((oldValue instanceof Date) && (value instanceof Date) && oldValue.getTime() === value.getTime()) {
            return false;
         }


         if (validationFunction) {
            value = callFunction(this, validationFunction, [value, oldValue]);
         }

         this._options[optionName] = value;

         if (!silent) {
            this._notifyOnPropertyChanged(optionName);
            eventName = 'on' + optionName.charAt(0).toUpperCase() + optionName.slice(1) + 'Change';
            this._notify(eventName, value);
         }
         if (afterFunction) {
            callFunction(this, afterFunction, [value, oldValue, silent]);
         }

         return true;
      };
      return propertyWrap;
   }

   function callFunction (obj, func, args) {
      switch(typeof func) {
         case 'function':
            return func.apply(obj, args);
         case 'string':
            return obj[func].apply(obj, args);
      }
   }

   return RangeMixin;

});