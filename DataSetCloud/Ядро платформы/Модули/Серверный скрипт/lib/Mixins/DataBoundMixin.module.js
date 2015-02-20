define('js!SBIS3.CORE.DataBoundMixin', ['js!SBIS3.CORE.Infobox', 'i18n!SBIS3.CORE.DataBoundMixin'], function(Infobox, rk){

   /**
    * @class $ws.mixins.DataBoundMixin
    */
   return $ws.mixins.DataBoundMixin = /** @lends $ws.mixins.DataBoundMixin.prototype */{
      /**
       * @event onValidate При прохождении валидации
       * Событие происходит как при удачном, так и неудачном прохождении валидации.
       * Оно несёт информирующую функцию и не является заменой самой валидации!
       * <wiTag group="Управление">
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Boolean} validationResult Результат валидации: пройдена успешно (true), возникли ошибки (false).
       * @param {Array} validationErrors С какими ошибками контрол прошёл валидацию.
       * @param {Boolean} previousValidation Результат предыдущей валидации: пройдена успешно (true), возникли ошибки (false).
       * @example
       * Если поле ввода (fieldString) успешно прошло валидацию, то сделать кнопку (btn) доступной для взаимодействия.
       * <pre>
       *    fieldString.subscribe('onValidate', function(eventObject, validationResult) {
       *       btn.setEnabled(validationResult);
       *    });
       * </pre>
       * @see validate
       * @see validators
       * @see errorMessage
       */
      /**
       * @event onValueChange При изменении значения контрола
       * Событие происходит при любом изменении значения контрола: смена пользователем, через контекст или методом {@link setValue}.
       * <wiTag group="Управление">
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {*} value Новое значение контрола.
       * @example
       * Запустим проверку прохождения валидации контролом при каждом изменении его значения.
       * <pre>
       *    control.subscribe('onValueChange', function() {
       *       //провалидируем контрол при любом его изменении
       *       this.validate();
       *    });
       * </pre>
       * @see value
       * @see setValue
       * @see getValue
       * @see onChange
       */
      $protected: {
         _contextUpdateHandlerFunction: null,
         _validating: false,
         _defaultValue: undefined,
         _initialValueSetted: false,
         _validationErrorCount: 0,
         _prevValidationResult: true,
         _vResultErrors: [],
         _options : {
            /**
             * @cfg {String} Значение контрола
             * Значение, которое будет отображаться в элементе, если не будет переопределено из других источников (контекст, вызов метода).
             * <wiTag group="Данные">
             * @example
             * При клике на кнопку (btn) очищать поле ввода (fieldString).
             * <pre>
             *    btn.subscribe('onClick', function() {
             *       fieldString.setValue('');
             *    });
             * </pre>
             * @see setValue
             * @see getValue
             * @see onValueChange
             */
            value: '',
            /**
             * @cfg {String} Сообщение об ошибке валидации
             * Свойство errorMessage определяет текст, который будет использован в качестве текущего сообщения об ошибке
             * <a href='http://wi.sbis.ru/dokuwiki/doku.php/api:validator'>валидации</a>.
             *
             * Особенности errorMessage:
             * <ol>
             *    <li>Доминирует над сообщением, которое задано в функции валидации.</li>
             *    <li>Активно до начала прохождения контролом новой валидации.</li>
             * </ol>
             * <wiTag group="Отображение">
             * @example
             * Заменить текст сообщения, если поле ввода (fieldString) не прошло валидацию.
             * <pre>
             *    //определяем новое сообщение об ошибке валидации
             *    var erMessage;
             *    fieldString.subscribe('onValidate', function(eventObject, validationResult) {
             *       if (!validationResult) this.setErrorMessage(erMessage);
             *    });
             * </pre>
             * @group Validation
             * @see setErrorMessage
             * @see getErrorMessage
             * @see validate
             * @see validators
             * @see titleErrorMessage
             * @see onValidate
             * @translatable
             */
            errorMessage: "",
            /**
             * @cfg {Array|String} Заголовок сообщений об ошибках валидации
             * Это текст, отображаемый перед сообщениями об ошибках валидации. Визуально выделен ярко-красным цветом. Можно задать либо массив из двух элементов, где первый - заголовок для одной ошибки,
             * второй - заголовок для нескольких ошибок, либо строка - заголовок будет одинаковый для любого количества ошибок
             * <wiTag group="Отображение">
             * @example
             * Если не соблюдены условия, то вывести информацию о требуемых действиях.
             * <pre>
             *    var message1,
             *        message2;
             *    //condition - флаг соблюдения условий
             *    if (!condition) {
             *       control.setTitleErrorMessage('Обязательные условия');
             *       control.markControl([message1, message2]);
             *    }
             * </pre>
             * @group Validation
             * @see setTitleErrorMessage
             * @see errorMessage
             * @see validate
             * @see validators
             * @see markControl
             * @see setErrorMessage
             * @see getErrorMessage
             * @see onValidate
             * @translatable
             */
            titleErrorMessage: ['Ошибка', 'Ошибки'],
            /**
             * @cfg {String} Текст сообщения об ошибке заполнения
             * Текст сообщения об ошибке заполнения используется в том случае, если метод {@link markControl} вызывается без аргументов.
             * <wiTag group="Отображение">
             * @example
             * При готовности контрола переопределить сообщение об ошибке заполнения.
             * <pre>
             *    control.subscribe('onReady', function() {
             *       this.setErrorMessageFilling('Неверный формат данных');
             *    });
             * </pre>
             * @group Validation
             * @see getErrorMessageFilling
             * @see setErrorMessageFilling
             * @see markControl
             * @translatable
             */
            errorMessageFilling: rk('Введите значение'),
            /**
             * @typedef {Object} Validator
             * @property {String} validator
             * @property {Object.<string, string>} params
             * @property {String} errorMessage
             * @translatable errorMessage
             * @property {Boolean} noFailOnError
             */
            /**
             * @cfg {Validator[]} Валидаторы контрола
             * Массив объектов, описывающих функции валидации. В каждом объекте возможны следующие свойства:
             * <ol>
             *    <li>{Function} validator - функция валидации.</li>
             *    <li>{Array} params - массив параметров. Каждый параметр передаётся в функцию валидации в качестве её аргумента.
             *    Первый элемент массива параметров является первым аргументов функции валидации, второй элемент - вторым аргументом, и т.д.</li>
             *    <li>{String} errorMessage - текст сообщения об ошибке валидации.
             *    Если свойство не определено, то в качестве текста будет использовано значение, возвращаемое функцией валидации.</li>
             *    <li>{Boolean} noFailOnError - нежёсткая валидация.
             *    Если noFailOnError установлено в true, то при непрохождении валидации контрол маркируется и возвращается true.</li>
             * </ol>
             * <wiTag group="Данные">
             * @example
             * При готовности контрола задать валидаторы для поля ввода (fieldString).
             * <pre>
             *    control.subscribe('onReady', function() {
             *       var validators = [{
             *          validator: function() {
             *             var value = this.getValue();
             *             return value !== null && value !== '';
             *          },
             *          errorMessage: 'Поле не может быть пустым. Введите значение!'
             *       },{
             *          validator: function(otherFieldName) {
             *             return this.getValue() !== otherFieldName.getValue();
             *          },
             *          params: [otherFieldName],
             *          errorMessage: 'Значения полей не могут совпадать!',
             *          noFailOnError: true
             *       }];
             *       fieldString.setValidators(validators);
             *    });
             * </pre>
             * @group Validation
             * @see errorMessage
             * @see setErrorMessage
             * @see getErrorMessage
             * @see setValidators
             * @see getValidators
             * @see validate
             * @see onValidate
             * @editor ValidatorsEditor
             */
            validators : []
         }
      },
      $constructor : function() {
         this._publishEvents();

         this._contextUpdateHandlerFunction = this._contextUpdateHandler.bind(this);

         this.setTitleErrorMessage(this._options.titleErrorMessage);
      },
      around: {
         _isCanShowExtendedTooltip: function() {
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
         _alterTooltipText: function(message) {
            if(this.isMarked()) {
               var
                     msg = this._options.errorMessage instanceof jQuery ? this._options.errorMessage[0].outerHTML : this._options.errorMessage,
                     errorTitle = this._validationErrorCount > 1 ? this._options.titleErrorMessage[1] : this._options.titleErrorMessage[0];
               return (typeof message == 'string' && message.length ? ('<p>' + message + '</p>') : '') + '<p><span class="ws-validation-error-message">' + errorTitle + ':</span> ' + msg + '</p>';
            } else {
               return message;
            }
         }
      },
      before: {
         init: function() {
            // Обновляем свое значение когда в контексте поменялись данные.
            if (this._context) {
               this._context.subscribe('onDataBind', this._contextUpdateHandlerFunction);
               this._context.subscribe('onFieldChange', this._contextUpdateHandlerFunction);
            }

            // После полной инициализации класса получим текущее значение из контекста
            this._initDefaultValue();
            this._contextUpdateHandler();
            // Если не забрали - проставим дефолтное
            if(this.getValue() === undefined)
               this._defaultValueHandler();
            // Значение до сих пор не определено, поставим пустое значение
            if(this.getValue() === undefined){
               this._curval = this._curValue();
               this._updateSelfContextValue(this._notFormatedVal());
            }
            this._markInitialValueSetted();
         },
         destroy: function() {

            if(this._context){
               this._context.unsubscribe('onDataBind', this._contextUpdateHandlerFunction);
               this._context.unsubscribe('onFieldChange', this._contextUpdateHandlerFunction);
            }
            if(Infobox.hasTarget() && Infobox.isCurrentTarget(this._getExtendedTooltipTarget())) {
               Infobox.hide();
            }
         }
      },
      /**
       * Сигналит об изменении значения, если нужно
       * @param {*} args Аргумент(ы), которые нужно передать
       * @protected
       */
      _notifyOnValueChange: function(args){
         if(this._initialValueSetted){
            if(!(args instanceof Array)){
               args = [args];
            } else {
               // Нужно сделать клон аргументов чтобы не испортить переданный массив
               args = args.slice(0);
            }
            args.unshift('onValueChange');
            this._notify.apply(this, args);
         }
      },
      /**
       * Запоминает, что начальное значение установлено
       * @protected
       */
      _markInitialValueSetted: function(){
         this._initialValueSetted = true;
      },
      /**
       * Обработчик смены значения в контексте
       * @param {Object} [event] Событие
       * @param {String} [field] Название изменившегося поля
       * @param {*} [value] Новое значение в контексте
       * @param {$ws.proto.Control} [initiator] Инициатор изменения контекста
       * @private
       */
      _contextUpdateHandler: function(event, field, value, initiator) {
         var name = this._options.name;
         if(name !== '' && this._context && this !== initiator) {
            // Если нам пришел field - значит это onFieldChange
            if(field) {
               if(field == name) // Если это наше поле - обновимся
                  this._onContextValueReceived(value);
            }
            else // Иначе обычная схема
               this._onContextValueReceived(this._context.getValue(name));
         }
      },
      /**
       * Публикует события
       * @private
       */
      _publishEvents: function(){
         this._publish('onValidate', 'onValueChange');
      },
      /**
       * Инициализирует дефолтное значение
       * @private
       */
      _initDefaultValue: function(){
         this._defaultValue = this._getDefaultValue();
      },
      _updateSelfContextValue: function(val) {
         this.getLinkedContext().setValue(this._options.name, val, undefined, this);
      },
      /**
       * Это функция, которая разруливает установку в элемент управления дефолтного значения, заданного при проектировании
       * Элемент управления должен определить свою реализацию _getDefaultValue
       */
      _defaultValueHandler: function() {
         var value = this.getDefaultValue();
         if(value !== undefined && this.setValue){
            // FIXME использование 2 и 3 параметра в setValue
            this.setValue(value, true, true);
         }
      },
      /**
       * Возвращает (считает) дефолтное значение контрола
       * @return {*}
       * @protected
       */
      _getDefaultValue: function(){
         return undefined;
      },
      /**
       * <wiTag group="Данные">
       * Получить текущее значение контрола.
       * Реализация по умолчанию возвращает значение из контекста по имени контрола.
       * @return {*} Текущее значение контрола.
       * @example
       * Установить в поле контекста 'Время Года' значение 'Зима', если в поле (fieldString) введено 'декабрь', 'январь' или 'февраль'.
       * <pre>
       *    fieldString.subscribe('onReady', function() {
       *       if (this.getValue() in {'декабрь':0, 'январь':0, 'февраль':0}) {
       *          this.getLinkedContext().setValue('ВремяГода', 'Зима');
       *       }
       *    });
       * </pre>
       * @see value
       * @see setValue
       * @see getDefaultValue
       */
      getValue : function(){
         return this.getLinkedContext().getValue(this._options.name);
      },
      /**
       * Получить значение контрола по умолчанию.
       * <wiTag group="Данные">
       * @returns {*} Начальное значение контрола.
       * @example
       * Если значение поля ввода (fieldString) превышает допустимое, то установить начальное значение контрола.
       * <pre>
       *    fieldString.subscribe('onChange', function() {
       *       if (this.getValue() >= 1000) {
       *          this.setValue(this.getDefaultValue());
       *       }
       *    });
       * </pre>
       * @see value
       * @see setValue
       * @see getValue
       */
      getDefaultValue: function(){
         return this._defaultValue;
      },
      _curValue : function() {
      },
      _notFormatedVal: function() {
      },
      /**
       * Установить заголовок сообщения об ошибках валидации, который определяется свойством {@link titleErrorMessage}.
       * <wiTag group="Данные">
       * @param {Array|String} titleErrorMessage Текст заголовка сообщения об ошибке валидации - массив (первое значение - заголовок для одной ошибки, второе - заголовок в случае нескольких ошибок) или строка (заголовок будет одинаковым для любого количества ошибок)
       * @example
       * Если не соблюдены условия, то вывести информацию о требуемых действиях.
       * <pre>
       *    var message1,
       *        message2;
       *    //condition - флаг соблюдения условий
       *    if (!condition) {
       *       control.setTitleErrorMessage('Обязательные условия');
       *       control.markControl([message1, message2]);
       *    }
       * </pre>
       * @see titleErrorMessage
       * @see errorMessage
       * @see validate
       * @see validators
       * @see markControl
       * @see setErrorMessage
       * @see getErrorMessage
       */
      setTitleErrorMessage : function(titleErrorMessage) {
         this._options.titleErrorMessage = titleErrorMessage instanceof Array ? titleErrorMessage : [titleErrorMessage, titleErrorMessage];
      },
      /**
       * Данный метод определяет, может ли быть проведена валидация данного элемента управления
       * т.е. имеет ли смысл вообще пробовать запустить ее.
       * Дефолтная реализация проверяет наличие валидаторов. Потомки класса могу реализовать собственную логику проверки
       *
       * @return {Boolean}
       * @protected
       */
      _canValidate: function() {
         var validators = this.getValidators();
         return validators && validators.length > 0;
      },
      _invokeValidation: function() {
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
               res = currValidator.validator.apply(this, currValidator.params || []);
            } catch (e) {
               $ws.single.ioc.resolve('ILogger').log("Control with name " + this.getName(), "Exception while validating " + e.message);
            }

            if (res !== true) { // Валидация не успешна
               res = currValidator.errorMessage ? currValidator.errorMessage : res;
               retval.errors = retval.errors.concat(res);
               if(failOnError)
                  retval.result &= false;
            }
         }

         return retval;
      },
      /**
       * <wiTag group="Данные">
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
       */
      validate: function(){
         var
            vResult,
            cont = this.getContainer(),
            previousStatus = this._prevValidationResult;
         this.clearMark();
         if(this._validating || !this._canValidate() || !cont || cont.hasClass('ws-hidden') === true)
            return true;

         try {
            this._validating = true;
            vResult = this._invokeValidation();
         } catch(e) {
            vResult = {
               errors: [ e.message ],
               result: false
            };
         } finally {
            this._validating = false;
         }

         if(vResult.errors.length > 0) {
            this.markControl(vResult.errors);
         }
         this._calcPrevValidationResult();

         this._notify('onValidate', !!vResult.result, vResult.errors, previousStatus);

         this._vResultErrors = vResult.errors;
         return vResult.result;
      },
      /**
       * Получить всплывающий тултип с заданными настройками. За скрытие тултипа отвечает контрол его получивший.
       * TODO: Не нужно ли заменить на Infobox? Сейчас этот функционал используется только для индикации нажатия CapsLock в поле ввода пароля
       *
       * @param {String} [message] Текст тултипа. Может быть html.
       * @param {Object} [settings] Настройки тултипа.
       *                   - color Цвет текста ('#ff0000')
       *                   - background-color Цвет фона. ('#cc1122')
       *                   - icon Иконка. ('waring') => '/ws/img/infobox/icon-warning.png'
       *                   - noIcon Отображать ли иконку.
       */
      _getMessageBox: function(message, settings) {
         var messageBox = $('body > .ws-warning-message-box');
         if(!messageBox.length){
            messageBox = $('<div class="ws-warning-message-box"></div>').append(
                        $('<span class="ws-warning-icon"></span>')
                  ).append(
                        $('<span class="ws-warning-message-text"></span>')
                  );
            // Создаем закорючку
            var ballon = $('<div class="ws-arrow-balloon"></div>');
            var ballonHtml = '';
            for(var i = 1; i <= 10; i++){
               ballonHtml += '<b class="b' + i + '"></b>';
            }
            ballon.html(ballonHtml);
            messageBox.append(ballon);
            $('body').append(messageBox);
         }

         if (message) {
            messageBox.find('.ws-warning-message-text').html($ws.helpers.escapeHtml(message));
         }
         try{
            if(settings){
               if(settings['icon'] && messageBox.data('current-icon') != settings['icon']){
                  var iconPath = $ws._const.wsRoot + 'img/infobox/icon-' + settings['icon'] + '.png';
                  messageBox.find('.ws-warning-icon').css({
                     'background-image':'url("' + iconPath + '")',
                     'display':'block'});
                  messageBox.data('current-icon', settings['icon']);
               }
               if(settings['noIcon']){
                  messageBox.find('.ws-warning-icon').hide();
               }
               if(settings['color']){
                  messageBox.find('.ws-warning-message-text').css('color', settings['color']);
               }
               if(settings['background-color'] && messageBox.data('current-background-color') != settings['background-color']){
                  // Если передан цвет, устанавливаем цвет, иначе по умолчанию из css
                  messageBox.css('background-color', settings['background-color']);
                  messageBox.find('.ws-arrow-balloon b').css('background-color', settings['background-color']);
                  messageBox.data('current-background-color', settings['background-color']);
               }
            }
         } catch (e){
            $ws.single.ioc.resolve('ILogger').log("Error", "Ошибка установки опций в функции Control." + "_getMessageBox");
         }
         return messageBox;
      },

      _createErrorMessage: function(message) { //сообщение в всплывающем блоке
         var res;
         if (message instanceof Array && message.length == 1)
            res = message[0];
         else if (message instanceof Array){
            res = $('<ul></ul>');
            for (var i = 0, l = message.length; i < l; i++){
               res.append('<li>'+ message[i] +'</li>');
            }
         } else
            res = message;
         this._options.errorMessage = res;
      },
      _handlersPath: function(eventName){
         var handlers = this.getEventHandlers(eventName),
               handlersPath = [];
         if (handlers){
            for(var i = 0, l = handlers.length; i < l; i++) {
               if(handlers[i].wsHandlerPath)
                  handlersPath.push(handlers[i].wsHandlerPath);
            }
         }
         return handlersPath;
      },
      /**
       * Сохранить состояние ошибки валидации
       * Сохраняет состояние об ошибке валидации контрола и запоминает количество ошибок на нём.
       * @param {Array|String} message
       * @protected
       */
      _calcValidationErrorCount: function(message) {
         this._validationErrorCount = message instanceof Array ? message.length : 1;
      },

      /**
       * Запомнить результат предыдущей валидации
       * @protected
       */
      _calcPrevValidationResult: function() {
         this._prevValidationResult = !this.isMarked();
      },

      /**
       * <wiTag group="Отображение">
       * Метод маркирует контрол как непрошедший валидацию.
       * Не проводит валидацию, просто подсвечивает контрол.
       * @param {Array|String} s Сообщение об ошибке.
       * @param {Boolean} showInfoBox Показывать инфобокс сразу(true) или по ховеру(false)
       * @example
       * Уведомить регистрируещегося пользователя, если введённый логин уже используется.
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
       */
      markControl : function(s, showInfoBox){
         var message = (s && (typeof s == 'string' || s instanceof Array && s.length)) ? s : this._options.errorMessageFilling;
         this._calcValidationErrorCount(message);
         this._createErrorMessage(message);
         if (showInfoBox === true){
            Infobox.show(this._getExtendedTooltipTarget(), this._alterTooltipText(), 'auto');
         }
         this._container.addClass('ws-validation-error');
      },
      /**
       * <wiTag group="Отображение">
       * Снять отметку об ошибке валидации.
       * @example
       * Для поля ввода (fieldString) определено необязательное условие: первый символ должен быть заглавной буквой.
       * Когда поле не соответствует этому условию, оно маркируется как непрошедшее валидацию.
       * Если пользователь не желает изменять регистр первой буквы, то при клике на кнопку (button) снимется маркировка с поля ввода.
       * <pre>
       *    //является ли первая буква строки заглавной
       *    var upperCase = true;
       *    fieldString.subscribe('onValidate', function(eventObject, value) {
       *       if (value) {
       *          //проверка первого символа строки
       *          upperCase = /^[А-Я].*$/.test(this.getValue());
       *       }
       *       if (!upperCase) {
       *          this.markControl('Рекомендуется изменить регистр первого символа!');
       *          button.show();
       *       }
       *    });
       *    button.subscribe('onClick', function() {
       *       fieldString.clearMark();
       *       this.hide();
       *    });
       * </pre>
       * @see markControl
       * @see isMarked
       * @see validate
       */
      clearMark : function(){
         if(this._validationErrorCount) {
            this._validationErrorCount = 0;
            this._options.errorMessage = '';
            this._container.removeClass('ws-validation-error');

            // Если на нас сейчас висит подсказка
            if(Infobox.hasTarget() && Infobox.isCurrentTarget(this._getExtendedTooltipTarget())) {
               // надо или поменять текст (убрать ошибки валидации), или убрать совсем (если текста помощи нет)
               if(this._isCanShowExtendedTooltip()) {
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
       */
      isMarked : function(){
         return !!this._validationErrorCount;
      },
      /**
       * Этот метод надо переопределить в дочерних классах
       * Тут должна находиться логика обработки значения из контекста
       * @param ctxVal
       */
      _onContextValueReceived: function(ctxVal) {

      },
      /**
       * <wiTag group="Управление">
       * Получить валидаторы контрола, определяемые свойством {@link validators}.
       * @return {Array} Массив объектов, описывающих функции валидации.
       * @example
       * Проверить наличие валидаторов у строки ввода. Если их нет, то задать.
       * <pre>
       *    fieldString.subscribe('onReady', function() {
       *       if (Object.isEmpty(this.getValidators()) {
       *          var validators = [{
       *             validator: function() {
       *                var value = this.getValue();
       *                return value !== null && value !== '';
       *             },
       *             errorMessage: 'Поле не может быть пустым. Введите значение!'
       *          }];
       *          this.setValidators(validators);
       *       }
       *    });
       * </pre>
       * @see errorMessage
       * @see getErrorMessage
       * @see setErrorMessage
       * @see validators
       * @see setValidators
       * @see validate
       */
      getValidators: function(){
         return this._options.validators;
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
       * @see errorMessage
       * @see setErrorMessage
       * @see getErrorMessage
       * @see validate
       */
      setValidators: function(validators){
         if(validators && Object.prototype.toString.apply(validators) == '[object Array]')
            this._options.validators = validators;
      },
      /**
       * <wiTag group="Отображение">
       * Получить текст сообщения об ошибке валидации, определяемый свойством {@link errorMessage}.
       * @return {String}
       * @example
       * Задать контролу сообщение об ошибке валидации, если оно не задано.
       * <pre>
       *    var message = this.getErrorMessage();
       *    if (!message) {
       *       this.setErrorMessage('Сообщение об ошибке');
       *    }
       * </pre>
       * @see errorMessage
       * @see setErrorMessage
       * @see validate
       * @see titleErrorMessage
       */
      getErrorMessage: function(){
         return this._options.errorMessage;
      },
      /**
       * <wiTag group="Отображение">
       * Установить текст сообщения об ошибке валидации, определяемый свойством {@link errorMessage}.
       * @param {String} errorMessage
       * @example
       * Если поле используется для ввода логина, то изменить сообщение об ошибке валидации.
       * <pre>
       *    fieldString.subscribe('onReady', function() {
       *       var name = this.getName();
       *       if (name === 'Логин') {
       *          this.setErrorMessage('Пароль должен быть не короче 8 символов!');
       *       }
       *    });
       * </pre>
       * @see errorMessage
       * @see getErrorMessage
       * @see validate
       * @see titleErrorMessage
       */
      setErrorMessage: function(errorMessage){
         this._options.errorMessage = errorMessage;
      },
      /**
       * <wiTag group="Отображение">
       * Получить текст сообщения об ошибке заполнения, который задан в свойстве {@link errorMessageFilling}.
       * @return {String}
       * @example
       * При готовности контрола переопределить сообщение об ошибке заполнения.
       * <pre>
       *    control.subscribe('onReady', function() {
       *       if (this.getErrorMessageFilling() == 'Введите значение') {
       *          this.setErrorMessageFilling('Неверный формат данных');
       *       }
       *    });
       * </pre>
       * @see errorMessageFilling
       * @see setErrorMessageFilling
       */
      getErrorMessageFilling: function(){
         return this._options.errorMessageFilling;
      },
      /**
       * <wiTag group="Отображение">
       * Установить текст сообщения об ошибке заполнения, который задан в свойстве {@link errorMessageFilling}.
       * @param {String} errorMessageFilling
       * @example
       * При готовности контрола переопределить сообщение об ошибке заполнения.
       * <pre>
       *    control.subscribe('onReady', function() {
       *       if (this.getErrorMessageFilling() == 'Введите значение') {
       *          this.setErrorMessageFilling('Неверный формат данных');
       *       }
       *    });
       * </pre>
       * @see errorMessageFilling
       * @see getErrorMessageFilling
       */
      setErrorMessageFilling: function(errorMessageFilling){
         this._options.errorMessageFilling = errorMessageFilling;
      }
   };
});
