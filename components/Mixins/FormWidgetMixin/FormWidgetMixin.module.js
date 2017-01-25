define('js!SBIS3.CONTROLS.FormWidgetMixin', [
   "Core/constants",
   "Core/IoC",
   "Core/core-functions",
   "Core/ConsoleLogger",
   "js!SBIS3.CORE.Infobox",
   "Core/helpers/string-helpers"
], function ( constants, IoC, cFunctions, ConsoleLogger,Infobox, strHelpers) {
   /**
    * Миксин, который добавляет функционал валидаторов.
    * Подробнее о работе с валидаторами вы можете прочитать в разделе документации <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/core/validation/index/">Валидация вводимых данных</a>.
    * @mixin SBIS3.CONTROLS.FormWidgetMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    */
   var FormWidgetMixin = /** @lends SBIS3.CONTROLS.FormWidgetMixin.prototype */{
       /**
        * @event onValidate Происходит при прохождении валидации.
        * @param {$ws.proto.EventObject} eventObject Дескриптор события.
        * @param {Boolean} result Результат прохождения валидации.
        * @param {Array} errors Массив ошибок валидации.
        * @param {Boolean} previousStatus Предыдущий результат валидации.
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
             * @property {String} option Название валидируемой опции. Передаётся в функцию валидации в качестве её аргумента.
             * @property {String} errorMessage Текст сообщения об ошибке валидации. Если свойство не определено, то в качестве текста будет использовано значение, возвращаемое функцией валидации.
             * @property {Boolean} noFailOnError Нежёсткая валидация. Если значение опции true, то при не прохождении валидации контрол только маркируется, а валидация всё равно считается пройденной.
             * @translatable errorMessage
             */
            /**
             * @cfg {Validator[]} Устанавливает валидаторы контрола.
             * Подробнее о валидации можно прочитать в {@link https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/validation/ руководстве разработчика}.
             * @example
             * Пример массива, описывающего валидацию значения из опции text. Такой валидатор, например, можно использовать в контроле {@link SBIS3.CONTROLS.TextBox}.
             * <pre class="brush: xml">
             *     <options name="validators" type="array">
             *        <options>
             *           <option name="validator" type="function" value="js!SBIS3.CONTROLS.ControlsValidators:inRange"></option>  <!-- Устанавливаем функцию валидации -->
             *           <option name="option">text</option>                                                                      <!-- Устанавливаем опцию контрола, значение которой нужно валидировать -->
             *           <option name="errorMessage">Пожалуйста, введите в данное поле ваше имя!</option>                         <!-- Устанавливаем текст сообщение об ошибке валидации -->
             *           <options name="params" type="array">                                                                     <!-- Устанавливаем аргументы, которые будут переданны в функцию валидации -->
             *              <option>10</option>                                                                                   <!-- Первый аргумент -->
             *              <option>100</option>                                                                                  <!-- Второй аргмуент -->
             *           </options>
             *        </options>
             *     </options>
             * </pre>
             * @group Validation
             * @see validators
             * @see getValidators
             * @see setValidators
             * @see markControl
             * @see clearMark
             * @see onValidate
             */
            validators: [],
            /**
             * @cfg {Boolean} Валидация даже если компонент является задизабленным
             */
            validateIfDisabled: false
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
         return this._options.validators.length && (this.isEnabled() || this._options.validateIfDisabled);
      },

      _invokeValidation: function () {
         var retval = {
            errors: [],
            result: true
         };

         for (var i = 0, l = this._options.validators.length; i < l; i++) {
            var
               currValidator = this._options.validators[i],
               validatorValue = this._options[currValidator.option],
               validatorParams = cFunctions.clone(currValidator.params || []),
               failOnError = !(currValidator.noFailOnError || false),
               res = false;

            validatorParams.push(validatorValue);
            try {
               res = currValidator.validator.apply(this, validatorParams);
            } catch (e) {
               IoC.resolve('ILogger').log('FieldAbstract', 'Exception while validating ' + e.message);
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
       * Запускает валидаторы контрола.
       * @remark
       * Проверит контрол всеми валидаторами: как встроенными, так и пользовательскими. В случае неудачи отметит контрол сообщением об ошибке валидации. В случае успеха снимет отметку ошибки, если такая была установлена.
       * <br/>
       * При работе с диалогами редактирования, валидации по умолчанию производится при попытке сохранения редактируемой записи.
       * <br/>
       * Если для контрола ограничено взаимодействие через опцию {@link $ws.proto.Control#enabled}, то для него валидация не производится.
       * <br/>
       * Подробнее о валидации вы можете прочитать в {@link https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/core/validation/ руководстве разработчика}.
       * @returns {Boolean} Признак: валидация пройдена успешно (true) или с ошибками (false).
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
         if (this._validating || !this.isEnabled() || !cont || cont.hasClass('ws-hidden') === true) {
            return true;
         }

         try {
            this._validating = true;
            vResult = this._invokeValidation();
            if (vResult.result && this._childControls) {
               for (var i = 0, l = this._childControls.length; i < l; i++) {
                  var childControl = this._childControls[i];
                  if (childControl && childControl.validate && !childControl.validate()) {
                     vResult.result = false;
                     break;
                  }
               }
            }
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
            messageBox.find('.ws-warning-message-text').html(strHelpers.escapeHtml(message));
         }
         try {
            if (settings) {
               if (settings['icon'] && messageBox.data('current-icon') != settings['icon']) {
                  var iconPath = constants.wsRoot + 'img/infobox/icon-' + settings['icon'] + '.png';
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
            IoC.resolve('ILogger').log('Error', 'Ошибка установки опций в функции Control.' + '_getMessageBox');
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
       * Отмечает контрол как непрошедший валидацию. Не проводит валидацию, а только отмечает контрол, валидация которого завершилась с ошибкой.
       * @param {Array|String} s Сообщение об ошибке. Отображается в инфобоксе.
       * @param {Boolean} [showInfoBox=false] Показывать инфобокс сразу(true) или по ховеру(false)
       * @example
       * Уведомить регистрирующегося пользователя, если введённый логин уже используется.
       * <pre>
       *    fieldString.subscribe('onChange', function(eventObject, value) {
       *       //создаём объект бизнес-логики
       *       var bl = new $ws.proto.BLObject('Пользователи'),
       *          self = this;
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
       * @see validators
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
       * Снимает с контрола маркировку об ошибке валидации.
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
       * @see validators
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
       * Возвращает признак, по которому можно определить: отмечен ли контрол ошибкой валидации.
       * @return {Boolean} true - контрол отмечен ошибкой валидации.
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
       * @see validators
       * @see onValidate
       */
      isMarked: function () {
         return !!this._validationErrorCount;
      },

      /**
       * Устанавливает валидаторы контрола.
       * @param {Array} validators Массив объектов, описывающих функции валидации.
       * @param {Object} [validators.object] Объект с конфигурацией валидатора.
       * @param {Function} [validators.object.validator] Функция валидации.
       * @param {String} [validators.object.option] Название опции контрола, значение которой требуется проверить валидатором.
       * @param {String} [validators.object.errorMessage] Текст сообщения об ошибке валидации. Если свойство не определено, то в качестве текста будет использовано значение, возвращаемое функцией валидации.
       * @param {Boolean} [validators.object.noFailOnError] Нежесткая валидация. В случае не прохождения валидации контрол будет только отмечен как непрошедший проверку, но валидация будет считаться пройденной.
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
       * @see addValidators
       * @see validate
       * @see validators
       * @see onValidate
       */
      setValidators: function (validators) {
         if (validators && Object.prototype.toString.apply(validators) == '[object Array]') {
            this._options.validators = validators;
         }
      },

      /**
       * Добавляет валидаторы контрола.
       * @param {Array} validators Массив объектов, описывающих функции валидации.
       * @param {Object} [validators.object] Объект с конфигурацией валидатора.
       * @param {Function} [validators.object.validator] Функция валидации.
       * @param {String} [validators.object.option] Название опции контрола, значение которой требуется проверить валидатором.
       * @param {String} [validators.object.errorMessage] Текст сообщения об ошибке валидации. Если свойство не определено, то в качестве текста будет использовано значение, возвращаемое функцией валидации.
       * @param {Boolean} [validators.object.noFailOnError] Нежесткая валидация. В случае не прохождения валидации контрол будет только отмечен как непрошедший проверку, но валидация будет считаться пройденной.
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
       *          this.addValidators(validators);
       *    });
       * </pre>
       * @see validators
       * @see setValidators
       * @see getValidators
       * @see validate
       * @see validators
       * @see onValidate
       */
      addValidators: function (validators) {
         if (validators && Object.prototype.toString.apply(validators) == '[object Array]') {
            Array.prototype.push.apply(this._options.validators, validators);
         }
      }
   };

   return FormWidgetMixin;

});