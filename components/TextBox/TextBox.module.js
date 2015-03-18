define('js!SBIS3.CONTROLS.TextBox', ['js!SBIS3.CONTROLS.TextBoxBase','html!SBIS3.CONTROLS.TextBox'], function(TextBoxBase, dotTplFn) {

   'use strict';

   /**
    * Поле ввода в одну строчку
    * @class SBIS3.CONTROLS.TextBox
    * @extends SBIS3.CONTROLS.TextBoxBase
    * @control
    * @public
    * @category Inputs
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
             * @typedef {Object} TextTransformEnum
             * @variant uppercase перевести в верхний регистр
             * @variant lowercase перевести в нижний регистр
             * @variant none оставить как есть
             */
            /**
             * @cfg {TextTransformEnum} Форматирование текста
             * Возможные значения:
             * <ul>
             *    <li>uppercase - все символы верхним регистром;</li>
             *    <li>lowercase - все символы нижним регистром;</li>
             *    <li>none - без изменений.</li>
             * </ul>
             */
            textTransform: 'none',
            /**
             * @cfg {Boolean} Выделять или нет текст в поле при получении фокуса
             * Возможные значения при получении полем фокуса:
             * <ul>
             *    <li>true - выделять текст;</li>
             *    <li>false - не выделять.</li>
             * </ul>
             */
            selectOnClick: false,
            /**
             * @cfg {String} Текст подсказки внутри поля ввода
             * Данный текст отображается внутри поля до момента получения фокуса.
             * @see setPlaceholder
             */
            placeholder: '',
            /**
             * @cfg {String} Фильтр ввода
             * <wiTag group="Управление">
             * Каждый вводимый символ будет проверяться на соответсвие указанному в этой опции регулярному выражению.
             * Несоответсвующие символы невозможно напечатать.
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
                  TextBox.superclass.setText.call(self, self._formatValue(self._inputField.val()));
                  self._inputField.val(self._options.text);
               }
            }, 100)
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

         if (this._options.placeholder && !$ws._const.compatibility.placeholder) {
            this._createCompatPlaceholder();
         }
      },

      _formatValue: function(value){
         value = value || ''; // так как есть датабиндинг может прийти undefined
         if (this._options.trim) {
            value = String.trim(value);
         }
         return value;
      },

      setText: function(text){
         //перед изменением делаем trim если нужно
         text = this._formatValue(text);
         TextBox.superclass.setText.call(this, text);
         if (this._compatPlaceholder) {
            this._compatPlaceholder.toggle(!text);
         }
         this._inputField.attr('value', text);
      },

      setMaxLength: function(num) {
         TextBox.superclass.setMaxLength.call(this, num);
         this._inputField.attr('maxlength',num);
      },

      /**
       * Установить подсказку, отображаемую внутри поля.
       * Метод установки или замены текста подсказки, заданного опцией {@link placeholder}.
       * @param {String} text Текст подсказки.
       * @see placeholder
       */
      setPlaceholder: function(text){
         if ($ws._const.compatibility.placeholder) {
            if (this._compatPlaceholder) {
               this._compatPlaceholder.text(text || '');
            }
            else {
               this._createCompatPlaceholder();
            }
         }
         else {
            this._inputField.attr('placeholder', text || '');
         }
      },

      /**
       * Установить форматирование текста
       * @param {TextTransformEnum} textTransform
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
         if (newText != this._options.text) {
            TextBox.superclass.setText.call(this, newText);
         }
         if (this._compatPlaceholder) {
            this._compatPlaceholder.toggle(!newText);
         }
      },

      _keyDownBind: function(event) {
         if (this._options.inputRegExp !== '' && this._inputRegExp(event, new RegExp(this._options.inputRegExp))){
            event.preventDefault();
         }
      },

      _keyPressBind: function() {

      },

      setActive: function(active){
         var firstSelect = this._isControlActive != active;
         TextBox.superclass.setActive.apply(this, arguments);
         if (active && firstSelect) {
            this._inputField.get(0).focus();
         }
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
         var code = e.which;
         if (code < 32 || e.ctrlKey || e.altKey) {
            return true;
         }
         return (!regexp.test(String.fromCharCode(code)));
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