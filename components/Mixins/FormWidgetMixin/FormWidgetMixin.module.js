define('js!SBIS3.CONTROLS.FormWidgetMixin', ['js!SBIS3.CORE.Infobox'], function (Infobox) {
   /**
    * Добавляет к любому контролу методы для получения и установки “значения”.
    * Необходим для однообразной работы с набором контролов на диалоге, когда речь идет о сохранении набора данных в БЛ,
    * или заполнении контролов значениями из БЛ. В каждом контроле методы должны быть определены
    * @mixin SBIS3.CONTROLS.FormWidgetMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    */
   var FormWidgetMixin = /** @lends SBIS3.CONTROLS.FormWidgetMixin.prototype */{
       /**
        * @event onValidate При смене выбранных элементов
        * @param {$ws.proto.EventObject} eventObject Дескриптор события.
        * @param {Boolean} vResult.result Результат.
        * @param {Array} vResult.errors Ошибки.
        * @param {String} previousStatus Предыдущее состоянии валидации.
        * @example
        * Если поле ввода (TextBox) успешно прошло валидацию, то сделать кнопку (btn) доступной для взаимодействия.
        * <pre>
        *    TextBox.subscribe('onValidate', function(eventObject, validationResult) {
        *       btn.setEnabled(validationResult);
        *    });
        * </pre>
        * @see validators
        * @see getValidators
        * @see setValidators
        * @see markControl
        * @see clearMark
        * @see validate
        */
      $protected: {
         _validationErrorCount: 0,
         _validating: false,
         _prevValidationResult: true,
         _vResultErrors: [],
         _errorMessage: '',
         _options: {
            /**
             * @typedef {Object} Validator
             * @property {Function} validator Функция валидации.
             * @property {String} option Валидируемая опция. Передаётся в функцию валидации в качестве её аргумента.
             * @property {String} errorMessage Текст сообщения об ошибке валидации.
             * Если свойство не определено, то в качестве текста будет использовано значение, возвращаемое функцией валидации.
             * @translatable errorMessage
             * @property {Boolean} noFailOnError Нежёсткая валидация.
             * Если значение опции true, то при непрохождении валидации контрол маркируется и возвращается true.
             */
            /**
             * @cfg {Validator[]} Валидаторы контрола
             * Массив объектов, описывающих функции валидации.
             * @group Validation
             * @see validators
             * @see getValidators
             * @see setValidators
             * @see markControl
             * @see clearMark
             * @see onValidate
             */
            validators: []
         }
      },

      $constructor: function () {
         this._publishEvents();
      },

      around: {
         _isCanShowExtendedTooltip: function () {
            return Array.prototype.shift.call(arguments).apply(this, arguments) || this.isMarked();
         }
      },
      instead: {
         /**
          * Добавляет к исходному тексту сообщение об ошибках валидации, если таковые имеются
          * @param message
          * @returns {string}
          * @private
          */
         _alterTooltipText: function (message) {
            if (this.isMarked()) {
               var
                  msg = this._errorMessage instanceof jQuery ? this._errorMessage[0].outerHTML : this._errorMessage;
               return (typeof message == 'string' && message.length ? ('<p>' + message + '</p>') : '') + '<p>' + msg + '</p>';
            } else {
               return message;
            }
         }
      },
      before: {
          destroy: function () {
            if (Infobox.hasTarget() && Infobox.isCurrentTarget(this._getExtendedTooltipTarget())) {
               Infobox.hide();
            }
         }
      },

      _publishEvents: function () {
         this._publish('onValidate');
      },

      /**
       * Данный метод определяет, может ли быть проведена валидация данного элемента управления
       * т.е. имеет ли смысл вообще пробовать запустить ее.
       * Дефолтная реализация проверяет наличие валидаторов. Потомки класса могу реализовать собственную логику проверки
       *
       * @return {Boolean}
       * @protected
       */
      _canValidate: function () {
         return this._options.validators.length;
      },

      _invokeValidation: function () {
         var retval = {
            errors: [],
            result: true
         };

         for (var i = 0, l = this._options.validators.length; i < l; i++) {
            var
               currValidator = this._options.validators[i],
               failOnError = !(currValidator.noFailOnError || false),
               res = false;

            try {
               res = currValidator.validator.apply(this, [this._options[currValidator.option]]);
            } catch (e) {
               $ws.single.ioc.resolve('ILogger').log('FieldAbstract', 'Exception while validating ' + e.message);
            }

            if (res !== true) { // Валидация не успешна
               res = currValidator.errorMessage ? currValidator.errorMessage : res;
               retval.errors = retval.errors.concat(res);
               if (failOnError) {
                  retval.result &= false;
               }
            }
         }

         return retval;
      },
      /**
       * Функция валидации контрола.
       * Проверит все валидаторы, как встроенные, так и пользовательские.
       * В случае неудачи отметит контрол сообщением об ошибке валидации.
       * В случае успеха снимет отметку ошибки, если такая была.
       * @returns {Boolean} Признак: валидация пройдена успешно (true) или с ошибками (false).
       * @example
       * Проверить все валидаторы диалога редактирования записи (dialogRecord). В случае успеха обновить запись.
       * <pre>
       *    if (dialogRecord.validate()) {
       *       dialogRecord.updateRecord();
       *    }
       * </pre>
       * @see validators
       * @see getValidators
       * @see setValidators
       * @see markControl
       * @see clearMark
       * @see onValidate
       */
      validate: function () {
         var
            vResult,
            cont = this.getContainer(),
            previousStatus = this._prevValidationResult;
         this.clearMark();
         if (this._validating || !this._canValidate() || !cont || cont.hasClass('ws-hidden') === true) {
            return true;
         }

         try {
            this._validating = true;
            vResult = this._invokeValidation();
         } catch (e) {
            vResult = {
               errors: [ e.message ],
               result: false
            };
         } finally {
            this._validating = false;
         }

         if (vResult.errors.length > 0) {
            this.markControl(vResult.errors);
         }
         this._calcPrevValidationResult();

         this._notify('onValidate', !!vResult.result, vResult.errors, previousStatus);

         this._vResultErrors = vResult.errors;
         return vResult.result;
      },

      _getMessageBox: function (message, settings) {
         var messageBox = $('body > .ws-warning-message-box');
         if (!messageBox.length) {
            messageBox = $('<div class="ws-warning-message-box"></div>').append(
                  $('<span class="ws-warning-icon"></span>')
               ).append(
                  $('<span class="ws-warning-message-text"></span>')
               );
            // Создаем закорючку
            var ballon = $('<div class="ws-arrow-balloon"></div>');
            var ballonHtml = '';
            for (var i = 1; i <= 10; i++) {
               ballonHtml += '<b class="b' + i + '"></b>';
            }
            ballon.html(ballonHtml);
            messageBox.append(ballon);
            $('body').append(messageBox);
         }

         if (message) {
            messageBox.find('.ws-warning-message-text').html($ws.helpers.escapeHtml(message));
         }
         try {
            if (settings) {
               if (settings['icon'] && messageBox.data('current-icon') != settings['icon']) {
                  var iconPath = $ws._const.wsRoot + 'img/infobox/icon-' + settings['icon'] + '.png';
                  messageBox.find('.ws-warning-icon').css({
                     'background-image': 'url("' + iconPath + '")',
                     'display': 'block'});
                  messageBox.data('current-icon', settings['icon']);
               }
               if (settings['noIcon']) {
                  messageBox.find('.ws-warning-icon').hide();
               }
               if (settings['color']) {
                  messageBox.find('.ws-warning-message-text').css('color', settings['color']);
               }
               if (settings['background-color'] && messageBox.data('current-background-color') != settings['background-color']) {
                  // Если передан цвет, устанавливаем цвет, иначе по умолчанию из css
                  messageBox.css('background-color', settings['background-color']);
                  messageBox.find('.ws-arrow-balloon b').css('background-color', settings['background-color']);
                  messageBox.data('current-background-color', settings['background-color']);
               }
            }
         } catch (e) {
            $ws.single.ioc.resolve('ILogger').log('Error', 'Ошибка установки опций в функции Control.' + '_getMessageBox');
         }
         return messageBox;
      },

      _createErrorMessage: function (message) { //сообщение в всплывающем блоке
         var res;
         if (message instanceof Array && message.length == 1) {
            res = message[0];
         }
         else if (message instanceof Array) {
            res = $('<ul></ul>');
            for (var i = 0, l = message.length; i < l; i++) {
               res.append('<li>' + message[i] + '</li>');
            }
         } else {
            res = message;
         }
         this._errorMessage = res;
      },

      _calcValidationErrorCount: function (message) {
         this._validationErrorCount = message instanceof Array ? message.length : 1;
      },

      /**
       * Запомнить результат предыдущей валидации
       * @protected
       */
      _calcPrevValidationResult: function () {
         this._prevValidationResult = !this.isMarked();
      },
      /**
       * Метод маркирует контрол как непрошедший валидацию.
       * Не проводит валидацию, просто подсвечивает контрол.
       * @param {Array|String} s Сообщение об ошибке.
       * @param {Boolean} showInfoBox Показывать инфобокс сразу(true) или по ховеру(false)
       * @example
       * Уведомить регистрирующегося пользователя, если введённый логин уже используется.
       * <pre>
       *    fieldString.subscribe('onChange', function(eventObject, value) {
       *       //создаём объект бизнес-логики
       *       var bl = new $ws.proto.BLObject('Пользователи'),
       *           self = this;
       *       //вызываем метод бизнес-логики с нужными нам параметрами
       *       bl.call('ПолучитьСписокПользователей', {'Логин': value}, $ws.proto.BLObject.RETURN_TYPE_RECORDSET).addCallback(function(recordSet) {
       *          //проверяем число принятых записей
       *          if (recordSet.getRecordCount() > 0) {
       *             self.markControl('Пользователь с таким логином уже существует!');
       *          }
       *       });
       *    });
       * </pre>
       * @see clearMark
       * @see isMarked
       * @see validate
       * @see onValidate
       */
      markControl: function (s, showInfoBox) {
         var
            message = (s && (typeof s == 'string' || s instanceof Array && s.length)) ? s : 'Введите значение';
         this._calcValidationErrorCount(message);
         this._createErrorMessage(message);
         if (showInfoBox === true) {
            Infobox.show(this._getExtendedTooltipTarget(), this._alterTooltipText(), 'auto');
         }
         this._container.addClass('ws-validation-error');
      },
      /**
       * <wiTag group="Отображение">
       * Снять отметку об ошибке валидации.
       * @example
       * Для поля ввода (TextBox) определено необязательное условие: первый символ должен быть заглавной буквой.
       * Когда поле не соответствует этому условию, оно маркируется как непрошедшее валидацию.
       * Если пользователь не желает изменять регистр первой буквы, то при клике на кнопку (button) снимется маркировка с поля ввода.
       * <pre>
       *    //является ли первая буква строки заглавной
       *    var upperCase = true;
       *    TextBox.subscribe('onValidate', function(eventObject, value) {
       *       if (value) {
       *          //проверка первого символа строки
       *          upperCase = /^[А-Я].*$/.test(this.getValue());
       *       }
       *       if (!upperCase) {
       *          this.markControl('Рекомендуется изменить регистр первого символа!');
       *          button.show();
       *       }
       *    });
       *    button.subscribe('onActivated', function() {
       *       TextBox.clearMark();
       *       this.hide();
       *    });
       * </pre>
       * @see markControl
       * @see isMarked
       * @see validate
       * @see onValidate
       */
      clearMark: function () {
         if (this._validationErrorCount) {
            this._validationErrorCount = 0;
            this._container.removeClass('ws-validation-error');
            this._errorMessage = '';
            // Если на нас сейчас висит подсказка
            if (Infobox.hasTarget() && Infobox.isCurrentTarget(this._getExtendedTooltipTarget())) {
               // надо или поменять текст (убрать ошибки валидации), или убрать совсем (если текста помощи нет)
               if (this._isCanShowExtendedTooltip()) {
                  this._showExtendedTooltip(true);
               } else {
                  Infobox.hide(0);
               }
            }
         }
      },
      /**
       * <wiTag group="Отображение">
       * Отмечен ли контрол ошибкой валидации.
       * @return {Boolean} Признак: отмечен (true) или нет (false).
       * @example
       * Если поле ввода (fieldString) отмечено ошибкой валидации, то кнопка (btn) не доступна для клика.
       * <pre>
       *    btn.subscribe('onReady', function() {
       *       this.setEnabled(!fieldString.isMarked());
       *    });
       * </pre>
       * @see markControl
       * @see clearMark
       * @see validate
       * @see onValidate
       */
      isMarked: function () {
         return !!this._validationErrorCount;
      },

      /**
       * <wiTag group="Управление">
       * Установить валидаторы контрола, определяемые свойством {@link validators}.
       * @param {Array} validators Массив объектов, описывающих функции валидации.
       * @param {Object} [validators.object] Объект с конфигурацией валидатора.
       * @param {Function} [validators.object.validator] Функция валидации.
       * @param {Array} [validators.object.params] Параметры валидатора. Каждый параметр передаётся в функцию валидации в качестве её аргумента.
       * Первый элемент массива параметров является первым аргументов функции валидации, второй элемент - вторым аргументом, и т.д.
       * @param {String} [validators.object.errorMessage] Текст сообщения об ошибке валидации.
       * Если свойство не определено, то в качестве текста будет использовано значение, возвращаемое функцией валидации.
       * @param {Boolean} [validators.object.noFailOnError] Нежесткая валидация.
       * Если noFailOnError установлено в true, то при непрохождении валидации контрол маркируется и возвращается true.
       * @example
       * При готовности поля ввода (fieldString) установить валидаторы, если их не существует.
       * <pre>
       *    //описываем два валидатора
       *    var validators = [{
       *       validator: function() {
       *          var value = this.getValue();
       *          return value !== null && value !== '';
       *       },
       *       errorMessage: 'Поле не может быть пустым. Введите значение!'
       *    },{
       *       //otherFieldName - имя любого другого поля ввода, с которым производим сравнение
       *       validator: function(otherFieldName) {
       *          //controlParent - родительский контрол для двух полей
       *          return this.getValue() !== controlParent.getChildControlByName(otherFieldName).getValue();
       *       },
       *       params: [otherFieldName],
       *       errorMessage: 'Значения полей не могут совпадать!',
       *       noFailOnError: true
       *    }];
       *    fieldString.subscribe('onReady', function() {
       *       if (this.getValidators().length == 0)
       *          this.setValidators(validators);
       *    });
       * </pre>
       * @see validators
       * @see getValidators
       * @see validate
       * @see onValidate
       */
      setValidators: function (validators) {
         if (validators && Object.prototype.toString.apply(validators) == '[object Array]') {
            this._options.validators = validators;
         }
      }
   };

   return FormWidgetMixin;

});