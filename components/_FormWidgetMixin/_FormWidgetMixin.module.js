define('js!SBIS3.CONTROLS._FormWidgetMixin', ['js!SBIS3.CORE.Infobox','i18n!SBIS3.CONTROLS._FormWidgetMixin'], function(Infobox, rk) {
   /**
    * Добавляет к любому контролу методы для получения и установки “значения”.
    * Необходим для однообразной работы с набором контролов на диалоге, когда речь идет о сохранении набора данных в БЛ,
    * или заполнении контролов значениями из БЛ. В каждом контроле методы должны быть определены
    * @mixin SBIS3.CONTROLS._FormWidgetMixin
    */
   var _FormWidgetMixin = /** @lends SBIS3.CONTROLS._FormWidgetMixin.prototype */{
      $protected: {
         _validationErrorCount: 0,
         _validating: false,
         _prevValidationResult: true,
         _vResultErrors: [],
         _options : {
            /**
             * @cfg {String} Сообщение об ошибке валидации
             * Свойство errorMessage определяет текст, который будет использован в качестве текущего сообщения об ошибке
             */
            errorMessage: '',
            /**
             * @cfg {Array|String} Заголовок сообщений об ошибках валидации
             * Это текст, отображаемый перед сообщениями об ошибках валидации. Визуально выделен ярко-красным цветом. Можно задать либо массив из двух элементов, где первый - заголовок для одной ошибки,
             * второй - заголовок для нескольких ошибок, либо строка - заголовок будет одинаковый для любого количества ошибок
             */
            titleErrorMessage: ['Ошибка', 'Ошибки'],
            /**
             * @cfg {String} Текст сообщения об ошибке заполнения
             * Текст сообщения об ошибке заполнения используется в том случае, если метод {@link markControl} вызывается без аргументов.
             */
            errorMessageFilling: rk('Введите значение'),
            /**
             * @typedef {Object} Validator
             * @property {String} validator
             * @property {Array} [params=[]] params
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
             */
            validators : []
         }
      },

      $constructor: function () {
         this._publishEvents();
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
         destroy: function() {
            this._batchUpdateData = undefined;
            if(Infobox.hasTarget() && Infobox.isCurrentTarget(this._getExtendedTooltipTarget())) {
               Infobox.hide();
            }
         }
      },

      _publishEvents: function(){
         // TODO: событие изменения текста бы сюда еще добавить
         this._publish('onValidate');
      },

      setTitleErrorMessage: function (titleErrorMessage) {
         this._options.titleErrorMessage = titleErrorMessage instanceof Array ? titleErrorMessage : [titleErrorMessage, titleErrorMessage];
      },

      _canValidate: function() {
         return this._options.validators.length;
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
               res = currValidator.validator.apply(this, [this._options[currValidator.option]]);
            } catch (e) {
               $ws.single.ioc.resolve('ILogger').log('FieldAbstract', 'Exception while validating ' + e.message);
            }

            if (res !== true) { // Валидация не успешна
               res = currValidator.errorMessage ? currValidator.errorMessage : res;
               retval.errors = retval.errors.concat(res);
               if(failOnError){
                  retval.result &= false;
               }
            }
         }

         return retval;
      },

      validate: function(){
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
            $ws.single.ioc.resolve('ILogger').log('Error', 'Ошибка установки опций в функции Control.' + '_getMessageBox');
         }
         return messageBox;
      },

      _createErrorMessage: function(message) { //сообщение в всплывающем блоке
         var res;
         if (message instanceof Array && message.length == 1){
            res = message[0];
         }
         else if (message instanceof Array){
            res = $('<ul></ul>');
            for (var i = 0, l = message.length; i < l; i++){
               res.append('<li>'+ message[i] +'</li>');
            }
         } else{
            res = message;
         }
         this._options.errorMessage = res;
      },

      _calcValidationErrorCount: function(message) {
         this._validationErrorCount = message instanceof Array ? message.length : 1;
      },

      _calcPrevValidationResult: function() {
         this._prevValidationResult = !this.isMarked();
      },

      markControl : function(s, showInfoBox){
         var
            message = (s && (typeof s == 'string' || s instanceof Array && s.length)) ? s : this._options.errorMessageFilling;
         this._calcValidationErrorCount(message);
         this._createErrorMessage(message);
         if (showInfoBox === true){
            Infobox.show(this._getExtendedTooltipTarget(), this._alterTooltipText(), 'auto');
         }
         this._container.addClass('ws-validation-error');
      },

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

      isMarked : function(){
         return !!this._validationErrorCount;
      },

      getValidators: function(){
         return this._options.validators;
      },

      setValidators: function(validators){
         if(validators && Object.prototype.toString.apply(validators) == '[object Array]'){
            this._options.validators = validators;
         }
      },

      getErrorMessage: function(){
         return this._options.errorMessage;
      },

      setErrorMessage: function(errorMessage){
         this._options.errorMessage = errorMessage;
      },

      getErrorMessageFilling: function(){
         return this._options.errorMessageFilling;
      },

      setErrorMessageFilling: function(errorMessageFilling){
         this._options.errorMessageFilling = errorMessageFilling;
      },

      /**
       * Установить значение
       * @param val значение
       */
      setValue: function(val) {

      },
      /**
       * Получить значение
       */
      getValue: function() {

      }

   };

   return _FormWidgetMixin;

});