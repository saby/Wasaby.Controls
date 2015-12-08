define('js!SBIS3.CONTROLS.TextBox', ['js!SBIS3.CONTROLS.TextBoxBase','html!SBIS3.CONTROLS.TextBox'], function(TextBoxBase, dotTplFn) {

   'use strict';

   /**
    * Однострочное текстовое поле ввода.
    * Специальные поля:
    * <ul>
    *    <li>{@link SBIS3.CONTROLS.NumberTextBox NumberTextBox} - поле ввода числа;</li>
    *    <li>{@link SBIS3.CONTROLS.PasswordTextBox PasswordTextBox} - поле ввода пароля;</li>
    *    <li>{@link SBIS3.CONTROLS.TextArea TextArea} - многострочное поле ввода;</li>
    *    <li>{@link SBIS3.CONTROLS.FormattedTextBox FormattedTextBox} - поле ввода с маской.</li>
    * </ul>
    *
    * Для поля ввода можно задать:
    * <ol>
    *    <li>{@link maxLength} - ограничение количества вводимых символов;</li>
    *    <li>{@link inputRegExp} - фильтр вводимых символов;</li>
    *    <li>{@link trim} - обрезать ли пробелы при вставке текста;</li>
    *    <li>{@link selectOnClick} - выделять ли текст при получении контролом фокуса;</li>
    *    <li>{@link textTransform} - форматирование регистра текста.</li>
    * </ol>
    * @class SBIS3.CONTROLS.TextBox
    * @extends SBIS3.CONTROLS.TextBoxBase
    * @control
    * @public
    * @author Крайнов Дмитрий Олегович
    * @demo SBIS3.CONTROLS.Demo.MyTextBox
    * @category Inputs
    *
    * @ignoreOptions independentContext contextRestriction extendedTooltip className
    * @ignoreOptions element linkedContext handlers parent autoHeight autoWidth horizontalAlignment
    * @ignoreOptions isContainerInsideParent owner stateKey subcontrol verticalAlignment
    *
    * @ignoreMethods applyEmptyState applyState findParent getAlignment getEventHandlers getEvents getExtendedTooltip
    * @ignoreMethods getId getLinkedContext getMinHeight getMinSize getMinWidth getOwner getOwnerId getParentByClass
    * @ignoreMethods getParentByName getParentByWindow getStateKey getTopParent getUserData hasEvent hasEventHandlers
    * @ignoreMethods isDestroyed isSubControl makeOwnerName once sendCommand setOwner setStateKey setUserData setValue
    * @ignoreMethods subscribe unbind unsubscribe getClassName setClassName
    *
    * @ignoreEvents onDragIn onDragMove onDragOut onDragStart onDragStop onStateChanged onTooltipContentRequest onChange
    * @ignoreEvents onReady
    */

   var TextBox = TextBoxBase.extend(/** @lends SBIS3.CONTROLS.TextBox.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _pasteProcessing : 0,
         _inputField : null,
         _compatPlaceholder: null,
         _options: {
            beforeFieldWrapper: null,
            afterFieldWrapper: null,
            /**
             * @cfg {String} Форматирование регистра текста
             * @example
             * <pre class="brush:xml">
             *     <option name="textTransform">uppercase</option>
             * </pre>
             * @variant uppercase Все символы верхним регистром.
             * @variant lowercase Все символы нижним регистром.
             * @variant none Без изменений.
             * @see setTextTransform
             */
            textTransform: 'none',
            /**
             * @cfg {Boolean} Выделять или нет текст в поле при получении фокуса
             * @remark
             * Возможные значения при получении полем фокуса:
             * <ul>
             *    <li>true - выделять текст;</li>
             *    <li>false - не выделять.</li>
             * </ul>
             * @example
             * <pre class="brush:xml">
             *     <option name="selectOnClick">true</option>
             * </pre>
             */
            selectOnClick: false,
            /**
             * @cfg {String} Текст подсказки внутри поля ввода
             * @remark
             * Данный текст отображается внутри поля до момента получения фокуса.
             * @example
             * <pre class="brush:xml">
             *     <option name="placeholder">Введите ФИО полностью</option>
             * </pre>
             * @see setPlaceholder
             */
            placeholder: '',
            /**
             * @cfg {String} Регулярное выражение, в соответствии с которым будет осуществляться ввод
             * @remark
             * Каждый вводимый символ будет проверяться на соответсвие указанному в этой опции регулярному выражению.
             * Несоответсвующие символы невозможно напечатать.
             * @example
             * Разрешим ввод только цифр:
             * <pre class="brush:xml">
             *     <option name="inputRegExp">/^\d+$/</option>
             * </pre>
             */
            inputRegExp : ''
         }
      },

      $constructor: function() {
         var self = this;
         this._inputField = $('.js-controls-TextBox__field', this.getContainer().get(0));
         this._container.bind('keypress',function(e){
            self._keyPressBind(e);
         });
         this._container.bind('keydown',function(e){
            self._keyDownBind(e);
         });

         this._container.bind('keyup',function(e){
            self._keyUpBind(e);
         });

         this._inputField.bind('paste', function(){
            self._pasteProcessing++;
            window.setTimeout(function(){
               self._pasteProcessing--;
               if (!self._pasteProcessing) {
                  self.setText(self._options._formatText(self._inputField.val()));
               }
            }, 100);
         });

         this._inputField.change(function(){
            var newText = $(this).val();
            if (newText != self._options.text) {
               self.setText(self._options.text);
            }
         });

         this._inputField.bind('focusin', function () {
            if (self._options.selectOnClick){
               self._inputField.select();
            }
         });

         this._inputField.bind('focusout', function(){
            self.setText(self._formatText(self._inputField.val()));
         });

         if (this._options.placeholder && !$ws._const.compatibility.placeholder) {
            this._createCompatPlaceholder();
         }
      },

      _drawText: function(text) {
         if (this._compatPlaceholder) {
            this._compatPlaceholder.toggle(!text);
         }
         if (this._inputField.val() != text) {
            this._inputField.val(text || '');
         }
      },

      setMaxLength: function(num) {
         TextBox.superclass.setMaxLength.call(this, num);
         this._inputField.attr('maxlength',num);
      },

      /**
       * Установить подсказку, отображаемую внутри поля.
       * Метод установки или замены текста подсказки, заданного опцией {@link placeholder}.
       * @param {String} text Текст подсказки.
       * @example
       * <pre>
       *     if (control.getText() == "") {
       *        control.setPlaceholder("Введите ФИО полностью");
       *     }
       * </pre>
       * @see placeholder
       */
      setPlaceholder: function(text){
         if (!$ws._const.compatibility.placeholder) {
            this._compatPlaceholder.text(text || '');
         }
         else {
            this._inputField.attr('placeholder', text || '');
         }
         this._options.placeholder = text;
      },

      /**
       * Установить форматирование текста.
       * Метод установки или замены форматирования регистра текста, заданного опцией {@link textTransform}.
       * @param {String} textTransform Необходимое форматирование регистра текста.
       * Возможные значения:
       * <ul>
       *    <li>uppercase - все символы верхним регистром;</li>
       *    <li>lowercase - все символы нижним регистром;</li>
       *    <li>none - без изменений.</li>
       * </ul>
       * @example
       * <pre>
       *     control.setTextTransform("lowercase");
       * </pre>
       * @see textTransform
       */
      setTextTransform: function(textTransform){
         switch (textTransform) {
            case 'uppercase':
               this._inputField.removeClass('controls-TextBox__field-lowercase')
                  .addClass('controls-TextBox__field-uppercase');
               break;
            case 'lowercase':
               this._inputField.removeClass('controls-TextBox__field-uppercase')
                  .addClass('controls-TextBox__field-lowercase');
               break;
            default:
               this._inputField.removeClass('controls-TextBox__field-uppercase')
                  .removeClass('controls-TextBox__field-lowercase');
         }
      },

      _keyUpBind: function() {
         var newText = this._inputField.val();
         this.setText(newText);
      },

      _keyDownBind: function(event) {
         if (this._options.inputRegExp !== '' && this._inputRegExp(event, new RegExp(this._options.inputRegExp))){
            event.preventDefault();
         }
      },

      _keyPressBind: function() {

      },

      _getElementToFocus: function() {
         return this._inputField;
      },

      _setEnabled : function(enabled) {
         TextBox.superclass._setEnabled.call(this, enabled);
         if (enabled == false) {
            this._inputField.attr('readonly', 'readonly')
         }
         else {
            this._inputField.removeAttr('readonly');
         }
      },

      _inputRegExp: function (e, regexp) {
         if (e.shiftKey) return true;
         var keyCode = (e.which >= 96 && e.which <= 105) ? e.which - 48 : e.which;
         if (keyCode < 32
            || e.ctrlKey
            || e.altKey
            || e.which == $ws._const.key.left
            || e.which == $ws._const.key.right
            || e.which == $ws._const.key.end
            || e.which == $ws._const.key.home
            || e.which == $ws._const.key.del

            ) {
            return false;
         }
         return (!regexp.test(String.fromCharCode(keyCode)));
      },

      _createCompatPlaceholder : function() {
         var self = this;
         this._compatPlaceholder = $('<div class="controls-TextBox__placeholder">' + this._options.placeholder + '</div>');
         if (this._options.text) {
            this._compatPlaceholder.hide()
         }
         this._inputField.after(this._compatPlaceholder);
         this._compatPlaceholder.css('left', this._inputField.position().left || parseInt(this._inputField.parent().css('padding-left'), 10));
         this._compatPlaceholder.click(function(){
            if (self.isEnabled()) {
               self._inputField.get(0).focus();
            }
         });
      }
   });

   return TextBox;

});