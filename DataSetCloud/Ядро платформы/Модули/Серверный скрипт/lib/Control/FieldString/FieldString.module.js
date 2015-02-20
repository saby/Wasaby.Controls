/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 21.04.13
 * Time: 22:55
 * To change this template use File | Settings | File Templates.
 */
define('js!SBIS3.CORE.FieldString', ['js!SBIS3.CORE.Infobox', 'js!SBIS3.CORE.FieldAbstract', 'html!SBIS3.CORE.FieldString',
                                  'is!msIe?js!SBIS3.CORE.FieldString/resources/ext/ierange-m2-min'], function( Infobox, FieldAbstract, dotTplFn ) {

   'use strict';

   /**
    * @class $ws.proto.FieldString аналог input text
    * @extends $ws.proto.FieldAbstract
    * @control
    * @initial
    * <component data-component='SBIS3.CORE.FieldString' style='width: 100px'>
    * </component>
    * @category Fields
    * @designTime actions /design/design
    * @ignoreOptions width
    */
   $ws.proto.FieldString = FieldAbstract.extend(/** @lends $ws.proto.FieldString.prototype */{
      $protected: {
         _tooltipContainer: null,
         _initValue: undefined,
         _infoboxTargetChangeHandler: null,
         _firefoxDelayedMaxlegth: null,
         _dataReview: undefined,
         _options: {
            /**
             * @cfg {Boolean} Отображать поле для ввода пароля
             * <wiTag group="Управление">
             * Включает режим ввода пароля, введённые символы отображаются звёздочками.
             * @see setPassword
             */
            password: false,
            // TODO свойство подлежит удалению
            /**
             * @cfg {Boolean} Поле не может быть пустым
             * <wiTag group="Управление" noShow>
             * @deprecated Не использовать.
             */
            canNotBeEmpty: false,
            /**
             * @cfg {Boolean} Отображать подсказку внутри поля
             * <wiTag group="Отображение">
             * Включает возможность отображения подсказки внутри поля ввода, при отсутствии в нём текста.
             */
            tooltipInside: false,
            /**
             * @cfg {String} Фильтр ввода
             * <wiTag group="Управление">
             * Каждый вводимый символ будет проверяться на соответсвие указанному в этой опции регулярному выражению.
             * Несоответсвующие символы невозможно напечатать.
             */
            inputFilter : '',
            /**
             * @cfg {Boolean} Обрезать начальные и конечные пробелы
             * <wiTag group="Управление">
             * Включает режим обрезания начальных и конечных пробельных символов при валидации.
             */
            trim : false,
            /**
             * Позволяет в задизабленном режиме подсвечивать ссылки на файлы и URL
             * @cfg {Boolean} Подсвечивать ссылки
             * <wiTag group="Управление">
             */
            highlightLinks: false,
            cssClass: ''
         },
         _keysWeHandle: [
            $ws._const.key.del,
            $ws._const.key.backspace,
            $ws._const.key.left,
            $ws._const.key.right,
            $ws._const.key.minus
         ]
      },
      /**
       * @lends $ws.proto.FieldString.prototype
       */
      $constructor : function(){
         var self = this;
         this._container.find('.ws-field').bind('click', function(){
            if(!self._inputClicked) {
               self._firstSelect();
            } else {
               self._inputClicked = false;
            }
         });
         this._container.find('.input-string-field').bind('change', function() {
            self._setValueInternal(self._curValue());
         });
      },
      _initEvents: function() {
         // в первую очередь нужно выполнить инициализоцию событий у родителя
         $ws.proto.FieldString.superclass._initEvents.apply(this, arguments);
         this._infoboxTargetChangeHandler = function(event, prev){
            if (prev === this._getExtendedTooltipTarget().get(0)) {
               this._inputControl.attr('title', this.getTooltip());
            }
         }.bind(this);
         var
            self = this,
            inputControl = this._inputControl,
            moveOnFirstSelectHandler = function(){
               self._mouseDraggedThroughFirstSelect = true;
               inputControl.unbind('mousemove', moveOnFirstSelectHandler);
            };

         if (!$ws._const.compatibility.placeholder && inputControl.is('input')){
            inputControl.css('line-height', this._container.height() - 2 + 'px');
         }
         inputControl.bind('keypress', function(event){
            self._handleCapsLock(event);
            return self._options.inputFilter !== '' ? self._inputFilter(event, new RegExp(self._options.inputFilter)) : true;
         }).bind('paste', function(){
            self._pasteProcessing++;
            var maxLength;
            if (self._options.maxLength){
               maxLength = self._options.maxLength;
               self._inputControl.attr('maxlength', 10000);
            }
            setTimeout(function (){
               self._pasteProcessing--;
               if (self._pasteProcessing) {// Обновляемся лишь в конце цепочки вставок.
                  return;
               }
               if (maxLength) {
                  self._inputControl.attr('maxlength', maxLength);
               }
               self._setValueInternal(self._isGetFullText ? self._curValue(true) : self._curValue());
               self._onValueChangeHandler(); // Не всегда вызывался раньше если вставлять из контекстного меню.
               self._onPasteHandler();
            }, 100);
         }).bind('mousedown', function(){
            if(self._isControlActive !== true){ // попали только что, значит нужно следить за выделением мышью
               self._mouseDraggedThroughFirstSelect = false;
               inputControl.bind('mousemove', moveOnFirstSelectHandler);
            }
         }).bind('mouseup', function(){
            inputControl.unbind('mousemove', moveOnFirstSelectHandler);
         }).bind('click', function(){
            if (self._mouseDraggedThroughFirstSelect !== undefined) {
               if(self._mouseDraggedThroughFirstSelect === false) {
                  self._firstSelect();
               }
               self._mouseDraggedThroughFirstSelect = undefined;
            }
            self._inputClicked = true;
         }).bind('focus', function() {
            if (self._tooltipContainer) {
               self._tooltipContainer.addClass('ws-hidden');
            }
         }).bind('blur', function(){
            self._getMessageBox().hide();
            if (self._tooltipContainer) {
               self._tooltipContainer.removeClass('ws-hidden');
            }
         }).bind('keyup', this._onKeyUp.bind(this)); //По нажатию кнопок delete и backspace - меняем значение поля на то, что останется
      },
      canAcceptFocus: function() {
         return !($ws._const.browser.isMobileSafari || $ws._const.browser.isMobileAndroid) &&
                $ws.proto.FieldString.superclass.canAcceptFocus.apply(this, arguments);
      },
      /**
       * Функция-обработчик на завершение цепочки вставок.
       * @private
       */
      _onPasteHandler: function() {
         //Переопределить в классах-потомках
      },
      /**
       * Функция-обработчик события _onKeyUp. Используется для смены значений при нажатии на delete/backspace
       * @param {object} event
       * @private
       */
      _onKeyUp: function(event) {
         if (event.keyCode === 46 || event.keyCode === 8) {
            var value = this._inputControl.val();
            this._updateSelfContextValue(value);
            this._notifyOnValueChange(this.getValue());
         }
      },
      /**
       * <wiTag group='Управление'>
       * Установить режим ввода пароля и опцию {@link password}.
       * @param password {Boolean} Значение опции.
       * <ol>
       *    <li>true - включить режим ввода пароля;</li>
       *    <li>false - не включать/выключить.</li>
       * </ol>
       * @see password
       */
      setPassword: function(password) {
         password = !!password;
         this._options.password = password;
         this._inputControl.prop('type', password ? 'password' : 'text');
         this._updateInPlaceValue(this.getStringValue());
      },
     /**
      * <wiTag group="Отображение">
      * Установить отображение подсказки внутри поля.
      * @param tooltipInside {Boolean} Значение опции.
      * <ol>
      *    <li>true - включить возможность отображения подсказки внутри поля;</li>
      *    <li>false - не включать/выключить.</li>
      * </ol>
      * @see tooltipInside
      */
      setTooltipInside: function(tooltipInside) {
         this._options.tooltipInside = tooltipInside;
         this._setTooltip(tooltipInside ? this._options.tooltip : '');
      },
      /**
       * Инициализирует поле ввода
       */
      init: function(){
         $ws.proto.FieldString.superclass.init.apply(this, arguments);
         this._initValue = this.getValue();
      },
      _handleCapsLock: function(event) {
         if(this.isPassword() && isNaN(parseInt(String.fromCharCode(event.which), 10))){
            if($ws.helpers.checkCapsLock(event)){
               this._showWarning('Caps-lock включен.');
            } else{
               this._getMessageBox().hide();
            }
         }
      },
      _showWarning: function(message) {
         var box = this._getMessageBox(message, {icon:'warning'});
         var css = $(this._container).offset();
         css.top -= box.height() + 3;
         css.left += 10;
         box.css(css);
         box.show();
      },
      _inputFilter : function(e, regexp){
         e = e || window.event;
         var target = e.target || e.srcElement;
         if (target.tagName.toUpperCase() === 'INPUT') {
            var
               isIE = document.all,
               code = isIE ? e.keyCode : e.which;
            if (code < 32 || e.ctrlKey || e.altKey) {
               return true;
            }
            if (!regexp.test(String.fromCharCode(code))) {
               return false;
            }
         }
         return true;
      },
      _bindTooltipHandlers: function() {
         var self = this;
         if (this.isTooltipInside() && this._options.tooltip.length > 0) {
            this._tooltipContainer.click(function(){
               if (self.isEnabled()) {
                  self._inputControl.focus();
               }
            });
            this._inputControl.unbind('.tooltip');
            this._inputControl.bind('keyup.tooltip blur.tooltip', function() {
               self._tooltipHandler();
            });
         }
      },
      _isEmpty: function() {
         var value = this._curValue();
         return (typeof(value) === 'undefined' || value === '' || value === null);
      },
      _tooltipHandler: function() {
         if (this.isTooltipInside() && this._options.tooltip.length > 0 && !$ws._const.compatibility.placeholder) {
            if (!this._tooltipContainer) {
               this._createPlaceholder();
            }
            this._tooltipContainer.toggle(this._isEmpty() && this.isEnabled());
         }
      },
      setTooltip : function(tooltip) {
         $ws.proto.FieldString.superclass.setTooltip.apply(this, arguments);
         this._setTooltip(tooltip);
      },
      /**
       * Функция осуществляет все внутренние операции, связанные со сменой текста тултипа но само свойство не меняется
       * @param {String} tooltip
       * @private
       */
      _setTooltip : function(tooltip) {
         if(!this.isPassword()){
            this._inputControl.attr('title', tooltip);
         }
         if (this.isTooltipInside()) {
            this._inputControl.removeAttr('title');
            this._container.removeAttr('title');
            if ($ws._const.compatibility.placeholder) {
               this._inputControl.attr('placeholder', tooltip);
            } else {
               if (this._tooltipContainer) {
                  this._tooltipContainer.text(tooltip).toggle(!!tooltip && this._isEmpty());
               } else {
                  this._createPlaceholder();
               }
            }
         } else {
            this._inputControl.attr('title', this._options.tooltip);
            this._container.attr('title', this._options.tooltip);
            if ($ws._const.compatibility.placeholder) {
               this._inputControl.removeAttr('placeholder');
            } else if (this._tooltipContainer) {
               this._tooltipContainer.remove();
            }
         }
      },
      /**
       * Переопределяем метод отображения подсказки, чтобы выключить тултип
       * @protected
       */
      _finallyShowInfobox: function() {
         if (!this._container.find('.ws-field').hasClass('ws-hidden') || this._editAtPlace) {
            this._inputControl.attr('title', null);
            var
               self = this;
            Infobox.once('onChangeTarget', function() {
               Infobox.once('onChangeTarget', self._infoboxTargetChangeHandler);
            });
            $ws.proto.FieldString.superclass._finallyShowInfobox.apply(this, arguments);
         }
      },
      _firstSelect : function(){
         this._funcFocus();
      },
      /**
       * <wiTag group='Управление'>
       * @param active
       * @param shiftKey
       * @param noFocus
       */
      setActive: function(active, shiftKey, noFocus){
         var firstSelect = this._isControlActive != active;
         if (!active && this._changed && this._options.trim) {
            var v = this.getValue();
            if (typeof v == 'string') {
               this.setValue(String.trim(v));
            }
         }
         $ws.proto.FieldString.superclass.setActive.apply(this, arguments);
         if (active && this._firefoxDelayedMaxlegth) {
            // Firefox'окостыль — https://bugzilla.mozilla.org/show_bug.cgi?id=818270
            // sbisdoc://1+ОшРазраб+07.02.14+81977+2DBDF88C-35F7-4D89-A64B-3FFA3E7584F+
            var
               ml = this.getMaxLength();
            this._inputControl.attr('maxlength', (ml || 0) + 100500);
            this._inputControl.attr('maxlength', ml);
            this._firefoxDelayedMaxlegth = false;
         }
         if (active && firstSelect && !noFocus) { // noFocus - не выделяем сразу всё поле по mousedown
            this._firstSelect();
         }
      },
      /**
       * Возвращает объект для фокуса
       * @return {jQuery}
       * @private
       */
      _getElementToFocus: function(){
         return this._inputControl;
      },
      /**
       * Создаёт элемент, имитирующий placeholder для ие
       * @protected
       */
      _createPlaceholder: function(){
         // Обработка свойства tooltipInside. Отображение подсказки в поле ввода.
         if (this.isTooltipInside() && this._options.tooltip.length > 0) {
            if (!$ws._const.compatibility.placeholder) {
               this._tooltipContainer = $(['<div class="ws-tooltip-container">', this._options.tooltip, '</div>'].join(''));
               this._inputControl.after(this._tooltipContainer);
               this._tooltipContainer.css('left', this._inputControl.position().left || parseInt(this._inputControl.parent().css('padding-left'), 10));
               this._bindTooltipHandlers();
               this._tooltipHandler();
            }
         }
      },
      _bindInternals : function(){
         this._inputControl = this._container.find('.input-string-field');
         if (!this.isPassword() && this._options.highlightLinks) {
            this._dataReview = this._container.find('.input-string-data-review');
         }
         this._createPlaceholder();
      },
      _dotTplFn: dotTplFn,
      /**
       * Значение пустого поля
       * Разрешает, какое значение примет поле при своём пустом здачении ("", null и т.п.).
       * @param            value Текущее предлагаемое значение
       * @returns {null|*}       Пустое значение для данного значения
       * @protected
       */
      _resolveEmptyValue: function(value){
         return this._initValue === null ? null : value;  
      },
      /**
       * возвращает текущее текстовое значение.
       * @return {String|*} текущее текстовое значение
       */
      _curValue : function(){
         var val = this._inputControl.val();
         return !val ? this._resolveEmptyValue(val) : val; 
      },
      _filterValue : function(v){
         var
            reg = new RegExp(this._options.inputFilter),
            r = [];
         for (var i = 0, l = v.length; i < l; i++){
            if (reg.test(v.charAt(i))) {
               r.push(v.charAt(i));
            }
         }
         return r.join('');
      },
      /**
       * Обработка строчного значения
       * @param {String} value входное значение
       * @returns {String} value обработанное значение на выходе
       * @protected
       */
      _valueInternalProcessing: function(value) {
         if (value === null || value === undefined) {
            value = '';
         }
         if (typeof value !== 'string') {
            value = value + '';
         }
         if (this._options.inputFilter) {
            value = this._filterValue(value);
         }
         if (this._options.trim) {
            value = String.trim(value);
         }
         if (this._options.maxLength && value.length > this._options.maxLength) {
            value = value.substr(0, this._options.maxLength);
         }
         return value;
      },
      _setValueInternal: function(value){
         var isPassword = this.isPassword();
         value = this._valueInternalProcessing(value);
         this._inputControl.val(value);
         if (!isPassword && this._options.highlightLinks && this._dataReview) {
            //экранируем скрипты до того как будем искать внутри ссылки, чтобы не попортить результат, там ведь html
            this._dataReview.html($ws.helpers.wrapFiles($ws.helpers.wrapURLs($ws.helpers.escapeHtml(value))));
         }
         if (this.isTooltipInside() && !isPassword) {
            this._inputControl.attr('title', value);
         }
         $ws.proto.FieldString.superclass._setValueInternal.apply(this, [value]);
         this._tooltipHandler();
      },
      _updateSelfContextValue: function(value) {
         if (!this.isPassword() && this._options.highlightLinks && this._dataReview) {
            this._dataReview.html($ws.helpers.wrapFiles($ws.helpers.wrapURLs($ws.helpers.escapeHtml(value))));
         }
         $ws.proto.FieldString.superclass._updateSelfContextValue.apply(this, arguments);
      },
      /**
       * Возвращает дефолтное значение
       * @returns {String}
       * @private
       */
      _getDefaultValue: function(){
         var check = function(value){
            if(value && typeof(value) === 'string'){
               return value;
            }
            return '';
         },
         value = this._options.value;

         return check(typeof(value) === 'function' ? value.call(this) : value);
      },
      _funcFocus : function(){
         var obj = this._inputControl.get(0);
         if(this.isEnabled()){
            if(document.selection){
               if(document.selection.type !== 'None') {
                  var r = obj.createTextRange();
                  //особая уличная магия для ие для работы выделения. подробности вот тут http://stackoverflow.com/questions/130186/ie-textrange-select-method-not-working-properly
                  if(r.select && r.boundingWidth > 0){
                     r.select();
                  }
               }
            }
            else {
               obj.select();
            }
         }
      },
      /**
       * @return {Boolean}
       * @protected
       */
      _canValidate: function() {
         return this.isVisible() && ($ws.proto.FieldString.superclass._canValidate.apply(this, arguments) || this._options.canNotBeEmpty);
      },
      _invokeValidation: function() {
         var v = this.getValue();
         if (this._options.trim && typeof v == "string"){
            this.setValue(String.trim(v));
         }
         var parentResult = $ws.proto.FieldString.superclass._invokeValidation.apply(this, arguments);
         if (this._options.canNotBeEmpty && this._isEmpty()) {
            parentResult.result = false;
            parentResult.errors.push(this._options.errorMessageFilling);
         }
         return parentResult;
      },
      _setEnabled : function(enabled){
         if (!this.isPassword() && this._options.highlightLinks && this._dataReview) {
            this._inputControl.toggleClass('ws-hidden', !enabled);
            this._dataReview.toggleClass('ws-hidden', enabled);
         }
         this._setTooltip(enabled ? this._options.tooltip : '');
         $ws.proto.FieldString.superclass._setEnabled.apply(this, arguments);
      },
      _setDisableAttr: function(enabled) {
         if (!enabled) {
            this._container.toggleClass('readonly', true);
            this._inputControl.attr('readonly', 'readonly');
         } else if (!this._options.readOnly) {
            this._container.toggleClass('readonly', false);
            this._inputControl.removeAttr('readonly');
         }
      },
      /**
       * <wiTag group="Управление">
       * Устанавливает опцию readOnly
       * @param readOnly значение опции
       */
      setReadOnly: function(readOnly) {
         this._options.readOnly = readOnly;
         if (readOnly) {
            this._container.toggleClass('readonly',true);
            this._inputControl.attr('readonly', 'readonly');
         }
         else
         if (this.isEnabled()) {
            this._container.toggleClass('readonly', false);
            this._inputControl.removeAttr('readonly');
         }
      },
      _keyboardHover: function(event){
         event.stopImmediatePropagation();
         return true;
      },
      /**
       * <wiTag group='Управление'>
       * Получить количество знаков установленной максимальной длины ввода.
       * @return {Number} Текущее ограничение макс. длины.
       */
      getMaxLength: function() {
         return this._options.maxLength;
      },
      /**
       * <wiTag group='Управление'>
       * Изменить максимальную длину ввода.
       * @param maxLen количество знаков для максимальной длины.
       */
      setMaxLength: function (maxLen){
         if (maxLen < 0) {
            return;
         }
         this._options.maxLength = maxLen;
         this._inputControl.attr('maxlength', maxLen);
         if($ws._const.browser.firefox && !$ws.helpers.isElementVisible(this._inputControl)) {
            this._firefoxDelayedMaxlegth = true;
         }
      },
      _handleInPlaceTooltip: function(value) {
         $ws.proto.FieldString.superclass._handleInPlaceTooltip.call(this, this.isPassword() ? '' : value);
      },
      /**
       * Обновление значения в текстовом поле при его изменении извне
       * @param {*} value новое значение
       * @private
       */
      _updateInPlaceValue: function (value) {
         if (this._editAtPlace && this.isPassword() && this._editAtPlaceElement) {
            value = value.replace(/./g, $.browser.webkit ? String.fromCharCode(8226) : String.fromCharCode(9679));
            $ws.proto.FieldString.superclass._updateInPlaceValue.apply(this, [value]);
         } else {
            $ws.proto.FieldString.superclass._updateInPlaceValue.apply(this, arguments);
         }
      },
      destroy: function() {
         Infobox.unsubscribe('onChangeTarget', this._infoboxTargetChangeHandler);
         $ws.proto.FieldString.superclass.destroy.apply(this, arguments);
      },
	  /**
       * <wiTag group="Данные">
       * Установить, что поле не может быть пустым.
       * @param {Boolean} required Обязательно ли для заполнения.
       * Возможные значения:
       * <ol>
       *    <li>true - поле обязательно к заполнению;</li>
       *    <li>false - поле может быть пустым.</li>
       * </ol>
       * @example
       * Если поле может быть пустым, то запретить эту возможность:
       * <pre>
       *     if(!this.isRequired()) {
       *        //устанавливаем, что поле обязательно к заполнению
       *        this.setRequired(true)
       *     }
       * </pre>
       * @see isRequired
       */
      setRequired: function(required) {
         required = !!required;
         this._options.canNotBeEmpty = required;
      },
      /**
       * <wiTag group="Данные">
       * Признак обязательно ли для заполнения поле.
       * @returns {Boolean} Возможные значения:
       * <ol>
       *    <li>true - поле обязательно к заполнению;</li>
       *    <li>false - поле может быть пустым.</li>
       * </ol>
       * @example
       * Если поле может быть пустым, то запретить эту возможность:
       * <pre>
       *     //проверяем может ли поле быть пустым
       *     if(!this.isRequired()) {
       *        this.setRequired(true)
       *     }
       * </pre>
       * @see setRequired
       */
      isRequired: function() {
         return this._options.canNotBeEmpty;
      },
      /**
       * Установка строки регулярного выражения для InputFilter
       * @param {String} inputFilter строка регулярного выражения
       * @example
       * <pre>
       *    fieldString.setInputFilter('[0-9]');
       * </pre>
       */
      setInputFilter: function(inputFilter) {
         if (typeof inputFilter === 'string') {
            this._options.inputFilter = inputFilter;
         }
      },
      /**
       * Возвращает строку регулярного выражение в InputFilter
       * @returns {String}
       * @public
       */
      getInputFilter: function() {
         return this._options.inputFilter;
      },
      /**
       * <wiTag group="Отображение">
       * Отображается ли подсказка внутри поля
       * @returns {Boolean}
       * @public
       */
      isTooltipInside: function() {
         return this._options.tooltipInside;
      },
      /**
       * <wiTag group="Отображение">
       * Включён ли режим ввода пароля
       * @returns {Boolean}
       * @public
       */
      isPassword: function() {
         return this._options.password;
      }
   });

   return $ws.proto.FieldString;

});
